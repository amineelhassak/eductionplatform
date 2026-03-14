import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const teachers = [
  { id: 1, avatar: "\ud83d\udc68\u200d\ud83c\udfeb", nameKey: "t1Name", subjectKey: "t1Subject", cityKey: "t1City", students: "3.2K", courses: 12, rating: 4.9 },
  { id: 2, avatar: "\ud83d\udc69\u200d\ud83d\udd2c", nameKey: "t2Name", subjectKey: "t2Subject", cityKey: "t2City", students: "2.8K", courses: 8, rating: 4.8 },
  { id: 3, avatar: "\ud83d\udc68\u200d\ud83d\udcbb", nameKey: "t3Name", subjectKey: "t3Subject", cityKey: "t3City", students: "1.9K", courses: 6, rating: 4.7 },
  { id: 4, avatar: "\ud83d\udc69\u200d\ud83c\udfeb", nameKey: "t4Name", subjectKey: "t4Subject", cityKey: "t4City", students: "2.4K", courses: 10, rating: 4.8 },
];

export function TopInstructors() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-white dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 rounded-full mb-3">
            {t("topTeachers.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            {t("topTeachers.title")}
          </h2>
          <p className="mt-3 text-gray-500 dark:text-dark-muted max-w-xl mx-auto">
            {t("topTeachers.description")}
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="group text-center p-6 bg-gray-50 dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl hover:shadow-brand-100/30 dark:hover:shadow-brand-900/20 hover:border-brand-200 dark:hover:border-brand-700 transition-all duration-300"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300">
                {teacher.avatar}
              </div>
              <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
                {t(`topTeachers.${teacher.nameKey}`)}
              </h3>
              <p className="text-sm text-brand-500 dark:text-brand-400 font-medium">
                {t(`topTeachers.${teacher.subjectKey}`)}
              </p>
              <p className="text-xs text-gray-400 dark:text-dark-muted">
                {t(`topTeachers.${teacher.cityKey}`)}
              </p>

              <div className="flex items-center justify-center gap-1 mt-3">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{teacher.rating}</span>
              </div>

              <div className="flex justify-center gap-6 mt-4 text-xs text-gray-400 dark:text-dark-muted">
                <span>{teacher.students} {t("topTeachers.students")}</span>
                <span>{teacher.courses} {t("topTeachers.courses")}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            to="/teachers"
            className="inline-block px-6 py-3 text-sm font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 rounded-full hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors"
          >
            {t("topTeachers.viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
