import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const subjectKeys = [
  { icon: "📐", key: "math" },
  { icon: "⚗️", key: "physics_chemistry" },
  { icon: "🧬", key: "svt" },
  { icon: "🕌", key: "arabic" },
  { icon: "🇫🇷", key: "french" },
  { icon: "🇬🇧", key: "english" },
  { icon: "💭", key: "philosophy" },
  { icon: "☪️", key: "islamic_education" },
  { icon: "🌍", key: "history_geography" },
];

export function Categories() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-white dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 rounded-full mb-3">
            {t("categories.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            {t("categories.title")}
          </h2>
          <p className="mt-3 text-gray-500 dark:text-dark-muted max-w-xl mx-auto">
            {t("categories.description")}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5">
          {subjectKeys.map((s) => (
            <Link
              key={s.key}
              to={`/courses?subject=${s.key}`}
              className="group flex flex-col items-center p-6 bg-gray-50 dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border hover:border-brand-200 dark:hover:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:shadow-lg hover:shadow-brand-100/50 dark:hover:shadow-brand-900/20 transition-all duration-300"
            >
              <span className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {s.icon}
              </span>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors text-center">
                {t(`categories.${s.key}`)}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
