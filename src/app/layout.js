import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://olusemre.dev"),
  title: {
    default: "Oluş Emre Demir — Tasarım Mühendisi // Maker",
    template: "%s — Oluş Emre Demir",
  },
  description:
    "Mekanik kısıtlar ile dijital imkanlar arasındaki köprüyü kuruyorum. Robotik, IoT, PCB tasarımı ve yazılım projeleri.",
  keywords: [
    "Oluş Emre Demir",
    "Design Engineer",
    "Maker",
    "Robotics",
    "IoT",
    "PCB",
    "Embedded",
    "Python",
    "React",
    "Portfolio",
  ],
  authors: [{ name: "Oluş Emre Demir" }],
  creator: "Oluş Emre Demir",
  publisher: "Oluş Emre Demir",
  applicationName: "Portfolio",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
  openGraph: {
    type: "website",
    url: "https://olusemre.dev/",
    title: "Oluş Emre Demir — Tasarım Mühendisi // Maker",
    description:
      "Robotik, IoT, PCB tasarımı, görüntü işleme ve akıllı arayüzler.",
    siteName: "olusemre.dev",
    locale: "tr_TR",
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@",
    creator: "@",
    title: "Oluş Emre Demir — Tasarım Mühendisi // Maker",
    description: "Robotik, IoT, PCB tasarımı ve görüntü işleme.",
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  themeColor: "#1688e8",
  category: "portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Person JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              '@id': 'https://olusemre.dev/#person',
              name: 'Oluş Emre Demir',
              url: 'https://olusemre.dev',
              image: 'https://olusemre.dev/opengraph-image',
              jobTitle: 'Tasarım Mühendisi / Maker',
              sameAs: [
                'https://linkedin.com/in/olusemre',
                'https://github.com',
                'mailto:olusemredemir@gmail.com',
              ],
            }),
          }}
        />
        {/* CreativeWork (Portfolio) JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CreativeWork',
              name: 'Oluş Emre Demir Portfolio',
              url: 'https://olusemre.dev/',
              inLanguage: 'tr',
              about: [
                'Robotics',
                'IoT',
                'PCB Design',
                'Computer Vision',
                'Embedded Systems',
              ],
              image: 'https://olusemre.dev/opengraph-image',
              author: { '@id': 'https://olusemre.dev/#person' },
              creator: { '@id': 'https://olusemre.dev/#person' },
              dateModified: new Date().toISOString(),
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
