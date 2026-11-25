import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const androidDir = path.join(rootDir, 'android');

if (!fs.existsSync(androidDir)) {
  console.error('Error: android/ directory does not exist. Run "npx cap add android" first.');
  process.exit(1);
}

const pkgJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const capConfig = JSON.parse(fs.readFileSync(path.join(rootDir, 'capacitor.config.json'), 'utf8'));

const appId = capConfig.appId || 'io.github.ariyanpal1008.quadra12';
const appName = capConfig.appName || 'Quadra 12';
const rawVersionName = process.env.QUADRA_VERSION_NAME || pkgJson.version || '2.6.0';
const versionName = rawVersionName.replace(/^v/i, '').trim() || '2.6.0';
const runNumber = parseInt(process.env.GITHUB_RUN_NUMBER || '1', 10) || 1;
const explicitCode = parseInt(process.env.QUADRA_VERSION_CODE || '', 10);
const versionCode = Number.isFinite(explicitCode) && explicitCode > 0 ? explicitCode : 1000 + runNumber;
const enableReleaseSigning = process.env.QUADRA_ENABLE_RELEASE_SIGNING === 'true';

// 1. Configure android/app/build.gradle (applicationId, versionCode, versionName, release signingConfig)
const gradlePath = path.join(androidDir, 'app', 'build.gradle');
if (!fs.existsSync(gradlePath)) {
  console.error('Error: android/app/build.gradle not found.');
  process.exit(1);
}

let gradle = fs.readFileSync(gradlePath, 'utf8');
gradle = gradle.replace(/applicationId\s+"[^"]+"/, `applicationId "${appId}"`);
gradle = gradle.replace(/versionCode\s+\d+/, `versionCode ${versionCode}`);
gradle = gradle.replace(/versionName\s+"[^"]+"/, `versionName "${versionName}"`);

if (enableReleaseSigning) {
  if (!gradle.includes('signingConfigs')) {
    const signingBlock = [
      '    signingConfigs {',
      '        release {',
      '            storeFile file("quadra12-release.jks")',
      '            storePassword System.getenv("ANDROID_KEYSTORE_PASSWORD")',
      '            keyAlias System.getenv("ANDROID_KEY_ALIAS")',
      '            keyPassword System.getenv("ANDROID_KEY_PASSWORD")',
      '        }',
      '    }',
      '    buildTypes {',
    ].join('\n');
    gradle = gradle.replace(/^\s*buildTypes\s*\{/m, signingBlock);
  }
  if (!/buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?signingConfig\s+signingConfigs\.release/.test(gradle)) {
    gradle = gradle.replace(
      /(buildTypes\s*\{\s*release\s*\{)/,
      '$1\n            signingConfig signingConfigs.release',
    );
  }
}

fs.writeFileSync(gradlePath, gradle, 'utf8');

// 2. Ensure strings.xml carries exact appName
const stringsPath = path.join(androidDir, 'app', 'src', 'main', 'res', 'values', 'strings.xml');
if (fs.existsSync(stringsPath)) {
  let stringsXml = fs.readFileSync(stringsPath, 'utf8');
  stringsXml = stringsXml.replace(
    /<string name="app_name">.*?<\/string>/,
    `<string name="app_name">${appName}</string>`,
  );
  stringsXml = stringsXml.replace(
    /<string name="title_activity_main">.*?<\/string>/,
    `<string name="title_activity_main">${appName}</string>`,
  );
  fs.writeFileSync(stringsPath, stringsXml, 'utf8');
}

// 3. Configure AndroidManifest.xml (camera, storage, package install permission, queries)
const manifestPath = path.join(androidDir, 'app', 'src', 'main', 'AndroidManifest.xml');
let manifest = fs.readFileSync(manifestPath, 'utf8');

const requiredPermissions = [
  '<uses-permission android:name="android.permission.INTERNET" />',
  '<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />',
  '<uses-permission android:name="android.permission.CAMERA" />',
  '<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />',
  '<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />',
  '<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="28" />',
  '<uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" />',
  '<uses-feature android:name="android.hardware.camera" android:required="false" />',
];

const missingPermissions = requiredPermissions.filter((entry) => {
  const nameMatch = entry.match(/android:name="([^"]+)"/);
  if (!nameMatch) return false;
  return !manifest.includes(`android:name="${nameMatch[1]}"`);
});

const queriesBlock = [
  '    <queries>',
  '        <intent>',
  '            <action android:name="android.media.action.IMAGE_CAPTURE" />',
  '        </intent>',
  '        <intent>',
  '            <action android:name="android.intent.action.GET_CONTENT" />',
  '        </intent>',
  '        <intent>',
  '            <action android:name="android.intent.action.OPEN_DOCUMENT" />',
  '        </intent>',
  '        <intent>',
  '            <action android:name="android.intent.action.VIEW" />',
  '            <data android:mimeType="application/pdf" />',
  '        </intent>',
  '        <intent>',
  '            <action android:name="android.intent.action.VIEW" />',
  '            <data android:mimeType="application/vnd.android.package-archive" />',
  '        </intent>',
  '        <intent>',
  '            <action android:name="android.intent.action.INSTALL_PACKAGE" />',
  '        </intent>',
  '    </queries>',
].join('\n');

let injection = '';
if (missingPermissions.length > 0) {
  injection += missingPermissions.map((line) => `    ${line}`).join('\n') + '\n';
}
if (!manifest.includes('android.vnd.android.package-archive') && !manifest.includes('application/vnd.android.package-archive')) {
  if (manifest.includes('<queries>')) {
    manifest = manifest.replace(/<queries>[\s\S]*?<\/queries>/, queriesBlock.trim());
  } else {
    injection += queriesBlock + '\n';
  }
}

if (injection) {
  manifest = manifest.replace('</manifest>', `${injection}</manifest>`);
}

fs.writeFileSync(manifestPath, manifest, 'utf8');

// 4. Configure file_paths.xml for external files / Downloads
const filePathsPath = path.join(androidDir, 'app', 'src', 'main', 'res', 'xml', 'file_paths.xml');
if (fs.existsSync(filePathsPath)) {
  let fp = fs.readFileSync(filePathsPath, 'utf8');
  if (!fp.includes('external-path')) {
    fp = fp.replace('</paths>', '    <external-path name="external_files" path="." />\n</paths>');
  }
  if (!fp.includes('external-files-path')) {
    fp = fp.replace('</paths>', '    <external-files-path name="external_app_files" path="." />\n</paths>');
  }
  fs.writeFileSync(filePathsPath, fp, 'utf8');
}

// 5. Write native MainActivity.java with QuadraAndroid bridge (PDF export + GitHub APK DownloadManager + Installer)
const packageSubdir = appId.split('.').join('/');
const mainActivityDir = path.join(androidDir, 'app', 'src', 'main', 'java', packageSubdir);
fs.mkdirSync(mainActivityDir, {recursive: true});

const mainActivityJava = `package ${appId};

import android.Manifest;
import android.app.DownloadManager;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.provider.Settings;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.widget.Toast;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
import com.getcapacitor.BridgeActivity;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import org.json.JSONObject;

public class MainActivity extends BridgeActivity {
    private static final int REQ_PERMISSIONS = 1001;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (getBridge() != null && getBridge().getWebView() != null) {
            WebSettings settings = getBridge().getWebView().getSettings();
            settings.setJavaScriptEnabled(true);
            settings.setMediaPlaybackRequiresUserGesture(false);
            settings.setAllowFileAccess(true);
            getBridge().getWebView().addJavascriptInterface(
                new QuadraAndroidBridge(),
                "QuadraAndroid"
            );
        }

        requestStartupPermissions();
    }

    private void requestStartupPermissions() {
        List<String> needed = new ArrayList<>();
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
                != PackageManager.PERMISSION_GRANTED) {
            needed.add(Manifest.permission.CAMERA);
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_MEDIA_IMAGES)
                    != PackageManager.PERMISSION_GRANTED) {
                needed.add(Manifest.permission.READ_MEDIA_IMAGES);
            }
        } else {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE)
                    != PackageManager.PERMISSION_GRANTED) {
                needed.add(Manifest.permission.READ_EXTERNAL_STORAGE);
            }
            if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.P &&
                    ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                            != PackageManager.PERMISSION_GRANTED) {
                needed.add(Manifest.permission.WRITE_EXTERNAL_STORAGE);
            }
        }
        if (!needed.isEmpty()) {
            ActivityCompat.requestPermissions(
                this,
                needed.toArray(new String[0]),
                REQ_PERMISSIONS
            );
        }
    }

    public class QuadraAndroidBridge {
        @JavascriptInterface
        public String getInstalledVersion() {
            try {
                PackageInfo info = getPackageManager().getPackageInfo(getPackageName(), 0);
                long code = Build.VERSION.SDK_INT >= Build.VERSION_CODES.P
                    ? info.getLongVersionCode()
                    : info.versionCode;
                JSONObject json = new JSONObject();
                json.put("versionName", info.versionName != null ? info.versionName : "${versionName}");
                json.put("versionCode", code);
                json.put("packageName", getPackageName());
                return json.toString();
            } catch (Exception ex) {
                return "{\\"versionName\\":\\"${versionName}\\",\\"versionCode\\":${versionCode},\\"packageName\\":\\"${appId}\\"}";
            }
        }

        @JavascriptInterface
        public boolean canRequestPackageInstalls() {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                return getPackageManager().canRequestPackageInstalls();
            }
            return true;
        }

        @JavascriptInterface
        public void openInstallPermissionSettings() {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                runOnUiThread(() -> {
                    try {
                        Intent intent = new Intent(
                            Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                            Uri.parse("package:" + getPackageName())
                        );
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                    } catch (Exception ex) {
                        Toast.makeText(
                            MainActivity.this,
                            "Enable 'Install unknown apps' for Quadra 12 in Android Settings.",
                            Toast.LENGTH_LONG
                        ).show();
                    }
                });
            }
        }

        @JavascriptInterface
        public String downloadApkUpdate(String apkUrl, String filename) {
            try {
                if (apkUrl == null || !apkUrl.startsWith("https://")) {
                    JSONObject err = new JSONObject();
                    err.put("ok", false);
                    err.put("error", "Invalid APK download URL. HTTPS required.");
                    return err.toString();
                }

                String safeName = (filename == null || filename.trim().isEmpty())
                    ? "Quadra12-Update.apk"
                    : filename.replaceAll("[^a-zA-Z0-9._-]", "_");
                if (!safeName.toLowerCase().endsWith(".apk")) {
                    safeName = safeName + ".apk";
                }

                File downloadDir = getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
                if (downloadDir != null) {
                    if (!downloadDir.exists()) {
                        downloadDir.mkdirs();
                    }
                    File staleFile = new File(downloadDir, safeName);
                    if (staleFile.exists()) {
                        staleFile.delete();
                    }
                }

                DownloadManager dm = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
                if (dm == null) {
                    JSONObject err = new JSONObject();
                    err.put("ok", false);
                    err.put("error", "Android DownloadManager service is unavailable.");
                    return err.toString();
                }

                DownloadManager.Request request = new DownloadManager.Request(Uri.parse(apkUrl));
                request.setTitle("Quadra 12 Update");
                request.setDescription("Downloading " + safeName);
                request.setMimeType("application/vnd.android.package-archive");
                request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                request.setAllowedOverMetered(true);
                request.setAllowedOverRoaming(true);
                request.setDestinationInExternalFilesDir(
                    MainActivity.this,
                    Environment.DIRECTORY_DOWNLOADS,
                    safeName
                );

                long downloadId = dm.enqueue(request);
                JSONObject ok = new JSONObject();
                ok.put("ok", true);
                ok.put("downloadId", downloadId);
                return ok.toString();
            } catch (Exception ex) {
                try {
                    JSONObject err = new JSONObject();
                    err.put("ok", false);
                    err.put("error", ex.getMessage() != null ? ex.getMessage() : "Download failed to start.");
                    return err.toString();
                } catch (Exception ignored) {
                    return "{\\"ok\\":false,\\"error\\":\\"Download failed to start.\\"}";
                }
            }
        }

        @JavascriptInterface
        public String getApkDownloadStatus(long downloadId) {
            try {
                DownloadManager dm = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
                if (dm == null) {
                    return "{\\"status\\":\\"failed\\",\\"error\\":\\"DownloadManager unavailable.\\"}";
                }
                DownloadManager.Query query = new DownloadManager.Query();
                query.setFilterById(downloadId);
                try (Cursor cursor = dm.query(query)) {
                    if (cursor == null || !cursor.moveToFirst()) {
                        return "{\\"status\\":\\"unknown\\",\\"progress\\":0}";
                    }
                    int statusCol = cursor.getColumnIndex(DownloadManager.COLUMN_STATUS);
                    int bytesCol = cursor.getColumnIndex(DownloadManager.COLUMN_BYTES_DOWNLOADED_SO_FAR);
                    int totalCol = cursor.getColumnIndex(DownloadManager.COLUMN_TOTAL_SIZE_BYTES);
                    int reasonCol = cursor.getColumnIndex(DownloadManager.COLUMN_REASON);

                    int statusCode = statusCol >= 0 ? cursor.getInt(statusCol) : -1;
                    long downloaded = bytesCol >= 0 ? cursor.getLong(bytesCol) : 0L;
                    long total = totalCol >= 0 ? cursor.getLong(totalCol) : 0L;
                    int reason = reasonCol >= 0 ? cursor.getInt(reasonCol) : 0;

                    int progress = total > 0
                        ? (int) Math.min(100L, Math.max(0L, (downloaded * 100L) / total))
                        : 0;

                    String statusStr = "unknown";
                    String errorMsg = "";
                    if (statusCode == DownloadManager.STATUS_PENDING) statusStr = "pending";
                    else if (statusCode == DownloadManager.STATUS_RUNNING) statusStr = "running";
                    else if (statusCode == DownloadManager.STATUS_PAUSED) statusStr = "paused";
                    else if (statusCode == DownloadManager.STATUS_SUCCESSFUL) {
                        statusStr = "successful";
                        progress = 100;
                    } else if (statusCode == DownloadManager.STATUS_FAILED) {
                        statusStr = "failed";
                        errorMsg = "Download failed (code " + reason + "). Check your internet connection and retry.";
                    }

                    JSONObject json = new JSONObject();
                    json.put("status", statusStr);
                    json.put("bytesDownloaded", downloaded);
                    json.put("totalBytes", total);
                    json.put("progress", progress);
                    if (!errorMsg.isEmpty()) {
                        json.put("error", errorMsg);
                    }
                    return json.toString();
                }
            } catch (Exception ex) {
                return "{\\"status\\":\\"failed\\",\\"error\\":\\"Could not inspect download status.\\"}";
            }
        }

        @JavascriptInterface
        public String openDownloadedApk(long downloadId) {
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O &&
                        !getPackageManager().canRequestPackageInstalls()) {
                    openInstallPermissionSettings();
                    return "NEEDS_PERMISSION";
                }

                DownloadManager dm = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
                if (dm == null) {
                    return "ERROR:DownloadManager service unavailable.";
                }

                Uri apkUri = dm.getUriForDownloadedFile(downloadId);
                if (apkUri == null) {
                    DownloadManager.Query query = new DownloadManager.Query();
                    query.setFilterById(downloadId);
                    try (Cursor cursor = dm.query(query)) {
                        if (cursor != null && cursor.moveToFirst()) {
                            int localUriIdx = cursor.getColumnIndex(DownloadManager.COLUMN_LOCAL_URI);
                            String localUriStr = localUriIdx >= 0 ? cursor.getString(localUriIdx) : null;
                            if (localUriStr != null) {
                                Uri parsed = Uri.parse(localUriStr);
                                if ("file".equals(parsed.getScheme()) && parsed.getPath() != null) {
                                    File apkFile = new File(parsed.getPath());
                                    apkUri = FileProvider.getUriForFile(
                                        MainActivity.this,
                                        getPackageName() + ".fileprovider",
                                        apkFile
                                    );
                                }
                            }
                        }
                    }
                }

                if (apkUri == null) {
                    return "ERROR:Downloaded APK file could not be located.";
                }

                final Uri installUri = apkUri;
                runOnUiThread(() -> {
                    Intent installIntent = new Intent(Intent.ACTION_VIEW);
                    installIntent.setDataAndType(installUri, "application/vnd.android.package-archive");
                    installIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(installIntent);
                });
                return "OK";
            } catch (Exception ex) {
                return "ERROR:" + (ex.getMessage() != null ? ex.getMessage() : "Unable to open APK installer.");
            }
        }

        @JavascriptInterface
        public boolean ensureCameraPermission() {
            if (ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.CAMERA)
                    == PackageManager.PERMISSION_GRANTED) {
                return true;
            }
            runOnUiThread(() -> ActivityCompat.requestPermissions(
                MainActivity.this,
                new String[]{ Manifest.permission.CAMERA },
                1002
            ));
            return false;
        }

        @JavascriptInterface
        public boolean ensureStoragePermission() {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                return true;
            }
            if (ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                    == PackageManager.PERMISSION_GRANTED) {
                return true;
            }
            runOnUiThread(() -> ActivityCompat.requestPermissions(
                MainActivity.this,
                new String[]{ Manifest.permission.WRITE_EXTERNAL_STORAGE },
                1003
            ));
            return false;
        }

        @JavascriptInterface
        public String saveBase64File(String base64Data, String filename, String mimeType) {
            try {
                String safeName = (filename == null || filename.trim().isEmpty())
                    ? "Quadra12-Export.pdf"
                    : filename.replaceAll("[^a-zA-Z0-9._-]", "_");
                String resolvedMime = (mimeType == null || mimeType.trim().isEmpty())
                    ? "application/pdf"
                    : mimeType;
                byte[] fileBytes = Base64.decode(base64Data, Base64.DEFAULT);

                Uri viewUri = null;
                String displayPath = "Downloads/Quadra12/" + safeName;

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    ContentResolver resolver = getContentResolver();
                    ContentValues values = new ContentValues();
                    values.put(MediaStore.MediaColumns.DISPLAY_NAME, safeName);
                    values.put(MediaStore.MediaColumns.MIME_TYPE, resolvedMime);
                    values.put(
                        MediaStore.MediaColumns.RELATIVE_PATH,
                        Environment.DIRECTORY_DOWNLOADS + "/Quadra12"
                    );
                    values.put(MediaStore.MediaColumns.IS_PENDING, 1);

                    Uri uri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
                    if (uri == null) {
                        return "ERROR:Failed to create file in Downloads/Quadra12.";
                    }
                    try (OutputStream out = resolver.openOutputStream(uri)) {
                        if (out == null) {
                            return "ERROR:Unable to open download output stream.";
                        }
                        out.write(fileBytes);
                        out.flush();
                    }
                    values.clear();
                    values.put(MediaStore.MediaColumns.IS_PENDING, 0);
                    resolver.update(uri, values, null, null);
                    viewUri = uri;
                } else {
                    if (ContextCompat.checkSelfPermission(
                            MainActivity.this,
                            Manifest.permission.WRITE_EXTERNAL_STORAGE
                        ) != PackageManager.PERMISSION_GRANTED) {
                        runOnUiThread(() -> ActivityCompat.requestPermissions(
                            MainActivity.this,
                            new String[]{ Manifest.permission.WRITE_EXTERNAL_STORAGE },
                            1003
                        ));
                        return "ERROR:Storage permission required. Tap Allow, then tap Save PDF again.";
                    }
                    File downloadsRoot = Environment.getExternalStoragePublicDirectory(
                        Environment.DIRECTORY_DOWNLOADS
                    );
                    File appDir = new File(downloadsRoot, "Quadra12");
                    if (!appDir.exists()) {
                        appDir.mkdirs();
                    }
                    File outFile = new File(appDir, safeName);
                    try (FileOutputStream fos = new FileOutputStream(outFile)) {
                        fos.write(fileBytes);
                        fos.flush();
                    }
                    MediaScannerConnection.scanFile(
                        MainActivity.this,
                        new String[]{ outFile.getAbsolutePath() },
                        new String[]{ resolvedMime },
                        null
                    );
                    viewUri = FileProvider.getUriForFile(
                        MainActivity.this,
                        getPackageName() + ".fileprovider",
                        outFile
                    );
                }

                final Uri finalUri = viewUri;
                final String finalMime = resolvedMime;
                final String finalPath = displayPath;
                runOnUiThread(() -> {
                    Toast.makeText(
                        MainActivity.this,
                        "Saved to " + finalPath,
                        Toast.LENGTH_LONG
                    ).show();
                    if (finalUri != null && "application/pdf".equals(finalMime)) {
                        try {
                            Intent viewIntent = new Intent(Intent.ACTION_VIEW);
                            viewIntent.setDataAndType(finalUri, finalMime);
                            viewIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                            startActivity(Intent.createChooser(viewIntent, "Open Quadra 12 PDF"));
                        } catch (Exception ignored) {
                            // No PDF viewer installed; file is still saved in Downloads/Quadra12
                        }
                    }
                });

                return "OK:" + displayPath;
            } catch (Exception ex) {
                return "ERROR:" + (ex.getMessage() != null ? ex.getMessage() : "File save failed.");
            }
        }
    }
}
`;

fs.writeFileSync(path.join(mainActivityDir, 'MainActivity.java'), mainActivityJava, 'utf8');

console.log(
  `Configured Android appId=${appId}, appName="${appName}", versionName=${versionName}, versionCode=${versionCode}, releaseSigning=${enableReleaseSigning}`,
);
