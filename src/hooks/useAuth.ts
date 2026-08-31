// @ts-nocheck
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, appId } from '../firebase';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [googleAccessToken, setGoogleAccessToken] = useState(null);
  const [globalAuthError, setGlobalAuthError] = useState("");

  const currentUser = user;
  const isSuperAdmin = currentUser?.email?.toLowerCase() === 'ai@ly-tech.ly';

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setGoogleAccessToken(null);
      setUser(null);
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (firebaseUser.email?.toLowerCase() === 'ai@ly-tech.ly') {
          setUser(firebaseUser);
          setIsAuthReady(true);
          setGlobalAuthError("");
        } else {
          try {
            const userDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'system_users', firebaseUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists() && userDocSnap.data().isActive === false) {
              await signOut(auth);
              setUser(null);
              setGlobalAuthError("تم إيقاف حسابك من قبل الإدارة. يرجى التواصل مع المدير.");
            } else {
              setUser(firebaseUser);
              setGlobalAuthError("");
            }
          } catch (e) {
            setUser(firebaseUser);
          }
          setIsAuthReady(true);
        }
      } else {
        setUser(null);
        setIsAuthReady(true);
      }
    });
    return () => unsubscribe();
  }, []);

  return {
    user,
    currentUser,
    isSuperAdmin,
    isAuthReady,
    googleAccessToken,
    setGoogleAccessToken,
    globalAuthError,
    handleLogout,
  };
};

export default useAuth;
