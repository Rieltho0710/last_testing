import { db } from "public/js/firebase-config.js";
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "firebase/firestore";

export const getBooks = async (filters = {}) => {
    let q = query(collection(db, "books"));
    
    if (filters.category) {
        q = query(q, where("categories", "array-contains", filters.category));
    }
    
    if (filters.search) {
        q = query(q, where("keywords", "array-contains", filters.search.toLowerCase()));
    }
    
    if (filters.available) {
        q = query(q, where("available", ">", 0));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        formattedDate: doc.data().createdAt?.toDate().toLocaleDateString()
    }));
};

export const getBookById = async (id) => {
    const docRef = doc(db, "books", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const addBook = async (bookData) => {
    const newBook = {
        ...bookData,
        available: parseInt(bookData.stock),
        keywords: generateKeywords(bookData.title, bookData.author),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, "books"), newBook);
    return docRef.id;
};

export const updateBook = async (id, bookData) => {
    await updateDoc(doc(db, "books", id), {
        ...bookData,
        updatedAt: serverTimestamp()
    });
};

export const deleteBook = async (id) => {
    await deleteDoc(doc(db, "books", id));
};

function generateKeywords(title, author) {
    const titleWords = title.toLowerCase().split(" ");
    const authorWords = author.toLowerCase().split(" ");
    return [...titleWords, ...authorWords];
}
