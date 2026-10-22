import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdminPanel from "@/components/AdminPanel";

export const metadata: Metadata = {
  title: "Yönetim paneli",
  robots: { index: false, follow: false },
};

export default function PanelPage() {
  return (
    <main className="wrap">
      <Breadcrumbs items={[{ name: "Yönetim paneli" }]} />
      <AdminPanel />
    </main>
  );
}
