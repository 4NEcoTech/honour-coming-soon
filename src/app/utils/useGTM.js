'use client'

import { useEffect } from 'react';

export const useGTM = () => {
  const sendGTMEvent = (event) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(event);
    }
  };

  return { sendGTMEvent };
};