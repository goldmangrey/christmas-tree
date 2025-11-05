import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Moderator from "./pages/Moderator.jsx";
import Checkout from "./pages/Checkout.jsx";

// Обертка для отслеживания scroll-позиции (нужно для анимаций)
export default function AppRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/moderator" element={<Moderator />} />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
}
