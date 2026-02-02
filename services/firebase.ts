
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, onValue, update } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBU7dBLWNCaTQQdxl0vCKNFRkS8sDC2o6I",
  authDomain: "ep-stem-academy.firebaseapp.com",
  databaseURL: "https://ep-stem-academy-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ep-stem-academy",
  storageBucket: "ep-stem-academy.firebasestorage.app",
  messagingSenderId: "974275103816",
  appId: "1:974275103816:web:05308b9b1c62bec6f45c7d",
  measurementId: "G-W04WTBE5KP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

/**
 * Requested Google Sign-In logic using the provided Client ID.
 */
export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    
    // Explicitly providing the client ID can help in some misconfigured environments
    // though Firebase usually manages this via the Console settings.
    provider.setCustomParameters({
      'client_id': '541165944985-04hs525ev9fqsm1dup05j6o905oc9qqd.apps.googleusercontent.com'
    });

    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Logged in user:", user);
    return user;

  } catch (error: any) {
    console.error("Google login error:", error);
    if (error.code === 'auth/configuration-not-found') {
      console.error("CRITICAL: Google Sign-In is not enabled in the Firebase Console.");
    }
    throw error;
  }
}

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 */
export const uploadFile = async (file: File | Blob, path: string): Promise<string> => {
  const fileRef = storageRef(storage, path);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
};

export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged 
};
export type { FirebaseUser };
