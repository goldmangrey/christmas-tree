// [ANCHOR: API]
import { db, storage } from "./firebase";
import {
    collection,
    getDocs,
    getDoc,
    doc,
    addDoc,
    setDoc,
    deleteDoc,
    query,
    where,
    orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// --- Firestore (Products) ---

const productsCollection = collection(db, "products");

// Получаем список АКТИВНЫХ продуктов для главной страницы
export async function listProducts() {
    console.log("API: listProducts (Firebase)");

    const q = query(
        productsCollection,
        where("isActive", "==", true),
        orderBy("orderIndex")
    );

    const querySnapshot = await getDocs(q);
    const products = [];
    querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
    });
    return products;
}

// Получаем ОДИН продукт по ID
export async function getProduct(id) {
    console.log("API: getProduct (Firebase)", id);
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        console.error("No such product!");
        return null;
    }
}

// Создаем или Обновляем продукт
export async function upsertProduct(p) {
    console.log("API: upsertProduct (Firebase)", p.id);

    if (p.id) {
        // Если ID есть, обновляем существующий
        const docRef = doc(db, "products", p.id);
        await setDoc(docRef, p, { merge: true }); // merge: true - не затирает, а обновляет
        return p.id;
    } else {
        // Если ID нет, создаем новый
        const docRef = await addDoc(productsCollection, p);
        return docRef.id; // Возвращаем ID, созданный Firebase
    }
}

// Удаляем продукт
export async function deleteProduct(id) {
    console.log("API: deleteProduct (Firebase)", id);
    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);
}

// --- Storage (Image Upload) ---

// Загружаем картинку
export async function uploadImage(file) {
    console.log("API: uploadImage (Firebase)");

    // Создаем уникальное имя файла
    const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);

    // Загружаем файл
    const snapshot = await uploadBytes(storageRef, file);

    // Получаем публичный URL для скачивания
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("File available at", downloadURL);
    return downloadURL;
}