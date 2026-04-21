'use client';

import { useEffect } from 'react';

// Kullanıcının yerel saatine göre site atmosferi değişir.
// 20:00-06:00 arası "cosy" mode — sıcak amber tonlar, grain biraz daha yoğun.
// CSS değişiklikleri globals.css'teki .cosy-mode selector'undan gelir.
export default function CosyMode() {
  useEffect(() => {
    const apply = () => {
      const hour = new Date().getHours();
      const isCosy = hour >= 20 || hour < 6;
      document.documentElement.classList.toggle('cosy-mode', isCosy);
    };
    apply();
    // Her dakika güncelle — 20:00 geçişini yakala
    const id = setInterval(apply, 60_000);
    return () => clearInterval(id);
  }, []);

  return null;
}
