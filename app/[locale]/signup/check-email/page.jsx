import { Link } from "@/i18n/navigation";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CheckEmailPage() {
  const t = useTranslations("signupCheckEmail");
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100 max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-[#ff6b6b] rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-red-100">
          <Mail className="w-8 h-8 text-white" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">{t("checkYourEmail")}</h1>
          <p className="text-gray-500 leading-relaxed">
            {t("confirmationLinkSent")}
          </p>
        </div>

        <div className="bg-red-50 rounded-xl p-4 text-sm text-gray-600">
          {t("afterConfirming")}
        </div>

        <p className="text-sm text-gray-400">
          {t("wrongEmail")}{" "}
          <Link href="/signup" className="text-[#ff6b6b] font-medium hover:underline">
            {t("startOver")}
          </Link>
        </p>
      </div>
    </div>
  );
}
