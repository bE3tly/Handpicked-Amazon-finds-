import { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, query, onSnapshot, serverTimestamp, doc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { Product } from '../types';
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import firebaseConfig from "../../firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Product>({
    title: '', affiliateLink: '', category: 'Home', whyLike: '', imageUrl: '', asin: '', topPick: false, editorsChoice: false, published: true, clicks: 0, isDemo: false, createdAt: null
  });

  useEffect(() => {
    const q = query(collection(db, 'products'));
    return onSnapshot(q, (snapshot) => {
        const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(prods);
    });
  }, []);

  const updateFormData = (field: keyof Product, value: any) => {
    let newFormData = { ...formData, [field]: value };
    if (field === 'affiliateLink') {
        const asinMatch = value.match(/\/dp\/([A-Z0-9]{10})/);
        if (asinMatch) newFormData.asin = asinMatch[1];
    }
    if (field === 'imageUrl') {
        const imgMatch = value.match(/src=["']([^"']+)["']/);
        if (imgMatch) newFormData.imageUrl = imgMatch[1];
    }
    setFormData(newFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        if (editingProduct) {
            await updateDoc(doc(db, 'products', editingProduct.id!), { ...formData });
            alert("Updated successfully");
        } else {
            await addDoc(collection(db, 'products'), { ...formData, createdAt: serverTimestamp() });
            alert("Added successfully");
        }
        setFormData({ title: '', affiliateLink: '', category: 'Home', whyLike: '', imageUrl: '', asin: '', topPick: false, editorsChoice: false, published: true, clicks: 0, isDemo: false, createdAt: null });
        setEditingProduct(null);
    } catch(e) { console.error(e); alert("Error saving product"); }
  };

  const deleteProduct = async (id: string) => {
    if(confirm("Confirm delete?")) {
        await deleteDoc(doc(db, 'products', id));
        alert("Deleted");
    }
  };

  const deleteDemoProducts = async () => {
    if(confirm("Confirm delete all demo products?")) {
        products.filter(p => p.isDemo).forEach(async p => await deleteDoc(doc(db, 'products', p.id!)));
        alert("Deleted demo products");
    }
  };

  const filtered = products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
  const hasDemo = products.some(p => p.isDemo);

  return (
    <div className="p-4">
        {hasDemo && (
            <div className="bg-yellow-100 p-4 mb-4 rounded">
                You have preview products. Delete them once your real products are added.
                <button onClick={deleteDemoProducts} className="bg-red-500 text-white p-2 rounded ml-2">Delete all preview products</button>
            </div>
        )}
        
        <form onSubmit={handleSubmit} className="border p-4 mb-4 rounded">
            <h2 className="text-xl mb-2">{editingProduct ? 'Edit' : 'Add'} Product</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="p-2 border" placeholder="Affiliate link (required)" value={formData.affiliateLink} onChange={e => updateFormData('affiliateLink', e.target.value)} required />
                <input className="p-2 border" placeholder="Title" value={formData.title} onChange={e => updateFormData('title', e.target.value)} />
                <select className="p-2 border" value={formData.category} onChange={e => updateFormData('category', e.target.value)}>
                    {['Home', 'Kitchen', 'Electronics', 'Beauty', 'Toys', 'Health'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input className="p-2 border" placeholder="Why we picked it" value={formData.whyLike} onChange={e => updateFormData('whyLike', e.target.value)} />
                <input className="p-2 border" placeholder="Image URL / <img> snippet" value={formData.imageUrl} onChange={e => updateFormData('imageUrl', e.target.value)} />
                <div className="flex gap-4">
                    <label><input type="checkbox" checked={formData.topPick} onChange={e => updateFormData('topPick', e.target.checked)} /> Top Pick</label>
                    <label><input type="checkbox" checked={formData.editorsChoice} onChange={e => updateFormData('editorsChoice', e.target.checked)} /> Editor's Choice</label>
                    <label><input type="checkbox" checked={formData.published} onChange={e => updateFormData('published', e.target.checked)} /> Published</label>
                </div>
            </div>
            {formData.imageUrl && <div className="mt-2 border p-2"><h4 className="font-bold">Card Preview</h4><img src={formData.imageUrl} alt="preview" className="w-32 h-32 object-cover" /><h3>{formData.title}</h3></div>}
            <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4">{editingProduct ? 'Update' : 'Add Product'}</button>
        </form>

        <input className="w-full p-2 border mb-4" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        
        {filtered.map(p => (
            <div key={p.id} className="border p-4 mb-2 flex items-center justify-between">
                <div>
                    <h3 className="font-bold">{p.title}</h3>
                    <p>{p.category} | Clicks: {p.clicks}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => { setEditingProduct(p); setFormData(p); }} className="p-1 bg-gray-200">Edit</button>
                    <button onClick={() => deleteProduct(p.id!)} className="p-1 bg-red-200">Delete</button>
                    <button onClick={() => updateDoc(doc(db, 'products', p.id!), { published: !p.published })} className="p-1 bg-green-200">{p.published ? 'Unpublish' : 'Publish'}</button>
                    <button onClick={() => updateDoc(doc(db, 'products', p.id!), { topPick: !p.topPick })} className="p-1 bg-yellow-200">{p.topPick ? 'Remove Top' : 'Set Top'}</button>
                </div>
            </div>
        ))}
    </div>
  );
}
