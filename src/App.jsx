import AppRoutes from "./routes.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import QuickAddOverlay from "./components/QuickAddOverlay.jsx";
import { AnimatePresence } from "framer-motion";

export default function App() {
  return (
    <div className="relative min-h-screen">
      <AppRoutes />

      {/* AnimatePresence нужен для анимации появления/исчезновения
        компонентов, управляемых условным рендерингом (if/else).
      */}
      <AnimatePresence>
        <CartDrawer />
        <QuickAddOverlay />
      </AnimatePresence>
    </div>
  );
}
