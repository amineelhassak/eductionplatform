import { useState } from "react";
import { useTranslation } from "react-i18next";

const testimonialKeys = [
  { id: 1, avatar: "\ud83d\udc68\u200d\ud83c\udf93", prefix: "t1", rating: 5 },
  { id: 2, avatar: "\ud83d\udc69\u200d\ud83c\udf93", prefix: "t2", rating: 5 },
  { id: 3, avatar: "\ud83d\udc68\u200d\ud83d\udcbb", prefix: "t3", rating: 5 },
  { id: 4, avatar: "\ud83d\udc69", prefix: "t4", rating: 5 },
];

export function Testimonials() {
  const [active, setActive] = useState(0);
  const { t } = useTranslation();

  const next = () => setActive((prev) => (prev + 1) % testimonialKeys.length);
  const prev = () =>
    setActive((prev) => (prev - 1 + testimonialKeys.length) % testimonialKeys.length);

  const current = testimonialKeys[active];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 rounded-full mb-3">
            {t("testimonials.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            {t("testimonials.title")}
          </h2>
          <p className="mt-3 text-gray-500 dark:text-dark-muted max-w-xl mx-auto">
            {t("testimonials.description")}
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-3xl mx-auto">
          {/* Card */}
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg border border-gray-100 dark:border-dark-border p-8 sm:p-10 text-center">
            {/* Stars */}
            <div className="flex justify-center gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg
                  key={s}
                  className={`w-5 h-5 ${s <= current.rating ? "text-yellow-400" : "text-gray-200 dark:text-gray-600"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            <blockquote className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed italic">
              {t(`testimonials.${current.prefix}Text`)}
            </blockquote>

            <div className="mt-6 flex flex-col items-center">
              <span className="text-3xl mb-2">{current.avatar}</span>
              <p className="font-bold text-gray-900 dark:text-white">
                {t(`testimonials.${current.prefix}Name`)}
              </p>
              <p className="text-sm text-brand-500 dark:text-brand-400">
                {t(`testimonials.${current.prefix}Role`)}
              </p>
            </div>
          </div>

          {/* Nav buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border flex items-center justify-center text-gray-500 dark:text-dark-muted hover:text-brand-500 dark:hover:text-brand-400 hover:border-brand-300 dark:hover:border-brand-700 transition-colors shadow-sm cursor-pointer"
              aria-label={t("testimonials.prev")}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonialKeys.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === active
                      ? "bg-brand-500 w-7"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-brand-300 dark:hover:bg-brand-700"
                  }`}
                  aria-label={`${t("testimonials.goTo")} ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border flex items-center justify-center text-gray-500 dark:text-dark-muted hover:text-brand-500 dark:hover:text-brand-400 hover:border-brand-300 dark:hover:border-brand-700 transition-colors shadow-sm cursor-pointer"
              aria-label={t("testimonials.next")}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
