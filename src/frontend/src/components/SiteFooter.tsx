import Link from "next/link";
import Logo from "./Logo";
import Year from "./Year";

export default function SiteFooter({ name, email }: { name: string; email: string }) {
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
          <a href="https://limanyazilim.com" title="Liman Yazılım" rel="noopener">
            Liman Yazılım tarafından geliştirildi
          </a>
        </div>
      </div>
    </footer>
  );
}
