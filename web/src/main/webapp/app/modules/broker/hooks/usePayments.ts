import { useState, useEffect } from 'react';
import { brokerApi, Payment } from '../api/brokerApi';

interface UsePaymentsResult {
  payments: Payment[];
  isLoading: boolean;
  error: Error | null;
  refreshPayments: () => Promise<void>;
  approvePayment: (paymentId: string) => Promise<void>;
  processPayment: (paymentId: string) => Promise<void>;
}

export const usePayments = (): UsePaymentsResult => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const paymentsData = await brokerApi.getPayments();
      setPayments(paymentsData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch payments on component mount
  useEffect(() => {
    fetchPayments();
  }, []);

  // Approve a payment (change status from pending to approved)
  const approvePayment = async (paymentId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call an API to approve the payment
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the payment status in the local state
      setPayments(prevPayments => 
        prevPayments.map(payment => 
          payment.id === paymentId 
            ? { ...payment, status: 'approved' } 
            : payment
        )
      );
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to approve payment'));
    } finally {
      setIsLoading(false);
    }
  };

  // Process a payment (change status from approved to paid)
  const processPayment = async (paymentId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call the Triumph Pay API
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the payment status in the local state
      setPayments(prevPayments => 
        prevPayments.map(payment => 
          payment.id === paymentId 
            ? { ...payment, status: 'paid' } 
            : payment
        )
      );
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to process payment'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    payments,
    isLoading,
    error,
    refreshPayments: fetchPayments,
    approvePayment,
    processPayment
  };
};

export default usePayments;