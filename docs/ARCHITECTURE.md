# Mimari

## Akış

```
Tarayıcı ── Vercel (Next.js, statik + ISR) ── API_URL ──► bs.limanyazilim.com (.NET 8) ──► SQL Server (77.245.159.112 / bandirmasenin_db)
                       │
                       └─ API yoksa/düşükse: src/frontend/content/*.json (repo içi yedek)
```

- Sayfalar sunucu bileşeni; veri `src/lib/data.ts` üzerinden `"use cache"` + `cacheLife("minutes")` ile okunur.
  Derlemede statik üretilir, çalışma anında dakikalar içinde tazelenir. Harita ve önce/sonra kaydırıcı istemci bileşeni.
- API yalnızca GET herkese açık; `PUT/DELETE` `X-Admin-Key` ister. Yönetici paneli (sonraki aşama) bu uçları kullanır.

## Veri modeli

| Tablo | Alanlar (özet) |
|---|---|
| `Spots` | Slug (unique), Title, City, District, Kind, Latitude, Longitude, Status, Summary, AdoptedBy, RecheckDue, Recheck* (owned: Date, Result, Note, Photo), IsDemo, CreatedAt, UpdatedAt |
| `Visits` | SpotId, Date, Kind (temizlik/kontrol/iyilestirme), Volunteers, Team, PhotoBefore, PhotoAfter, DeliveredTo, Notes, Order |
| `Weighings` | VisitId, Material (plastik/cam/metal/kagit/organik/diger), Kg (8,2), Method (tarti/tahmin) |
| `Sponsors` | Key (unique, JSON'da `id`), Name, Url, Contribution, IsActive, Order |
| `SpotSponsors` | SpotId + SponsorId |

Durum akışı: `tespit_edildi → planlandi → tamamlandi → yeniden_kontrol_edilecek → (tamamlandi | tekrar_kirlendi)`.

Enum'lar DB'de string (PascalCase), JSON'da snake_case (`JsonStringEnumConverter(SnakeCaseLower)`).

## JSON sözleşmesi

`src/frontend/src/lib/types.ts` ↔ `src/backend/BandirmaSenin.API/Contracts/SpotDtos.cs`. Örnek:

```json
{
  "slug": "sahil-yuruyus-yolu", "title": "…", "city": "bandirma", "district": "Paşakent mevkii",
  "kind": "sahil", "coords": [40.3562, 27.9605], "status": "yeniden_kontrol_edilecek",
  "summary": "…", "sponsorIds": [], "recheckDue": "2026-11-22", "demo": true,
  "visits": [{ "date": "2026-10-25", "kind": "temizlik", "volunteers": 2,
               "photos": { "before": "/demo/sahil-before.svg", "after": "/demo/sahil-after.svg" },
               "weighings": [{ "material": "plastik", "kg": 9.4, "method": "tarti" }],
               "deliveredTo": "…", "notes": "…" }]
}
```

## Fotoğraflar

İlk sürümde `public/photos/<slug>/` (repo) ya da API'ye tam URL. Büyüyünce Cloudflare R2 ve yükleme ucu.

Yüklenen fotoğraflar ("İz bırak") `IPhotoStorage` üzerinden gider; ilk gerçekleme `LocalPhotoStorage`
(`Uploads:Root`, varsayılan `wwwroot/uploads`, `/uploads/...` statik servis, uzun önbellek). R2'ye geçiş yalnız
bu arayüzün yeni gerçeklemesidir; controller değişmez. Dosya türü uzantıdan değil ilk bayttan (JPEG/PNG/WebP) okunur.

## İz bırak (anonim bildirim)

`/iz-birak` → `TraceForm`: kamera (`<input capture>`) → tarayıcıda 1600px JPEG'e küçültme (EXIF ve gömülü konum düşer)
→ `navigator.geolocation` → `TraceMap` üzerinde sürüklenebilir işaret → `/api/trace` (Next BFF, multipart) → API
`POST /api/traces` (honeypot, IP başına 10/saat, Bandırma kutusu dışı red). Kayıt `Pending` düşer; yönetici `/panel → İzler`
sekmesinden onaylar/reddeder/siler (`GET /api/traces/all`, `PATCH`, `DELETE`, AdminKey). Herkese açık `GET /api/traces`
yalnız onaylıları döner; ana harita bunları turuncu nokta + fotoğraflı açılır kutuyla gösterir. Ad, e-posta alınmaz;
IP yalnız kötüye kullanım için saklanır ve hiçbir uçtan dönmez. Sözleşme: `Contracts/TraceDtos.cs` ↔ `lib/types.ts → Trace`.

## Harita

OpenStreetMap karoları doğrudan; URL tek yerde (`SpotMap.tsx`). Trafik büyürse MapTiler/Stadia ya da kendi tile sunucusu.
Karo isteği kullanıcı IP'sini OSM'e iletir; çerez politikası sayfasında yazılı.

## Bilinçli dışarıda bırakılanlar (v1)

- Üyelik, herkese açık pin ekleme, yorum.
- Otomatik karbon hesabı (toplama ≠ geri dönüşüm; metodoloji doğrulanınca).
- Yönetici paneli (JSON/Swagger ile giriliyor).
- Mobil uygulama (Expo, `mobile/`, API hazır olduğu için sonra).
