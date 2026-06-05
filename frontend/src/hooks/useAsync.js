import { useState } from 'react';

/**
 * Hook للتعامل مع حالة التحميل والأخطاء
 */
export const useAsync = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (asyncFunction) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction();
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ ما');
      setLoading(false);
      throw err;
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
  };

  return { loading, error, execute, reset };
};
