# 🎙️ SesliShop — Kendi NLP Modelinle Sesli Filtre

**Mimari:** Web Speech API → kendi eğittiğin spaCy NER + Logistic Regression → FastAPI → Next.js

---

## 📦 Paketler

### Python (model + API)
```
fastapi>=0.115.0
uvicorn[standard]>=0.30.0
spacy>=3.7.5
spacy-lookups-data>=1.0.5  # Türkçe dil desteği (Yerel sözlük)
scikit-learn>=1.5.0
joblib>=1.4.2
typer>=0.12.0              
python-multipart>=0.0.12
```

### Node.js (frontend)
```
next@14   react@18   typescript
```

---

## 🚀 Kurulum

### 1. Python

```bash
cd model
pip install -r requirements.txt
python -m spacy download tr_core_news_sm   # Türkçe base model
```

### 2. Modeli eğit

```bash
python train_model.py
```

Çıktı: `ecommerce_ner/`  `intent_clf.joblib`  `model_info.json`

### 3. API'yi başlat

```bash
python index.py
# http://localhost:8000
# Swagger: http://localhost:8000/docs
```

Test:
```bash
curl -X POST http://localhost:8000/parse \
  -H "Content-Type: application/json" \
  -d '{"text": "kırmızı mont 150 lira altı"}'
```

### 4. Next.js (ayrı terminal)

```bash
npm install && npm run dev
# http://localhost:3000
```

---

## 🧠 Model Mimarisi

```
"kadın siyah elbise 200 tl altı"
           │
    spaCy NER modeli (kendi eğitimin)
    ├─ "siyah"  → COLOR
    ├─ "elbise" → CATEGORY
    ├─ "kadın"  → GENDER
    └─ "200"    → PRICE_MAX
           │
    TF-IDF + LogReg intent modeli
    └─ intent = FILTER  (güven: %96)
           │
    FilterResult JSON → Next.js
```

### Entity Tipleri
| Label | Örnek |
|-------|-------|
| COLOR | kırmızı, siyah, lacivert |
| CATEGORY | mont, kazak, ayakkabı |
| GENDER | kadın, erkek |
| PRICE_MAX | "150" → max fiyat |
| PRICE_MIN | "100" → min fiyat |
| RATING | "4" → min yıldız |
| STOCK | stokta, mevcut |

### Intent Tipleri
| Intent | Tetikleyen |
|--------|-----------|
| FILTER | "kırmızı mont göster" |
| RESET | "filtreyi temizle" |
| BROWSE | "ne var", "listele" |

---

## 🔧 Modeli Geliştirme

`model/training_data.py` dosyasına örnek ekle:
```python
("turuncu hırka 80 tl altında", {
    "entities": [(0, 7, "COLOR"), (8, 13, "CATEGORY"), (14, 16, "PRICE_MAX")],
    "intent": "FILTER"
}),


```
Bu proje modüler bir yapıdadır. Eğer sistemi geliştirmek isterseniz şu adımları izleyebilirsiniz:

1. **Yeni Bir Etiket (Entity) Eklemek:**
   - `training_data.py` içine yeni bir etiket (örn: `BRAND`) ekleyin.
   - `train_model.py` içindeki `save_model_info` fonksiyonunda `entity_types` listesini güncelleyin.
   - Modeli tekrar eğitip API'yi başlatın.

2. **Daha İyi Bir NLP Doğruluğu İçin:**
   - Eğitim setindeki cümleleri çeşitlendirin (Örn: "kırmızı olsun", "fiyatı 500'ü geçmesin" gibi farklı kalıplar).
   - `spacy-lookups-data` paketini güncel tutarak Türkçe morfolojik analizi iyileştirin.

3. **Frontend Entegrasyonu:**
   - API'den dönen JSON yapısı sabittir. Yeni bir filtre eklerseniz `ProductGrid.tsx` içindeki filtreleme mantığına o yeni anahtarı eklemeyi unutmayın.
Sonra `python api/train_model.py` → `python api/index.py`

---

## 🛠️ Geliştirici ve Katkı Rehberi

SesliShop, modüler bir yapıdadır ve yeni özellikler eklemek oldukça kolaydır. Geliştirmek isterseniz şunlara dikkat etmelisiniz:

1. **Model Eğitimi:** Yeni bir niyet (intent) veya varlık (entity) eklediğinizde, `training_data.py` içindeki etiketleme formatına (`start`, `end`, `label`) sadık kalmalısınız. Bir karakterlik kayma bile modelin yanlış öğrenmesine sebep olabilir.
2. **Paket Uyumu:** Proje Python 3.13 üzerinde test edilmiştir. `typer>=0.12.0` paketinin altındaki sürümlerde uyumluluk sorunu yaşanabilir.
3. **Mantık Akışı:** API'den dönen JSON objesi sabittir. Eğer yeni bir entity tipi (örneğin: `BRAND`) eklerseniz, bunu Next.js tarafındaki filtreleme fonksiyonuna (`products.filter(...)`) da eklemeniz gerekir.

## 📡 API Endpoint'leri

| | Path | |
|---|---|---|
| GET | `/health` | Model durumu |
| POST | `/parse` | Metin → filtre |
| GET | `/docs` | Swagger UI |
