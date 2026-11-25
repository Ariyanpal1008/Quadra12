import {
  GITHUB_RELEASES_API_URL,
  GITHUB_RELEASES_PAGE_URL,
  InstalledAppInfo,
  getInstalledAppInfo,
  isVersionNewer,
  normalizeVersionString,
} from '../constants/version';

export interface GitHubReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
  content_type?: string;
}

export interface ReleaseUpdateInfo {
  tagName: string;
  latestVersion: string;
  installed: InstalledAppInfo;
  hasUpdate: boolean;
  releaseTitle: string;
  releaseNotes: string;
  publishedAt: string | null;
  releasePageUrl: string;
  apkAsset: {
    name: string;
    downloadUrl: string;
    sizeBytes: number;
  } | null;
}

export type UpdateCheckOutcome =
  | {status: 'up-to-date'; info: ReleaseUpdateInfo}
  | {status: 'update-available'; info: ReleaseUpdateInfo}
  | {status: 'offline'; message: string}
  | {status: 'error'; message: string};

export interface NativeApkDownloadState {
  status: 'running' | 'pending' | 'paused' | 'successful' | 'failed' | 'unknown';
  bytesDownloaded: number;
  totalBytes: number;
  progress: number;
  error?: string;
}

const SESSION_DISMISS_KEY = 'quadra12_update_banner_dismissed_v1';

export function isUpdateBannerDismissed(version: string): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_DISMISS_KEY) === version;
  } catch {
    return false;
  }
}

export function dismissUpdateBannerForSession(version: string): void {
  try {
    window.sessionStorage.setItem(SESSION_DISMISS_KEY, version);
  } catch {
    // Ignore storage errors
  }
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export async function checkLatestGitHubRelease(): Promise<UpdateCheckOutcome> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return {
      status: 'offline',
      message:
        'No internet connection detected. Connect to Wi-Fi or mobile data and try again.',
    };
  }

  const installed = getInstalledAppInfo();
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(GITHUB_RELEASES_API_URL, {
      headers: {
        Accept: 'application/vnd.github+json',
      },
      cache: 'no-store',
      signal: controller.signal,
    });

    if (res.status === 404) {
      return {
        status: 'error',
        message:
          'No published GitHub Release was found yet. Publish a tagged release (e.g. v2.6.0) on GitHub to enable in-app APK updates.',
      };
    }

    if (res.status === 403 || res.status === 429) {
      return {
        status: 'error',
        message:
          'GitHub Releases API rate limit reached on this network. Wait a minute or open GitHub Releases directly.',
      };
    }

    if (!res.ok) {
      return {
        status: 'error',
        message: `GitHub Releases returned status ${res.status}. Please try again shortly.`,
      };
    }

    const data = (await res.json()) as {
      tag_name?: string;
      name?: string;
      body?: string;
      published_at?: string;
      html_url?: string;
      assets?: GitHubReleaseAsset[];
    };

    const tagName = data.tag_name || `v${installed.versionName}`;
    const latestVersion = normalizeVersionString(tagName) || installed.versionName;
    const assets = Array.isArray(data.assets) ? data.assets : [];

    // Prefer signed APK release asset (exclude unsigned debug APKs if any ever existed)
    const apk =
      assets.find(
        (asset) =>
          typeof asset.name === 'string' &&
          asset.name.toLowerCase().endsWith('.apk') &&
          !asset.name.toLowerCase().includes('unsigned'),
      ) || null;

    const hasUpdate = isVersionNewer(latestVersion, installed.versionName);

    const info: ReleaseUpdateInfo = {
      tagName,
      latestVersion,
      installed,
      hasUpdate,
      releaseTitle: (data.name || `Quadra 12 ${tagName}`).trim(),
      releaseNotes: (data.body || '').trim(),
      publishedAt: data.published_at || null,
      releasePageUrl: data.html_url || GITHUB_RELEASES_PAGE_URL,
      apkAsset: apk
        ? {
            name: apk.name,
            downloadUrl: apk.browser_download_url,
            sizeBytes: Number(apk.size) || 0,
          }
        : null,
    };

    return {
      status: hasUpdate ? 'update-available' : 'up-to-date',
      info,
    };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return {
        status: 'offline',
        message:
          'Connection timed out while checking GitHub Releases. Please check your internet connection.',
      };
    }
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      return {
        status: 'offline',
        message:
          'You appear to be offline. Connect to the internet to check for Quadra 12 updates.',
      };
    }
    return {
      status: 'error',
      message:
        'Could not reach GitHub Releases right now. Check your internet connection and try again.',
    };
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export function hasNativeApkUpdater(): boolean {
  return Boolean(
    typeof window !== 'undefined' &&
      window.QuadraAndroid?.downloadApkUpdate &&
      window.QuadraAndroid?.getApkDownloadStatus &&
      window.QuadraAndroid?.openDownloadedApk,
  );
}

export function startNativeApkDownload(
  apkUrl: string,
  filename: string,
): {ok: true; downloadId: number} | {ok: false; error: string} {
  const bridge = typeof window !== 'undefined' ? window.QuadraAndroid : undefined;
  if (!bridge?.downloadApkUpdate) {
    return {ok: false, error: 'Native Android updater bridge is unavailable.'};
  }
  try {
    const raw = bridge.downloadApkUpdate(apkUrl, filename);
    const parsed = JSON.parse(raw) as {
      ok?: boolean;
      downloadId?: number;
      error?: string;
    };
    if (parsed.ok && typeof parsed.downloadId === 'number' && parsed.downloadId > 0) {
      return {ok: true, downloadId: parsed.downloadId};
    }
    return {
      ok: false,
      error: parsed.error || 'Failed to enqueue APK download in Android DownloadManager.',
    };
  } catch {
    return {
      ok: false,
      error: 'Unable to start native APK download on this device.',
    };
  }
}

export function pollNativeApkDownload(downloadId: number): NativeApkDownloadState {
  const bridge = typeof window !== 'undefined' ? window.QuadraAndroid : undefined;
  if (!bridge?.getApkDownloadStatus) {
    return {
      status: 'unknown',
      bytesDownloaded: 0,
      totalBytes: 0,
      progress: 0,
      error: 'Download status bridge unavailable.',
    };
  }
  try {
    const raw = bridge.getApkDownloadStatus(downloadId);
    const parsed = JSON.parse(raw) as Partial<NativeApkDownloadState>;
    return {
      status: parsed.status || 'unknown',
      bytesDownloaded: Number(parsed.bytesDownloaded) || 0,
      totalBytes: Number(parsed.totalBytes) || 0,
      progress: Math.max(0, Math.min(100, Number(parsed.progress) || 0)),
      error: parsed.error,
    };
  } catch {
    return {
      status: 'unknown',
      bytesDownloaded: 0,
      totalBytes: 0,
      progress: 0,
      error: 'Failed to read Android download status.',
    };
  }
}

export function triggerNativeApkInstall(
  downloadId: number,
): 'OK' | 'NEEDS_PERMISSION' | string {
  const bridge = typeof window !== 'undefined' ? window.QuadraAndroid : undefined;
  if (!bridge?.openDownloadedApk) {
    return 'ERROR:Native Android installer bridge is unavailable.';
  }
  try {
    return bridge.openDownloadedApk(downloadId);
  } catch (err) {
    return `ERROR:${err instanceof Error ? err.message : 'Unable to launch system APK installer.'}`;
  }
}

export function canNativeRequestPackageInstalls(): boolean {
  const bridge = typeof window !== 'undefined' ? window.QuadraAndroid : undefined;
  if (!bridge?.canRequestPackageInstalls) return true;
  try {
    return Boolean(bridge.canRequestPackageInstalls());
  } catch {
    return true;
  }
}

export function openNativeInstallPermissionSettings(): void {
  const bridge = typeof window !== 'undefined' ? window.QuadraAndroid : undefined;
  bridge?.openInstallPermissionSettings?.();
}
