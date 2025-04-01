"use client"

import { useState, useEffect } from "react"

/**
 * Custom hook for debouncing a value
 * @param {any} value The value to debounce
 * @param {number} delay The delay in milliseconds
 * @returns {any} The debounced value
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

