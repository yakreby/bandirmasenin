import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import AccountPanel from "@/components/AccountPanel";

export const metadata: Metadata = {
  title: "Hesabım",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <main className="wrap">
      <Breadcrumbs items={[{ name: "Hesabım" }]} />
      <AccountPanel />
    </main>
  );
}
