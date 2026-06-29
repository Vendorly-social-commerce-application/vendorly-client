interface SpinnerScreenProps {
  message: string;
}

export function SpinnerScreen({ message }: SpinnerScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="text-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-200 rounded-full mx-auto mb-6" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 border-4 border-transparent border-t-[#10b981] rounded-full animate-spin" />
        </div>
        <p className="text-lg font-medium text-gray-900 mb-2">{message}</p>
        <p className="text-sm text-gray-500">Please wait…</p>
      </div>
    </div>
  );
}