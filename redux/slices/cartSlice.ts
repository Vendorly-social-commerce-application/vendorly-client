import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    discountPrice: number | null;
    quantity: number;
    images: { url: string }[];
  };
}

interface CartState {
  items: CartItem[];
  itemCount: number;
  isLoading: boolean;
}

const initialState: CartState = {
  items: [],
  itemCount: 0,
  isLoading: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },

    updateCartCount: (state, action: PayloadAction<number>) => {
      state.itemCount = action.payload;
    },

    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    clearCart: (state) => {
      state.items = [];
      state.itemCount = 0;
    },
  },
});

export const { setCartItems, updateCartCount, setCartLoading, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
