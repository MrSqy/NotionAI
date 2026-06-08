# 📖 NotionAI — Kullanım Kılavuzu

Bu rehber, NotionAI uygulamasını sıfırdan kurup kullanmak için adım adım talimatlar içerir.

---

## 🚀 Hızlı Başlangıç

> **Yeni:** AI Chat özelliği eklendi! Notlarınızdan yararlanan akıllı sohbet asistanı artık her sohbette aktif. AI read-only erişime sahiptir, notlarınızı asla düzenlemez.

### 1. Ön Koşullar

Bilgisayarınızda şunların kurulu olması gerekir:
- **Docker** — [Kurulum Rehberi](https://docs.docker.com/get-docker/)
- **Docker Compose** — Genellikle Docker ile birlikte gelir

Kurulumu doğrulamak için:
```bash
docker --version      # Örnek: Docker version 24.x.x
docker compose version # Örnek: Docker Compose version v2.x.x
```

### 2. `.env` Dosyasını Oluştur

Proje klasörüne gidin:
```bash
cd "Kimi denemesi"
```

`.env.example` dosyasını `.env` olarak kopyalayın:
```bash
cp .env.example .env
```

`.env` dosyasını bir metin editörüyle açın. İçindekiler şöyle olmalı:

```env
# OpenAI API Key (opsiyonel — yoksa AI özellikleri devre dışı kalır)
# https://platform.openai.com/api-keys adresinden ücretsiz key alabilirsiniz
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Backend güvenlik anahtarları (üretimde kesinlikle değiştirin!)
JWT_SECRET=super_secret_jwt_key_change_in_production
JWT_REFRESH_SECRET=super_secret_refresh_key_change_in_production

# Veritabanı ve Redis bağlantı URL'leri (Docker içinde otomatik çalışır)
DATABASE_URL=postgresql://notionai:notionai_secret@localhost:5432/notionai
REDIS_URL=redis://localhost:6379

# Frontend API adresleri
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

> 💡 **Groq API Key gerekli mi?**
> - **Hayır**, key olmadan da uygulama çalışır.
> - **Evet** — Eğer şunları istiyorsanız: AI sohbet, otomatik özet, semantik arama.

### 3. Projeyi Başlat

Tek komutla tüm servisleri ayağa kaldırın:

```bash
docker compose up --build -d
```

**İlk kurulumda** Docker image'ları indirilecek ve build edilecektir. Bu ~3-5 dakika sürebilir.

**Sonraki başlatmalarda** çok daha hızlıdır:
```bash
docker compose up -d
```

### 4. Erişim

Tarayıcınızda şu adreslere gidin:

| Servis | URL | Açıklama |
|--------|-----|----------|
| **Frontend** | http://localhost:5173 | React uygulaması (ana arayüz) |
| **Backend API** | http://localhost:3001 | NestJS REST API |

---

## 📝 Uygulamayı Kullanma

### Adım 1: Kayıt Ol

1. `http://localhost:5173`'e gidin
2. **"Kayıt ol"** linkine tıklayın
3. Email, şifre (min 6 karakter) ve isim girin
4. Kayıt olduktan sonra otomatik olarak Dashboard'a yönlendirilirsiniz

### Adım 2: İlk Notunuzu Oluşturun

1. Sol sidebar'daki **"Yeni Not"** butonuna tıklayın
2. Başlık yazın (örn: "İlk Notum")
3. Editör alanına içerik girin
4. Toolbar'dan biçimlendirme yapın:
   - **H1 / H2** — Başlıklar
   - **B** — Kalın metin
   - **I** — İtalik metin
   - **• List** — Sırasız liste
   - **1. List** — Sıralı liste
   - **Quote** — Alıntı
   - **Code** — Kod bloğu

> ⚡ **Auto-Save:** İçerik yazarken 2 saniye durduğunuzda otomatik kaydedilir.

### Adım 3: Etiket Ekleme

1. Sağ üstteki **etiket (🏷️) butonuna** tıklayın
2. **Yeni etiket oluştur:**
   - İsim girin (örn: "Önemli")
   - Renk seçin (örn: kırmızı `#ff0000`)
   - **"Ekle"** butonuna tıklayın
3. Etiketi nota ilişkilendirmek için **"Ekle"** butonuna tıklayın

### Adım 4: Notları Yönetme

Her notun sağ üst köşesinde şu aksiyonlar var:

| Buton | İşlem |
|-------|-------|
| 📌 **Pin** | Notu sabitle (en üste taşır) |
| 🗃️ **Arşiv** | Notu arşivle (soft delete) |
| 🏷️ **Etiket** | Etiket modalını aç |
| 🗑️ **Sil** | Notu arşivle (kalıcı silinmiyor!) |

> 🗄️ **Arşivlenen Notlar:** `isArchived: true` olan notlar artık normal listede görünmez. Görüntülemek için API'den `GET /notes?archived=true` ile çekebilirsiniz (UI'da arşiv görünümü eklenebilir).

### Adım 5: AI Sohbet

1. Sol sidebar'ın altındaki **"AI Sohbet"** butonuna tıklayın (veya `/chat` adresine gidin)
2. **"Yeni Sohbet"** butonuna tıklayarak yeni bir sohbet başlatın
3. Mesaj kutusuna sorunuzu yazın:
   - `"Notlarım arasında tasarrufla ilgili ne yazmıştım?"`
   - `"Son notumu özetle"`
   - `"Önemli etiketli notlarım neler?"`
4. AI, notlarınızın içeriğinden yararlanarak cevap verir

> 🔒 **AI sadece okur:** AI asistanı notlarınızı asla düzenlemez veya silemez. Sadece mevcut içeriği analiz ederek size yardımcı olur.

### Adım 6: Semantik Arama

1. Sidebar'daki **arama (🔍) butonuna** tıklayın
2. Arama kutusuna bir konu veya kelime yazın:
   - `"para biriktirme"`
   - `"geçen hafta yazdıklarım"`
   - `"proje fikirleri"`
3. Sonuçlar listelenecektir

> 🔑 **Groq Key Aktifse:** pgvector cosine similarity ile en alakalı notları bulur.
> 🔑 **Key Yoksa:** Son güncellenen 10 notu döndürür (fallback mod).

### Adım 7: Dark Mode

Sol sidebar'ın altındaki **Ay/Güneş (🌙/☀️) butonuna** tıklayarak karanlık/aydınlık tema arasında geçiş yapın.

---

## 🧠 AI Özellikleri (Groq Key Aktifse)

Groq API key `.env` dosyasına eklendiyse şu özellikler otomatik çalışır:

| Özellik | Nasıl Çalışır? |
|---------|---------------|
| **AI Sohbet** | Notlarınızdan bağlam alarak sorularınıza cevap verir. AI sadece okuma yapar, notlarınızı düzenlemez. |
| **Otomatik Özet** | Not kaydedildiğinde/güncellendiğinde Llama 3.1 2-3 cümlelik özet üretir. Not başlığının altında görünür. |
| **Etiket Önerisi** | Yeni notlar için mevcut etiketlerden alakalı olanları önerir. |
| **Semantik Arama** | Arama sorgusu da embedding'e çevrilir, pgvector `cosine similarity` ile en yakın notlar bulunur. (Embedding fallback: key yoksa random vektör) |

---

## 🛠️ Yönetim Komutları

### Logları İzleme

```bash
# Tüm servislerin logları
docker compose logs -f

# Sadece backend logları
docker compose logs -f backend

# Sadece frontend logları
docker compose logs -f frontend

# Sadece veritabanı logları
docker compose logs -f postgres
```

### Servisleri Yeniden Başlatma

```bash
# Tümünü yeniden başlat
docker compose restart

# Sadece backend'i yeniden başlat
docker compose restart backend

# Sadece frontend'i yeniden başlat
docker compose restart frontend
```

### Servisleri Durdurma

```bash
# Servisleri durdur (veriler korunur)
docker compose down

# Tamamen sıfırla (veritabanı dahil her şey silinir!)
docker compose down -v
```

### Kod Değişiklikleri

Docker Compose yapılandırmasında **volume mount** var, bu yüzden:
- `backend/src/` ve `frontend/src/` dosyalarını doğrudan editörünüzde değiştirebilirsiniz
- Değişiklikler otomatik olarak container'lara yansır
- Backend: NestJS watch mode sayesinde otomatik yeniden derlenir
- Frontend: Vite HMR sayesinde tarayıcı otomatik yenilenir

---

## 🔐 Güvenlik Hatırlatmaları

Üretim ortamına taşımadan önce **mutlaka** şunları yapın:

1. **JWT_SECRET** ve **JWT_REFRESH_SECRET**'ı güçlü, rastgele stringlerle değiştirin:
   ```bash
   openssl rand -base64 32
   ```

2. **OPENAI_API_KEY** (Groq key)'i güvenli bir yerde saklayın (örn: Docker secrets, AWS Secrets Manager)

3. **FRONTEND_URL** çevre değişkenini gerçek domain'inize ayarlayın

4. **PostgreSQL şifresini** değiştirin (`.env` ve `docker-compose.yml` içindeki `POSTGRES_PASSWORD`)

5. **HTTPS** kullanın (üretimde `VITE_API_URL` ve `VITE_WS_URL`'yi `https://` ve `wss://` yapın)

Detaylı güvenlik denetim raporu için [SECURITY_AUDIT.md](./SECURITY_AUDIT.md) dosyasına bakın.

---

## ❓ Sık Karşılaşılan Sorunlar

### "Address already in use" hatası
```bash
# Portları kullanan process'leri bulup öldürün
lsof -ti:5173 | xargs -r kill -9
lsof -ti:3001 | xargs -r kill -9
lsof -ti:6379 | xargs -r kill -9
```

### "The table does not exist" hatası
Veritabanı schema oluşturulmamış. Migration'ları çalıştırın:
```bash
docker compose exec backend npx prisma migrate deploy
```

### "Migration failed" hatası
Migration dosyaları eksik olabilir. Sıfırlama yapın:
```bash
docker compose down -v
docker compose up --build -d
```

### Frontend 5173 portunda açılmıyor
Muhtemelen başka bir Vite projesi çalışıyor. Portu değiştirmek için `docker-compose.yml` içinde `5173:5173` kısmını `5180:5173` gibi bir değerle değiştirin.

---

## 📞 Destek

Bir sorunla karşılaşırsanız veya yeni özellik isteğiniz varsa:
- Logları kontrol edin: `docker compose logs -f backend`
- API'yi doğrudan test edin: `curl http://localhost:3001/`
- [SECURITY_AUDIT.md](./SECURITY_AUDIT.md) güvenlik raporunu inceleyin
