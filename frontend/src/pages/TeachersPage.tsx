import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AppLayout } from "../components";
import { getTeachers } from "../services/platform";
import type { TeacherProfile, SchoolLevel, Subject } from "../types";
import { LEVEL_LABELS, SUBJECT_LABELS } from "../types";

const LEVELS = Object.keys(LEVEL_LABELS) as SchoolLevel[];
const SUBJECTS = Object.keys(SUBJECT_LABELS) as Subject[];

export function TeachersPage() {
  const [params, setParams] = useSearchParams();
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const subject = params.get("subject") || "";
  const level = params.get("level") || "";
  const city = params.get("city") || "";
  const search = params.get("search") || "";

  useEffect(() => {
    setLoading(true);
    const q: Record<string, string> = {};
    if (subject) q.subject = subject;
    if (level) q.level = level;
    if (city) q.city = city;
    if (search) q.search = search;
    getTeachers(q)
      .then((r) => {
        setTeachers(r.teachers);
        setTotal(r.total);
      })
      .finally(() => setLoading(false));
  }, [subject, level, city, search]);

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Trouver un Professeur
          </h1>
          <p className="text-gray-500 mt-2">
            Réservez des cours particuliers avec les meilleurs enseignants du
            Maroc
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <select
            value={subject}
            onChange={(e) => setFilter("subject", e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Toutes les matières</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {SUBJECT_LABELS[s]}
              </option>
            ))}
          </select>
          <select
            value={level}
            onChange={(e) => setFilter("level", e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Tous les niveaux</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {LEVEL_LABELS[l]}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Ville…"
            defaultValue={city}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                setFilter("city", (e.target as HTMLInputElement).value);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm w-36"
          />
          <input
            type="text"
            placeholder="Rechercher…"
            defaultValue={search}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                setFilter("search", (e.target as HTMLInputElement).value);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm flex-1 min-w-40"
          />
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Chargement…</div>
        ) : teachers.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            Aucun professeur trouvé.
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {total} professeur(s) trouvé(s)
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((t) => (
                <Link
                  key={t.id}
                  to={`/teachers/${t.id}`}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {t.user.avatar ? (
                      <img
                        src={t.user.avatar}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                        {t.user.name?.charAt(0) ?? "P"}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition">
                        {t.user.name}
                      </h3>
                      {t.city && (
                        <p className="text-xs text-gray-400">{t.city}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {t.subjects.map((s) => (
                      <span
                        key={s}
                        className="text-xs px-2 py-0.5 bg-brand-50 text-brand-700 rounded-full"
                      >
                        {SUBJECT_LABELS[s]}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-yellow-500">
                      ⭐ {t.rating.toFixed(1)}
                    </span>
                    {t.pricePerHour != null && (
                      <span className="font-semibold text-gray-800">
                        {t.pricePerHour} DH/h
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    {t._count?.courses ?? 0} cours · {t._count?.bookings ?? 0}{" "}
                    réservations
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
