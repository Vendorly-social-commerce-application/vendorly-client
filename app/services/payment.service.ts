import axiosInstance from "@/lib/axios";

export interface InitializePaymentDto {
  productId: string;
  quantity: number;
  callbackUrl?: string;
}

export interface PaymentResponse {
  authorizationUrl: string;
  reference: string;
}

export const paymentService = {
  initializePayment: async (dto: InitializePaymentDto): Promise<PaymentResponse> => {
    const { data } = await axiosInstance.post('/payments/initialize', dto);
    return data;
  },
};