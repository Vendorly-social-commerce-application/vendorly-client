import Image from "next/image";
import { Package, AlertCircle, Minus, Plus } from "lucide-react";
import { CartItem } from "@/app/services/cart.service";

interface ProductCardProps {
  item: CartItem;
  quantity: number;
  maxQty: number;
  onQuantityChange: (delta: number) => void;
}

export function ProductCard({
  item,
  quantity,
  maxQty,
  onQuantityChange,
}: ProductCardProps) {
  const product = item.product;
  const unitPrice = product.price;
  const savings =
    product.discountPrice && product.discountPrice > unitPrice
      ? (product.discountPrice - unitPrice) * quantity
      : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5">
        Order Item
      </p>

      <div className="flex gap-5">
        {/* Thumbnail */}
        <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0">
          {product.images?.[0]?.url ? (
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-10 w-10 text-gray-300" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-snug mb-1">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-bold text-[#10b981]">
              ₦{unitPrice.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 font-medium">/ unit</span>
            {product.discountPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₦{product.discountPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Low-stock badge */}
          {maxQty <= 5 && (
            <p className="text-xs font-semibold text-orange-600 bg-orange-50 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg mb-3">
              <AlertCircle className="h-3 w-3" />
              Only {maxQty} left in stock
            </p>
          )}

          {/* Quantity selector */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-gray-600">Quantity:</span>
            <div className="inline-flex items-center rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
              <button
                onClick={() => onQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-11 text-center text-sm font-bold text-gray-900 select-none tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => onQuantityChange(1)}
                disabled={quantity >= maxQty}
                className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-xs text-gray-400">{maxQty} available</span>
          </div>
        </div>
      </div>

      {/* Savings banner */}
      {savings > 0 && (
        <div className="mt-5 pt-5 border-t border-gray-100">
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-red-700">
              You're saving
            </span>
            <span className="text-sm font-bold text-red-700">
              ₦{savings.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
