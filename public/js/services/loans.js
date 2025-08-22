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
    serverTimestamp
} from "firebase/firestore";

export const getLoans = async (userId = null, status = null) => {
    let q = query(collection(db, "loans"));
    
    if (userId) {
        q = query(q, where("userId", "==", userId));
    }
    
    if (status) {
        q = query(q, where("status", "==", status));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        formattedLoanDate: doc.data().loanDate?.toDate().toLocaleDateString(),
        formattedDueDate: doc.data().dueDate?.toDate().toLocaleDateString()
    }));
};

export const requestLoan = async (userId, bookId) => {
    const loanData = {
        userId,
        bookId,
        loanDate: serverTimestamp(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        status: "pending",
        createdAt: serverTimestamp()
    };
    
    await addDoc(collection(db, "loans"), loanData);
    
    // Update book availability
    await updateDoc(doc(db, "books", bookId), {
        available: firebase.firestore.FieldValue.increment(-1)
    });
};

export const approveLoan = async (loanId, adminId) => {
    await updateDoc(doc(db, "loans", loanId), {
        status: "approved",
        approvedBy: adminId,
        updatedAt: serverTimestamp()
    });
};

export const rejectLoan = async (loanId, adminId, reason) => {
    await updateDoc(doc(db, "loans", loanId), {
        status: "rejected",
        rejectedBy: adminId,
        rejectionReason: reason,
        updatedAt: serverTimestamp()
    });
};

export const returnBook = async (loanId, bookId) => {
    await updateDoc(doc(db, "loans", loanId), {
        status: "returned",
        returnDate: serverTimestamp()
    });
    
    await updateDoc(doc(db, "books", bookId), {
        available: firebase.firestore.FieldValue.increment(1)
    });
};
