import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function CTA() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-white dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Student CTA */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-brand-500 to-brand-700 p-10 text-white">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <span className="text-4xl mb-4 block">{"\ud83d\udcda"}</span>
              <h3 className="text-2xl font-extrabold mb-3">
                {t("cta.studentTitle")}
              </h3>
              <p className="text-brand-100 mb-6 max-w-sm">
                {t("cta.studentDesc")}
              </p>
              <Link
                to="/register"
                className="inline-block px-8 py-3 bg-white text-brand-600 font-semibold rounded-full hover:bg-brand-50 transition-colors shadow-lg"
              >
                {t("cta.studentBtn")}
              </Link>
            </div>
          </div>

          {/* Teacher CTA */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 p-10 text-white">
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <span className="text-4xl mb-4 block">{"\ud83c\udfeb"}</span>
              <h3 className="text-2xl font-extrabold mb-3">
                {t("cta.teacherTitle")}
              </h3>
              <p className="text-gray-300 mb-6 max-w-sm">
                {t("cta.teacherDesc")}
              </p>
              <Link
                to="/register"
                className="inline-block px-8 py-3 bg-brand-500 text-white font-semibold rounded-full hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/25"
              >
                {t("cta.teacherBtn")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
