export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen relative">
      {/* Background Blobs - Auth pages pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] right-[15%] w-[400px] h-[400px] bg-peach rounded-full mix-blend-multiply filter blur-[80px] opacity-35 animate-blob animation-delay-2000" />
        <div className="absolute top-[40%] left-[10%] w-[450px] h-[450px] bg-coral rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-blob animation-delay-4000" />
        <div className="absolute bottom-[15%] right-[25%] w-[350px] h-[350px] bg-peach/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-25 animate-blob" />
      </div>

      {children}
    </div>
  );
}
