import type { Metadata } from "next";
import { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Giriş yap",
  description: "Bandırma Senin üye girişi.",
  alternates: { canonical: "/giris" },
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <main className="wrap">
      <Breadcrumbs items={[{ name: "Giriş yap" }]} />
      <div className="authpage">
        <h1>Tekrar hoş geldiniz.</h1>
        <p className="hero__lead">Pazar çalışmalarının yerini ve saatini hesabınızdan görürsünüz.</p>
        <Suspense fallback={null}>
          <AuthForm mode="login" />
        </Suspense>
      </div>
    </main>
  );
}
