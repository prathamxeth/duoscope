import type { Metadata } from 'next';
import './globals.css';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (process.env.NODE_ENV === 'production' ? '/duoscope' : '');

export const metadata: Metadata = {
  title: 'DuoScope | Dual-Screen iOS Continuity Diagnostics & 3D Simulation',
  description: 'Automated developer diagnostics & continuity profiling for iOS foldable form factors (iPhone Duo 5.4" <-> 7.6")',
  manifest: `${basePath}/site.webmanifest`,
  icons: {
    icon: [
      { url: `${basePath}/favicon-16x16.png`, sizes: '16x16', type: 'image/png' },
      { url: `${basePath}/favicon-32x32.png`, sizes: '32x32', type: 'image/png' },
      { url: `${basePath}/favicon-48x48.png`, sizes: '48x48', type: 'image/png' },
      { url: `${basePath}/favicon.ico`, sizes: '32x32' },
      { url: `${basePath}/favicon.png`, type: 'image/png' }
    ],
    shortcut: `${basePath}/favicon-32x32.png`,
    apple: [
      { url: `${basePath}/apple-touch-icon.png`, sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'icon', url: `${basePath}/android-chrome-192x192.png`, sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: `${basePath}/android-chrome-512x512.png`, sizes: '512x512', type: 'image/png' }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <head>
        <link rel="icon" type="image/png" sizes="16x16" href={`${basePath}/favicon-16x16.png`} />
        <link rel="icon" type="image/png" sizes="32x32" href={`${basePath}/favicon-32x32.png`} />
        <link rel="icon" type="image/png" sizes="48x48" href={`${basePath}/favicon-48x48.png`} />
        <link rel="icon" type="image/png" href={`${basePath}/favicon.png`} />
        <link rel="shortcut icon" href={`${basePath}/favicon.ico`} />
        <link rel="apple-touch-icon" sizes="180x180" href={`${basePath}/apple-touch-icon.png`} />
        <link rel="manifest" href={`${basePath}/site.webmanifest`} />

        {/* Video CDN Early DNS & Connection Warmup */}
        <link rel="preconnect" href="https://d8j0ntlcm91z4.cloudfront.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://d8j0ntlcm91z4.cloudfront.net" />

        {/* High-Priority Hero Videos Preload (Both Section 1 & Section 2) */}
        <link
          rel="preload"
          as="video"
          href="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260619_191346_9d19d66e-86a4-47f7-8dc6-712c1788c3b2.mp4"
          type="video/mp4"
        />
        <link
          rel="preload"
          as="video"
          href="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_093722_ccfc7ebf-182f-419f-8a62-2dc02db7dd9d.mp4"
          type="video/mp4"
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                darkMode: 'class',
                theme: {
                  extend: {
                    fontFamily: {
                      heading: ['"Instrument Serif"', 'Georgia', 'serif'],
                      body: ['"Barlow"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
                      mono: ['"JetBrains Mono"', 'monospace'],
                    },
                    borderRadius: {
                      DEFAULT: "9999px"
                    }
                  }
                }
              };
            `,
          }}
        />
      </head>
      <body className="font-body antialiased overflow-x-hidden min-h-screen bg-black text-white">{children}</body>
    </html>
  );
}
