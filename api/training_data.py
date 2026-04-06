"""
Türkçe e-ticaret sesli filtre için eğitim verisi.
Entity tipleri:
  COLOR     → kırmızı, siyah, lacivert...
  CATEGORY  → mont, kazak, pantolon...
  GENDER    → kadın, erkek, unisex
  PRICE_MAX → 150, 200 (üst fiyat sınırı)
  PRICE_MIN → 100 (alt fiyat sınırı)
  PRICE_VAL → tam fiyat (100-200 arası için her iki taraf)
  RATING    → 4, 4.5 (minimum yıldız)
  STOCK     → stokta, mevcut (boolean sinyal)

Intent tipleri:
  FILTER    → filtre uygula
  RESET     → filtreyi temizle / hepsini göster
  BROWSE    → genel listeleme
"""

TRAIN_DATA = [
    # ── Sadece renk ──────────────────────────────────────────────────────
    ("kırmızı ürünler göster", {
        "entities": [(0, 7, "COLOR")],
        "intent": "FILTER"
    }),
    ("siyah olanları listele", {
        "entities": [(0, 5, "COLOR")],
        "intent": "FILTER"
    }),
    ("beyaz ürün istiyorum", {
        "entities": [(0, 5, "COLOR")],
        "intent": "FILTER"
    }),
    ("lacivert ne var", {
        "entities": [(0, 8, "COLOR")],
        "intent": "FILTER"
    }),
    ("gri ürünleri görmek istiyorum", {
        "entities": [(0, 3, "COLOR")],
        "intent": "FILTER"
    }),
    ("yeşil renk", {
        "entities": [(0, 5, "COLOR")],
        "intent": "FILTER"
    }),
    ("pembe ürünler", {
        "entities": [(0, 5, "COLOR")],
        "intent": "FILTER"
    }),
    ("mor renkte bir şeyler göster", {
        "entities": [(0, 3, "COLOR")],
        "intent": "FILTER"
    }),

    # ── Sadece kategori ───────────────────────────────────────────────────
    ("mont göster", {
        "entities": [(0, 4, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("kazak istiyorum", {
        "entities": [(0, 5, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("pantolon ara", {
        "entities": [(0, 8, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("elbise var mı", {
        "entities": [(0, 6, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("ayakkabı göster", {
        "entities": [(0, 8, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("çanta listele", {
        "entities": [(0, 5, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("gömlek arıyorum", {
        "entities": [(0, 6, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("tişört", {
        "entities": [(0, 6, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("etek göster", {
        "entities": [(0, 4, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("ceket istiyorum", {
        "entities": [(0, 5, "CATEGORY")],
        "intent": "FILTER"
    }),

    # ── Renk + Kategori ────────────────────────────────────────────────────
    ("kırmızı mont göster", {
        "entities": [(0, 7, "COLOR"), (8, 12, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("siyah kazak istiyorum", {
        "entities": [(0, 5, "COLOR"), (6, 11, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("beyaz gömlek arıyorum", {
        "entities": [(0, 5, "COLOR"), (6, 12, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("lacivert pantolon göster", {
        "entities": [(0, 8, "COLOR"), (9, 17, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("pembe elbise", {
        "entities": [(0, 5, "COLOR"), (6, 12, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("gri ayakkabı", {
        "entities": [(0, 3, "COLOR"), (4, 12, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("yeşil ceket var mı", {
        "entities": [(0, 5, "COLOR"), (6, 11, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("kahve çanta göster", {
        "entities": [(0, 5, "COLOR"), (6, 11, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("sarı tişört", {
        "entities": [(0, 4, "COLOR"), (5, 11, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("bordo etek istiyorum", {
        "entities": [(0, 5, "COLOR"), (6, 10, "CATEGORY")],
        "intent": "FILTER"
    }),

    # ── Fiyat (sadece üst sınır) ──────────────────────────────────────────
    ("150 lira altı ürünler", {
        "entities": [(0, 3, "PRICE_MAX")],
        "intent": "FILTER"
    }),
    ("200 tl altında olanlar", {
        "entities": [(0, 3, "PRICE_MAX")],
        "intent": "FILTER"
    }),
    ("yüz elli lira altı", {
        "entities": [(0, 8, "PRICE_MAX")],
        "intent": "FILTER"
    }),
    ("en fazla 300 tl", {
        "entities": [(9, 12, "PRICE_MAX")],
        "intent": "FILTER"
    }),
    ("100 tlden ucuz", {
        "entities": [(0, 3, "PRICE_MAX")],
        "intent": "FILTER"
    }),
    ("500 liraya kadar", {
        "entities": [(0, 3, "PRICE_MAX")],
        "intent": "FILTER"
    }),
    ("250 tl'den az", {
        "entities": [(0, 3, "PRICE_MAX")],
        "intent": "FILTER"
    }),

    # ── Fiyat (sadece alt sınır) ──────────────────────────────────────────
    ("100 lira üzeri", {
        "entities": [(0, 3, "PRICE_MIN")],
        "intent": "FILTER"
    }),
    ("200 tl üstü ürünler", {
        "entities": [(0, 3, "PRICE_MIN")],
        "intent": "FILTER"
    }),
    ("en az 150 lira", {
        "entities": [(7, 10, "PRICE_MIN")],
        "intent": "FILTER"
    }),
    ("300 tlden pahalı", {
        "entities": [(0, 3, "PRICE_MIN")],
        "intent": "FILTER"
    }),

    # ── Fiyat aralığı ─────────────────────────────────────────────────────
    ("100 ile 200 lira arası", {
        "entities": [(0, 3, "PRICE_MIN"), (8, 11, "PRICE_MAX")],
        "intent": "FILTER"
    }),
    ("150 ile 300 tl arasında", {
        "entities": [(0, 3, "PRICE_MIN"), (9, 12, "PRICE_MAX")],
        "intent": "FILTER"
    }),
    ("50 ile 100 arası", {
        "entities": [(0, 2, "PRICE_MIN"), (8, 11, "PRICE_MAX")],
        "intent": "FILTER"
    }),
    ("200 ile 400 lira arası kazak", {
        "entities": [(0, 3, "PRICE_MIN"), (9, 12, "PRICE_MAX"), (20, 25, "CATEGORY")],
        "intent": "FILTER"
    }),

    # ── Renk + Fiyat ──────────────────────────────────────────────────────
    ("kırmızı mont 150 tl altı", {
        "entities": [(0, 7, "COLOR"), (8, 12, "CATEGORY"), (13, 16, "PRICE_MAX")],
        "intent": "FILTER"
    }),
    ("siyah ayakkabı 200 lira altında", {
        "entities": [(0, 5, "COLOR"), (6, 14, "CATEGORY"), (15, 18, "PRICE_MAX")],
        "intent": "FILTER"
    }),
    ("beyaz gömlek 100 liradan ucuz", {
        "entities": [(0, 5, "COLOR"), (6, 12, "CATEGORY"), (13, 16, "PRICE_MAX")],
        "intent": "FILTER"
    }),
    ("lacivert pantolon 300 tl altı", {
        "entities": [(0, 8, "COLOR"), (9, 17, "CATEGORY"), (18, 21, "PRICE_MAX")],
        "intent": "FILTER"
    }),
    ("gri kazak 100 ila 200 arası", {
        "entities": [(0, 3, "COLOR"), (4, 9, "CATEGORY"), (10, 13, "PRICE_MIN"), (18, 21, "PRICE_MAX")],
        "intent": "FILTER"
    }),

    # ── Cinsiyet ──────────────────────────────────────────────────────────
    ("kadın elbise göster", {
        "entities": [(0, 5, "GENDER"), (6, 12, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("erkek gömlek istiyorum", {
        "entities": [(0, 5, "GENDER"), (6, 12, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("kadın için kırmızı kazak", {
        "entities": [(0, 5, "GENDER"), (11, 18, "COLOR"), (19, 24, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("erkek ayakkabı", {
        "entities": [(0, 5, "GENDER"), (6, 14, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("bayan elbise", {
        "entities": [(0, 5, "GENDER"), (6, 12, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("bay gömlek", {
        "entities": [(0, 3, "GENDER"), (4, 10, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("unisex mont var mı", {
        "entities": [(0, 6, "GENDER"), (7, 11, "CATEGORY")],
        "intent": "FILTER"
    }),

    # ── Rating ────────────────────────────────────────────────────────────
    ("4 yıldız üzeri ürünler", {
        "entities": [(0, 1, "RATING")],
        "intent": "FILTER"
    }),
    ("4.5 yıldızlı ürünler", {
        "entities": [(0, 3, "RATING")],
        "intent": "FILTER"
    }),
    ("en iyi puanlı kazak", {
        "entities": [(12, 17, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("yüksek puanlı ürünler", {
        "entities": [],
        "intent": "FILTER"
    }),

    # ── Stok ─────────────────────────────────────────────────────────────
    ("stokta olan ürünler", {
        "entities": [(0, 6, "STOCK")],
        "intent": "FILTER"
    }),
    ("mevcut olanları göster", {
        "entities": [(0, 6, "STOCK")],
        "intent": "FILTER"
    }),
    ("satışta olan lacivert mont", {
        "entities": [(0, 7, "STOCK"), (13, 21, "COLOR"), (22, 26, "CATEGORY")],
        "intent": "FILTER"
    }),

    # ── Karmaşık cümleler ─────────────────────────────────────────────────
    ("kadın için siyah 150 lira altı mont göster", {
        "entities": [(0, 5, "GENDER"), (11, 16, "COLOR"), (17, 20, "PRICE_MAX"), (26, 30, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("erkek lacivert kazak 200 tl altında", {
        "entities": [(0, 5, "GENDER"), (6, 14, "COLOR"), (15, 20, "CATEGORY"), (21, 24, "PRICE_MAX")],
        "intent": "FILTER"
    }),
    ("kırmızı ya da siyah mont", {
        "entities": [(0, 7, "COLOR"), (14, 19, "COLOR"), (20, 24, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("4 yıldız üzeri kadın elbise 300 tl altı", {
        "entities": [(0, 1, "RATING"), (15, 20, "GENDER"), (21, 27, "CATEGORY"), (28, 31, "PRICE_MAX")],
        "intent": "FILTER"
    }),
    ("stokta olan pembe kazak 100 ila 200 lira arası", {
        "entities": [(0, 6, "STOCK"), (12, 17, "COLOR"), (18, 23, "CATEGORY"), (24, 27, "PRICE_MIN"), (32, 35, "PRICE_MAX")],
        "intent": "FILTER"
    }),
    ("ucuz kırmızı tişört", {
        "entities": [(5, 12, "COLOR"), (13, 19, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("pahalı siyah ceket", {
        "entities": [(6, 11, "COLOR"), (12, 17, "CATEGORY")],
        "intent": "FILTER"
    }),
    ("en ucuz mont", {
        "entities": [(8, 12, "CATEGORY")],
        "intent": "FILTER"
    }),

    # ── RESET intent ─────────────────────────────────────────────────────
    ("filtreyi kaldır", {
        "entities": [],
        "intent": "RESET"
    }),
    ("hepsini göster", {
        "entities": [],
        "intent": "RESET"
    }),
    ("temizle", {
        "entities": [],
        "intent": "RESET"
    }),
    ("sıfırla", {
        "entities": [],
        "intent": "RESET"
    }),
    ("tüm ürünleri göster", {
        "entities": [],
        "intent": "RESET"
    }),
    ("filtreyi temizle", {
        "entities": [],
        "intent": "RESET"
    }),

    # ── BROWSE intent ─────────────────────────────────────────────────────
    ("ne var", {
        "entities": [],
        "intent": "BROWSE"
    }),
    ("ürünleri listele", {
        "entities": [],
        "intent": "BROWSE"
    }),
    ("alışveriş yapmak istiyorum", {
        "entities": [],
        "intent": "BROWSE"
    }),
    ("bir şeyler bak", {
        "entities": [],
        "intent": "BROWSE"
    }),
]

# Validation set (eğitimde kullanılmaz, sadece test)
TEST_DATA = [
    ("mor tişört 50 tl altı", {
        "entities": [(0, 3, "COLOR"), (4, 10, "CATEGORY"), (11, 13, "PRICE_MAX")],
        "intent": "FILTER"
    }),
    ("erkek siyah ceket 250 ile 400 arası", {
        "entities": [(0, 5, "GENDER"), (6, 11, "COLOR"), (12, 17, "CATEGORY"), (18, 21, "PRICE_MIN"), (26, 29, "PRICE_MAX")],
        "intent": "FILTER"
    }),
    ("hepsini temizle", {
        "entities": [],
        "intent": "RESET"
    }),
    ("stokta olan kadın pembe elbise 200 tl altı", {
        "entities": [(0, 6, "STOCK"), (12, 17, "GENDER"), (18, 23, "COLOR"), (24, 30, "CATEGORY"), (31, 34, "PRICE_MAX")],
        "intent": "FILTER"
    }),
]
