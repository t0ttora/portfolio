import type { Metadata } from "next";
import { headers } from "next/headers";
import { LegalShell } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  robots: { index: false, follow: false },
};

function pickLocale(acceptLanguage: string | null) {
  const value = (acceptLanguage ?? "").toLowerCase();
  if (value.includes("tr")) return "tr" as const;
  return "en" as const;
}

export default async function PrivacyPolicyPage() {
  const hdrs = await headers();
  const locale = pickLocale(hdrs.get("accept-language"));
  const effectiveDate = locale === "tr" ? "29 Ocak 2026" : "29 Jan 2026";

  return (
    <LegalShell
      title={locale === "tr" ? "Gizlilik Politikası" : "Privacy Policy"}
      subtitle={`${locale === "tr" ? "Yürürlük" : "Effective"}: ${effectiveDate}`}
    >
      {locale === "tr" ? (
        <>
          <section className="space-y-3">
            <h2 className="text-white text-base font-semibold">Kapsam</h2>
            <p>
              Bu Gizlilik Politikası, bu web sitesini kullandığınızda hangi
              bilgilerin işlendiğini ve bunların nasıl korunduğunu açıklar.
              Varsayılan yaklaşımımız minimum veri toplamadır.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-base font-semibold">Toplanan Veriler</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-mono text-white/70">Kimlik doğrulama</span>
                : The Vault (admin girişi) kullanılırsa Supabase Auth, Google
                OAuth üzerinden e-posta adresinizi oturum oluşturmak amacıyla
                işler.
              </li>
              <li>
                <span className="font-mono text-white/70">Temel loglar</span>:
                güvenlik ve hata ayıklama için IP adresi, user-agent ve istek
                metadatası gibi standart sunucu logları tutulabilir.
              </li>
              <li>
                <span className="font-mono text-white/70">Çerezler</span>:
                Supabase, oturum yönetimi için gerekli auth çerezlerini
                yerleştirir.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-base font-semibold">Yapmadıklarımız</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Kişisel verileri satmayız.</li>
              <li>Varsayılan olarak reklam/izleme pikselleri koymayız.</li>
              <li>
                Operasyonel gereksinimler dışında gereksiz veri saklamayız.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-base font-semibold">Üçüncü Taraflar</h2>
            <p>
              Kimlik doğrulama Supabase ve Google OAuth ile sağlanır. Bu
              sağlayıcılar, kendi politikalarına göre veri işleyebilir.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-base font-semibold">Güvenlik</h2>
            <p>
              Admin erişimi, gizli bir passphrase ve e-posta allowlist kuralı
              ile korunur. Yetkisiz kimlikler tespit edildiğinde oturum sonlandırılır.
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
            <h2 className="text-white text-base font-semibold">Scope</h2>
            <p>
              This Privacy Policy explains what information is processed when
              you use this site and how it is protected. The default posture is
              minimal collection.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-base font-semibold">Data We Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-mono text-white/70">Authentication</span>
                : if you use The Vault (admin login), Supabase Auth processes
                your Google identity (email) to create a session.
              </li>
              <li>
                <span className="font-mono text-white/70">Basic logs</span>:
                standard server logs may include IP address, user agent, and
                request metadata for security and reliability.
              </li>
              <li>
                <span className="font-mono text-white/70">Cookies</span>: Supabase
                sets session cookies required for authentication.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-base font-semibold">What We Don’t Do</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>We do not sell personal data.</li>
              <li>We do not embed ad/tracking pixels by default.</li>
              <li>We avoid unnecessary retention beyond operational needs.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-base font-semibold">Third Parties</h2>
            <p>
              Authentication is provided via Supabase and Google OAuth. Those
              services may process data according to their own policies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-white text-base font-semibold">Security</h2>
            <p>
              Admin access is protected by a Vault gate (secret phrase) and a
              strict email allowlist. Unauthorized identities are signed out
              immediately.
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
