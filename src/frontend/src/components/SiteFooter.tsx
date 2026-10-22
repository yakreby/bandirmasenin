import Link from "next/link";
import { Heart } from "lucide-react";
import Logo from "./Logo";
import Year from "./Year";

export default function SiteFooter({
  name,
  email,
  supporter,
}: {
  name: string;
  email: string;
  supporter?: { name: string; url: string };
}) {
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr__top">
          <div className="ftr__brand">
            <Logo size={32} />
            <div>
              <div className="ftr__name">{name}</div>
              <p>
                Bağımsız bir yerel girişim. Haritadaki her kayıt fotoğraf ve tartıyla belgelenir;
                hiçbir kurumun reklam alanı değildir.
              </p>
              {supporter && (
                <p className="ftr__supporter">
                  <a href={supporter.url} title={`${supporter.name} web sitesi`} target="_blank" rel="noopener noreferrer">
                    {supporter.name}
                  </a>{" "}
                  desteğiyle.
                </p>
              )}
            </div>
          </div>
          <nav className="ftr__nav" aria-label="Alt menü">
            <Link href="/katil" title="Pazar temizliğine katıl">
              Katıl
            </Link>
            <Link href="/hakkinda" title="Bandırma Senin nedir">
              Hakkında
            </Link>
            <Link href="/cerez-politikasi" title="Çerez politikası">
              Çerez politikası
            </Link>
            <a href={`mailto:${email}`} title="E-posta gönder">
              {email}
            </a>
          </nav>
        </div>
        <div className="ftr__bottom">
          <span>
            © <Year /> {name}
          </span>
          <a href="https://limanyazilim.com" title="Liman Yazılım" target="_blank" rel="noopener noreferrer" className="ftr__liman">
            Liman Yazılım tarafından <Heart size={13} className="ftr__heart" aria-label="sevgi" /> ile
            geliştirildi
          </a>
        </div>
      </div>
    </footer>
  );
}
