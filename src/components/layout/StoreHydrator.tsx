'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cart';

/** Подтягивает корзину из localStorage после монтирования (skipHydration). */
export function StoreHydrator() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);
  return null;
}
