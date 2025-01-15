// store/authStore.ts
import { create } from 'zustand';
import { User } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  handleGoogleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
  initializeAuth: () => () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  setLoading: (loading) => set({ loading }),
  handleGoogleLogin: async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      set({ user: result.user });
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  },
  handleLogout: async () => {
    try {
      await signOut(auth);
      set({ user: null });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  },
  initializeAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        set({ user, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    });

    // Return the unsubscribe function for cleanup
    return unsubscribe;
  },
}));

export default useAuthStore;