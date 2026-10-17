import { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured, missingEnvVars } from './firebase';
import { AuthContext } from './authContextInstance';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // If Firebase is not configured, loading is immediately false without triggering effect set-state
  const [loading, setLoading] = useState(() => isFirebaseConfigured && Boolean(auth));

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      return;
    }

    // Check redirect result if popup was blocked earlier
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
        }
      })
      .catch((err) => {
        if (err.code === 'auth/unauthorized-domain') {
          console.warn('[Halcyon Auth] Domain not authorized for redirect sign-in.');
        } else if (err.code !== 'auth/popup-closed-by-user') {
          console.warn('[Halcyon Auth] Redirect sign-in notice:', err.message);
        }
      });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      console.warn(
        `[Halcyon Auth] Sign-in is not configured yet. Missing environment variables:\n` +
          missingEnvVars.map((v) => `  - ${v}`).join('\n') +
          `\nPlease configure them in your .env file.`
      );
      return { success: false, error: 'Sign-in is not configured yet.' };
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { success: true, user: result.user };
    } catch (err) {
      // 1. If user closes the popup, do nothing (no error)
      if (
        err.code === 'auth/popup-closed-by-user' ||
        err.code === 'auth/cancelled-popup-request'
      ) {
        return { success: false, error: null };
      }

      // 2. If popup is blocked by the browser, fall back to redirect
      if (err.code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, googleProvider);
          return { success: false, error: null, redirecting: true };
        } catch (redirectErr) {
          return {
            success: false,
            error:
              redirectErr.code === 'auth/unauthorized-domain'
                ? 'This domain is not authorized for sign-in yet.'
                : 'Popup was blocked and redirect failed. Please check browser permissions.',
          };
        }
      }

      // 3. Domain unauthorized
      if (err.code === 'auth/unauthorized-domain') {
        return {
          success: false,
          error: 'This domain is not authorized for sign-in yet.',
        };
      }

      // 4. Network error
      if (err.code === 'auth/network-request-failed') {
        return {
          success: false,
          error: 'Network connection issue. Please check your network and try again.',
        };
      }

      // 5. Default friendly message
      return {
        success: false,
        error: 'Unable to complete sign-in. Please try again.',
      };
    }
  };

  const signOut = async () => {
    if (auth) {
      await firebaseSignOut(auth);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
