import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService, Cart } from '@/app/services/cart.service';
import { useDispatch, useSelector } from 'react-redux';
import { setCartItems, updateCartCount } from '../redux/slices/cartSlice';
import { toast } from 'sonner';
import { RootState } from '../redux/store';
import { useEffect } from 'react';

export const useGetCart = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (
        event.type === 'updated' &&
        event.query.queryKey[0] === 'cart' &&
        event.action.type === 'success'
      ) {
        const data = event.query.state.data as Cart;
        if (data) {
          const itemCount = data.items.reduce((sum, item) => sum + item.quantity, 0);
          dispatch(setCartItems(data.items));
          dispatch(updateCartCount(itemCount));
        }
      }
      
      if (
        event.type === 'updated' &&
        event.query.queryKey[0] === 'cart' &&
        event.action.type === 'error'
      ) {
        dispatch(updateCartCount(0));
      }
    });

    return () => unsubscribe();
  }, [queryClient, dispatch]);

  return useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, 
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const cartItemCount = useSelector((state: RootState) => state.cart.itemCount);

  const mutation = useMutation({
    mutationFn: cartService.addToCart,
    
    onMutate: async (newItem) => {
      if (!isAuthenticated) {
        toast.error('Please login to add items to cart');
        throw new Error('Not authenticated');
      }

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      const previousCart = queryClient.getQueryData<Cart>(['cart']);

      // Optimistically update cart count in Redux
      dispatch(updateCartCount(cartItemCount + newItem.quantity));

      return { previousCart };
    },

    onError: (error: any, newItem, context) => {
      if (error.message === 'Not authenticated') return;

      // Rollback to previous cart state
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
        const itemCount = context.previousCart.items.reduce(
          (sum: number, item: any) => sum + item.quantity, 
          0
        );
        dispatch(updateCartCount(itemCount));
      }
      
      const errorMessage = error?.response?.data?.message || 'Failed to add item to cart';
      toast.error(errorMessage);
    },

    onSuccess: () => {
      toast.success('Item added to cart successfully!');
    },

    onSettled: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      }
    },
  });

  return {
    addToCart: mutation.mutateAsync,
    isAdding: mutation.isPending,
  };
};