import {
  AlertCircle,
  Lock,
  CreditCard,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";
import { Tooltip } from "./Tooltip";
import { FeeBreakdown, formatKobo } from "@/utils/paymentFee";

interface PriceBreakdownProps {
  breakdown: FeeBreakdown;
  quantity: number;
  unitPrice: number;
  isPaying: boolean;
  paymentError?: string | null;
  onPay: () => void;
}

export function PriceBreakdown({
  breakdown,
  quantity,
  unitPrice,
  isPaying,
  paymentError,
  onPay,
}: PriceBreakdownProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5">
        Price Breakdown
      </p>

      <div className="space-y-3.5">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Subtotal{" "}
            <span className="text-gray-400">
              ({quantity} × ₦{unitPrice.toLocaleString()})
            </span>
          </span>
          <span className="text-sm font-semibold text-gray-900 tabular-nums">
            {formatKobo(breakdown.subtotalKobo)}
          </span>
        </div>

        {/* Service fee */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-gray-600">Service fee</span>
            <Tooltip text="A small platform fee that keeps Vendorly safe and running for buyers and vendors." />
          </div>
          <span className="text-sm font-semibold text-gray-900 tabular-nums">
            {formatKobo(breakdown.serviceFeeKobo)}
          </span>
        </div>

        {/* Processing fee */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-gray-600">Processing fee</span>
            <Tooltip text="Charged by Paystack to securely handle your card payment." />
          </div>
          <span className="text-sm font-semibold text-gray-900 tabular-nums">
            {formatKobo(breakdown.processingFeeKobo)}
          </span>
        </div>

        {/* Total */}
        <div className="pt-3.5 border-t border-dashed border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-gray-900">Total</span>
            <span className="text-2xl font-extrabold text-[#10b981] tabular-nums">
              {formatKobo(breakdown.totalKobo)}
            </span>
          </div>
        </div>
      </div>

      {paymentError && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-amber-900">
                Payment is temporarily unavailable
              </p>
              <p className="mt-1 text-sm leading-relaxed text-amber-800">
                {paymentError}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pay button */}
      <button
        onClick={onPay}
        disabled={isPaying}
        className="mt-6 w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] disabled:from-[#10b981]/70 disabled:to-[#059669]/70 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/20 hover:shadow-green-500/35 transition-all duration-300 flex items-center justify-center gap-2.5 text-[15px] cursor-pointer disabled:cursor-not-allowed"
      >
        {isPaying ? (
          <>
            <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Redirecting to Paystack…
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            Pay {formatKobo(breakdown.totalKobo)}
          </>
        )}
      </button>

      {/* Security note */}
      <div className="mt-4 flex items-start gap-2">
        <Lock className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
        <p className="text-[11px] text-gray-400 leading-relaxed">
          Payments are processed securely by{" "}
          <span className="font-semibold text-gray-500">Paystack</span>.
          Vendorly never stores your card details.
        </p>
      </div>

      {/* Feature bullets */}
      <div className="hidden lg:flex flex-col gap-2.5 mt-5 pt-5 border-t border-gray-100">
        {[
          { icon: Lock, label: "SSL encrypted checkout" },
          { icon: BadgeCheck, label: "Verified vendor products" },
          { icon: ShieldCheck, label: "Secure payment via Paystack" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
