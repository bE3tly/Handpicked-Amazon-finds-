import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import firebaseConfig from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const appContainer = document.getElementById('app');

const PREVIEW_PRODUCTS = [
  { title: "Smart Home Hub", category: "Electronics", whyLike: "Centralizes all your smart devices.", affiliateLink: "#", imageUrl: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=400&q=80", isDemo: true, topPick: true, createdAt: new Date() },
  { title: "Professional Blender", category: "Kitchen", whyLike: "Incredible power for daily smoothies.", affiliateLink: "#", imageUrl: "https://images.unsplash.com/photo-1570913149950-59a3599b50e3?auto=format&fit=crop&w=400&q=80", isDemo: true, topPick: true, createdAt: new Date() },
  { title: "Ergonomic Office Chair", category: "Home", whyLike: "Unmatched support for long days.", affiliateLink: "#", imageUrl: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=400&q=80", isDemo: true, topPick: false, createdAt: new Date() },
  { title: "Hydrating Face Serum", category: "Beauty", whyLike: "Keeps skin radiant and hydrated.", affiliateLink: "#", imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80", isDemo: true, topPick: false, createdAt: new Date() },
  { title: "Interactive Toy Robot", category: "Toys", whyLike: "Engaging and educational for kids.", affiliateLink: "#", imageUrl: "https://images.unsplash.com/photo-1596464406878-a5684c5615d7?auto=format&fit=crop&w=400&q=80", isDemo: true, topPick: false, createdAt: new Date() },
  { title: "Vitamin D Supplement", category: "Health", whyLike: "Essential for daily wellness.", affiliateLink: "#", imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80", isDemo: true, topPick: false, createdAt: new Date() },
  { title: "Wireless Speaker", category: "Electronics", whyLike: "Crystal clear sound, portable design.", affiliateLink: "#", imageUrl: "https://images.unsplash.com/photo-1545454675-3531b5722003?auto=format&fit=crop&w=400&q=80", isDemo: true, topPick: true, createdAt: new Date() },
  { title: "Cast Iron Skillet", category: "Kitchen", whyLike: "Perfect for searing and versatility.", affiliateLink: "#", imageUrl: "https://images.unsplash.com/photo-1583258298488-82502b662363?auto=format&fit=crop&w=400&q=80", isDemo: true, topPick: false, createdAt: new Date() },
  { title: "Bamboo Bed Sheets", category: "Home", whyLike: "Incredibly soft and temperature regulating.", affiliateLink: "#", imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80", isDemo: true, topPick: false, createdAt: new Date() },
  { title: "Organic Lip Balm", category: "Beauty", whyLike: "Natural protection for lips.", affiliateLink: "#", imageUrl: "https://images.unsplash.com/photo-1573448685056-6218f0203f44?auto=format&fit=crop&w=400&q=80", isDemo: true, topPick: false, createdAt: new Date() },
  { title: "Wooden Building Blocks", category: "Toys", whyLike: "Classic, durable toy for imagination.", affiliateLink: "#", imageUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=400&q=80", isDemo: true, topPick: false, createdAt: new Date() },
  { title: "Yoga Mat", category: "Health", whyLike: "Excellent grip and cushioning.", affiliateLink: "#", imageUrl: "https://images.unsplash.com/photo-1599447421416-341450edd417?auto=format&fit=crop&w=400&q=80", isDemo: true, topPick: false, createdAt: new Date() }
];

function renderSkeleton() {
  // Skeleton logic or just populate initial grid structures
}

function trackClick(id) {
    if (!id) return;
    // Real implementation requires Firestore update
}
window.trackClick = trackClick;

function renderProductCard(product) {
  const createdAt = product.createdAt.toDate ? product.createdAt.toDate() : product.createdAt;
  const isNew = (new Date() - createdAt) < (7 * 24 * 60 * 60 * 1000);
  let badge = product.isDemo ? 'Preview' : (product.topPick ? 'Top Pick' : (product.editorsChoice ? "Editor's Choice" : (isNew ? 'New' : '')));
  
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.category = product.category;
  card.innerHTML = `
    <div style="position:relative">
        ${badge ? `<span class="card-badge">${badge}</span>` : ''}
        <img src="${product.imageUrl}" class="card-img" alt="${product.title}" loading="lazy" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%23eee%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 font-size=%2240%22>🛍️</text></svg>'">
    </div>
    <h3>${product.title}</h3>
    <a href="${product.affiliateLink}" class="btn" target="_blank" rel="sponsored nofollow noopener" onclick="trackClick('${product.id}')">View on Amazon</a>
  `;
  return card;
}

async function loadProducts() {
  renderSkeleton();
  const allGrid = document.getElementById('all-products-grid');
  const topGrid = document.getElementById('top-picks-grid');

  try {
    const productsCol = collection(db, 'products');
    const q = productsCol;
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
        // Seed demo data if empty
        const { addDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
        for (const p of PREVIEW_PRODUCTS) {
            await addDoc(productsCol, { ...p, published: true, createdAt: new Date() });
        }
        loadProducts(); // Reload after seeding
        return;
    }
    
    snapshot.forEach(doc => {
        const product = doc.data();
        const card = renderProductCard(product);
        if (product.topPick) topGrid.appendChild(card.cloneNode(true));
        else allGrid.appendChild(card.cloneNode(true));
    });
  } catch (error) {
    console.error("Error loading products:", error);
    // Show preview products on error as fallback
    PREVIEW_PRODUCTS.forEach(p => {
        const card = renderProductCard(p);
        if (p.topPick) topGrid.appendChild(card.cloneNode(true));
        else allGrid.appendChild(card.cloneNode(true));
    });
  }
}


loadProducts();

// Add click listeners for filtering
document.querySelectorAll('.category-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
        document.querySelector('.category-chip.active').classList.remove('active');
        e.target.classList.add('active');
        filterProducts(e.target.dataset.category);
    });
});

// Admin Secret Trigger
let tapCount = 0;
let lastTapTime = 0;
document.querySelector('.logo').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const now = Date.now();
    if (now - lastTapTime > 4000) {
        tapCount = 0;
    }
    
    tapCount++;
    lastTapTime = now;
    
    if (tapCount === 6) {
        window.location.href = '/admin.html';
    }
});

function filterProducts(category) {
  const allCards = document.querySelectorAll('.card');
  allCards.forEach(card => {
      const productCategory = card.dataset.category;
      if (category === 'All' || productCategory === category) {
          card.style.display = 'flex';
      } else {
          card.style.display = 'none';
      }
  });
}
