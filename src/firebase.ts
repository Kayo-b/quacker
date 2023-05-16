import { initializeApp } from 'firebase/app';
import {
     GoogleAuthProvider,
     getAuth,
     signInWithPopup,
     signInWithEmailAndPassword,
     createUserWithEmailAndPassword,
     sendPasswordResetEmail,
     signOut } from 'firebase/auth';
import {
     getFirestore,
     query,
     getDocs,
     collection,
     where,
     addDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB7ZtQsJrhm4whoqz_Vbg4MULY0JkK_IyM",
    authDomain: "twitter-clone-project-quack.firebaseapp.com",
    databaseURL: "https://twitter-clone-project-quack-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "twitter-clone-project-quack",
    storageBucket: "twitter-clone-project-quack.appspot.com",
    messagingSenderId: "374815127447",
    appId: "1:374815127447:web:1dec4a51895f3dfc6cf6d2"
  
  };
  
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

//Google Sign-up
const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async() => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if(docs.docs.length === 0) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
                bookmarks: []
            });
        }
    } catch (err: unknown) {
        if(err instanceof Error) {
            console.error(err);
            alert(err.message);
        } else {
            console.error(err);
            alert("an error occurred")
        }

    }
};

//Email Sign-up

const signUpWithEmail = async(email: string, password: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, password)
    } catch(err: unknown) {
        if(err instanceof Error) {
            console.error(err);
            alert(err.message)
        } else {
            console.error(err);
            console.log("an error occurred")
        }

    }
}
const registerEmail = async(name: string, email: string, password: string) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if(docs.docs.length === 0) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: name,
                authProvider: "local",
                email: user.email,
                bookmarks: []
            });
        }
    } catch (err: unknown) {
        if(err instanceof Error) {
            console.error(err);
            alert(err.message);
        } else {
            console.error(err);
            alert("an error occurred")
        }
    }
}

//Password recovery
const sendPasswordReset = async(email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset link sent!");
    } catch (err: unknown) {
        if(err instanceof Error) {
            console.error(err);
            alert(err.message);
        } else {
            console.error(err);
            alert("an error occurred")
        }
    }
}


const logout = () => {
    signOut(auth);
  };



export {
    auth,
    db,
    signInWithGoogle,
    signUpWithEmail,
    registerEmail,
    sendPasswordReset,
    logout,
};


