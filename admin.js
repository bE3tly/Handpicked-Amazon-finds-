import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import firebaseConfig from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const adminApp = document.getElementById('admin-app');

function renderLogin() {
  adminApp.innerHTML = '<div class="hero"><h1>Admin Login</h1><button id="login-btn" class="btn">Sign in with Google</button></div>';
  document.getElementById('login-btn').addEventListener('click', () => {
    signInWithPopup(auth, provider);
  });
}

async function renderDashboard(user) {
  const productsCol = collection(db, 'products');
  const snapshot = await getDocs(productsCol);
  let total = 0, published = 0, topClicked = null;
  let hasDemo = false;

  snapshot.forEach(doc => {
    const p = doc.data();
    total++;
    if (p.published) published++;
    if (p.isDemo) hasDemo = true;
    if (!topClicked || p.clicks > topClicked.clicks) topClicked = { ...p, id: doc.id };
  });

  adminApp.innerHTML = `
    <header><h1>Dashboard</h1><button id="logout-btn" class="btn">Logout</button></header>
    ${hasDemo ? '<div class="card" style="background:#fef2f2; border:1px solid #fecaca; margin-bottom:1rem;">You have preview products. Delete them once your real products are added. <button id="delete-demo" class="btn">Delete all preview products</button></div>' : ''}
    <div class="stats">
        <div class="card"><h3>Total</h3><p>${total}</p></div>
        <div class="card"><h3>Published</h3><p>${published}</p></div>
        <div class="card"><h3>Top Clicked</h3><p>${topClicked?.title || 'None'}</p></div>
    </div>
    <div class="card" style="margin-top:2rem;">
        <h3>Add Product</h3>
        <input type="text" id="title" placeholder="Title">
        <input type="text" id="category" placeholder="Category">
        <input type="text" id="whyLike" placeholder="Why Like">
        <input type="text" id="affiliateLink" placeholder="Affiliate Link">
        <input type="text" id="imageUrl" placeholder="Image URL (paste snippet/<img> tag here)">
        <button id="add-btn" class="btn">Add Product</button>
    </div>
  `;
  
  document.getElementById('imageUrl').addEventListener('blur', (e) => {
      const val = e.target.value;
      if (val.includes('<img')) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(val, 'text/html');
          const img = doc.querySelector('img');
          if (img) e.target.value = img.src;
      }
  });

  document.getElementById('add-btn').addEventListener('click', async () => {
      const p = {
          title: document.getElementById('title').value,
          category: document.getElementById('category').value,
          whyLike: document.getElementById('whyLike').value,
          affiliateLink: document.getElementById('affiliateLink').value,
          imageUrl: document.getElementById('imageUrl').value,
          createdAt: new Date(),
          published: true
      };
      const { addDoc } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js");
      await addDoc(productsCol, p);
      renderDashboard(user);
  });
  
  document.getElementById('delete-demo')?.addEventListener('click', async () => {
      if(confirm('Delete all preview products?')) {
          const q = query(productsCol, where('isDemo', '==', true));
          const demoSnapshot = await getDocs(q);
          for(const d of demoSnapshot.docs) await deleteDoc(doc(db, 'products', d.id));
          renderDashboard(user);
      }
  });

  document.getElementById('logout-btn').addEventListener('click', () => auth.signOut());
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    if (user.email === "frankgeorge2u@gmail.com") {
        renderDashboard(user);
    } else {
        auth.signOut();
        adminApp.innerHTML = '<div class="hero"><h1>Access denied</h1><p>You do not have permission to access this area.</p><button onclick="location.reload()" class="btn">Back</button></div>';
    }
  } else {
    renderLogin();
  }
});
