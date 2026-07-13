import { useState, useEffect, useCallback } from 'react';
import orderService from '../services/order.service';
import Swal from 'sweetalert2';

export function useOrderDetail(orderId, userId = 1) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getUserDetail(userId, orderId);
      // Depending on API response, unwrap the actual order object
      setOrder(data.data || data);
    } catch (err) {
      console.error('Failed to fetch order details:', err);
      setError(err?.message || 'Failed to fetch order details');
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        icon: 'error',
        title: 'Failed to load order details',
      });
    } finally {
      setLoading(false);
    }
  }, [orderId, userId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const updateStatus = async (status) => {
    try {
      await orderService.updateStatus(orderId, status);
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        icon: 'success',
        title: 'Order status updated successfully',
      });
      // Refresh order data
      fetchOrder();
      return true;
    } catch (err) {
      console.error('Failed to update order status:', err);
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        icon: 'error',
        title: err?.message || 'Failed to update order status',
      });
      return false;
    }
  };

  const cancelOrder = async (userId, reason) => {
    try {
      await orderService.cancel(orderId, userId, reason);
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        icon: 'success',
        title: 'Order cancelled successfully',
      });
      // Refresh order data
      fetchOrder();
      return true;
    } catch (err) {
      console.error('Failed to cancel order:', err);
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        icon: 'error',
        title: err?.message || 'Failed to cancel order',
      });
      return false;
    }
  };

  return {
    order,
    loading,
    error,
    fetchOrder,
    updateStatus,
    cancelOrder,
  };
}
