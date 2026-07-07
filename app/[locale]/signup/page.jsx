import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { User, Baby } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SignupPage() {
  const t = useTranslations("signup");
  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden grid lg:grid-cols-2">
      {/* Left Side */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/20 backdrop-blur-3xl" />
        <div className="relative z-10 max-w-lg mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold font-outfit text-gray-900">
            {t("joinLittleHalo")}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            {t("joinDescription")}
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">{t("createYourAccount")}</h2>
            <p className="text-muted-foreground">{t("selectSignupMethod")}</p>
          </div>

          <div className="grid gap-6">
            <Link href="/signup/parent">
              <Card className="group hover:border-primary/50 transition-all hover:shadow-md cursor-pointer border-2 border-transparent hover:bg-primary/5">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-[#ff6b6b] group-hover:scale-110 transition-transform">
                    <Baby className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-lg text-gray-900">{t("imAParent")}</h3>
                    <p className="text-sm text-gray-500">{t("imAParentDesc")}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/signup/sitter">
              <Card className="group hover:border-secondary/50 transition-all hover:shadow-md cursor-pointer border-2 border-transparent hover:bg-secondary/5">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-lg text-gray-900">{t("imASitter")}</h3>
                    <p className="text-sm text-gray-500">{t("imASitterDesc")}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              {t("alreadyHaveAccount")}{" "}
              <Link href="/login" className="text-primary font-bold hover:underline">
                {t("signIn")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
