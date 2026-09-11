/**
 * Utility to extract iOS Application Name and Bundle Identifier
 * from uploaded files, IPA filenames, Swift code, Git URLs, or project paths.
 */

export interface ExtractedAppMetadata {
  appName: string;
  bundleId: string;
  detectedSource: string;
}

/**
 * Clean and format an app name from a raw string or filename
 */
export function formatAppName(raw?: string | null): string {
  if (!raw) return 'My iOS App';
  
  // Remove extension if present
  let clean = raw.replace(/\.(ipa|zip|xcarchive|swift|plist|xcodeproj|xcworkspace)$/i, '');
  
  // Remove common build/version suffix patterns (e.g. _v1.2.3, -2.4.0, (Release), etc.)
  clean = clean.replace(/[_-]v?\d+(\.\d+)*(-[a-zA-Z0-9]+)?$/i, '');
  clean = clean.replace(/\s*\(\w+\)$/, '');
  
  // Replace underscores and hyphens with spaces for readability if kebab-case
  if (clean.includes('-') || clean.includes('_')) {
    clean = clean.replace(/[-_]+/g, ' ');
  }
  
  // Convert camelCase to Title Case with spaces if needed
  clean = clean.replace(/([a-z])([A-Z])/g, '$1 $2').trim();
  
  // Capitalize first letter of each word
  clean = clean
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return clean || 'My iOS App';
}

/**
 * Format a bundle identifier from an app name or raw string
 */
export function formatBundleId(org?: string | null, appName?: string | null): string {
  const cleanOrg = (org || 'developer').toLowerCase().replace(/[^a-z0-9]/g, '') || 'developer';
  const cleanApp = (appName || 'app').toLowerCase().replace(/[^a-z0-9]/g, '') || 'app';
  return `com.${cleanOrg}.${cleanApp}`;
}

/**
 * Extract metadata from an Info.plist content string
 */
export function extractFromPlistContent(plistText: string): Partial<ExtractedAppMetadata> | null {
  if (!plistText || (!plistText.includes('<plist') && !plistText.includes('CFBundle'))) {
    return null;
  }

  let bundleId: string | undefined;
  let appName: string | undefined;

  // CFBundleIdentifier
  const bundleMatch = plistText.match(/<key>CFBundleIdentifier<\/key>\s*<string>([^<]+)<\/string>/i);
  if (bundleMatch && bundleMatch[1] && !bundleMatch[1].includes('$')) {
    bundleId = bundleMatch[1].trim();
  }

  // CFBundleDisplayName or CFBundleName
  const displayMatch = plistText.match(/<key>CFBundleDisplayName<\/key>\s*<string>([^<]+)<\/string>/i);
  const nameMatch = plistText.match(/<key>CFBundleName<\/key>\s*<string>([^<]+)<\/string>/i);

  if (displayMatch && displayMatch[1] && !displayMatch[1].includes('$')) {
    appName = displayMatch[1].trim();
  } else if (nameMatch && nameMatch[1] && !nameMatch[1].includes('$')) {
    appName = nameMatch[1].trim();
  }

  if (bundleId || appName) {
    return {
      appName: appName || (bundleId ? bundleId.split('.').pop() : undefined),
      bundleId: bundleId
    };
  }

  return null;
}

/**
 * Extract metadata from Swift / SwiftUI / UIKit source code
 */
export function extractFromSwiftCode(code: string): ExtractedAppMetadata {
  if (!code || code.trim().length === 0) {
    return {
      appName: 'My iOS App',
      bundleId: 'com.developer.app',
      detectedSource: 'default'
    };
  }

  // Check for explicit bundle identifier in code
  const explicitBundleMatch = code.match(/bundleIdentifier\s*[:=]\s*"([^"]+)"/i) ||
                              code.match(/Bundle\(identifier:\s*"([^"]+)"\)/i);
  const explicitBundle = explicitBundleMatch ? explicitBundleMatch[1] : null;

  // Check for @main struct AppName: App
  const mainAppMatch = code.match(/@main\s+struct\s+([A-Za-z0-9_]+)(App)?\s*:\s*App/i);
  if (mainAppMatch) {
    const rawName = mainAppMatch[1];
    const appName = formatAppName(rawName);
    return {
      appName,
      bundleId: explicitBundle || formatBundleId('developer', rawName),
      detectedSource: 'SwiftUI @main'
    };
  }

  // Check for class AppName: UIResponder, UIApplicationDelegate
  const appDelegateMatch = code.match(/class\s+([A-Za-z0-9_]+)(AppDelegate)?\s*:\s*(UIResponder|NSObject)/i);
  if (appDelegateMatch) {
    const rawName = appDelegateMatch[1];
    const appName = formatAppName(rawName);
    return {
      appName,
      bundleId: explicitBundle || formatBundleId('developer', rawName),
      detectedSource: 'UIKit AppDelegate'
    };
  }

  // Check for UIViewController or SwiftUI View name
  const vcMatch = code.match(/(?:class|struct)\s+([A-Za-z0-9_]+)(?:ViewController|View|Screen|Page)/i);
  if (vcMatch) {
    const rawName = vcMatch[1];
    const appName = formatAppName(rawName);
    return {
      appName,
      bundleId: explicitBundle || formatBundleId('developer', rawName),
      detectedSource: 'Swift View'
    };
  }

  return {
    appName: 'Custom Swift View',
    bundleId: explicitBundle || 'com.developer.customview',
    detectedSource: 'Swift Code'
  };
}

/**
 * Extract metadata from uploaded files list (.ipa, .zip, .plist, .swift, etc.)
 */
export function extractFromUploadedFiles(files: Array<{ name: string; content?: string; size?: number }>): ExtractedAppMetadata {
  if (!files || files.length === 0) {
    return {
      appName: 'My iOS App',
      bundleId: 'com.developer.app',
      detectedSource: 'default'
    };
  }

  // 1. Check if any file is an Info.plist or contains plist XML
  for (const file of files) {
    if (file.name.toLowerCase().endsWith('.plist') || file.content?.includes('<key>CFBundleIdentifier</key>')) {
      if (file.content) {
        const plistMeta = extractFromPlistContent(file.content);
        if (plistMeta && plistMeta.bundleId) {
          return {
            appName: plistMeta.appName ? formatAppName(plistMeta.appName) : formatAppName(file.name),
            bundleId: plistMeta.bundleId,
            detectedSource: 'Info.plist'
          };
        }
      }
    }
  }

  // 2. Check for .ipa, .zip, .xcarchive package names
  for (const file of files) {
    const lower = file.name.toLowerCase();
    if (lower.endsWith('.ipa') || lower.endsWith('.xcarchive') || lower.endsWith('.zip')) {
      const appName = formatAppName(file.name);
      
      // Known app signatures for common test IPAs or extract reverse domain
      let org = 'developer';
      if (lower.includes('whatsapp')) org = 'whatsapp';
      else if (lower.includes('spotify')) org = 'spotify';
      else if (lower.includes('duostore') || lower.includes('apple')) org = 'apple';
      else if (lower.includes('instagram') || lower.includes('facebook')) org = 'meta';
      else if (lower.includes('twitter') || lower.includes('x')) org = 'x';
      else if (lower.includes('google')) org = 'google';
      else if (lower.includes('telegram')) org = 'telegram';

      // Check if filename is a reverse-domain like com.example.app.ipa
      const revDomainMatch = file.name.match(/^([a-z0-9_]+\.[a-z0-9_]+(\.[a-z0-9_]+)+)/i);
      const bundleId = (revDomainMatch && revDomainMatch[1]) ? revDomainMatch[1] : formatBundleId(org, appName);

      return {
        appName,
        bundleId,
        detectedSource: lower.endsWith('.ipa') ? 'iOS App Package (.ipa)' : 'App Archive'
      };
    }
  }

  // 3. Check Swift source files
  for (const file of files) {
    if (file.name.endsWith('.swift') && file.content) {
      const swiftMeta = extractFromSwiftCode(file.content);
      if (swiftMeta.appName !== 'Custom Swift View') {
        return {
          appName: swiftMeta.appName,
          bundleId: swiftMeta.bundleId,
          detectedSource: `${file.name}`
        };
      }
    }
  }

  // 4. Default to first file's basename
  const primaryName = formatAppName(files[0]?.name);
  return {
    appName: primaryName,
    bundleId: formatBundleId('developer', primaryName),
    detectedSource: 'File Package'
  };
}

/**
 * Extract metadata from GitHub Repository URL
 */
export function extractFromGitUrl(url: string): ExtractedAppMetadata {
  if (!url || url.trim().length === 0) {
    return {
      appName: 'Remote Git App',
      bundleId: 'com.developer.gitapp',
      detectedSource: 'default'
    };
  }

  try {
    // E.g. https://github.com/airbnb/lottie-ios or git@github.com:apple/sample-app.git
    const cleanUrl = url.trim().replace(/\.git$/i, '');
    const parts = cleanUrl.split(/[/:]/).filter(Boolean);
    
    if (parts.length >= 2) {
      const repo = parts[parts.length - 1];
      const owner = parts[parts.length - 2];
      const appName = formatAppName(repo);
      const bundleId = formatBundleId(owner, repo);
      return {
        appName,
        bundleId,
        detectedSource: `GitHub (${owner}/${repo})`
      };
    }
  } catch (_) {}

  return {
    appName: 'Remote Git App',
    bundleId: 'com.developer.gitapp',
    detectedSource: 'Git URL'
  };
}

/**
 * Extract metadata from Local Folder Path
 */
export function extractFromLocalPath(localPath: string): ExtractedAppMetadata {
  if (!localPath || localPath.trim().length === 0) {
    return {
      appName: 'Local Xcode Project',
      bundleId: 'com.local.app',
      detectedSource: 'default'
    };
  }

  const clean = localPath.trim().replace(/[/\\]+$/, '');
  const segments = clean.split(/[/\\]/).filter(Boolean);
  const folderName = segments[segments.length - 1] || 'LocalApp';
  const appName = formatAppName(folderName);

  return {
    appName,
    bundleId: formatBundleId('local', folderName),
    detectedSource: `Local Folder (${folderName})`
  };
}
