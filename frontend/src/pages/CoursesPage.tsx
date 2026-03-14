import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AppLayout } from "../components";
import { getCourses } from "../services/platform";
import type { Course, SchoolLevel, Subject } from "../types";
import { LEVEL_LABELS, SUBJECT_LABELS } from "../types";

const LEVELS = Object.keys(LEVEL_LABELS) as SchoolLevel[];
const SUBJECTS = Object.keys(SUBJECT_LABELS) as Subject[];

export function CoursesPage() {
  const [params, setParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const level = params.get("level") || "";
  const subject = params.get("subject") || "";
  const search = params.get("search") || "";
  const page = parseInt(params.get("page") || "1");

  useEffect(() => {
    setLoading(true);
    const q: Record<string, string> = { page: String(page) };
    if (level) q.level = level;
    if (subject) q.subject = subject;
    if (search) q.search = search;
    getCourses(q)
      .then((r) => {
        setCourses(r.courses);
        setTotal(r.total);
      })
      .finally(() => setLoading(false));
  }, [level, subject, search, page]);

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    setParams(next);
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Cours</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <select
            value={level}
            onChange={(e) => setFilter("level", e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
            <option value="">Tous les niveaux</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {LEVEL_LABELS[l]}
              </option>
            ))}
          </select>

          <select
            value={subject}
            onChange={(e) => setFilter("subject", e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
            <option value="">Toutes les matières</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {SUBJECT_LABELS[s]}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Rechercher un cours..."
            defaultValue={search}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                setFilter("search", (e.target as HTMLInputElement).value);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm flex-1 min-w-50 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Chargement…</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            Aucun cours trouvé.
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((c) => (
                <Link
                  key={c.id}
                  to={`/courses/${c.id}`}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition group"
                >
                  {c.thumbnail ? (
                    <img
                      src={c.thumbnail}
                      alt=""
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-brand-100 flex items-center justify-center text-brand-400 text-3xl font-bold">
                      {SUBJECT_LABELS[c.subject]?.charAt(0) ?? "C"}
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-0.5 bg-brand-100 text-brand-700 rounded-full font-medium">
                        {LEVEL_LABELS[c.level]}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                        {SUBJECT_LABELS[c.subject]}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition line-clamp-2">
                      {c.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {c.teacher?.user?.name ?? "Enseignant"}
                    </p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                      <span>⭐ {c.avgRating?.toFixed(1) ?? "–"}</span>
                      <span>{c._count?.enrollments ?? 0} élèves</span>
                      <span>{c._count?.lessons ?? 0} leçons</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {total > 12 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: Math.ceil(total / 12) }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setFilter("page", String(i + 1))}
                    className={`w-9 h-9 rounded-full text-sm font-medium ${
                      page === i + 1
                        ? "bg-brand-600 text-white"
                        : "bg-white border border-gray-300 text-gray-600 hover:bg-brand-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
