"""
index.py — SesliShop NER + Intent FastAPI Sunucusu
─────────────────────────────────────────────────
Çalıştırma:
    pip install fastapi uvicorn spacy scikit-learn joblib
    python /api/index.py

Endpoint:
    POST /parse
    Body: { "text": "kırmızı mont 150 lira altı" }
    Dönüş:
    {
      "intent": "FILTER",
      "intent_confidence": 0.97,
      "entities": {
        "colors": ["kırmızı"],
        "categories": ["mont"],
        "genders": [],
        "price_min": null,
        "price_max": 150,
        "rating_min": null,
        "in_stock_only": false
      },
      "raw_entities": [
        {"text": "kırmızı", "label": "COLOR", "start": 0, "end": 7},
        ...
      ],
      "debug": { "model_version": "1.0.0" }
    }
"""

import os
import re
import json
import logging
from pathlib import Path
from typing import Optional

import uvicorn
import spacy
import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ─── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO, format="%(asctime)s  %(levelname)s  %(message)s")
log = logging.getLogger("sesli-shop")

# ─── Model yükle ──────────────────────────────────────────────────────────────
# Modelleri bir üst klasördeki 'model' dizininde aramasını sağlıyoruz
MODEL_DIR = Path(__file__).parent.parent / "model" / "ecommerce_ner"
INTENT_MODEL_PATH = Path(__file__).parent.parent / "model" / "intent_clf.joblib"
MODEL_INFO_PATH = Path(__file__).parent.parent / "model" / "model_info.json"

def load_models():
    log.info("Modeller yükleniyor...")

    if not MODEL_DIR.exists():
        raise RuntimeError(
            f"NER modeli bulunamadı: {MODEL_DIR}\n"
            "Önce: cd model && python train_model.py"
        )

    nlp = spacy.load(MODEL_DIR)
    clf = joblib.load(INTENT_MODEL_PATH)

    model_info = {}
    if MODEL_INFO_PATH.exists():
        with open(MODEL_INFO_PATH, encoding="utf-8") as f:
            model_info = json.load(f)

    log.info(f"✅ Modeller hazır  (versiyon: {model_info.get('model_version', '?')})")
    return nlp, clf, model_info

nlp, intent_clf, model_info = load_models()

# ─── FastAPI ──────────────────────────────────────────────────────────────────
app = FastAPI(
    title="SesliShop NLP API",
    description="Türkçe sesli e-ticaret filtre motoru",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", os.environ.get("NEXT_PUBLIC_NLP_API_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Schemas ──────────────────────────────────────────────────────────────────
class ParseRequest(BaseModel):
    text: str

class EntityInfo(BaseModel):
    text: str
    label: str
    start: int
    end: int

class FilterResult(BaseModel):
    colors: list[str]
    categories: list[str]
    genders: list[str]
    price_min: Optional[float]
    price_max: Optional[float]
    rating_min: Optional[float]
    in_stock_only: bool

class ParseResponse(BaseModel):
    intent: str
    intent_confidence: float
    entities: FilterResult
    raw_entities: list[EntityInfo]
    debug: dict

# ─── Yardımcılar ──────────────────────────────────────────────────────────────

# Türkçe sayı → rakam dönüşüm tablosu
TURKCE_SAYI = {
    "sıfır": 0, "bir": 1, "iki": 2, "üç": 3, "dört": 4,
    "beş": 5, "altı": 6, "yedi": 7, "sekiz": 8, "dokuz": 9,
    "on": 10, "yirmi": 20, "otuz": 30, "kırk": 40, "elli": 50,
    "altmış": 60, "yetmiş": 70, "seksen": 80, "doksan": 90,
    "yüz": 100, "iki yüz": 200, "üç yüz": 300, "dört yüz": 400,
    "beş yüz": 500, "bin": 1000,
}

def turkce_sayi_to_int(text: str) -> Optional[float]:
    """Türkçe veya rakam olarak yazılmış sayıyı float'a çevirir."""
    text = text.strip().lower()
    # Önce rakam dene
    match = re.search(r"\d+(?:[.,]\d+)?", text)
    if match:
        return float(match.group().replace(",", "."))
    # Türkçe yazım dene
    for word, val in sorted(TURKCE_SAYI.items(), key=lambda x: -len(x[0])):
        if word in text:
            return float(val)
    return None


def extract_filter_from_entities(doc, raw_entities: list[EntityInfo]) -> FilterResult:
    """NER çıktısından yapılandırılmış filtre oluşturur."""
    colors = []
    categories = []
    genders = []
    price_min = None
    price_max = None
    rating_min = None
    in_stock_only = False

    for ent in raw_entities:
        label = ent.label
        text = ent.text.lower().strip()

        if label == "COLOR":
            # Normalize (varyant eşleştirme)
            color = COLOR_NORMALIZE.get(text, text)
            if color not in colors:
                colors.append(color)

        elif label == "CATEGORY":
            cat = CATEGORY_NORMALIZE.get(text, text)
            if cat not in categories:
                categories.append(cat)

        elif label == "GENDER":
            gender = GENDER_NORMALIZE.get(text, text)
            if gender not in genders:
                genders.append(gender)

        elif label == "PRICE_MAX":
            val = turkce_sayi_to_int(text)
            if val is not None:
                price_max = val

        elif label == "PRICE_MIN":
            val = turkce_sayi_to_int(text)
            if val is not None:
                price_min = val

        elif label == "RATING":
            val = turkce_sayi_to_int(text)
            if val is not None:
                rating_min = val

        elif label == "STOCK":
            in_stock_only = True

    # Fiyat context analizi: "ucuz" → max 150, "pahalı" → min 300
    full_text = doc.text.lower()
    if "ucuz" in full_text and price_max is None and price_min is None:
        price_max = 150.0
    if "pahalı" in full_text and price_max is None and price_min is None:
        price_min = 300.0
    if ("yüksek puan" in full_text or "iyi puan" in full_text) and rating_min is None:
        rating_min = 4.0

    return FilterResult(
        colors=colors,
        categories=categories,
        genders=genders,
        price_min=price_min,
        price_max=price_max,
        rating_min=rating_min,
        in_stock_only=in_stock_only,
    )


# Normalize tabloları
COLOR_NORMALIZE = {
    "kirmizi": "kırmızı", "red": "kırmızı",
    "black": "siyah",
    "white": "beyaz",
    "blue": "mavi",
    "navy": "lacivert", "koyu mavi": "lacivert",
    "grey": "gri", "gray": "gri",
    "green": "yeşil", "yesil": "yeşil",
    "yellow": "sarı", "sari": "sarı",
    "pink": "pembe",
    "purple": "mor",
    "orange": "turuncu",
    "brown": "kahve", "kahverengi": "kahve",
    "beige": "bej",
    "cream": "krem",
    "khaki": "haki",
    "burgundy": "bordo",
}

CATEGORY_NORMALIZE = {
    "kaban": "mont", "parka": "mont", "anorak": "mont",
    "triko": "kazak", "hırka": "kazak", "sweatshirt": "kazak",
    "jean": "pantolon", "kot": "pantolon", "jogger": "pantolon",
    "sneaker": "ayakkabı", "bot": "ayakkabı", "topuklu": "ayakkabı",
    "blazer": "ceket", "t-shirt": "tişört",
}

GENDER_NORMALIZE = {
    "bayan": "kadın", "kadin": "kadın",
    "bay": "erkek",
}

# ─── Endpoint'ler ─────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_version": model_info.get("model_version", "unknown"),
        "entity_types": model_info.get("entity_types", []),
        "intents": model_info.get("intents", []),
    }


@app.post("/parse", response_model=ParseResponse)
def parse_voice_command(req: ParseRequest):
    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="'text' alanı boş olamaz")

    log.info(f"Parse isteği: '{text}'")

    # 1. NER çalıştır
    doc = nlp(text)
    raw_entities = [
        EntityInfo(
            text=ent.text,
            label=ent.label_,
            start=ent.start_char,
            end=ent.end_char,
        )
        for ent in doc.ents
    ]

    # 2. Intent tahmin et
    intent_proba = intent_clf.predict_proba([text])[0]
    intent_classes = intent_clf.classes_
    best_idx = intent_proba.argmax()
    intent = intent_classes[best_idx]
    confidence = float(intent_proba[best_idx])

    # 3. Filtre oluştur
    filter_result = extract_filter_from_entities(doc, raw_entities)

    # 4. RESET intent → filtreyi boşalt
    if intent == "RESET":
        filter_result = FilterResult(
            colors=[], categories=[], genders=[],
            price_min=None, price_max=None,
            rating_min=None, in_stock_only=False,
        )

    log.info(f"  → intent={intent} ({confidence:.2f})  entities={len(raw_entities)}")

    return ParseResponse(
        intent=intent,
        intent_confidence=round(confidence, 4),
        entities=filter_result,
        raw_entities=raw_entities,
        debug={
            "model_version": model_info.get("model_version", "?"),
            "raw_text": text,
            "token_count": len(doc),
        },
    )


@app.get("/examples")
def get_examples():
    """Test için örnek komutlar döner."""
    return {
        "examples": [
            "kırmızı mont göster",
            "150 lira altı ürünler",
            "kadın siyah elbise",
            "100 ile 200 arası kazak",
            "4 yıldız üzeri erkek ceket",
            "stokta olan lacivert pantolon",
            "filtreyi temizle",
        ]
    }


# ─── Başlat ───────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    uvicorn.run(
        "index:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
