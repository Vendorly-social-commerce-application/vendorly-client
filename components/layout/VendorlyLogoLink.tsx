import Link from "next/link";
import { MessageCircle } from "lucide-react";

interface VendorlyLogoLinkProps {
  className?: string;
}

export default function VendorlyLogoLink({
  className = "",
}: VendorlyLogoLinkProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 rounded-lg text-gray-900 transition-colors hover:text-[#10b981] ${className}`}
      aria-label="Go to Vendorly home"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#10b981]/10 text-[#10b981]">
        <MessageCircle className="h-5 w-5" />
      </span>
      <span className="text-xl font-bold">Vendorly</span>
    </Link>
  );
}
