export const APP_VERSION = '2.6.0';

export const GITHUB_REPO_OWNER = 'Ariyanpal1008';
export const GITHUB_REPO_NAME = 'Quadra12';
export const GITHUB_REPO_URL = `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`;
export const GITHUB_RELEASES_API_URL = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/releases/latest`;
export const GITHUB_RELEASES_PAGE_URL = `${GITHUB_REPO_URL}/releases`;

export interface InstalledAppInfo {
  versionName: string;
  versionCode: number | null;
  isNativeAndroid: boolean;
  packageName?: string;
}

export function normalizeVersionString(rawVersion: string): string {
  return rawVersion.replace(/^v/i, '').trim();
}

export function parseSemverParts(rawVersion: string): [number, number, number] {
  const clean = normalizeVersionString(rawVersion).split('-')[0] || '0.0.0';
  const parts = clean.split('.').map((segment) => {
    const num = parseInt(segment.replace(/\D.*$/, ''), 10);
    return Number.isFinite(num) && num >= 0 ? num : 0;
  });
  return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0];
}

/**
 * Returns 1 if remote > local, -1 if remote < local, 0 if equal.
 */
export function compareSemver(remoteVer: string, localVer: string): -1 | 0 | 1 {
  const r = parseSemverParts(remoteVer);
  const l = parseSemverParts(localVer);
  for (let i = 0; i < 3; i++) {
    if (r[i] > l[i]) return 1;
    if (r[i] < l[i]) return -1;
  }
  return 0;
}

export function isVersionNewer(remoteVer: string, localVer: string): boolean {
  return compareSemver(remoteVer, localVer) > 0;
}

export function getInstalledAppInfo(): InstalledAppInfo {
  if (typeof window !== 'undefined' && window.QuadraAndroid?.getInstalledVersion) {
    try {
      const raw = window.QuadraAndroid.getInstalledVersion();
      if (raw) {
        const parsed = JSON.parse(raw) as {
          versionName?: string;
          versionCode?: number;
          packageName?: string;
        };
        const versionName = normalizeVersionString(parsed.versionName || APP_VERSION) || APP_VERSION;
        return {
          versionName,
          versionCode: typeof parsed.versionCode === 'number' ? parsed.versionCode : null,
          isNativeAndroid: true,
          packageName: parsed.packageName || 'io.github.ariyanpal1008.quadra12',
        };
      }
    } catch {
      // Fallback to web APP_VERSION below
    }
  }

  const isCapacitorRuntime =
    typeof window !== 'undefined' &&
    Boolean(window.QuadraAndroid || (window as Window & {Capacitor?: unknown}).Capacitor);

  return {
    versionName: APP_VERSION,
    versionCode: null,
    isNativeAndroid: isCapacitorRuntime,
  };
}
