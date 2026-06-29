"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useGetCart } from "@/hooks/useCart";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Link from "next/link";
import Button from "@/components/ui/Button";
import {
  ArrowLeft,
  ShoppingCart,
  Lock,
  AlertCircle,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { SpinnerScreen } from "@/components/ui/SpinnerScreen";
import { ProductCard } from "@/components/checkout/ProductCard";
import { PriceBreakdown } from "@/components/checkout/PriceBreakdown";
import { TrustBadge } from "@/components/checkout/TrustBadge";
import { calcBreakdown } from "@/utils/paymentFee";
import { usePayment } from "@/hooks/usePayment";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cartItemId = searchParams.get("item");

  const { data: cart, isLoading: cartLoading } = useGetCart();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { initializePayment, isPaying } = usePayment();

  const [quantity, setQuantity] = useState<number | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Avoid SSR/hydration mismatch on auth state
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Find the cart item matching the query param
  const cartItem = useMemo(
    () => cart?.items?.find((i: any) => i.id === cartItemId) ?? null,
    [cart, cartItemId]
  );

  // Seed quantity from the cart once data arrives
  useEffect(() => {
    if (cartItem && quantity === null) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItem, quantity]);

  const product = cartItem?.product ?? null;
  const maxQty = product?.quantity ?? 1;

  // Recalculate breakdown whenever price or quantity changes
  const breakdown = useMemo(() => {
    if (!product || quantity === null) return null;
    return calcBreakdown(product.price, quantity);
  }, [product, quantity]);

  function adjustQty(delta: number) {
    setQuantity((q) => Math.max(1, Math.min((q ?? 1) + delta, maxQty)));
  }

  async function handlePay() {
    if (!product || quantity === null) return;
    
    await initializePayment({
      productId: product.id,
      quantity,
    });
  }

  // ── Guard states ────────────────────────────────────────────────────────────

  if (!isHydrated || cartLoading) {
    return <SpinnerScreen message="Preparing checkout" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <ShoppingCart className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sign in to continue
          </h2>
          <p className="text-gray-500 mb-6">
            You must be logged in to complete your purchase.
          </p>
          <Link href="/login">
            <Button className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-semibold py-3 rounded-xl shadow-lg shadow-green-500/25">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!cartItem || !product || quantity === null || !breakdown) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-xl p-8 border border-red-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Item not found
          </h2>
          <p className="text-gray-500 mb-6">
            This item is no longer in your cart. Please go back and try again.
          </p>
          <Link href="/cart">
            <Button className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-semibold py-3 rounded-xl shadow-lg shadow-green-500/25">
              Return to Cart
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* ── Sticky header ─────────────────────────────────────────────────── */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Cart</span>
            </button>
            <div className="flex items-center gap-1.5 text-sm">
              <Lock className="h-4 w-4 text-green-600" />
              <span className="text-gray-600 font-medium">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-500 mt-1">Review your order before paying</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          {/* ── Left column: product + quantity ──────────────────────────── */}
          <div className="space-y-4">
            <ProductCard
              item={cartItem}
              quantity={quantity}
              maxQty={maxQty}
              onQuantityChange={adjustQty}
            />

            {/* Trust badges — visible on mobile only */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-3 gap-3">
              <TrustBadge
                icon={Lock}
                bg="bg-green-50"
                color="text-green-600"
                label="SSL Encrypted"
                sub="Bank-grade security"
              />
              <TrustBadge
                icon={BadgeCheck}
                bg="bg-blue-50"
                color="text-blue-600"
                label="Verified Vendors"
                sub="Quality assured"
              />
              <TrustBadge
                icon={ShieldCheck}
                bg="bg-purple-50"
                color="text-purple-600"
                label="Powered by Paystack"
                sub="Trusted payments"
              />
            </div>
          </div>

          {/* ── Right column: price breakdown + CTA ──────────────────────── */}
          <PriceBreakdown
            breakdown={breakdown}
            quantity={quantity}
            unitPrice={product.price}
            isPaying={isPaying}
            onPay={handlePay}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Page export — wraps searchParams usage in required Suspense boundary ─────
export default function CheckoutPage() {
  return (
    <Suspense fallback={<SpinnerScreen message="Preparing checkout" />}>
      <CheckoutContent />
    </Suspense>
  );
}