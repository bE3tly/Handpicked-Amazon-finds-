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
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const handleSignIn = async () => {
    setErrorMsg("");
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("SignInWithPopup success, email:", result.user.email);
    } catch (error: any) {
      console.error("Popup sign-in error:", error);
      if (error.code === 'auth/popup-blocked') {
        setErrorMsg("Sign-in popup was blocked. Please allow popups for this site and try again.");
      } else {
        setErrorMsg(`Error: ${error.code} - ${error.message}`);
      }
    }
  };

  if (loading) return <div>Checking sign-in...</div>;

  if (!user) {
    return (
        <div className="hero">
            <h1>Admin Login</h1>
            <button onClick={handleSignIn} className="btn">Sign in with Google</button>
            {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
        </div>
    );
  }

  if (user.email !== "frank2006george@gmail.com") {
    signOut(auth);
    return (
        <div className="hero">
            <h1>Access denied</h1>
            <p>Signed in as: {user.email}</p>
            <button onClick={() => location.reload()} className="btn">Back to Login</button>
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
