"use client";

import { Product } from "@/lib/products";
import { useState } from "react";

interface Props {
  products: Product[];
  loading?: boolean;
}


export default function ProductGrid({ products, loading }: Props) {
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "rating">("default");

  const sorted = [...products].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  if (loading) {
    return (
      <div className="grid-loading">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton-card" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <h3>Ürün bulunamadı</h3>
        <p>Farklı bir arama deneyin veya filtreyi temizleyin.</p>
      </div>
    );
  }

  return (
    <div className="product-grid-wrapper responsive-grid-wrapper">
      {/* Üst bar */}
      <div className="grid-topbar responsive-grid-topbar">
        <span className="result-count">
          <strong>{products.length}</strong> ürün bulundu
        </span>
        <div className="sort-controls">
          <label htmlFor="sort">Sırala:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="sort-select"
          >
            <option value="default">Varsayılan</option>
            <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
            <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
            <option value="rating">En İyi Puan</option>
          </select>
        </div>
      </div>

      {/* Ürün grid */}
      <div className="product-grid responsive-product-grid">
        {sorted.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  return (
    <div className={`product-card responsive-product-card ${!product.inStock ? "out-of-stock" : ""}`}>
      {/* Resim */}
      <div className="card-img-wrap">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="card-img"
          />
        ) : (
          <div className="card-img-fallback">
            <span>👕</span>
          </div>
        )}

        {/* Badge'lar */}
        <div className="card-badges">
          {!product.inStock && <span className="badge badge-oos">Tükendi</span>}
          {product.rating >= 4.7 && product.inStock && (
            <span className="badge badge-top">⭐ Top</span>
          )}
        </div>

        {/* Wishlist butonu */}
        <button
          className={`wishlist-btn ${wishlist ? "active" : ""}`}
          onClick={() => setWishlist(!wishlist)}
          aria-label="Favorilere ekle"
        >
          {wishlist ? "❤️" : "🤍"}
        </button>
      </div>

      {/* İçerik */}
      <div className="card-body">
        <div className="card-meta">
          <span className="card-brand">{product.brand}</span>
          <span className="card-category">{product.category}</span>
        </div>

        <h3 className="card-name">{product.name}</h3>

        {/* Renk noktaları */}
        <div className="color-dots">
          {product.colors.map((c) => (
            <span
              key={c}
              className="color-dot"
              style={{ backgroundColor: COLOR_HEX[c] || "#ccc" }}
              title={c}
            />
          ))}
        </div>

        {/* Puan */}
        <div className="card-rating">
          <span className="stars">{renderStars(product.rating)}</span>
          <span className="rating-val">{product.rating.toFixed(1)}</span>
        </div>

        {/* Fiyat & Buton */}
        <div className="card-footer">
          <span className="card-price">{product.price.toLocaleString("tr-TR")} ₺</span>
          <button
            className={`add-to-cart ${!product.inStock ? "disabled" : ""}`}
            disabled={!product.inStock}
          >
            {product.inStock ? "Sepete Ekle" : "Stokta Yok"}
          </button>
        </div>
      </div>
    </div>
  );
}

function renderStars(rating: number) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <>
      {"★".repeat(full)}
      {half ? "½" : ""}
      {"☆".repeat(5 - full - (half ? 1 : 0))}
    </>
  );
}

const COLOR_HEX: Record<string, string> = {
  kırmızı: "#e53e3e", siyah: "#1a1a1a", beyaz: "#f0f0f0", mavi: "#3182ce",
  lacivert: "#2c5282", gri: "#718096", yeşil: "#38a169", sarı: "#d69e2e",
  pembe: "#ed64a6", mor: "#805ad5", turuncu: "#ed8936", kahve: "#744210",
  bej: "#c9a96e", krem: "#f5e6c8", haki: "#6b7c45", bordo: "#702459",
  lila: "#9b59b6", "açık mavi": "#90cdf4",
};
