# Vizyon ve yol haritası — Bandırma Senin'den sonrası

Ekim 2026 sohbetlerinden damıtılmış not. Siteye yazılmış vaat değil, yönümüzü hatırlatan belge.
İlk görev hâlâ son derece somut: **güvenli biçimde bir noktayı temizlemek ve bunu doğrulanabilir şekilde kaydetmek.**
Bu dosyadaki her şey o kaydın üstüne kurulur.

## Temel ilke

Bandırma Senin, insanların her soruna kendi başına müdahale ettiği bir hareket değil; sorunları tespit eden,
yetkili kurumlarla çözüm üreten, sonuçlarını doğrulayan ve öğrendiklerini teknolojiye dönüştüren bir sistem.
Projedeki en değerli varlık toplanan çöp değil, onu toplarken doğrulayarak öğrendiğimiz bilgi.

## Birbirini besleyen döngü

```
Bandırma Senin ──► gerçek saha operasyonu, doğrulanmış veri
      │
      ▼
Liman Environmental Intelligence ──► atık algılama, değişim analizi, operasyon bilgisi
      │
      ▼
Formex + endüstriyel uygulamalar ──► teknolojinin gerçek hatta sınanması
      │
      ▼
Liman Teknoloji ──► akıllı ekipman, sensör, robotik (uzun vade)
```

Robot yapmak için ilk günden robot yapmamız gerekmiyor; sahada gerçek sorunları çözerek ilerliyoruz.

## Dört varlık (ileride ayrı ayrı satılabilir)

| Varlık | Ne yapar | Bugünkü karşılığı |
|---|---|---|
| **FieldOps** | Görevler, gönüllüler, ekipman, koordinat, fotoğraf, 30 gün kontrol; şehirden bağımsız saha operasyonu | Site + panel + iz bırak |
| **Material Router** | Toplanan malzemeyi türüne göre yetkili toplama/geri kazanım kanalına, kayıt zincirini koruyarak yönlendirme | `deliveredTo` alanı |
| **Environmental AI** | Atık tespiti ve sayımı (LitterVision), önce/sonra değişim analizi (CleanVision), ekipman-yöntem-sonuç öğrenen operasyon zekâsı (CleanOps) | Henüz yok; veri toplama buna göre kurulur |
| **Impact Ledger** | Doğrulanmış katkı, sponsor finansmanı, ödül hak edişi ve varsa sertifikalı çevresel sonuç kaydı | Henüz yok |

Marka ayrımı: **Bandırma Senin** yerel ve bağımsız toplumsal fayda girişimi; ticari platform ayrı adla
(çalışma adı **Liman FieldOps**) belediye, çevre kuruluşu ve temizlik şirketlerine lisanslanır.
Gelir modeli: kurum başına yıllık lisans, kapasiteye göre abonelik, kurulum ve entegrasyon.

## Yapay zekâ: üç ayrı problem

1. **Atık algılama.** Fotoğraftaki şişe, kutu, ambalajı tespit eder, sayar, konumlandırır. Nesne tespiti + segmentasyon + insan doğrulaması.
2. **Çevresel değişim.** Önce/sonra görüntüsünü hizalar, kalan atığı ve yeniden kirlenmeyi ölçer.
3. **Operasyon zekâsı.** Hangi zeminde hangi ekipman, kaç kişi, ne kadar sürede, ne sonuç. Zamanla öneri modeli.

Bir atığın ne olduğunu tanımak ile onu güvenli ve verimli temizlemeyi bilmek ayrı işler; ikincisi sahada öğrenilir.
RGB kamerayla "plastik şişe" görmek, polimerini (PET/PP/PE) bilmek değildir; endüstriyel ayrıştırma için spektral
algılama gerekebilir. Dış mekân verisi (Bandırma Senin) ile tesis verisi (olası Formex pilotu) ayrı tutulur;
birinde eğitilen modelin diğerinde çalışacağı varsayılmaz.

Dünyada parçaları var: TACO (dış mekân atık veri seti), ZeroWaste (konveyör, CC BY-NC → ticari kullanım hakkı
varsayılmaz), OpenLitterMap (vatandaş haritalama), SpectralWaste (RGB + hiperspektral). Farkımız tespit değil,
**tespitten temizliğe, ölçüme, geri kazanıma ve tekrar kontrole kadar bütün zinciri bağlamak** ve gerçek bir
geri dönüşüm işletmesiyle doğrulanmış sonuç üretebilmek.

## İlk günden AI'a uygun veri toplama

Kamuya gösterilen önce/sonra ile modele giden veri aynı olmak zorunda değil. Her çekimde ayrı ayrı kaydedilir:

| Veri | Amaç |
|---|---|
| Geniş açı önce / sonra fotoğrafı (aynı açı) | Başlangıç durumu, temizlik sonucu |
| Atıkların yakın plan fotoğrafı, 2-3 açı | Nesne tanıma eğitimi |
| Nesne etiketi / maskesi (başta elle, sonra ön-etiketleme + insan doğrulaması) | Piksel düzeyinde öğrenme |
| Doğrulanmış malzeme türü (görüntüden değil, elle) | Etiketle gerçeği ayırmak |
| Zemin türü: çim, kum, beton, taş, çakıl | Ortam ayrımı |
| Kullanılan ekipman, işlem, süre, kişi sayısı | Verimlilik ve yöntem öğrenme |
| Tartım ve teslim kaydı | Doğrulanabilir miktar |
| 30 gün sonrası görüntü | Yeniden kirlenme |
| Fotoğrafın amacı: `before`, `after`, `waste_detail`, `sorting`, `followup` | Veri setini ayırmak |
| Veri sahibinin paylaşım ve model eğitimi izni | Hukuki temel |

Model başarısı eğitimde görülmemiş nokta ve tarihlerle ölçülür. Formex'le ortak veri üretilirse veri kullanım hakkı,
lisans ve model mülkiyeti baştan yazılı olur.

**Sıradaki geliştirme:** `EnvironmentalDataset` ve `CleanupMethod` küçük, genişletilebilir modül; görüntü etiketleri,
saha yöntemleri ve ölçüm kayıtları ileride kullanılabilecek şekilde saklanır. İz bırak altyapısı (fotoğraf + konum +
tür + onay) bunun ilk tuğlası.

## Müdahale sınırları (operasyon kuralı)

| Sınıf | Kapsam | Koşul |
|---|---|---|
| **Yeşil — temel temizlik** | Erişilebilir alanda sıradan ambalaj atığı toplama, ayırma, tartma, yetkili sisteme teslim | Alan yetkisi ve teslim planı teyitli; pilot kapsamı |
| **Sarı — izinli iyileştirme** | Bank boyama, kent mobilyası onarımı, levha/çöp kutusu, budama, peyzaj | Malik/kurum yazılı izni, uygun malzeme, teknik sorumlu, tamamlanma kontrolü |
| **Kırmızı — yetkili kurum işi** | Yol çukuru, kaldırım taşıyıcısı, elektrik, riskli ağaç, tehlikeli atık | Gönüllü müdahalesi yok; tespit + fotoğraf + bildirim, onarım sonrası doğrulama |

Dayanak: Karayolları Trafik Kanunu m.14 (yol yapısına müdahale), TCK m.179 (trafik güvenliğini tehlikeye sokma);
kötü onarım yaralanmaya yol açarsa hukuki sorumluluk doğar. Bu tablo operasyonel risk sınıflandırmasıdır,
hukuki izin belgesi değildir. Sistemde her nokta için **müdahale sınıfı, sorun türü, sorumlu kurum, onay durumu,
saha görevi** alanları olacak; görev ancak *alan uygun → yetki doğrulandı → risk değerlendirildi → ekipman hazır →
görev onaylandı* zincirinden sonra açılır. Yüksek riskli işler gönüllü akışına hiç girmez.

## Hukuki zemin

- Doğadaki birkaç atığı alıp kutuya atmak ile organize toplama/ayırma/taşıma/teslim aynı faaliyet değil; ikincisi koordinasyon ister.
- **5393 Belediye Kanunu m.77** gönüllü katılım programlarına imkân tanır; **İl Özel İdaresi ve Belediye Hizmetlerine Gönüllü
  Katılım Yönetmeliği m.10** protokolle sorumluluk kapsamını tanımlar. Şirket kurmadan önce belediyeyle gönüllü çalışma protokolü
  ya da yazılı faaliyet onayı değerlendirilir.
- **2022/6 Atık Toplayıcıları Genelgesi** bağımsız toplayıcılığı düzenler; hangi usulün uygulanacağı belediye ve İl Çevre Müdürlüğüyle netleşir.
- Protokolde: çalışma alanı ve saatleri, atık teslim sorumluluğu, gönüllü güvenliği ve sigorta, yapılabilir/yapılamaz müdahaleler,
  ekipman sorumluluğu, onarımda teknik onay ve tamamlanma kontrolü.
- Muhataplar: Temizlik İşleri Müdürlüğü (temizlik@bandirma.bel.tr), Park ve Bahçeler (parkbahce@bandirma.bel.tr), 444 7 105.
  İlk görüşmede büyük protokol değil, pilot için yazılı koordinasyon talebi.
- KVKK: kullanıcı konumu ve tanınabilir kişi fotoğrafı kişisel veridir; aydınlatma, hukuki dayanak, gerekirse açık rıza.
  Halka açık haritada kullanıcının anlık konumu değil, noktanın konumu gösterilir. EXIF konumuna güvenilmez, cihaz konumu izinle alınır.

## Geri kazanım ağı (Material Router)

Formex PET işlemiyor; bu engel değil, iş kolu: toplanan atığın **doğru kanala** ulaşmasını organize etmek.

| Malzeme | İlk değerlendirilecek kanal |
|---|---|
| DOA işaretli içecek ambalajı (PET/cam şişe, alüminyum kutu; 1 Tem 2026'dan itibaren 1 TL iade) | Resmî depozito iade sistemi; iade bedelinin hak sahibi ve teslim usulü netleşmeden otomatik tahsil varsayılmaz |
| DOA dışı PET | PET kabul eden yetkili toplama/geri kazanım işletmesi |
| PP / PE | Formex kabul şartları ya da uygun tesis |
| Metal, cam, kâğıt | Yetkili ayrı toplama kanalları |
| Kirli, karışık | Belediye koordinasyonuyla uygun atık yönetimi |
| Tehlikeli, tıbbi, kesici | Dokunmadan bildirim; uzman ekip |

Bandırma çevresinde görüşülecek adaylar: **BANPLAS Geri Dönüşüm** (600 Evler, Bandırma; toplama-ayırma),
**BAHM Geri Dönüşüm** (Bandırma OSB; PET). 2026 lisans kapsamı, kirli sokak PET'ini kabul, minimum miktar ve taşıma şartı teyit edilecek.
Toplama-ayırma tesisi ile hammaddeye dönüştüren tesis farklı olabilir; ikisi ayrı kaydedilir.

Lojistik: tesisin minimum kabul miktarı, alım günü, araçla toplama yapıp yapmadığı, atığın durumu ve belge gereği sisteme girilir;
yazılım uygun ve yasal teslim yolunu önerir. Başlangıçta kendi depomuzda biriktirmek yerine yetkili kuruluşla önceden teslim planı.

**Formex'e sorulacak soru:** "Kabul etmediğiniz atıklar için çalıştığınız toplama-ayırma firmaları ya da geri dönüşüm tesisleri var mı?"

## Katılımcı ödülü ve çevresel kredi

Üç ayrı gösterge, asla karışmaz: **oyun/etki puanı** (sertifika değildir), **doğrulanmış atık miktarı**, **tahmini emisyon etkisi**
(yalnız uygun metodolojiyle). Resmî sertifikalı krediler dördüncü, tamamen ayrı kayıt.

- **Plastic Credit** (Verra Plastic Waste Reduction Standard): doğrulanmış 1 ton plastik toplama (Waste Collection Credit) ya da
  geri dönüşüm (Waste Recycling Credit). **Carbon Credit:** 1 tCO₂e. Farklı şeyleri ölçerler. İkisi de ek fayda (additionality),
  uygun atık yönetimi ve bağımsız denetim ister; zaten toplanacak atığı toplamak ek fayda sayılmayabilir.
  Krediler bireysel cüzdanlara otomatik dağıtılan puan değildir; kayıt sistemindeki kuruluş hesapları arasında devredilir.
- Kayıt durumları: **tespit edildi → toplandı → teslim doğrulandı → geri kazanım doğrulandı.** Şişeyi fotoğraflamak ile
  gerçekten geri dönüştürmek karışmaz.
- Ödül havuzu başta **sponsor finansmanlı**; kredi geliri doğarsa sonra değerlendirilir. Fotoğraf başına ya da kontrolsüz kilo başına
  ödeme yok (aynı atığı tekrar çekme, evdeki atığı doğadan toplanmış gösterme, para için tehlikeli alana girme teşviki).
  Hak ediş: doğrulanmış kayıt, güvenli çalışma, gerçek tartım, teslim belgesi; zor ama değerli işler de hesaba girer.
- Kullanıcı tercihi (ileride): ödül hakkını çevre çalışmalarına aktar / nakit al / yalnız gönüllü puanı.
- Hukuk: başkası adına bakiye tutmak ve transfer **6493 sayılı Kanun / TCMB**; kendi e-para cüzdanı yapılmaz, hak ediş muhasebesi +
  gerekirse lisanslı ödeme kuruluşu. "Bağış" toplama **2860 Yardım Toplama Kanunu**; çerçeve netleşmeden açılmaz.
  Ücretli düzenli çalışma başlarsa gönüllülük/iş ilişkisi, sigorta, vergi, İSG ayrıca.

## Gelir kaynakları (öncelik sırasıyla)

1. Sponsor finansmanı: ilk ödül ve saha bütçesi.
2. Kurumsal temizlik sözleşmeleri: düzenli operasyon geliri.
3. Malzemenin ekonomik değeri: miktar, kalite, lojistiğe bağlı.
4. Yazılım lisansları: ölçeklenebilir.
5. Plastik / karbon kredileri: ancak uygunluk ve bağımsız doğrulama sonrası.

Ekonomi sertifika beklentisine yaslanmaz.

## Sunumda nasıl anlatılır (üç zaman ufku)

- **Bugün:** Bandırma'da gerçek temizlik, harita, fotoğraf, tartım, anonim iz bırakma.
- **Yakın gelecek:** belediyeyle güvenli operasyon protokolü, Formex'le geri kazanım işbirliği, gönüllü katılımı, görüntü tabanlı atık kaydı, atık kabul ağı.
- **Uzun gelecek:** başka şehirlerin kullanabileceği saha platformu, doğrulanabilir çevre verisi, yapay zekâ destekli ayrıştırma,
  şartlar oluşursa çevresel kredilendirme ve katılımcı ödülü.

Ana teklif değişmez: saha kiti, uygun atık kabulü, logo izni. Vizyon tek bölümdür, toplantının merkezi değil.
