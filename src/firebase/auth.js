import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { auth } from "./config";

export const signUp = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
    // Check if user is new by comparing creation time with last sign in time
    // If they're the same, it's a new user
    const metadata = userCredential.user.metadata;
    const isNewUser = metadata.creationTime === metadata.lastSignInTime;
    
    return { 
      user: userCredential.user, 
      error: null, 
      isNewUser: isNewUser 
    };
  } catch (error) {
    return { 
      user: null, 
      error: error.message, 
      isNewUser: false 
    };
  }
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

