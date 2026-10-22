"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogIn, UserPlus, UserRound, LayoutDashboard } from "lucide-react";

export interface SessionUser {
  id: string;
  fullName: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  roles: string[];
  whatsAppInviteUrl?: string | null;
}

/**
 * Header'daki giriş durumu. Sayfalar statik kalsın diye oturum istemcide okunur:
 * /api/auth/me çerezi okur, API'ye sorar. Yanıt gelene kadar hiçbir şey göstermez.
 */
export default function AuthMenu({ variant }: { variant: "bar" | "panel" }) {
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => alive && setUser(u))
      .catch(() => alive && setUser(null));
    return () => {
      alive = false;
    };
  }, []);

  if (user === undefined) return <span className="auth__ph" aria-hidden />;

  const isAdmin = user?.roles.includes("Admin");

  if (variant === "panel") {
    return user ? (
      <>
        <Link href="/hesap" className="btn btn--primary" title="Hesabım">
          <UserRound size={18} aria-hidden />
          Hesabım
        </Link>
        {isAdmin && (
          <Link href="/panel" className="btn btn--ghost" title="Yönetim paneli">
            <LayoutDashboard size={18} aria-hidden />
            Panel
          </Link>
        )}
      </>
    ) : (
      <>
        <Link href="/giris" className="btn btn--primary" title="Giriş yap">
          <LogIn size={18} aria-hidden />
          Giriş yap
        </Link>
        <Link href="/kayit" className="btn btn--ghost" title="Üye ol">
          <UserPlus size={18} aria-hidden />
          Üye ol
        </Link>
      </>
    );
  }

  return user ? (
    <span className="auth">
      {isAdmin && (
        <Link href="/panel" className="auth__link" title="Yönetim paneli">
          Panel
        </Link>
      )}
      <Link href="/hesap" className="auth__user" title="Hesabım">
        <UserRound size={16} aria-hidden />
        <span>{user.fullName.split(" ")[0]}</span>
      </Link>
    </span>
  ) : (
    <span className="auth">
      <Link href="/kayit" className="auth__link auth__link--ghost" title="Üye ol">
        <UserPlus size={16} aria-hidden />
        Üye ol
      </Link>
      <Link href="/giris" className="btn btn--primary auth__btn" title="Giriş yap">
        <LogIn size={16} aria-hidden />
        Giriş yap
      </Link>
    </span>
  );
}
