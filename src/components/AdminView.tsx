import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import firebaseConfig from "../../firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export function AdminView() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return (
        <div className="hero">
            <h1>Admin Login</h1>
            <button onClick={() => signInWithPopup(auth, provider)} className="btn">Sign in with Google</button>
        </div>
    );
  }

  if (user.email !== "frankgeorge2u@gmail.com") {
    signOut(auth);
    return (
        <div className="hero">
            <h1>Access denied</h1>
            <p>You do not have permission to access this area.</p>
            <button onClick={() => location.reload()} className="btn">Back</button>
        </div>
    );
  }

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div>
        <header><h1>Dashboard</h1><button onClick={() => signOut(auth)} className="btn">Logout</button></header>
        {/* Rest of dashboard content */}
      </div>
    </>
  );
}
