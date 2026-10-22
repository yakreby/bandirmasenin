import Link from "next/link";
import { Heart, Leaf } from "lucide-react";
import Logo from "./Logo";
import Year from "./Year";

export default function SiteFooter({
  name,
  email,
  supporter,
}: {
  name: string;
  email: string;
  /** Adlı destekçi gelince site.json → supporter doldurulur; boşken satır "Gönüllülerin desteğiyle." kalır. */
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
              <p className="ftr__supporter">
                {supporter ? (
                  <>
                    <a href={supporter.url} title={`${supporter.name} web sitesi`} target="_blank" rel="noopener noreferrer">
                      {supporter.name}
                    </a>{" "}
                    desteğiyle.
                  </>
                ) : (
                  "Gönüllülerin desteğiyle."
                )}
              </p>
            </div>
          </div>
          <nav className="ftr__nav" aria-label="Alt menü">
            <Link href="/iz-birak" title="Gördüğün çöpü fotoğrafla ve konumla bildir">
              İz bırak
            </Link>
            <Link href="/katil" title="Pazar temizliğine katıl">
              Katıl
            </Link>
            <Link href="/iletisim" title="Bize yazın">
              İletişim
            </Link>
            <Link href="/hakkinda" title="Bandırma Senin nedir">
              Hakkında
            </Link>
            <Link href="/cerez-politikasi" title="Çerez politikası">
              Çerez politikası
            </Link>
            <Link href="/kvkk-aydinlatma" title="KVKK aydınlatma metni">
              KVKK aydınlatma
            </Link>
            <span>{email}</span>
          </nav>
        </div>

        <div className="ftr__eco" title="Düşük enerji ilkesiyle geliştirildi">
          <span className="eco">
            <Leaf size={14} aria-hidden />
            Düşük enerjili, çevre dostu yazılım
          </span>
          <span className="eco__sub">
            Statik sayfalar, sıkıştırılmış görseller, yalnızca onayla yüklenen analitik, gereksiz istek yok.
          </span>
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
