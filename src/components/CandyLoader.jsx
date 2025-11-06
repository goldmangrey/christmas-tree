import { useEffect, useRef } from "react";
import "./CandyLoader.scss";

export default function CandyLoader({ loading, duration = 3000 }) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (loading) {
      wrapper.classList.add("visible");
      // скорость анимации пропорциональна времени загрузки
      const sec = Math.max(duration / 1000, 2);
      wrapper.style.setProperty("--speed", `${sec}s`);
    } else {
      wrapper.classList.remove("visible");
    }
  }, [loading, duration]);

  return (
    <div ref={wrapperRef} className="candy-wrapper">
      <div className="candy">
        <div className="candy-loader"></div>
      </div>
    </div>
  );
}
