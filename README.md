# Bandırma Senin

**Şehrine sahip çık. Değişimi gör.** — https://bandirmasenin.com

Bandırma'daki çevre temizliği ve kamusal alan iyileştirme çalışmalarını koordinatlı harita üzerinde
belgeleyen, mobil öncelikli bir toplumsal fayda platformu. Her nokta: önce/sonra fotoğrafı, tartılmış
atık miktarı ve türü, teslim yeri, gönüllü sayısı, destekçi ve 30 gün sonra yeniden kontrol sonucu.

## Yapı

| Klasör | Ne | Nerede çalışır |
|---|---|---|
| `src/frontend/` | Next.js 16, TypeScript, düz CSS, react-leaflet | Vercel (Root Directory: `src/frontend`) |
| `src/backend/` | .NET 8 Web API, EF Core, SQL Server | https://bs.limanyazilim.com |
| `docs/` | Mimari ve yol haritası | |
| `mobile/` | Sonraki aşama | |

## Çalıştırma

Frontend (API olmadan da çalışır, `content/` JSON'unu kullanır):

```bash
cd src/frontend
npm install
npm run dev          # http://localhost:3000
```

Backend (yerel SQL Server, Windows auth; `appsettings.Development.json`):

```bash
cd src/backend
dotnet run --project BandirmaSenin.API      # http://localhost:5010/swagger
```

Development'ta açılışta migration uygulanır ve DB boşsa 3 örnek nokta basılır (`Seed:Demo`).
Frontend'in API'den okuması için `src/frontend/.env.local` içine `API_URL=http://localhost:5010`.

## Yayın

- **Vercel:** proje `src/frontend` köküyle, preset Next.js. Ortam değişkeni `API_URL=https://bs.limanyazilim.com`.
- **API:** `appsettings.Production.local.json` dosyasını `.example` şablonundan oluştur (bağlantı dizgisi + `Admin:ApiKey`), ardından:

```bash
cd src/backend
dotnet ef database update -p BandirmaSenin.Persistence -s BandirmaSenin.API   # ilk kurulum / her migration
dotnet publish BandirmaSenin.API -c Release -o ../../artifacts/api
```

## İçerik girmek

Yönetici paneli gelene kadar iki yol var:

1. **API ile:** `PUT /api/spots/{slug}` gövdesi `SpotUpsertRequest`, başlık `X-Admin-Key`. Swagger'da şema var.
2. **Dosya ile (API kapalıyken):** `src/frontend/content/spots/<slug>.json`, kurallar `src/frontend/content/README.md`.

Kurallar: `demo: true` kayıtlar toplamlara girmez; tartı ile tahmin ayrı; teslim yeri her zaman yazılır;
30 gün sonra kontrol. Ayrıntı: `CLAUDE.md`, `docs/ARCHITECTURE.md`.
