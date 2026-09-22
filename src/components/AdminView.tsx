import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import firebaseConfig from "../../firebase-config.js";
import { Dashboard } from './Dashboard';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function AdminView() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Sign-in error:", error);
      setErrorMsg(`Error ${error.code}: ${error.message}`);
    }
  };

  if (loading) return <div>Checking sign-in...</div>;

  if (!user) {
    return (
        <div className="hero">
            <h1>Admin Login</h1>
            <form onSubmit={handleSignIn} className="flex flex-col gap-4">
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="p-2 border" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="p-2 border" />
                <button type="submit" className="btn">Sign In</button>
            </form>
            {errorMsg && <p style={{ color: 'red' }} className="mt-4">{errorMsg}</p>}
        </div>
    );
  }

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div>
        <header className="flex justify-between p-4 border-b">
            <h1>Dashboard</h1>
            <button onClick={() => signOut(auth)} className="btn">Logout</button>
        </header>
        <Dashboard />
      </div>
    </>
  );
}
