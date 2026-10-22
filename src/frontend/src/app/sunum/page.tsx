import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

/** Formex'e sunulan pilot teklifi. Arama motorlarına kapalı (noindex + robots.txt), menüde yok. */
export const metadata: Metadata = {
  title: "Pilot teklifi",
  description: "Bandırma Senin'in Formex'e sunduğu pilot teklifi: proje, döngü, dört Pazar planı, istekler, bütçe ve işbirliği.",
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: "/sunum" },
  openGraph: {
    title: "Bandırma Senin pilot teklifi",
    description: "Proje, döngü, dört Pazar planı, istekler, bütçe ve işbirliği.",
    url: "/sunum",
    type: "article",
  },
};

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

function Arrow() {
  return (
    <span className="pr-arrow" aria-hidden>
      <ArrowRight size={18} />
    </span>
  );
}

export default function PresentationPage() {
  return (
    <main className="pr-page">
      <header className="pr-hero">
        <div className="pr-rings" aria-hidden />
        <div className="wrap">
          <div className="pr-hero__tag">Bandırma Senin</div>
          <h1>Bu şehir hepimizin.</h1>
          <div className="pr-hero__rule" aria-hidden />
          <p>
            Pazar sabahları Bandırma&apos;da bir noktayı temizliyoruz, topladığımızı tartıyoruz, teslim
            ediyoruz ve bir ay sonra aynı yere geri dönüp bakıyoruz. Her şey haritada, fotoğraflı ve
            kiloyla.
          </p>
          <div className="pr-hero__meta">
            <span>Formex için pilot teklifi</span>
            <span>Ekim 2026</span>
            <span>bandirmasenin.com</span>
          </div>
        </div>
      </header>

      <div className="wrap">
        <section className="pr-sec">
          <div className="pr-head">
            <div className="pr-eyebrow">01 / Amaç</div>
            <h2>Bu proje ne?</h2>
          </div>
          <div className="pr-stack">
            <p className="pr-lead">
              Bandırma Senin, şehirdeki kirli noktaları haritaya işleyen, temizleyen ve sonucunu
              herkese açık şekilde belgeleyen bağımsız bir yerel girişim. Çöp toplama etkinliği değil,
              ölçen ve takip eden bir sistem.
            </p>
            <div className="pr-cols">
              <div className="pr-box">
                <h3>Tespit</h3>
                <p>
                  Nokta koordinatıyla haritaya girer. Aynı açıdan tekrar çekilebilecek bir
                  &ldquo;önce&rdquo; fotoğrafı alınır. Belediyeyle yetki durumu netleşir.
                </p>
              </div>
              <div className="pr-box">
                <h3>Temizlik ve tartı</h3>
                <p>
                  Eldiven ve maşayla, Pazar sabahı. Atık türüne göre ayrılır, kantarda tartılır, nereye
                  teslim edildiği yazılır.
                </p>
              </div>
              <div className="pr-box">
                <h3>30 gün sonra kontrol</h3>
                <p>
                  Aynı açıdan yeni fotoğraf. Nokta yeniden kirlendiyse nedeni araştırılır, kalıcı çözüm
                  önerisi belediyeye gider.
                </p>
              </div>
            </div>
            <p>
              Site bugün yayında: harita, nokta kayıtları, önce/sonra karşılaştırması ve destekçi alanı
              hazır. İlk gerçek nokta bu Pazar giriliyor.
            </p>
          </div>
        </section>

        <section className="pr-sec">
          <div className="pr-head">
            <div className="pr-eyebrow">02 / Neden Formex</div>
            <h2>Formex&apos;le neden?</h2>
            <p>Formex&apos;in fabrikada yaptığı işi sokağa taşıyoruz. Döngü kapanıyor.</p>
          </div>
          <div className="pr-stack">
            <div className="pr-loop">
              <div className="pr-node"><b>Topla</b><span>Sahil, park, sokak</span></div>
              <Arrow />
              <div className="pr-node"><b>Ayrıştır ve tart</b><span>Plastik, cam, metal, kâğıt</span></div>
              <Arrow />
              <div className="pr-node pr-node--formex"><b>Formex</b><span>Uygun plastik geri kazanıma</span></div>
              <Arrow />
              <div className="pr-node"><b>Granül</b><span>Yeni hammadde</span></div>
              <Arrow />
              <div className="pr-node"><b>Geri aynı noktaya</b><span>Levha, kutu, çuval halkası</span></div>
            </div>
            <div className="pr-cols">
              <div className="pr-box pr-box--dark">
                <h3>Formex&apos;e ne kazandırır</h3>
                <p>
                  Bandırma&apos;da sahada görünür, ölçülebilir sosyal etki. Haritadaki her nokta
                  &ldquo;Formex desteğiyle&rdquo; yazar. Müşterilerinizin sürdürülebilirlik raporlarına
                  girebilecek, fotoğraflı ve kilolu gerçek bir hikâye. Çalışanlarınız için gönüllü günü.
                </p>
              </div>
              <div className="pr-box pr-box--hi">
                <h3>Bize ne kazandırır</h3>
                <p>
                  Doğru ekipmanla güvenli çalışma, toplanan plastiğin gerçekten geri dönüşmesi ve
                  &ldquo;bu levha bu plajdan toplanan şişelerden yapıldı&rdquo; diyebilmek. Bunu başka
                  hiçbir temizlik girişimi diyemiyor.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="pr-sec">
          <div className="pr-head">
            <div className="pr-eyebrow">03 / Dört Pazar</div>
            <h2>Nasıl başlıyoruz?</h2>
            <p>Dört Pazar, iki kişi, bir harita. Büyük organizasyon yok.</p>
          </div>
          <div className="pr-tl">
            <div className="pr-tl__row"><div className="pr-tl__when">1. Pazar</div><p>Güvenli, yetki durumu net bir nokta. Önce fotoğrafı, temizlik, ayrıştırma, kantar, teslim. İlk gerçek kayıt haritaya girer.</p></div>
            <div className="pr-tl__row"><div className="pr-tl__when">2. Pazar</div><p>İkinci nokta. İlk noktanın verisi yayında: kilo, malzeme kırılımı, teslim yeri.</p></div>
            <div className="pr-tl__row"><div className="pr-tl__when">3. Pazar</div><p>Küçük ekip, 3 ile 5 kişi. Kişi-saat başına kaç kilo toplandığı ve hangi ekipmanın eksik olduğu ölçülür.</p></div>
            <div className="pr-tl__row"><div className="pr-tl__when">4. Pazar</div><p>İlk noktanın 30 gün kontrolü. Önce/sonra görsellerinden kısa video. Pilot raporu Formex&apos;e sunulur.</p></div>
            <div className="pr-tl__row"><div className="pr-tl__when">Sonra</div><p>Veriye göre karar: ekip büyür mü, hangi ekipman alınır, Formex üretimi nerede devreye girer.</p></div>
          </div>
        </section>

        <section className="pr-sec">
          <div className="pr-head">
            <div className="pr-eyebrow">04 / İstekler</div>
            <h2>Formex&apos;ten ne istiyoruz?</h2>
            <p>Pilot için para değil, malzeme ve üç karar.</p>
          </div>
          <div className="pr-stack">
            <div className="pr-ask">
              <div className="pr-ask__item">
                <div>
                  <b>Saha kiti</b>
                  <p>
                    4 takım logolu tişört ve reflektif yelek, 4 çöp toplama maşası, kesilmeye dirençli
                    eldiven, 4 çuval tutma halkası, etiketli çuval ve torba, 3 ile 5 ayrıştırma kovası,
                    1 dijital askılı kantar, 1 ilk yardım seti. Çoğu Formex&apos;in mevcut tedarik
                    kanalından çıkar.
                  </p>
                </div>
              </div>
              <div className="pr-ask__item">
                <div>
                  <b>Toplanan plastiğin kabulü</b>
                  <p>
                    Ayrıştırılmış, uygun plastiği Karacabey&apos;e getirdiğimizde alınması. Önce
                    netleşmesi gereken soru: Formex&apos;in lisansı kamusal alandan toplanan plastiği
                    kapsıyor mu? Kapsamıyorsa belediye üzerinden nasıl döner?
                  </p>
                </div>
              </div>
              <div className="pr-ask__item">
                <div>
                  <b>Logo kullanım izni</b>
                  <p>Site, tişört ve sahadaki levhalarda &ldquo;Formex desteğiyle&rdquo; ibaresi için yazılı onay.</p>
                </div>
              </div>
            </div>
            <p className="pr-note">
              Bütçe ve ortaklık konuşmasını dört Pazar sonra, elimizde gerçek veriyle yapmak istiyoruz.
              Bugün istediğimiz şeylerin hepsi Formex&apos;in elinde var.
            </p>
          </div>
        </section>

        <section className="pr-sec">
          <div className="pr-head">
            <div className="pr-eyebrow">05 / Bütçe</div>
            <h2>Ne kadar bütçe gerekiyor?</h2>
            <p>Yaklaşık rakamlar, Türkiye&apos;deki satış ilanlarından. Bağlayıcı teklif değil, büyüklüğü göstermek için.</p>
          </div>
          <div className="pr-stack">
            <div className="pr-tbl">
              <table>
                <thead>
                  <tr><th>Aşama</th><th>Ne alınır</th><th>Ne zaman</th><th className="num">Tahmini bütçe</th></tr>
                </thead>
                <tbody>
                  <tr><td><b>P1</b> İlk pilot</td><td>2 kişilik temel ekipman ve güvenlik: maşa, eldiven, yelek, çuval halkası, kantar, ilk yardım</td><td>Şimdi</td><td className="num">3.700 – 9.500 TL</td></tr>
                  <tr><td><b>P2</b> Zemin düzenleme</td><td>Yaprak tırmığı, kürek, süpürge ve faraş; izinli peyzaj için budama makası</td><td>3 güvenli çalışmadan sonra</td><td className="num">2.900 – 7.300 TL</td></tr>
                  <tr><td><b>P3</b> Ekip ve mobil istasyon</td><td>4 kişilik ek ekipman, tekerlekli taşıma arabası, modüler ayrıştırma sistemi</td><td>6 çalışma ve düzenli gönüllü sonrası</td><td className="num">6.100 – 15.900 TL</td></tr>
                  <tr><td className="total" colSpan={3}>Üç aşamanın toplamı (motorlu makine ve yazılım emeği hariç)</td><td className="num total">12.800 – 32.500 TL</td></tr>
                </tbody>
              </table>
            </div>
            <div className="pr-cols">
              <div className="pr-box">
                <h3>Yatırım disiplini</h3>
                <p>
                  Her aşamaya geçiş bir önceki aşamada kanıtlanmış ihtiyaca bağlı. İlk gün büyük makine
                  yok. Hangi aletin ne kadar işçilik kazandırdığı sahada ölçülür, sonra alınır.
                </p>
              </div>
              <div className="pr-box">
                <h3>Formex&apos;in üretim gücü nerede girer</h3>
                <p>
                  P3&apos;te. Geri kazanılmış plastikten çuval halkası, modüler ayrıştırma kovası ve
                  temizlenen noktalara QR&apos;lı bilgilendirme levhası. Önce 3D yazıcıyla numune, sahada
                  test, sonra kalıp uygunsa enjeksiyon.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="pr-sec">
          <div className="pr-head">
            <div className="pr-eyebrow">06 / İşbirliği</div>
            <h2>Belediye ve üniversiteyle nasıl çalışırız?</h2>
          </div>
          <div className="pr-cols">
            <div className="pr-box">
              <h3>Bandırma Belediyesi</h3>
              <p>
                Temizlik İşleri Müdürlüğü doğal ortağımız. İlk Pazar&apos;dan önce yazılı bilgilendirme:
                yer, tarih, atığı kimin alacağı. Belediyeden istenen: alan izni, geri kazanılamayan atık
                için toplama noktası, gerekirse araç. Belediyeye verilen: 30 gün kontrol verisi.
                &ldquo;Şuraya çöp kutusu, şuraya levha&rdquo; kararının dayanağı bu veri olur. Ayrıştırma
                etiketlerinde Sıfır Atık renk sistemi kullanılır.
              </p>
            </div>
            <div className="pr-box">
              <h3>Bandırma Onyedi Eylül Üniversitesi</h3>
              <p>
                Öğrenci toplulukları düzenli gönüllü kaynağı. İlgili bölümler için staj ve bitirme
                projesi konuları: atık karakterizasyonu, yeniden kirlenme analizi, saha verisinin
                işlenmesi. Üniversite kampüs çevresinde bir noktayı &ldquo;sahiplenebilir&rdquo;,
                periyodik kontrolünü üstlenir.
              </p>
            </div>
            <div className="pr-box">
              <h3>Formex</h3>
              <p>
                Ana destekçi. Ekipman, atık kabulü ve geri dönüşüm uzmanlığı. Hangi plastiğin gerçekten
                geri kazanılabileceğini sahada bize Formex öğretir; ayrıştırma kuralını birlikte yazarız.
              </p>
            </div>
          </div>
        </section>

        <section className="pr-sec">
          <div className="pr-head">
            <div className="pr-eyebrow">07 / İlkeler</div>
            <h2>Ölçüm ve şeffaflık kuralları</h2>
            <p>Projenin güvenilirliği bu kurallardan gelir. Hiçbiri esnemez.</p>
          </div>
          <ul className="rules">
            <li>Atık kantarla tartılır. Göz kararı tahmin ayrı işaretlenir, kesin sayı gibi gösterilmez.</li>
            <li>Önce ve sonra fotoğrafı aynı açıdan çekilir. Yakınlaştırmayla kandırmaca yok.</li>
            <li>Atığın nereye teslim edildiği her kayıtta yazar. Formex&apos;in gerçekten geri dönüştürdüğü miktar, toplanan miktardan ayrı raporlanır.</li>
            <li>Karbon tasarrufu sayısı, metodoloji doğrulanana kadar yazılmaz. Toplamak ile geri dönüştürmek aynı şey değildir.</li>
            <li>Örnek kayıtlar &ldquo;örnek kayıt&rdquo; damgası taşır ve toplamlara girmez.</li>
            <li>Kesici, tıbbi, kimyasal ya da ne olduğu belli olmayan atığa dokunulmaz; konumu belediyeye bildirilir. Trafiğe açık yol kenarında gönüllü çalışması yapılmaz.</li>
          </ul>
        </section>

        <section className="pr-sec">
          <div className="pr-head">
            <div className="pr-eyebrow">08 / Yol haritası</div>
            <h2>Teknoloji nereye gidiyor?</h2>
            <p>İlk gün telefon, QR etiket ve kantar. Sonrası sahanın öğrettiğine göre.</p>
          </div>
          <div className="pr-cols">
            <div className="pr-box"><h3>V1 Şimdi</h3><p>Her torbaya QR, gerçek tartım, atık türü, fotoğraf. Harita ve nokta kayıtları canlı. Yönetici girişi ve mobil uygulama sırada.</p></div>
            <div className="pr-box"><h3>V2</h3><p>Fotoğraftan şişe, kutu, ambalaj tanıma. Modelin tahmini ile gönüllünün sayımı yan yana. Kilo yine kantardan.</p></div>
            <div className="pr-box"><h3>V3</h3><p>Vatandaş &ldquo;burası kirli&rdquo; bildirimi, yönetici onayıyla yayın. &ldquo;Bu noktayı sahiplen&rdquo;: kişi, mahalle grubu ya da şirket bir noktanın bakımını üstlenir.</p></div>
            <div className="pr-box"><h3>V4</h3><p>Atık yoğunluğu ve yeniden kirlenme haritası, kaynak planlama. Erdek, Gönen ve diğer şehirlere aynı model.</p></div>
          </div>
        </section>
      </div>

      <footer className="pr-close">
        <div className="pr-rings" aria-hidden />
        <div className="wrap">
          <div className="pr-hero__tag">Karar noktası</div>
          <h2>Bandırma&apos;da birlikte başlayalım.</h2>
          <ul className="pr-close__list">
            <li><span className="pr-close__num">01</span> Saha kiti için ayni destek</li>
            <li><span className="pr-close__num">02</span> Uygun plastik için kabul değerlendirmesi</li>
            <li><span className="pr-close__num">03</span> Logo ve işbirliği için yazılı onay</li>
          </ul>
          <p>
            İlk dört Pazar&apos;ı kendimiz yapıyoruz, veriyle geri geliyoruz. Beğenmezseniz haritadaki
            &ldquo;Formex desteğiyle&rdquo; satırı iki dakikada kalkar. Beğenirseniz Bandırma&apos;da ilk
            kapanan döngüyü birlikte kurmuş oluruz.
          </p>
        </div>
      </footer>
      <div className="wrap pr-foot">
        <p>
          Bandırma Senin bağımsız bir yerel girişimdir. Yazılımı{" "}
          <a href="https://limanyazilim.com" title="Liman Yazılım" {...ext}>
            Liman Yazılım
          </a>{" "}
          geliştirir. Bütçe rakamları Ekim 2026 ilan fiyatlarından yaklaşık aralıklardır.
        </p>
      </div>
    </main>
  );
}
