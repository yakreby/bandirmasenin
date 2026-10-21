# İçerik nasıl girilir

Her nokta `spots/<slug>.json` dosyasıdır. Alanlar `src/lib/types.ts` içinde tanımlı.
Yeni nokta eklerken dosyayı oluştur, `src/lib/content.ts` içindeki listeye import et, commit'le. Vercel yayınlar.

Kurallar:

- `demo: true` olan kayıtlar arayüzde "örnek kayıt" damgasıyla görünür ve toplamlara girmez. Gerçek ilk çalışmada bu alanı sil.
- Tartı ile ölçülen miktar `method: "tarti"`, göz kararı `method: "tahmin"`. İkisi ayrı raporlanır, tahmin kesin sayı gibi gösterilmez.
- Önce/sonra fotoğrafları aynı açıdan çekilir. Dosyalar `public/photos/<slug>/` altına konur (ilk sürüm; büyüyünce R2).
- `deliveredTo` boş bırakılmaz: atık nereye teslim edildiyse o yazılır.
- `recheckDue` temizlikten 30 gün sonrası. Kontrol yapılınca `recheck` doldurulur ve `status` güncellenir.
- Durumlar: `tespit_edildi` → `planlandi` → `tamamlandi` → `yeniden_kontrol_edilecek` → (`tamamlandi` | `tekrar_kirlendi`).
