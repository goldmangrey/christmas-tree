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
        // id: doc.id - это ID документа, doc.data() - это его поля
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

// ⬇️⬇️ ИСПРАВЛЕННАЯ ФУНКЦИЯ ⬇️⬇️
// Теперь она принимает 'productData' (данные) и 'id' (ID) отдельно.
export async function upsertProduct(productData, id = null) {
    if (id) {
        // Путь Обновления (Редактирование или Сортировка)
        // 'productData' может быть {name: ...} или {orderIndex: ...}
        const docRef = doc(db, "products", id);
        // 'merge: true' гарантирует, что мы только обновим поля,
        // а не сотрем весь документ
        await setDoc(docRef, productData, { merge: true });
        return id;
    } else {
        // Путь Создания (Новый товар)
        // 'productData' - это полный объект нового товара
        const docRef = await addDoc(productsCollection, productData);
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

// (Эта функция остается без изменений)
export async function uploadImage(file) {
    console.log("API: uploadImage (Firebase)");
    const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("File available at", downloadURL);
    return downloadURL;
}