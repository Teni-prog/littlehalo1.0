export default function WelcomeBanner({ userName, sessionCount }) {
    return (
        <div className="mb-8 rounded-3xl bg-gradient-to-br from-[#ff6b6b]/35 to-[#14b8a6]/35 p-8 sm:p-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {/* 2. Use the variable here */}
                Welcome back, {userName}! 👋
            </h1>
            <p className="text-lg text-gray-600">
                You have{" "}
                <span className="font-semibold text-[#ff6b6b]">
                    {/* 3. Use the count here */}
                    {sessionCount} upcoming {sessionCount === 1 ? "session" : "sessions"}
                </span>{" "}
                this week
            </p>
        </div>
    )
}