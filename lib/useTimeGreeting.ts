'use client';

import { useEffect, useState } from 'react';

export type TimeGreeting = {
  kicker: string;
  message: string;
};

function resolveGreeting(now: Date): TimeGreeting {
  const hour = now.getHours();
  const day = now.getDay(); // 0 Pazar, 6 Cumartesi

  // Cumartesi akşam — lansman momenti
  if (day === 6 && hour >= 18 && hour < 24) {
    return {
      kicker: 'Cumartesi · Bean saati',
      message: 'Saat tam. Bir yerde seninle oturmak isteyen biri var.',
    };
  }

  // Pazar sabahı — yoga, brunch, yavaş güne başlama
  if (day === 0 && hour >= 7 && hour < 12) {
    return {
      kicker: 'Pazar · yavaş saat',
      message: 'Yoga, brunch, kitap — yakınlarında ne var, bakalım mı?',
    };
  }

  // Cuma akşam — hafta sonuna giriş
  if (day === 5 && hour >= 17) {
    return {
      kicker: 'Cuma akşamı · hafta bitti',
      message: 'Cumartesi planı hazır değilse geç kalmadın.',
    };
  }

  // Genel saatlik kuşaklar
  if (hour >= 5 && hour < 11) {
    return {
      kicker: 'Günaydın',
      message: 'Akşamı şimdiden planla — şehir ne yapıyor, bir bak.',
    };
  }

  if (hour >= 11 && hour < 14) {
    return {
      kicker: 'Günün ortası',
      message: 'Öğle molası. Bu akşam bir Bean&apos;e yer açmalı mısın?',
    };
  }

  if (hour >= 14 && hour < 18) {
    return {
      kicker: 'Öğleden sonra',
      message: 'Mesai bitmek üzere. Akşam planını bir dokunuşta kur.',
    };
  }

  if (hour >= 18 && hour < 22) {
    return {
      kicker: 'Akşam başlıyor',
      message: 'Masan hazır mı? Yakınında bu gece neler oluyor, bak.',
    };
  }

  // Gece (22 - 05)
  return {
    kicker: 'Gece vardiyası',
    message: 'Yarınki Bean&apos;i şimdi işaretle — sabah hazır uyan.',
  };
}

export function useTimeGreeting(): TimeGreeting | null {
  // SSR + hydration uyumu için başlangıçta null
  const [greeting, setGreeting] = useState<TimeGreeting | null>(null);

  useEffect(() => {
    setGreeting(resolveGreeting(new Date()));
    // Dakikada bir yenile — kullanıcı saat 10:59 -> 11:00 geçişini yakalasın
    const id = setInterval(() => {
      setGreeting(resolveGreeting(new Date()));
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  return greeting;
}
