import type { Metadata } from "next";
import { headers } from "next/headers";
import { LegalShell } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Terms of Service",
  robots: { index: false, follow: false },
};

function pickLocale(acceptLanguage: string | null) {
  const value = (acceptLanguage ?? "").toLowerCase();
  if (value.includes("tr")) return "tr" as const;
  return "en" as const;
}

export default async function TermsOfServicePage() {
  const hdrs = await headers();
  const locale = pickLocale(hdrs.get("accept-language"));
  const effectiveDate = locale === "tr" ? "29 Ocak 2026" : "29 Jan 2026";

  return (
    <LegalShell
      title={locale === "tr" ? "Kullanım Koşulları" : "Terms of Service"}
      subtitle={`${locale === "tr" ? "Yürürlük" : "Effective"}: ${effectiveDate}`}
    >
      {locale === "tr" ? (
        <>
          <section className="space-y-3">
            <h2 className="text-white text-base font-semibold">Kabul</h2>
            <p>
              Bu siteye erişerek veya siteyi kullanarak işbu Kullanım Koşullarını
              kabul etmiş olursunuz. Kabul etmiyorsanız siteyi kullanmayın.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-base font-semibold">Sitenin Kullanımı</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Siteyi yalnızca hukuka uygun amaçlarla kullanın.</li>
              <li>Güvenlik kontrollerini aşmaya çalışmayın.</li>
              <li>
                Servisin zafiyetini test etmeye yönelik tarama/probe işlemleri
                yapmayın.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-base font-semibold">The Vault (Admin)</h2>
            <p>
              Admin fonksiyonları özel ve erişim kontrollüdür. Yetkisiz erişim
              girişimleri erişimin engellenmesine ve geçici ban uygulanmasına
              neden olabilir.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-base font-semibold">Fikri Mülkiyet</h2>
            <p>
              Bu sitedeki içerikler (metin, görsel, tasarım ve kod örnekleri)
              yürürlükteki mevzuat kapsamında korunabilir. İzin olmadan
              çoğaltılamaz veya yeniden dağıtılamaz.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-base font-semibold">Sorumluluk Reddi</h2>
            <p>
              Site “olduğu gibi” ve “mevcut olduğu ölçüde” sunulur; açık veya
              zımni herhangi bir garanti verilmez.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-base font-semibold">İletişim</h2>
            <p className="font-mono text-white/70">olusemredemir@gmail.com</p>
          </section>
        </>
      ) : (
        <>
          <section className="space-y-3">
            <h2 className="text-white text-base font-semibold">Acceptance</h2>
            <p>
              By accessing or using this site, you agree to these Terms of
              Service. If you do not agree, do not use the site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-base font-semibold">Use of the Site</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use the site for lawful purposes only.</li>
              <li>Do not attempt to bypass security controls.</li>
              <li>Do not probe, scan, or test vulnerabilities.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-base font-semibold">The Vault (Admin)</h2>
            <p>
              Admin functionality is private and access-controlled. Unauthorized
              access attempts may result in denial of access and temporary bans.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-base font-semibold">Intellectual Property</h2>
            <p>
              Content on this site (including text, visuals, design, and code
              samples) may be protected by applicable laws. You may not
              reproduce or redistribute it without permission.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-base font-semibold">Disclaimer</h2>
            <p>
              The site is provided on an “as is” and “as available” basis without
              warranties of any kind.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-base font-semibold">Contact</h2>
            <p className="font-mono text-white/70">olusemredemir@gmail.com</p>
          </section>
        </>
      )}
    </LegalShell>
  );
}
