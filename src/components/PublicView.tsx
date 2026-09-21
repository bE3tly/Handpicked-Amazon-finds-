import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import firebaseConfig from "../../firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export function PublicView() {
  const navigate = useNavigate();

  useEffect(() => {
    // Ported trigger logic
    let tapCount = 0;
    let lastTapTime = 0;
    const logo = document.querySelector('.logo');
    if (!logo) return;

    const handler = (e: any) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const now = Date.now();
        if (now - lastTapTime > 4000) tapCount = 0;
        tapCount++;
        lastTapTime = now;
        if (tapCount === 6) navigate('/admin');
    };
    logo.addEventListener('click', handler);
    return () => logo.removeEventListener('click', handler);
  }, [navigate]);

  useEffect(() => {
      // Ported product loading logic
      async function loadProducts() {
        const allGrid = document.getElementById('all-products-grid');
        const topGrid = document.getElementById('top-picks-grid');
        if(!allGrid || !topGrid) return;
        
        try {
            const productsCol = collection(db, 'products');
            const snapshot = await getDocs(productsCol);
            
            snapshot.forEach(doc => {
                const product = doc.data();
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `<h3>${product.title}</h3><a href="${product.affiliateLink}" class="btn" target="_blank">View</a>`;
                if (product.topPick) topGrid.appendChild(card);
                else allGrid.appendChild(card);
            });
        } catch(e) { console.error(e); }
      }
      loadProducts();
  }, []);

  return (
    <>
      <header>
        <div className="logo">
          <span className="logo-icon">👜</span>
          <span className="logo-text">Handpicked Finds</span>
        </div>
        <input type="text" className="search-bar" placeholder="Search products..." />
      </header>
      <p className="disclosure-header">As an Amazon Associate, I earn from qualifying purchases.</p>
      
      <div id="categories" className="category-chips">
        <span className="category-chip active" data-category="All">All</span>
        <span className="category-chip" data-category="Home">Home</span>
        <span className="category-chip" data-category="Kitchen">Kitchen</span>
        <span className="category-chip" data-category="Electronics">Electronics</span>
        <span className="category-chip" data-category="Beauty">Beauty</span>
        <span className="category-chip" data-category="Toys">Toys</span>
        <span className="category-chip" data-category="Health">Health</span>
      </div>

      <div className="trust-strip">Hand-picked · Honestly reviewed · Updated weekly</div>
      
      <section id="top-picks">
        <h2>Top Picks</h2>
        <div id="top-picks-grid" className="products-grid"></div>
      </section>
      
      <section id="all-products">
        <h2>All Finds</h2>
        <div id="all-products-grid" className="products-grid"></div>
      </section>

      <section className="about-section">
        <h2>How we choose products</h2>
        <p>We research thousands of items, test for real-world utility, and curate only the best for you.</p>
        <a href="#">About us</a>
      </section>

      <footer className="footer">
        <p className="footer-disclosure">Affiliate Disclosure: As an Amazon Associate I earn from qualifying purchases.</p>
      </footer>
    </>
  );
}
