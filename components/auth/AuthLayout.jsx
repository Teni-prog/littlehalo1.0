import { AuthNavbar } from "./AuthNavbar";

export function AuthLayout({ children }) {
  return (
    <>
      <AuthNavbar />

      <div className="pt-16 min-h-screen flex items-center py-12 sm:py-16 lg:py-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </>
  );
}
