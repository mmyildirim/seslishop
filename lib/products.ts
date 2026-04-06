export type Product = {
  id: number;
  name: string;
  price: number;
  color: string;
  colors: string[]; // renk varyantları
  category: string; // mont, kazak, pantolon, elbise, ayakkabı, çanta, gömlek, tişört, etek, ceket
  gender: string; // kadın, erkek, unisex
  size: string[];
  brand: string;
  image: string;
  rating: number;
  inStock: boolean;
  tags: string[];
};

// Unsplash product-style images by category
const IMAGES = {
  mont: [
    "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&q=80",
    "https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=400&q=80",
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
    "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&q=80",
  ],
  kazak: [
    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80",
    "https://images.unsplash.com/photo-1522211988038-6fcbb8c12c7e?w=400&q=80",
  ],
  pantolon: [
    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80",
    "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80",
    "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=400&q=80",
  ],
  elbise: [
    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80",
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80",
  ],
  ayakkabı: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80",
  ],
  çanta: [
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80",
  ],
  gömlek: [
    "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&q=80",
    "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=400&q=80",
  ],
  tişört: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80",
  ],
  etek: [
    "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&q=80",
    "https://images.unsplash.com/photo-1434510423563-c5e1f45d8b9c?w=400&q=80",
  ],
  ceket: [
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80",
    "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&q=80",
  ],
};

function img(category: string, idx = 0) {
  const arr = IMAGES[category as keyof typeof IMAGES] ?? IMAGES.tişört;
  return arr[idx % arr.length];
}

export const products: Product[] = [
  // MONTLAR
  { id: 1, name: "Kırmızı Kışlık Mont", price: 129, color: "kırmızı", colors: ["kırmızı", "siyah"], category: "mont", gender: "kadın", size: ["S","M","L","XL"], brand: "ModaStore", image: img("mont",0), rating: 4.5, inStock: true, tags: ["kış","sıcak","şık"] },
  { id: 2, name: "Siyah Kapüşonlu Mont", price: 199, color: "siyah", colors: ["siyah"], category: "mont", gender: "erkek", size: ["M","L","XL","XXL"], brand: "UrbanWear", image: img("mont",1), rating: 4.7, inStock: true, tags: ["kapüşon","kış","spor"] },
  { id: 3, name: "Lacivert Şişme Mont", price: 89, color: "lacivert", colors: ["lacivert","gri"], category: "mont", gender: "unisex", size: ["XS","S","M","L"], brand: "WinterLine", image: img("mont",2), rating: 4.2, inStock: true, tags: ["şişme","hafif","kış"] },
  { id: 4, name: "Beyaz Kaban", price: 249, color: "beyaz", colors: ["beyaz","krem"], category: "mont", gender: "kadın", size: ["S","M","L"], brand: "ElegantModa", image: img("mont",3), rating: 4.8, inStock: false, tags: ["kaban","şık","uzun"] },
  { id: 5, name: "Haki Parka Mont", price: 175, color: "haki", colors: ["haki","kahve"], category: "mont", gender: "erkek", size: ["M","L","XL"], brand: "OutdoorTR", image: img("mont",0), rating: 4.3, inStock: true, tags: ["parka","outdoor","su geçirmez"] },
  { id: 6, name: "Pembe Kısa Mont", price: 99, color: "pembe", colors: ["pembe","lila"], category: "mont", gender: "kadın", size: ["XS","S","M"], brand: "ModaStore", image: img("mont",1), rating: 4.1, inStock: true, tags: ["kısa","sevimli","genç"] },
  { id: 7, name: "Gri Spor Mont", price: 145, color: "gri", colors: ["gri","siyah","lacivert"], category: "mont", gender: "unisex", size: ["S","M","L","XL"], brand: "SportLine", image: img("mont",2), rating: 4.4, inStock: true, tags: ["spor","rahat","günlük"] },
  { id: 8, name: "Kırmızı Çocuk Montu", price: 79, color: "kırmızı", colors: ["kırmızı","turuncu"], category: "mont", gender: "unisex", size: ["3-4Y","5-6Y","7-8Y"], brand: "KidsModa", image: img("mont",3), rating: 4.6, inStock: true, tags: ["çocuk","kış","renkli"] },

  // KAZAKLAR
  { id: 9, name: "Krem Oversize Kazak", price: 69, color: "krem", colors: ["krem","bej","gri"], category: "kazak", gender: "kadın", size: ["S","M","L","XL"], brand: "SoftWear", image: img("kazak",0), rating: 4.6, inStock: true, tags: ["oversize","rahat","yumuşak"] },
  { id: 10, name: "Lacivert Balıkçı Kazak", price: 89, color: "lacivert", colors: ["lacivert","siyah","kırmızı"], category: "kazak", gender: "erkek", size: ["M","L","XL"], brand: "ClassicWear", image: img("kazak",1), rating: 4.4, inStock: true, tags: ["balıkçı","klasik","kış"] },
  { id: 11, name: "Gri Triko Kazak", price: 55, color: "gri", colors: ["gri","siyah","krem"], category: "kazak", gender: "unisex", size: ["XS","S","M","L","XL"], brand: "BasicLine", image: img("kazak",2), rating: 4.2, inStock: true, tags: ["triko","basic","günlük"] },
  { id: 12, name: "Bordo Boğazlı Kazak", price: 75, color: "bordo", colors: ["bordo","yeşil"], category: "kazak", gender: "kadın", size: ["S","M","L"], brand: "WarmStyle", image: img("kazak",0), rating: 4.5, inStock: true, tags: ["boğazlı","şık","sonbahar"] },
  { id: 13, name: "Siyah Hırka", price: 95, color: "siyah", colors: ["siyah","haki","kahve"], category: "kazak", gender: "unisex", size: ["S","M","L","XL"], brand: "CasualBrand", image: img("kazak",1), rating: 4.3, inStock: false, tags: ["hırka","rahat","çok yönlü"] },

  // PANTOLONLAR
  { id: 14, name: "Siyah Skinny Jean", price: 119, color: "siyah", colors: ["siyah","lacivert","gri"], category: "pantolon", gender: "kadın", size: ["25","26","27","28","29","30"], brand: "DenimCo", image: img("pantolon",0), rating: 4.7, inStock: true, tags: ["jean","skinny","günlük"] },
  { id: 15, name: "Lacivert Klasik Pantolon", price: 149, color: "lacivert", colors: ["lacivert","gri","siyah"], category: "pantolon", gender: "erkek", size: ["30","32","34","36"], brand: "OfficeLine", image: img("pantolon",1), rating: 4.5, inStock: true, tags: ["klasik","iş","resmi"] },
  { id: 16, name: "Haki Kargo Pantolon", price: 89, color: "haki", colors: ["haki","siyah","gri"], category: "pantolon", gender: "erkek", size: ["M","L","XL"], brand: "StreetWear", image: img("pantolon",2), rating: 4.3, inStock: true, tags: ["kargo","casual","rahat"] },
  { id: 17, name: "Beyaz Wide Leg Pantolon", price: 135, color: "beyaz", colors: ["beyaz","krem","siyah"], category: "pantolon", gender: "kadın", size: ["XS","S","M","L"], brand: "TrendModa", image: img("pantolon",0), rating: 4.4, inStock: true, tags: ["wide leg","trend","yaz"] },
  { id: 18, name: "Gri Jogger", price: 65, color: "gri", colors: ["gri","siyah","lacivert"], category: "pantolon", gender: "unisex", size: ["S","M","L","XL","XXL"], brand: "SportLine", image: img("pantolon",1), rating: 4.1, inStock: true, tags: ["jogger","spor","rahat"] },

  // ELBİSELER
  { id: 19, name: "Kırmızı Midi Elbise", price: 159, color: "kırmızı", colors: ["kırmızı","siyah","bordo"], category: "elbise", gender: "kadın", size: ["XS","S","M","L"], brand: "GlamStyle", image: img("elbise",0), rating: 4.8, inStock: true, tags: ["midi","şık","gece"] },
  { id: 20, name: "Beyaz Yazlık Elbise", price: 99, color: "beyaz", colors: ["beyaz","krem","açık mavi"], category: "elbise", gender: "kadın", size: ["S","M","L","XL"], brand: "SummerVibes", image: img("elbise",1), rating: 4.5, inStock: true, tags: ["yazlık","sade","günlük"] },
  { id: 21, name: "Siyah Uzun Elbise", price: 189, color: "siyah", colors: ["siyah"], category: "elbise", gender: "kadın", size: ["XS","S","M","L","XL"], brand: "ElegantModa", image: img("elbise",2), rating: 4.7, inStock: true, tags: ["uzun","abiye","özel gün"] },
  { id: 22, name: "Çiçekli Mini Elbise", price: 79, color: "pembe", colors: ["pembe","sarı","mavi"], category: "elbise", gender: "kadın", size: ["XS","S","M"], brand: "FloralStyle", image: img("elbise",0), rating: 4.3, inStock: false, tags: ["çiçekli","mini","yaz"] },
  { id: 23, name: "Yeşil Saten Elbise", price: 225, color: "yeşil", colors: ["yeşil","bordo","lacivert"], category: "elbise", gender: "kadın", size: ["S","M","L"], brand: "LuxuryLine", image: img("elbise",1), rating: 4.9, inStock: true, tags: ["saten","lüks","düğün"] },

  // AYAKKABILAR
  { id: 24, name: "Beyaz Spor Ayakkabı", price: 199, color: "beyaz", colors: ["beyaz","siyah","gri"], category: "ayakkabı", gender: "unisex", size: ["36","37","38","39","40","41","42","43"], brand: "SportStep", image: img("ayakkabı",0), rating: 4.6, inStock: true, tags: ["spor","günlük","rahat"] },
  { id: 25, name: "Siyah Deri Bot", price: 349, color: "siyah", colors: ["siyah","kahve"], category: "ayakkabı", gender: "kadın", size: ["36","37","38","39","40"], brand: "LeatherCraft", image: img("ayakkabı",1), rating: 4.8, inStock: true, tags: ["deri","bot","klasik"] },
  { id: 26, name: "Kahve Oxford Ayakkabı", price: 279, color: "kahve", colors: ["kahve","siyah"], category: "ayakkabı", gender: "erkek", size: ["40","41","42","43","44","45"], brand: "ClassicShoe", image: img("ayakkabı",2), rating: 4.5, inStock: true, tags: ["oxford","klasik","iş"] },
  { id: 27, name: "Kırmızı Topuklu", price: 165, color: "kırmızı", colors: ["kırmızı","siyah","nude"], category: "ayakkabı", gender: "kadın", size: ["36","37","38","39","40"], brand: "HeelStyle", image: img("ayakkabı",0), rating: 4.4, inStock: true, tags: ["topuklu","şık","gece"] },
  { id: 28, name: "Gri Sneaker", price: 149, color: "gri", colors: ["gri","beyaz","siyah"], category: "ayakkabı", gender: "unisex", size: ["36","37","38","39","40","41","42","43","44"], brand: "UrbanStep", image: img("ayakkabı",1), rating: 4.3, inStock: false, tags: ["sneaker","casual","spor"] },

  // ÇANTALAR
  { id: 29, name: "Siyah Deri Çanta", price: 299, color: "siyah", colors: ["siyah","bordo","kahve"], category: "çanta", gender: "kadın", size: ["tek boy"], brand: "BagHouse", image: img("çanta",0), rating: 4.7, inStock: true, tags: ["deri","şık","günlük"] },
  { id: 30, name: "Kahve Omuz Çantası", price: 189, color: "kahve", colors: ["kahve","bej","krem"], category: "çanta", gender: "kadın", size: ["tek boy"], brand: "StyleBag", image: img("çanta",1), rating: 4.5, inStock: true, tags: ["omuz","rahat","günlük"] },
  { id: 31, name: "Lacivert Sırt Çantası", price: 129, color: "lacivert", colors: ["lacivert","siyah","gri"], category: "çanta", gender: "unisex", size: ["tek boy"], brand: "BackpackCo", image: img("çanta",0), rating: 4.4, inStock: true, tags: ["sırt çantası","pratik","okul"] },
  { id: 32, name: "Bej Mini Çanta", price: 99, color: "bej", colors: ["bej","krem","pembe"], category: "çanta", gender: "kadın", size: ["tek boy"], brand: "MiniBag", image: img("çanta",1), rating: 4.2, inStock: true, tags: ["mini","sevimli","çapraz"] },

  // GÖMLEKler
  { id: 33, name: "Beyaz Klasik Gömlek", price: 89, color: "beyaz", colors: ["beyaz","açık mavi","pembe"], category: "gömlek", gender: "erkek", size: ["S","M","L","XL","XXL"], brand: "OfficeLine", image: img("gömlek",0), rating: 4.5, inStock: true, tags: ["klasik","resmi","iş"] },
  { id: 34, name: "Çizgili Flannel Gömlek", price: 75, color: "kırmızı", colors: ["kırmızı","mavi","yeşil"], category: "gömlek", gender: "unisex", size: ["XS","S","M","L","XL"], brand: "CasualBrand", image: img("gömlek",1), rating: 4.3, inStock: true, tags: ["flannel","çizgili","casual"] },
  { id: 35, name: "Siyah Oversize Gömlek", price: 95, color: "siyah", colors: ["siyah","beyaz","gri"], category: "gömlek", gender: "kadın", size: ["S","M","L","XL"], brand: "TrendModa", image: img("gömlek",0), rating: 4.4, inStock: true, tags: ["oversize","trend","günlük"] },
  { id: 36, name: "Lacivert Oxford Gömlek", price: 110, color: "lacivert", colors: ["lacivert","beyaz"], category: "gömlek", gender: "erkek", size: ["M","L","XL","XXL"], brand: "ClassicWear", image: img("gömlek",1), rating: 4.6, inStock: false, tags: ["oxford","şık","resmi"] },

  // TİŞÖRTLER
  { id: 37, name: "Siyah Basic Tişört", price: 39, color: "siyah", colors: ["siyah","beyaz","gri","lacivert"], category: "tişört", gender: "unisex", size: ["XS","S","M","L","XL","XXL"], brand: "BasicLine", image: img("tişört",0), rating: 4.2, inStock: true, tags: ["basic","günlük","rahat"] },
  { id: 38, name: "Beyaz Baskılı Tişört", price: 49, color: "beyaz", colors: ["beyaz","siyah"], category: "tişört", gender: "unisex", size: ["S","M","L","XL"], brand: "PrintTee", image: img("tişört",1), rating: 4.1, inStock: true, tags: ["baskılı","casual","genç"] },
  { id: 39, name: "Kırmızı Polo Tişört", price: 65, color: "kırmızı", colors: ["kırmızı","lacivert","beyaz","yeşil"], category: "tişört", gender: "erkek", size: ["S","M","L","XL","XXL"], brand: "PoloStyle", image: img("tişört",0), rating: 4.4, inStock: true, tags: ["polo","smart casual","yaz"] },
  { id: 40, name: "Pembe Crop Tişört", price: 35, color: "pembe", colors: ["pembe","lila","sarı"], category: "tişört", gender: "kadın", size: ["XS","S","M"], brand: "TrendModa", image: img("tişört",1), rating: 4.0, inStock: true, tags: ["crop","genç","yaz"] },
  { id: 41, name: "Gri Melanj Tişört", price: 45, color: "gri", colors: ["gri","beyaz","siyah"], category: "tişört", gender: "unisex", size: ["S","M","L","XL","XXL"], brand: "BasicLine", image: img("tişört",0), rating: 4.3, inStock: true, tags: ["melanj","klasik","günlük"] },

  // ETEKLER
  { id: 42, name: "Siyah Mini Etek", price: 69, color: "siyah", colors: ["siyah","kırmızı","bordo"], category: "etek", gender: "kadın", size: ["XS","S","M","L"], brand: "GlamStyle", image: img("etek",0), rating: 4.3, inStock: true, tags: ["mini","şık","gece"] },
  { id: 43, name: "Çiçekli Midi Etek", price: 89, color: "pembe", colors: ["pembe","sarı","beyaz"], category: "etek", gender: "kadın", size: ["XS","S","M","L","XL"], brand: "FloralStyle", image: img("etek",1), rating: 4.5, inStock: true, tags: ["midi","çiçekli","yaz"] },
  { id: 44, name: "Kahve Deri Etek", price: 139, color: "kahve", colors: ["kahve","siyah","krem"], category: "etek", gender: "kadın", size: ["XS","S","M","L"], brand: "LeatherLine", image: img("etek",0), rating: 4.4, inStock: false, tags: ["deri","şık","modern"] },
  { id: 45, name: "Bej Maxi Etek", price: 115, color: "bej", colors: ["bej","beyaz","kahve"], category: "etek", gender: "kadın", size: ["S","M","L","XL"], brand: "BohoStyle", image: img("etek",1), rating: 4.6, inStock: true, tags: ["maxi","boho","rahat"] },

  // CEKETler
  { id: 46, name: "Siyah Blazer Ceket", price: 249, color: "siyah", colors: ["siyah","bej","lacivert"], category: "ceket", gender: "kadın", size: ["XS","S","M","L","XL"], brand: "OfficeLine", image: img("ceket",0), rating: 4.7, inStock: true, tags: ["blazer","resmi","şık"] },
  { id: 47, name: "Lacivert Erkek Ceket", price: 299, color: "lacivert", colors: ["lacivert","gri","siyah"], category: "ceket", gender: "erkek", size: ["M","L","XL","XXL"], brand: "ClassicWear", image: img("ceket",1), rating: 4.8, inStock: true, tags: ["klasik","resmi","iş"] },
  { id: 48, name: "Bej Oversize Ceket", price: 185, color: "bej", colors: ["bej","krem","haki"], category: "ceket", gender: "kadın", size: ["S","M","L"], brand: "TrendModa", image: img("ceket",0), rating: 4.5, inStock: true, tags: ["oversize","trend","sonbahar"] },
  { id: 49, name: "Gri Takım Ceketi", price: 320, color: "gri", colors: ["gri","lacivert","siyah"], category: "ceket", gender: "erkek", size: ["M","L","XL","XXL"], brand: "SuitLine", image: img("ceket",1), rating: 4.9, inStock: true, tags: ["takım","resmi","özel gün"] },

  // EK ÜRÜNLER (ucuz segment)
  { id: 50, name: "Sarı Tişört", price: 29, color: "sarı", colors: ["sarı","turuncu","yeşil"], category: "tişört", gender: "unisex", size: ["S","M","L","XL"], brand: "ColorPop", image: img("tişört",0), rating: 4.0, inStock: true, tags: ["renkli","yaz","neşeli"] },
  { id: 51, name: "Mavi Denim Ceket", price: 139, color: "mavi", colors: ["mavi","açık mavi","siyah"], category: "ceket", gender: "unisex", size: ["S","M","L","XL"], brand: "DenimCo", image: img("ceket",0), rating: 4.4, inStock: true, tags: ["denim","casual","günlük"] },
  { id: 52, name: "Turuncu Spor Ayakkabı", price: 175, color: "turuncu", colors: ["turuncu","beyaz"], category: "ayakkabı", gender: "unisex", size: ["38","39","40","41","42","43"], brand: "SportStep", image: img("ayakkabı",0), rating: 4.2, inStock: true, tags: ["spor","renkli","koşu"] },
  { id: 53, name: "Mor Sweatshirt", price: 85, color: "mor", colors: ["mor","lila","siyah"], category: "kazak", gender: "unisex", size: ["S","M","L","XL","XXL"], brand: "CasualBrand", image: img("kazak",0), rating: 4.1, inStock: true, tags: ["sweatshirt","rahat","günlük"] },
  { id: 54, name: "Yeşil Kargo Pantolon", price: 99, color: "yeşil", colors: ["yeşil","haki","siyah"], category: "pantolon", gender: "erkek", size: ["M","L","XL"], brand: "StreetWear", image: img("pantolon",0), rating: 4.2, inStock: true, tags: ["kargo","street","rahat"] },
  { id: 55, name: "Krem Blazer", price: 210, color: "krem", colors: ["krem","bej","beyaz"], category: "ceket", gender: "kadın", size: ["XS","S","M","L"], brand: "ElegantModa", image: img("ceket",1), rating: 4.6, inStock: true, tags: ["blazer","şık","ofis"] },
  { id: 56, name: "Kırmızı Kazak", price: 72, color: "kırmızı", colors: ["kırmızı","bordo"], category: "kazak", gender: "kadın", size: ["S","M","L"], brand: "WarmStyle", image: img("kazak",2), rating: 4.3, inStock: true, tags: ["kış","sıcak","renkli"] },
  { id: 57, name: "Gri Bot", price: 265, color: "gri", colors: ["gri","siyah"], category: "ayakkabı", gender: "kadın", size: ["36","37","38","39","40"], brand: "BootStyle", image: img("ayakkabı",2), rating: 4.5, inStock: true, tags: ["bot","kış","şık"] },
  { id: 58, name: "Lacivert Anorak Mont", price: 145, color: "lacivert", colors: ["lacivert","siyah","kırmızı"], category: "mont", gender: "erkek", size: ["M","L","XL"], brand: "OutdoorTR", image: img("mont",0), rating: 4.4, inStock: true, tags: ["anorak","spor","outdoor"] },
  { id: 59, name: "Beyaz Blazer", price: 195, color: "beyaz", colors: ["beyaz","krem"], category: "ceket", gender: "kadın", size: ["XS","S","M","L"], brand: "TrendModa", image: img("ceket",0), rating: 4.7, inStock: true, tags: ["beyaz","şık","yaz"] },
  { id: 60, name: "Siyah Kısa Etek", price: 55, color: "siyah", colors: ["siyah","gri"], category: "etek", gender: "kadın", size: ["XS","S","M","L"], brand: "BasicLine", image: img("etek",0), rating: 4.1, inStock: true, tags: ["kısa","basic","günlük"] },
];
