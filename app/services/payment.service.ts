import axiosInstance from "@/lib/axios";

export interface InitializePaymentDto {
  productId: string;
  quantity: number;
  callbackUrl?: string;
}

export interface PaymentResponse {
  authorizationUrl: string;
  accessCode?: string;
  reference: string;
  paymentId?: string;
  orderId?: string;
  amount?: number;
  breakdown?: unknown;
}

export const paymentService = {
  initializePayment: async (dto: InitializePaymentDto): Promise<PaymentResponse> => {
    const { data } = await axiosInstance.post('/payments/initialize', dto);
    return data;
  },
};
