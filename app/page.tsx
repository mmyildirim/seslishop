"use client";

import { useState, useMemo } from "react";
import VoiceFilter from "@/components/VoiceFilter";
import ProductGrid from "@/components/ProductGrid";
import { products } from "@/lib/products";
import { FilterState, EMPTY_FILTER, applyFilters } from "@/lib/nlp-filter";

export default function Home() {
  const [filter, setFilter] = useState<FilterState>(EMPTY_FILTER);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const filteredProducts = useMemo(
    () => applyFilters(products, filter),
    [filter]
  );

  const handleFilterChange = (newFilter: FilterState) => {
    setFilter(newFilter);
    setFilterMenuOpen(false);
  };

  return (
    <main className="main-layout">
      {/* Header */}
      <header className="site-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">🛍️</span>
            <span className="logo-text">SesliShop</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">
            Sesle Alışveriş <span className="hero-accent">Çok Kolay</span>
          </h1>
          <p className="hero-sub">
            &ldquo;Kırmızı mont 150 lira altı&rdquo; demeniz yeterli.
          </p>
        </div>
      </section>

      {/* İçerik */}
      <div className="content-area">
        {/* Desktop sidebar */}
        <aside className="filter-sidebar-desktop">
          <VoiceFilter
            onFilterChange={handleFilterChange}
            currentFilter={filter}
          />
        </aside>

        {/* Ürün listesi */}
        <section className="products-section">
          <ProductGrid products={filteredProducts} />
        </section>
      </div>

      {/* Floating Filter Button - Sayfanın en altında */}
      <button
        className={`floating-filter-btn ${filterMenuOpen ? "active" : ""}`}
        onClick={() => setFilterMenuOpen(!filterMenuOpen)}
        aria-label="Sesli filtreler"
        title="Sesli Filtreler"
      >
        <span className="filter-icon">🎙️</span>
        <span className="filter-text">Filtre</span>
      </button>

      {/* Full Screen Filter Modal - Kırmızı background ile alttan üste */}
      {filterMenuOpen && (
        <div className="filter-modal-backdrop" onClick={() => setFilterMenuOpen(false)}>
          <div className="filter-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="filter-modal-header">
              <h2>Sesli Filtreler</h2>
              <button
                className="filter-modal-close"
                onClick={() => setFilterMenuOpen(false)}
                aria-label="Kapat"
              >
                ✕
              </button>
            </div>
            <div className="filter-modal-content">
              <VoiceFilter
                onFilterChange={handleFilterChange}
                currentFilter={filter}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
