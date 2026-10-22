import type { Metadata } from "next";
import { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Üye ol",
  description: "Bandırma Senin'e üye olun: Pazar çalışmalarına davet, WhatsApp grubu ve katıldığınız çalışmaların kaydı.",
  alternates: { canonical: "/kayit" },
  openGraph: { title: "Bandırma Senin'e üye ol", description: "Pazar çalışmalarına davet ve grup.", url: "/kayit", type: "website" },
};

export default function RegisterPage() {
  return (
    <main className="wrap">
      <Breadcrumbs items={[{ name: "Üye ol" }]} />
      <div className="authpage">
        <h1>Aramıza katılın.</h1>
        <p className="hero__lead">
          Üyelik ücretsiz. Kaydınız bir yöneticinin onayından geçer; onaylanınca Pazar çalışmalarına
          davet ve WhatsApp grubunun bağlantısı hesabınızda görünür.
        </p>
        <Suspense fallback={null}>
          <AuthForm mode="register" />
        </Suspense>
      </div>
    </main>
  );
}
