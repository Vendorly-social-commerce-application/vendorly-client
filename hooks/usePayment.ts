import { useState } from 'react';
import { paymentService, InitializePaymentDto } from '@/app/services/payment.service';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { toast } from 'sonner';

export const usePayment = () => {
  const [isPaying, setIsPaying] = useState(false);
  const token = useSelector((state: RootState) => (state.auth as any).token as string | undefined);

  const initializePayment = async (dto: Omit<InitializePaymentDto, 'callbackUrl'>) => {
    setIsPaying(true);
    
    try {
      const callbackUrl = `${window.location.origin}/payment/callback`;
      
      const data = await paymentService.initializePayment({
        ...dto,
        callbackUrl,
      });

      // Redirect to Paystack
      window.location.href = data.authorizationUrl;
      
      // isPaying stays true as user is being redirected
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Payment initialisation failed. Please try again.';
      toast.error(errorMessage);
      setIsPaying(false);
      throw error;
    }
  };

  return {
    initializePayment,
    isPaying,
  };
};