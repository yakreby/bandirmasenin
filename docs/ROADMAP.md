# Yol haritası

## İlk dört Pazar (pilot)

| | Ne | Çıktı |
|---|---|---|
| Pazar 1 | Güvenli, yetki durumu net bir nokta. Önce fotoğrafı (tripod, aynı açı için zemin işareti), temizlik, ayrıştırma, kantar, teslim. | İlk gerçek kayıt; `demo` alanı silinir. |
| Pazar 2 | İlk nokta siteye girilir. İkinci nokta. | Harita iki gerçek pin. |
| Pazar 3 | Küçük ekip (3-5 kişi). Katılımcı organizasyonu, ekipman ihtiyacı ve gerçek maliyet ölçülür. | Çalışma başına maliyet notu. |
| Pazar 4 | İlk noktanın 30 gün kontrolü. Önce/sonra görsellerinden 60 saniyelik video. | Pilot raporu (Formex sunumu). |

Belediye Temizlik İşleri'ne ilk Pazar'dan önce kısa yazı: yer, tarih, atığı kimin alacağı.

## Formex görüşmesi

Yarınki toplantıda tek slayt, "haberiniz olsun": harita mock'u + döngü çizimi. Üç istek:
tişört ve saha ekipmanı, logo kullanım izni, toplanan ayrıştırılmış plastiğin kabulü (lisans kapsamı sorusu).
Bütçe ve ortaklık konuşması dört Pazar sonra, veriyle.

## Sürümler

- **v0.1 (bu commit):** harita, nokta kaydı, önce/sonra, tartı kırılımı, 30 gün kontrolü, destekçi alanı; API + SQL Server; JSON yedeği.
- **v0.1.1 (2026-10-22):** iletişim formu (API + DB), /sunum, GA onay sonrası, özel 404/500, KVKK aydınlatma,
  canlıda API düşünce örnek veriye düşülmez, resmî toplam yalnız tartılmış kilo, demo kayıtlar noindex.
- **v0.2 Üyelik ve yönetici paneli (2026-10-22, ilk kesim YAPILDI):** kayıt/giriş/hesap, üye onayı, WhatsApp daveti onaylıya,
  panelde üyeler + mesajlar. Kalan: nokta/ziyaret formu, e-posta doğrulama (SMTP).
  - **2026-10-22 ikinci tur YAPILDI:** "İz bırak" (anonim kamera + konum bildirimi, yerel disk deposu, panelde onay),
    hero fotoğraf geçişi, footer'da düşük enerji satırı, mobil düzeltmeler; Formex adı public sayfalardan kaldırıldı
    ("Gönüllülerin desteğiyle", `supporter` dolunca geri gelir). Bekleyen: prod'a `AddTraceReports` migration + API publish, R2'ye geçiş.
  - Hesaplar: e-posta + şifre (ASP.NET Identity), e-posta doğrulama, roller `Admin` / `Member`. Kayıt formu KVKK onayı ister.
    Üye olmanın karşılığı: Pazar çalışmalarına davet (e-posta), WhatsApp grubuna katılım linki (onaylı üyeye gösterilir),
    kendi katıldığı çalışmaların listesi, ileride katılım sertifikası.
  - Yönetici paneli (`/panel`, Next, yalnız Admin): nokta/ziyaret/tartım formu, iletişim mesajları (okundu/not),
    destekçi yönetimi, **fotoğraf onayı**: her yükleme `Pending` düşer, Admin onaylayınca yayına girer, reddedilen silinir.
  - Fotoğraf yükleme: R2 (S3 uyumlu), API imzalı URL verir; dosya boyutu/tip sınırı; EXIF konum temizlenir; yüz görünen fotoğraf reddedilir.
  - Üye nokta önerisi: haritadan konum seç + fotoğraf; `Pending` → Admin onayı → haritada "tespit edildi".
- **v0.3:** "bu noktayı sahiplen", e-posta ile Pazar duyurusu, katılım sertifikası (PDF, kâğıt baskı için).
- **v0.4:** mobil (Expo): saha girişi, kamera, GPS, tartı girişi çevrimdışı.
- **Sonra:** ikinci şehir (Erdek, Gönen), çoklu destekçi, belediyeye aylık rapor (PDF), karbon hesabı (metodoloji doğrulanınca).
