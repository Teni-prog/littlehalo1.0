import { useTranslations } from "next-intl";

export default function WelcomeBanner({ userName, sessionCount }) {
  const t = useTranslations("welcomeBanner");
  const firstName = userName?.trim().split(/\s+/)[0] || userName;

  return (
    <div className="mb-8 rounded-3xl bg-gradient-to-br from-[#ff6b6b]/35 to-[#14b8a6]/35 p-8 sm:p-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
        {t("welcomeMessage", { name: firstName })}
      </h1>
      <p className="text-lg text-gray-600">
        {sessionCount > 0 ? (
          <>
            {t("youHave")}{" "}
            <span className="font-semibold text-[#ff6b6b]">
              {t("sessionCountLabel", { count: sessionCount })}
            </span>{" "}
            {t("thisWeek")}
          </>
        ) : (
          t("noUpcomingSessions")
        )}
      </p>
    </div>
  );
}
