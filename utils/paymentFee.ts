const PERCENT_DENOMINATOR = 10_000;
const PLATFORM_COMMISSION_BPS = 200;
const CUSTOMER_PLATFORM_SHARE_BPS = 1_000;
const PAYSTACK_LOCAL_FEE_BPS = 150;
const PAYSTACK_FLAT_FEE_KOBO = 10_000; 
const PAYSTACK_FLAT_FEE_WAIVER_LIMIT_KOBO = 250_000; 
const PAYSTACK_FEE_CAP_KOBO = 200_000; 

function pctOf(kobo: number, bps: number) {
  return Math.ceil((kobo * bps) / PERCENT_DENOMINATOR);
}

function paystackFeeFor(kobo: number) {
  const pct = pctOf(kobo, PAYSTACK_LOCAL_FEE_BPS);
  const flat = kobo < PAYSTACK_FLAT_FEE_WAIVER_LIMIT_KOBO ? 0 : PAYSTACK_FLAT_FEE_KOBO;
  return Math.min(pct + flat, PAYSTACK_FEE_CAP_KOBO);
}

export interface FeeBreakdown {
  subtotalKobo: number;
  serviceFeeKobo: number;
  processingFeeKobo: number;
  totalKobo: number;
}

export function calcBreakdown(priceNaira: number, qty: number): FeeBreakdown {
  const subtotalKobo = Math.round(priceNaira * qty * 100);
  const platformCommission = pctOf(subtotalKobo, PLATFORM_COMMISSION_BPS);
  const serviceFeeKobo = pctOf(platformCommission, CUSTOMER_PLATFORM_SHARE_BPS);
  const beforePaystack = subtotalKobo + serviceFeeKobo;

  let totalKobo = beforePaystack;
  for (let i = 0; i < 10; i++) {
    const fee = paystackFeeFor(totalKobo);
    const next = beforePaystack + fee;
    if (next === totalKobo) break;
    totalKobo = next;
  }

  const processingFeeKobo = paystackFeeFor(totalKobo);

  return { subtotalKobo, serviceFeeKobo, processingFeeKobo, totalKobo };
}

export function formatKobo(kobo: number): string {
  return `₦${(kobo / 100).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}