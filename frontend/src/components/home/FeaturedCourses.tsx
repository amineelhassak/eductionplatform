import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const courses = [
  {
    id: 1,
    icon: "\ud83d\udcd0",
    titleKey: "c1Title",
    teacherKey: "c1Teacher",
    levelKey: "c1Level",
    subjectKey: "c1Subject",
    students: "3.2K",
    lessons: 48,
    tagKey: "popular",
  },
  {
    id: 2,
    icon: "\u2697\ufe0f",
    titleKey: "c2Title",
    teacherKey: "c2Teacher",
    levelKey: "c2Level",
    subjectKey: "c2Subject",
    students: "2.8K",
    lessons: 36,
    tagKey: "new",
  },
  {
    id: 3,
    icon: "\ud83e\uddec",
    titleKey: "c3Title",
    teacherKey: "c3Teacher",
    levelKey: "c3Level",
    subjectKey: "c3Subject",
    students: "1.9K",
    lessons: 30,
    tagKey: "popular",
  },
  {
    id: 4,
    icon: "\ud83c\uddeb\ud83c\uddf7",
    titleKey: "c4Title",
    teacherKey: "c4Teacher",
    levelKey: "c4Level",
    subjectKey: "c4Subject",
    students: "2.1K",
    lessons: 24,
    tagKey: "exam",
  },
  {
    id: 5,
    icon: "\ud83d\udcad",
    titleKey: "c5Title",
    teacherKey: "c5Teacher",
    levelKey: "c5Level",
    subjectKey: "c5Subject",
    students: "1.5K",
    lessons: 20,
    tagKey: "new",
  },
  {
    id: 6,
    icon: "\ud83c\uddec\ud83c\udde7",
    titleKey: "c6Title",
    teacherKey: "c6Teacher",
    levelKey: "c6Level",
    subjectKey: "c6Subject",
    students: "1.8K",
    lessons: 28,
    tagKey: "popular",
  },
];

export function FeaturedCourses() {
  const { t } = useTranslation();

  const tagStyle = (tagKey: string) => {
    if (tagKey === "popular")
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";
    if (tagKey === "exam")
      return "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300";
    return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 rounded-full mb-3">
              {t("featuredCourses.badge")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              {t("featuredCourses.title")}
            </h2>
            <p className="mt-2 text-gray-500 dark:text-dark-muted max-w-lg">
              {t("featuredCourses.description")}
            </p>
          </div>
          <Link
            to="/courses"
            className="mt-4 sm:mt-0 text-sm font-semibold text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
          >
            {t("featuredCourses.viewAll")}
          </Link>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              to="/courses"
              className="group bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden hover:shadow-xl hover:shadow-brand-100/30 dark:hover:shadow-brand-900/20 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image placeholder */}
              <div className="relative h-44 bg-linear-to-br from-brand-50 to-brand-100 dark:from-brand-900/30 dark:to-brand-800/30 flex items-center justify-center">
                <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                  {course.icon}
                </span>
                <span
                  className={`absolute top-3 left-3 rtl:left-auto rtl:right-3 px-2.5 py-0.5 text-xs font-bold rounded-full ${tagStyle(course.tagKey)}`}
                >
                  {t(`featuredCourses.${course.tagKey}`)}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 rounded-full font-medium">
                    {t(`featuredCourses.${course.levelKey}`)}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                    {t(`featuredCourses.${course.subjectKey}`)}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {t(`featuredCourses.${course.titleKey}`)}
                </h3>
                <p className="text-xs text-gray-400 dark:text-dark-muted mt-1">
                  {t(`featuredCourses.${course.teacherKey}`)}
                </p>

                <div className="flex items-center justify-between mt-4 text-xs text-gray-400 dark:text-dark-muted">
                  <span>
                    {course.students} {t("featuredCourses.students")}
                  </span>
                  <span>
                    {course.lessons} {t("featuredCourses.lessons")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
