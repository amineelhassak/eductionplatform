import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function Hero() {
  const { t } = useTranslation();

  const stats = [
    { value: t("hero.stat1Value"), label: t("hero.stat1Label") },
    { value: t("hero.stat2Value"), label: t("hero.stat2Label") },
    { value: t("hero.stat3Value"), label: t("hero.stat3Label") },
  ];

  const levels = [
    { label: t("hero.level1"), icon: "🏫" },
    { label: t("hero.level2"), icon: "📘" },
    { label: t("hero.level3"), icon: "🎯" },
  ];

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-brand-50 via-white to-brand-50 dark:from-dark-bg dark:via-gray-900 dark:to-dark-bg">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-100 dark:bg-brand-900/30 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-200 dark:bg-brand-800/20 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/3" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-100 dark:bg-brand-900/40 rounded-full mb-6">
              {t("hero.badge")}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {t("hero.titleStart")}{" "}
              <span className="text-brand-500">{t("hero.titleHighlight")}</span>
            </h1>
            <p className="mt-5 text-lg text-gray-500 dark:text-dark-muted leading-relaxed">
              {t("hero.description")}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/courses"
                className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-2xl shadow-lg shadow-brand-500/25 transition-all active:scale-[0.98] text-center"
              >
                {t("hero.exploreCourses")}
              </Link>
              <Link
                to="/exams"
                className="px-8 py-4 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-700 dark:text-dark-text font-semibold rounded-2xl hover:border-brand-300 hover:text-brand-600 dark:hover:text-brand-400 transition-all text-center"
              >
                {t("hero.nationalExams")}
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {s.value}
                  </p>
                  <p className="text-sm text-gray-400 dark:text-dark-muted">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-4 -left-4 w-64 h-44 bg-brand-100 dark:bg-brand-900/30 rounded-2xl -rotate-6" />
              <div className="absolute -bottom-4 -right-4 w-64 h-44 bg-brand-200 dark:bg-brand-800/30 rounded-2xl rotate-6" />
              <div className="relative bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-dark-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {t("hero.chooseLevel")}
                    </p>
                    <p className="text-sm text-gray-400 dark:text-dark-muted">
                      {t("hero.fromMiddleToBac")}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {levels.map((c) => (
                    <div
                      key={c.label}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
                    >
                      <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-sm">
                        {c.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {c.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-2">
                  <div className="flex -space-x-2 rtl:space-x-reverse">
                    {["🇲🇦", "📖", "✏️", "⭐"].map((e, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/40 border-2 border-white dark:border-dark-card flex items-center justify-center text-xs"
                      >
                        {e}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 dark:text-dark-muted">
                    {t("hero.joinStudents")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
