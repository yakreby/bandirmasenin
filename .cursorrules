# Bandırma Senin — Proje Kuralları

Bandırma'da çevre temizliği ve kamusal alan iyileştirme çalışmalarını koordinatlı harita üzerinde,
önce/sonra fotoğrafı ve tartılmış atık miktarıyla belgeleyen bağımsız yerel girişim. Canlı: https://bandirmasenin.com

## Yapı

```
src/frontend/   Next.js 16 (App Router, TypeScript, düz CSS, react-leaflet)  → Vercel (root dir: src/frontend)
src/backend/    .NET 8 Web API + EF Core + SQL Server                          → https://bs.limanyazilim.com
  BandirmaSenin.Domain       entity'ler ve enum'lar
  BandirmaSenin.Persistence  AppDbContext, konfigürasyonlar, migration'lar, DbSeeder
  BandirmaSenin.API          controller'lar, Contracts (DTO), Security (AdminKey), Middleware
docs/           dokümantasyon (ARCHITECTURE.md, ROADMAP.md)
mobile/         sonraki aşama (Expo)
```

- Frontend veri katmanı `src/frontend/src/lib/data.ts`: `API_URL` tanımlıysa API'den okur, yoksa ya da API düşükse `src/frontend/content/` JSON'una düşer. Sayfalar yalnızca bu dosyayı kullanır.
- JSON sözleşmesi `src/frontend/src/lib/types.ts` ile `BandirmaSenin.API/Contracts/SpotDtos.cs` birebir aynıdır. Enum'lar snake_case (`tespit_edildi`). Birini değiştirince diğerini de değiştir.
- Sırlar `appsettings.{Env}.local.json` dosyasında (gitignore'lu, en son yüklenir ve her şeyi ezer). Şablon: `appsettings.Production.local.json.example`.
- Migration: `cd src/backend && dotnet ef migrations add <Ad> -p BandirmaSenin.Persistence -s BandirmaSenin.API`. Development'ta uygulama açılışta `MigrateAsync` çalıştırır; üretimde elle.
- Kimlik: ASP.NET Identity + JWT (`Jwt:Key` zorunlu). Frontend JWT'yi `bs_session` HttpOnly çerezinde tutar;
  `src/app/api/auth/[action]` (login/register/logout/me) ve `src/app/api/bs/[...path]` (oturumlu köprü) API'ye Bearer ile iletir.
  Sayfalar statik kalır; oturum durumu istemcide (`AuthMenu`, `AccountPanel`, `AdminPanel`) okunur.
- Yazma uçları: Admin rolü JWT'si ya da `X-Admin-Key` (betikler). Üye kaydı `Pending` düşer, yönetici `/panel`'den onaylar.
- İlk yönetici: `Admin:Email` + `Admin:Password` (local.json) açılışta seed edilir; var olan kullanıcıya dokunmaz.
- Google ile giriş: `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (Vercel) + `Google:ClientId` (API) aynı OAuth istemcisi; ikisi de boşsa düğme görünmez.
  GIS betiği accounts.google.com'dan yalnız giriş/kayıt sayfasında yüklenir (CDN kuralının ikinci bilinçli istisnası).

## Veri ilkeleri (ürün kuralı, kodda da korunur)

- `demo: true` kayıtlar "örnek kayıt" damgası taşır ve toplamlara girmez.
- Tartı (`tarti`) ile tahmin (`tahmin`) ayrı raporlanır; tahmin kesin sayı gibi gösterilmez.
- Önlenen karbon hesabı otomatik gösterilmez; metodoloji doğrulanmadan sayı yazılmaz.
- Atığın teslim yeri (`deliveredTo`) her temizlik ziyaretinde yazılır.
- Her temizlikten 30 gün sonra kontrol (`recheckDue` → `recheck`).

---

# Liman Yazılım — Web Projesi Kuralları

Bu liste varsayılandır; aksi belirtilmedikçe hepsi uygulanır. Bir kuralı bilerek atlıyorsan sebebini söyle.

## Proje iskeleti
- Kök dizinde README.md olacak.
- docs/ klasörü olacak; dokümantasyon oraya yazılır.
- Tüm dosya ve klasör isimleri İngilizce olacak (içerik Türkçe olabilir).

## SEO ve meta
- Her sayfanın title ve description'ı kendine özel olacak.
- OG etiketleri eksiksiz: og:title, og:description, og:image, og:url, og:type.
- Meta etiketleri eksiksiz: viewport, charset, canonical, theme-color.
- robots.txt olacak. Sitemap konfigürasyonla üretilecek (`app/sitemap.ts`).
- JSON-LD yapısal veri: Organization, WebSite, BreadcrumbList; sayfa tipine göre ek şemalar.
- llms.txt olacak.
- Route'lar Türkçe ASCII slug: /hakkinda, /katil, /cerez-politikasi, /nokta/{slug}.

## Erişilebilirlik
- Tüm `<img>` etiketlerinde alt, tüm `<a>` etiketlerinde title. Dekoratif görsellerde alt="" bilinçli yazılır.
- Tüm input alanlarında placeholder ve label.

## Tasarım
- frontend-design skill'i açık.
- Yasak fontlar: Inter, Space Grotesk, Montserrat. (Bu projede: Bricolage Grotesque + Public Sans, next/font ile lokalden.)
- İkonlarda emoji yok; ikon kütüphanesi lokalden (bu projede lucide-react, npm paketi).
- body'de `overflow-x: clip` (hidden değil; sticky'yi bozar). Taşmanın sebebi yine de bulunup düzeltilir.
- Scrollbar ve ::selection özelleştirilir.
- Sol kenarlık (left-border) stili kullanılmaz.
- Header ve footer'da logo. Yukarı çık butonu. Mobilde offcanvas menü. Alt sayfalarda breadcrumb.
- Footer'ın en altında https://limanyazilim.com referansı; yıl `new Date().getFullYear()`.

## Animasyon
- Scroll-reveal: IntersectionObserver + CSS sınıfı (`Reveal` bileşeni), ek bağımlılık yok.
- `prefers-reduced-motion: reduce` prod'da saygı görür: hareket kapanır, kısa opacity geçişi kalır.
- **Bu projede `force-motion` her ortamda basılır** (ürün kararı 2026-10-22): Windows "animasyonları azalt" açık olsa da site hareketli kalır. Reduce bloğu kodda duruyor ama devre dışı.
- Smooth scroll: Lenis (`SmoothScroll` bileşeni, Liman3DWebsite ayarları); rota değişiminde Lenis ile tepeye/çapaya gidilir, ham scrollTo kullanılmaz.

## Bağımlılıklar — CDN yok
- Dış script/stil CDN'den çekilmez. Fontlar next/font ile derlemede indirilir ve siteden servis edilir; kütüphaneler npm ile paketlenir.
- Harita karoları OpenStreetMap'ten gelir (veri kaynağı, script değil); kullanım politikası nedeniyle büyüyünce lisanslı sağlayıcıya geçilir. Tile URL tek yerde: `SpotMap.tsx`.

## Çerez / KVKK
- Sitenin kendi çerez onay bileşeni (`CookieConsent`), çerez politikası sayfası (/cerez-politikasi) ve ondan link.
- Onay verilmeden analitik/pazarlama çerezi yazılmaz. Google Analytics (`Analytics` bileşeni, kimlik `content/site.json` → `gaId`)
  yalnızca "Kabul et" sonrası yüklenir. gtag.js Google alanından gelir; "CDN yok" kuralının bilinçli tek istisnasıdır.

## Backend (.NET)
- Özel `ErrorHandlerMiddleware` (ProblemDetails). 40x/50x için `UseStatusCodePages` ProblemDetails döner (API olduğu için HTML sayfa yok).
- `ResponseCompression` Brotli + Gzip.
