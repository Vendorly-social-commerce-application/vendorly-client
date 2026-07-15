import { useState } from 'react';
import { paymentService, InitializePaymentDto } from '@/app/services/payment.service';
import { toast } from 'sonner';

const VENDOR_PAYOUT_UNAVAILABLE_MESSAGE =
  "This vendor cannot receive upfront payout at the moment. Please try again later while Vendorly updates payout availability.";

const PAYOUT_CHECK_UNAVAILABLE_MESSAGE =
  "We could not confirm payout availability right now. Please try again shortly.";

const getFriendlyPaymentError = (error: any) => {
  const status = error?.response?.status;
  const backendMessage = error?.response?.data?.message;
  const normalizedBackendMessage =
    typeof backendMessage === "string" ? backendMessage.trim() : "";

  if (
    status === 400 &&
    normalizedBackendMessage.includes(VENDOR_PAYOUT_UNAVAILABLE_MESSAGE)
  ) {
    return "This vendor cannot receive payout right now. Please try again later or contact the vendor.";
  }

  if (
    status === 502 &&
    normalizedBackendMessage.includes(PAYOUT_CHECK_UNAVAILABLE_MESSAGE)
  ) {
    return "We could not confirm payment availability right now. Please try again in a few minutes.";
  }

  if (normalizedBackendMessage) {
    const containsInternalPaymentDetail =
      /balance|float|transfer recipient|recipient|top-up|top up|subaccount|split/i.test(
        normalizedBackendMessage,
      );

    return containsInternalPaymentDetail
      ? "Payment is temporarily unavailable. Please try again later."
      : normalizedBackendMessage;
  }

  if (Array.isArray(backendMessage) && backendMessage.length > 0) {
    return backendMessage.join(", ");
  }

  return error?.message || "Payment initialization failed. Please try again.";
};

export const usePayment = () => {
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const initializePayment = async (dto: Omit<InitializePaymentDto, 'callbackUrl'>) => {
    setIsPaying(true);
    setPaymentError(null);
    
    try {
      const callbackUrl = `${window.location.origin}/payment/callback`;
      
      const data = await paymentService.initializePayment({
        ...dto,
        callbackUrl,
      });

      if (!data.authorizationUrl) {
        throw new Error("Payment checkout link was not returned. Please try again.");
      }

      // Redirect to Paystack
      window.location.href = data.authorizationUrl;
      
      // isPaying stays true as user is being redirected
    } catch (error: any) {
      const errorMessage = getFriendlyPaymentError(error);
      setPaymentError(errorMessage);
      toast.error(errorMessage);
      setIsPaying(false);
    }
  };

  return {
    initializePayment,
    isPaying,
    paymentError,
    clearPaymentError: () => setPaymentError(null),
  };
};
