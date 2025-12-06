# Oluş Emre Demir — Portfolio

Modern, etkileşimli bir Next.js 14+ portfolyo. Mekanik ve dijital dünyalar arasında köprü kuran projeleri temaya uygun bir masa/desk arayüzü ile sergiler.

## Özellikler

- Temaya uygun **yükleme (boot) ekranı** ve akıcı fade/scale geçişler
- **Draggable desk**: geniş tuval üzerinde projeleri kart olarak gezdirme
- **TR odaklı metadata** ve **JSON-LD (Person + CreativeWork)**
- **Dinamik OG/Twitter görselleri** (`/opengraph-image`, `/twitter-image`)
- **Sitemap** (`/sitemap.xml`) ve **Robots** (`/robots.txt`)
- **Favicon (SVG)** ve **Apple Touch Icon** (dinamik)
- Framer Motion animasyonları, grid arka plan, temaya uygun UI

## Kurulum

```powershell
# bağımlılıkları yükle
npm install

# geliştirme sunucusunu başlat
npm run dev
```

Uygulama varsayılan olarak `http://localhost:3000` altında çalışır.

## Proje Yapısı

- `src/app/page.js`: Masa/desk arayüzü, projeler, alt sayfalar
- `src/app/layout.js`: Global stiller ve metadata/SEO
- `src/app/opengraph-image.js`: OG görseli (dinamik)
- `src/app/twitter-image.js`: Twitter görseli (dinamik)
- `src/app/icon.js`: Favicon (alternatif dinamik rota, SVG ile birlikte)
- `src/app/apple-icon.js`: Apple Touch Icon (dinamik)
- `src/app/sitemap.js`: Next.js App Router sitemap
- `src/app/robots.js`: Robots yapılandırması
- `public/favicon.svg`: Statik favicon

## SEO Notları

- Dil `tr` ve `openGraph.locale = tr_TR` olarak ayarlandı.
- `alternates.languages` (hreflang) ile TR/EN sinyali veriliyor.
- Structured Data: `Person` + `CreativeWork` JSON-LD `<head>` içine eklendi.
- Sosyal önizleme görselleri dinamik rotalardan üretiliyor.
- Canonical ve robots yönergeleri yayın için hazır.

Arama sonuçlarında “Oluş Emre Demir” görünürlüğünü arttırmak için:

- Başlıklar ve içerikte Türkçe anahtar kelimeleri kullanmaya devam edin.
- Proje sayfalarını ayrı route’lara bölerek indekslenebilir sayfa sayısını artırın.
- Performans (Core Web Vitals) için görselleri optimize edin (lazy-load, boyutlar, preload kritik fontlar).

## Dağıtım

Vercel önerilir. Next.js 14+ App Router ile uyumlu.

- Ortam değişkeni gerekmiyor; tüm OG/Twitter görselleri ve ikon rotaları edge’de üretilir.
- Alan adınız `https://olusemre.dev` ise `metadataBase` buna göre ayarlanmıştır.

## Lisans

Bu repo kişisel portfolyo içindir.This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
