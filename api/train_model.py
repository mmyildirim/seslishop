"""
api/train_model.py
──────────────
Türkçe e-ticaret sesli filtre modelini eğitir.

Kurulum (Güncel):
    pip install spacy scikit-learn joblib spacy-lookups-data

Eğitim:
    python api/train_model.py

Çıktı:
    ecommerce_ner/          → spaCy NER modeli
    intent_clf.joblib       → intent sınıflandırıcı
    model_info.json         → model meta verileri
"""
import random
import json
import os
from pathlib import Path

import spacy
from spacy.training import Example
from spacy.util import minibatch, compounding

from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
import joblib

from training_data import TRAIN_DATA, TEST_DATA

# ─── Ayarlar ──────────────────────────────────────────────────────────────────
BASE_MODEL_PATH = Path("model")
BASE_MODEL_PATH.mkdir(exist_ok=True) # Klasör yoksa oluşturur

MODEL_DIR = BASE_MODEL_PATH / "ecommerce_ner"
INTENT_MODEL_PATH = BASE_MODEL_PATH / "intent_clf.joblib"
MODEL_INFO_PATH = BASE_MODEL_PATH / "model_info.json" # Bunu da ekledik
N_ITER = 40          # epoch sayısı
DROPOUT = 0.2
RANDOM_SEED = 42

random.seed(RANDOM_SEED)

# ─── 1. NER Modeli ────────────────────────────────────────────────────────────

def train_ner():
    print("\n🔧 NER modeli eğitiliyor...")

    # spacy-lookups-data ile desteklenmiş yerel Türkçe model
    nlp = spacy.blank("tr")
    print("   → Türkçe dil şablonu (Local Lookups) aktif edildi.")

    # NER pipeline ekle veya var olanı al
    if "ner" not in nlp.pipe_names:
        ner = nlp.add_pipe("ner", last=True)
    else:
        ner = nlp.get_pipe("ner")

    # Entity tiplerini kaydet (Burası senin verilerindeki etiketleri modele tanıtır)
    entity_types = set()
    for _, annotations in TRAIN_DATA:
        for start, end, label in annotations["entities"]:
            entity_types.add(label)
            ner.add_label(label)

    print(f"   → Entity tipleri tanımlandı: {sorted(entity_types)}")
    entity_types = set()
    for _, annotations in TRAIN_DATA:
        for start, end, label in annotations["entities"]:
            entity_types.add(label)
            ner.add_label(label)

    print(f"   → Entity tipleri: {sorted(entity_types)}")

    # Eğitim örnekleri oluştur
    train_examples = []
    for text, annotations in TRAIN_DATA:
        doc = nlp.make_doc(text)
        entities = annotations.get("entities", [])
        # Geçersiz span'ları filtrele
        filtered = []
        for start, end, label in entities:
            span = doc.char_span(start, end, label=label, alignment_mode="contract")
            if span is not None:
                filtered.append((start, end, label))
            else:
                print(f"   ⚠️  Span atlandı: '{text[start:end]}' ({start},{end}) in '{text}'")
        example = Example.from_dict(doc, {"entities": filtered})
        train_examples.append(example)

    # Diğer pipeline bileşenlerini dondur
    other_pipes = [pipe for pipe in nlp.pipe_names if pipe != "ner"]

    # Eğitim döngüsü
    optimizer = nlp.begin_training()
    best_loss = float("inf")
    patience = 5
    no_improve = 0

    with nlp.disable_pipes(*other_pipes):
        for iteration in range(N_ITER):
            random.shuffle(train_examples)
            losses = {}
            batches = minibatch(train_examples, size=compounding(4.0, 32.0, 1.001))

            for batch in batches:
                nlp.update(batch, drop=DROPOUT, losses=losses, sgd=optimizer)

            loss = losses.get("ner", 0)
            if (iteration + 1) % 5 == 0:
                print(f"   Epoch {iteration+1:3d}/{N_ITER}  loss: {loss:.4f}")

            # Early stopping
            if loss < best_loss:
                best_loss = loss
                no_improve = 0
            else:
                no_improve += 1
                if no_improve >= patience and iteration > 15:
                    print(f"   → Early stopping (epoch {iteration+1})")
                    break

    # Kaydet
    MODEL_DIR.mkdir(exist_ok=True)
    nlp.to_disk(MODEL_DIR)
    print(f"   ✅ NER modeli kaydedildi → {MODEL_DIR}/")

    return nlp


# ─── 2. Intent Sınıflandırıcı ─────────────────────────────────────────────────

def train_intent_classifier():
    print("\n🔧 Intent sınıflandırıcı eğitiliyor...")

    texts = [text for text, _ in TRAIN_DATA]
    labels = [ann["intent"] for _, ann in TRAIN_DATA]

    # TF-IDF + Logistic Regression pipeline
    clf = Pipeline([
        ("tfidf", TfidfVectorizer(
            analyzer="char_wb",
            ngram_range=(2, 5),
            max_features=5000,
            sublinear_tf=True,
        )),
        ("clf", LogisticRegression(
            max_iter=1000,
            C=2.0,
            random_state=RANDOM_SEED,
            # multi_class="multinomial" satırı SİLİNDİ
        )),
    ])

    clf.fit(texts, labels)

    # Eğitim doğruluğu
    train_preds = clf.predict(texts)
    correct = sum(p == l for p, l in zip(train_preds, labels))
    print(f"   Eğitim doğruluğu: {correct}/{len(labels)} = {correct/len(labels)*100:.1f}%")

    # Test set varsa değerlendir
    if TEST_DATA:
        test_texts = [t for t, _ in TEST_DATA]
        test_labels = [a["intent"] for _, a in TEST_DATA]
        test_preds = clf.predict(test_texts)
        print("\n   Test seti sonuçları:")
        print(classification_report(test_labels, test_preds, zero_division=0))

    joblib.dump(clf, INTENT_MODEL_PATH)
    print(f"   ✅ Intent model kaydedildi → {INTENT_MODEL_PATH}")

    return clf


# ─── 3. NER Değerlendirme ─────────────────────────────────────────────────────

def evaluate_ner(nlp):
    print("\n📊 NER değerlendirme (test seti):")

    correct = 0
    total = 0

    for text, annotations in TEST_DATA:
        doc = nlp(text)
        predicted = {(ent.start_char, ent.end_char, ent.label_) for ent in doc.ents}
        expected = {(s, e, l) for s, e, l in annotations.get("entities", [])}

        for exp in expected:
            total += 1
            if exp in predicted:
                correct += 1

        if predicted != expected:
            print(f"\n   Metin: '{text}'")
            print(f"   Beklenen : {expected}")
            print(f"   Tahmin   : {predicted}")

    if total > 0:
        print(f"\n   Entity doğruluğu: {correct}/{total} = {correct/total*100:.1f}%")
    else:
        print("   Test verisi yok.")


# ─── 4. Model Bilgisi Kaydet ──────────────────────────────────────────────────

def save_model_info():
    info = {
        "model_version": "1.0.0",
        "entity_types": ["COLOR", "CATEGORY", "GENDER", "PRICE_MAX", "PRICE_MIN", "RATING", "STOCK"],
        "intents": ["FILTER", "RESET", "BROWSE"],
        "language": "tr",
        "train_samples": len(TRAIN_DATA),
        "description": "Türkçe e-ticaret sesli filtre NER + intent modeli",
        "color_vocab": [
            "kırmızı", "siyah", "beyaz", "mavi", "lacivert", "gri",
            "yeşil", "sarı", "pembe", "mor", "turuncu", "kahve",
            "bej", "krem", "haki", "bordo", "lila"
        ],
        "category_vocab": [
            "mont", "kazak", "pantolon", "elbise", "ayakkabı",
            "çanta", "gömlek", "tişört", "etek", "ceket"
        ],
    }

    with open(MODEL_INFO_PATH, "w", encoding="utf-8") as f:
            json.dump(info, f, ensure_ascii=False, indent=2)

    print(f"\n   📄 {MODEL_INFO_PATH} kaydedildi")


# ─── Ana ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("=" * 55)
    print("  SesliShop NER + Intent Model Eğitimi")
    print("=" * 55)

    nlp = train_ner()
    clf = train_intent_classifier()
    evaluate_ner(nlp)
    save_model_info()

    print("\n✅ Eğitim tamamlandı!")
    print(f"   → NER modeli   : model/ecommerce_ner/")
    print(f"   → Intent model : model/intent_clf.joblib")
    print(f"   → Model bilgisi: model/model_info.json")
    print("\nSonraki adım: python api/index.py")
