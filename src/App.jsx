import AppRoutes from "./routes.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
// QuickAddOverlay убран
import { AnimatePresence } from "framer-motion";

export default function App() {
  return (
    <>
      <div className="app-container">
        <AppRoutes />
      </div>

      <AnimatePresence>
        <CartDrawer />
        {/* QuickAddOverlay отсюда удален */}
      </AnimatePresence>
    </>
  );
}
