import { Info } from "lucide-react";

interface TooltipProps {
  text: string;
}

export function Tooltip({ text }: TooltipProps) {
  return (
    <div className="relative group/tip inline-block">
      <Info className="h-3.5 w-3.5 text-gray-400 cursor-help" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-gray-900 text-white text-[11px] leading-relaxed rounded-xl px-3 py-2 opacity-0 group-hover/tip:opacity-100 pointer-events-none transition-opacity z-20 shadow-xl">
        {text}
        {/* Caret */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
}