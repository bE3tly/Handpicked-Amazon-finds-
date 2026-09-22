import { useEffect, useState } from 'react';
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, query } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import firebaseConfig from "../../firebase-config.js";
import { Product } from '../types';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export function PublicView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'products'));
    return onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
    });
  }, []);

  const categories = ["All", "Home", "Toys", "Electronics", "Kitchen", "Beauty", "Health"];

  const mainFilteredProducts = products.filter(p => 
    (selectedCategory === "All" || p.category === selectedCategory)
  );
  
  const searchResults = products.filter(p => 
    searchQuery.trim() !== "" && (p.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const topPicks = mainFilteredProducts.filter(p => p.topPick);
  const otherProducts = mainFilteredProducts.filter(p => !p.topPick);

  const ProductCard = ({ product }: { product: Product }) => {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        {product.imageUrl && (
          <div className="aspect-square overflow-hidden bg-gray-50">
            <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 h-10">{product.title}</h3>
          <a href={product.affiliateLink} target="_blank" rel="sponsored nofollow noopener" className="block mt-3 w-full p-2.5 bg-[#00a8e1] hover:bg-[#0092c4] text-white text-center font-semibold rounded-lg text-sm transition-colors whitespace-nowrap">View on Amazon</a>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <header className="sticky top-0 z-10 bg-white p-4 border-b flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👜</span>
          <span className="text-xl font-bold tracking-tight">Handpicked Finds</span>
        </div>
        <button className="bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-500 w-32 md:w-48 text-left" onClick={() => setIsSearchOpen(true)}>Search...</button>
      </header>
      
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm p-4 flex items-start justify-center pt-20">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 p-4 border-b">
                    <span className="text-gray-400">🔍</span>
                    <input autoFocus type="text" className="flex-1 outline-none text-base" placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    <button onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                    {searchResults.map(p => (
                        <div key={p.id} className="flex gap-4 p-4 border-b hover:bg-gray-50 transition-colors items-center cursor-pointer" onClick={() => { setIsSearchOpen(false); window.open(p.affiliateLink, '_blank'); }}>
                            <img src={p.imageUrl} className="w-14 h-14 rounded-lg object-cover" />
                            <div><h4 className="font-semibold text-sm text-gray-900">{p.title}</h4><p className="text-xs text-gray-500 mt-0.5">{p.category}</p></div>
                        </div>
                    ))}
                    {searchResults.length === 0 && searchQuery.trim() !== "" && <p className="p-8 text-center text-gray-500">No results found.</p>}
                </div>
            </div>
        </div>
      )}
      
      <p className="text-center text-xs text-gray-500 py-3">As an Amazon Associate, I earn from qualifying purchases.</p>
      
      <div className="flex gap-2 px-4 pb-4 overflow-x-auto scrollbar-hide">
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors shrink-0 ${selectedCategory === cat ? 'bg-[#00a8e1] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <section className="px-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">Top Picks 🔥</h2>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {topPicks.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {otherProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
      
      <footer className="px-4 py-8 bg-gray-100 text-gray-500 text-xs text-center leading-relaxed">
        <p className="font-semibold mb-2">Affiliate Disclosure: As an affiliate, we earn from qualifying purchases. Product prices and availability are subject to change. Any price and availability information displayed on the retailer's website at the time of purchase will apply to the purchase of the product.</p>
        <p>Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates.</p>
      </footer>
    </div>
  );
}
