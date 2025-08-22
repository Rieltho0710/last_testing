import { 
    auth,
    db
} from "public/js/firebase-config.js";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw handleAuthError(error);
    }
};

export const register = async (email, password, userData) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), {
            ...userData,
            role: "member",
            createdAt: new Date()
        });
        return userCredential.user;
    } catch (error) {
        throw handleAuthError(error);
    }
};

export const logout = async () => {
    await signOut(auth);
};

export const getCurrentUser = () => {
    return auth.currentUser;
};

export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            callback({
                ...user,
                role: userDoc.data()?.role || "member"
            });
        } else {
            callback(null);
        }
    });
};

function handleAuthError(error) {
    const errorMap = {
        "auth/invalid-email": "Email tidak valid",
        "auth/user-disabled": "Akun dinonaktifkan",
        "auth/user-not-found": "Akun tidak ditemukan",
        "auth/wrong-password": "Password salah",
        "auth/email-already-in-use": "Email sudah terdaftar",
        "auth/weak-password": "Password terlalu lemah"
    };
    return new Error(errorMap[error.code] || "Terjadi kesalahan saat autentikasi");
}
