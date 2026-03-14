import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppLayout } from "../components";
import { getExams } from "../services/platform";
import type { Exam, SchoolLevel, Subject } from "../types";
import { LEVEL_LABELS, SUBJECT_LABELS } from "../types";

const LEVELS = Object.keys(LEVEL_LABELS) as SchoolLevel[];
const SUBJECTS = Object.keys(SUBJECT_LABELS) as Subject[];
const YEARS = Array.from({ length: 15 }, (_, i) => 2024 - i);

export function ExamsPage() {
  const [params, setParams] = useSearchParams();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  const level = params.get("level") || "";
  const subject = params.get("subject") || "";
  const year = params.get("year") || "";
  const type = params.get("type") || "";

  useEffect(() => {
    setLoading(true);
    const q: Record<string, string> = {};
    if (level) q.level = level;
    if (subject) q.subject = subject;
    if (year) q.year = year;
    if (type) q.type = type;
    getExams(q)
      .then((r) => setExams(r.exams))
      .finally(() => setLoading(false));
  }, [level, subject, year, type]);

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
            Examens Nationaux & Régionaux
          </h1>
          <p className="text-gray-500 mt-2">
            Téléchargez les sujets et corrigés des examens du Maroc
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
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
            value={year}
            onChange={(e) => setFilter("year", e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Toutes les années</option>
            {YEARS.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
          <select
            value={type}
            onChange={(e) => setFilter("type", e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Tous types</option>
            <option value="national">National</option>
            <option value="regional">Régional</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Chargement…</div>
        ) : exams.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            Aucun examen trouvé.
          </div>
        ) : (
          <div className="space-y-3">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs px-2 py-0.5 bg-brand-100 text-brand-700 rounded-full">
                      {LEVEL_LABELS[exam.level]}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                      {SUBJECT_LABELS[exam.subject]}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">
                      {exam.year}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full capitalize">
                      {exam.type}
                    </span>
                    {exam.session && (
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                        {exam.session}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={exam.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-brand-600 text-white text-sm rounded-full hover:bg-brand-700 transition"
                  >
                    📥 Sujet
                  </a>
                  {exam.correctionUrl && (
                    <a
                      href={exam.correctionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded-full hover:bg-green-700 transition"
                    >
                      ✅ Corrigé
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
