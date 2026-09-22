import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import firebaseConfig from "../../firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export function AdminView() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // 1. Handle redirect result
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("Result email:", result.user.email);
        }
      })
      .catch((error) => {
        console.error("Redirect error:", error);
      });

    // 2. Auth listener
    return onAuthStateChanged(auth, (u) => {
      if (u) {
        console.log("AuthStateChanged email:", u.email);
      }
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Checking sign-in...</div>;

  if (!user) {
    return (
        <div className="hero">
            <h1>Admin Login</h1>
            <button onClick={() => signInWithRedirect(auth, provider)} className="btn">Sign in with Google</button>
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
