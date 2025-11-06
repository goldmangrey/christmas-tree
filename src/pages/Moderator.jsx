import { useEffect, useState } from "react";
import { useProductsStore } from "../store/useProductsStore";
import { useForm } from "react-hook-form";
import * as api from "../lib/api";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

// --- ИМПОРТЫ FIREBASE AUTH ---
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

// (Компонент SortableItem остается без изменений)
function SortableItem({ product, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: product.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center gap-3 p-2 bg-white rounded-lg shadow"
    >
      <button {...listeners} className="w-6 h-10 text-gray-400 cursor-grab">
        &#x2630;
      </button>
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-12 h-12 rounded bg-gray-100 object-contain"
      />
      <div className="flex-1">
        <p className="font-semibold text-sm">
          {product.name}{" "}
          <span className="text-xs font-normal text-gray-500">
            (₸{product.price}) {/* <-- Я также поменял $ на ₸ здесь */}
          </span>
        </p>
        <p className="text-xs text-gray-500">{product.sizeRange}</p>
      </div>
      <button
        onClick={() => onEdit(product)}
        className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-md"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(product.id)}
        className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-md"
      >
        Del
      </button>
    </div>
  );
}

// Основной компонент модератора
export default function Moderator() {
  const { products, fetch, upsert, remove, reorder } = useProductsStore();
  const [editingProduct, setEditingProduct] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm();

  // --- ОБНОВЛЕННАЯ ЛОГИКА АВТОРИЗАЦИИ ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState(""); // <-- Добавили Email
  const [passwordInput, setPasswordInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // <-- Для кнопки
  const [error, setError] = useState(null); // <-- Для ошибок
  // ---

  useEffect(() => {
    if (isAuthenticated) {
      fetch();
    }
  }, [fetch, isAuthenticated]);

  useEffect(() => {
    if (editingProduct) {
      reset(editingProduct);
    } else {
      reset({
        name: "",
        price: 0,
        sizeRange: "",
        images: [],
        fullDesc: "",
        isActive: true,
      });
    }
  }, [editingProduct, reset]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const url = await api.uploadImage(file);
    setIsUploading(false);
    setValue("images", [url]);
  };

  const onSubmit = async (data) => {
    const productToSave = {
      ...data,
      price: parseFloat(data.price),
    };

    let productId = null;
    if (editingProduct) {
      // Если редактируем, получаем ID для обновления
      productId = editingProduct.id;
    } else {
      // Если создаем новый, ставим ему 'orderIndex'
      productToSave.orderIndex = products.length;
    }

    // 'productToSave' больше НЕ содержит 'id'
    // Мы передаем ID вторым аргументом
    await upsert(productToSave, productId);
    setEditingProduct(null);
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = products.findIndex((p) => p.id === active.id);
      const newIndex = products.findIndex((p) => p.id === over.id);
      const newList = arrayMove(products, oldIndex, newIndex);
      reorder(newList);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      remove(id);
    }
  };

  // --- НОВЫЙ ОБРАБОТЧИК ВХОДА С FIREBASE ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Пытаемся войти
      await signInWithEmailAndPassword(auth, emailInput, passwordInput);
      // Если успешно:
      setIsAuthenticated(true);
    } catch (err) {
      // Если ошибка:
      console.error(err.code, err.message);
      if (err.code === "auth/invalid-credential") {
        setError("Неверный email или пароль.");
      } else {
        setError("Ошибка входа.");
      }
    } finally {
      // В любом случае
      setIsLoading(false);
    }
  };

  // --- ОБНОВЛЕННЫЙ ЭКРАН ВХОДА ---
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-md space-y-3"
        >
          <h1 className="text-xl font-bold mb-4 text-center">
            Moderator Access
          </h1>

          {/* Поле Email */}
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="w-full border p-3 rounded-lg"
            placeholder="Email"
            required
          />

          {/* Поле Пароль */}
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full border p-3 rounded-lg"
            placeholder="Пароль"
            required
          />

          {/* Сообщение об ошибке */}
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading} // Блокируем кнопку во время загрузки
            className="w-full h-11 bg-green-600 text-white rounded-lg font-semibold transition-colors
                       disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    );
  }

  // --- 1. ИСПРАВЛЕНИЕ ---
  // Создаем массив ТОЛЬКО из ID, как того требует @dnd-kit
  const productIds = products.map((p) => p.id);

  // --- СТАРАЯ СТРАНИЦА МОДЕРАТОРА (остается без изменений) ---
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Moderator Panel</h1>

      {/* Форма CRUD */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-4 rounded-2xl shadow space-y-3"
      >
        {/* ... (код формы без изменений) ... */}
        <h2 className="text-lg font-semibold">
          {editingProduct ? "Edit Product" : "Create Product"}
        </h2>
        <input
          {...register("name")}
          placeholder="Name"
          className="w-full border p-2 rounded-lg"
        />
        <input
          {...register("price")}
          type="number"
          step="0.01"
          placeholder="Price"
          className="w-full border p-2 rounded-lg"
        />
        <input
          {...register("sizeRange")}
          placeholder="Size Range (e.g. 120-150 cm)"
          className="w-full border p-2 rounded-lg"
        />
        <textarea
          {...register("fullDesc")}
          placeholder="Full Description"
          className="w-full border p-2 rounded-lg"
        />
        <div>
          <label className="text-sm">Image</label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="w-full text-xs"
          />
          {isUploading && <p className="text-xs text-blue-500">Uploading...</p>}
        </div>
        <label className="flex items-center gap-2">
          <input {...register("isActive")} type="checkbox" />
          <span>Is Active?</span>
        </label>
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 h-10 bg-green-600 text-white rounded-lg"
          >
            Save
          </button>
          {editingProduct && (
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="flex-1 h-10 bg-gray-200 rounded-lg"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Список с D&D */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          Product Order (Drag & Drop)
        </h2>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext
            // --- 2. ИСПРАВЛЕНИЕ ---
            // Передаем сюда массив ID, а не массив объектов
            items={productIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {products.map((p) => (
                <SortableItem
                  key={p.id}
                  product={p}
                  onEdit={setEditingProduct}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
