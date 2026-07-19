import { useState, useEffect, useCallback } from 'react';
import returnService from '../services/return.service';

export function useReturnDetails(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDetails = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await returnService.getById(id);
            console.log('RES del', res);
      const body = res?.data ?? res;
      setData(body?.payload ?? body);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.data?.message ||
        err.message ||
        'Failed to load return details.'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return {
    data,
    loading,
    error,
    refetch: fetchDetails,
  };
}

export default useReturnDetails;
