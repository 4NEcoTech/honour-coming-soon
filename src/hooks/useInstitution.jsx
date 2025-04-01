'use client';

import { useEffect, useState } from 'react';

const useInstitution = (institutionNum) => {
  const [institutionData, setInstitutionData] = useState(null);
  const [loading, setLoading] = useState(true); // default true
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!institutionNum) return;

    const controller = new AbortController();

    const fetchInstitution = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/institution/v1/institutionGet/${institutionNum}`,
          {
            signal: controller.signal,
          }
        );

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result?.error || 'Something went wrong');
        }

        setInstitutionData(result);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInstitution();

    return () => {
      controller.abort(); // ✅ clean-up on unmount
    };
  }, [institutionNum]);

  return { institutionData, loading, error };
};

export default useInstitution;
