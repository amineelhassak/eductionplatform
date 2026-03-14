import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "../components";
import { getStudentDashboard } from "../services/platform";
import type { StudentDashboardData } from "../types";
import { SUBJECT_LABELS, LEVEL_LABELS } from "../types";

export function StudentDashboardPage() {
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentDashboard()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <AppLayout>
        <div className="text-center py-20 text-gray-400">Chargement…</div>
      </AppLayout>
    );
  if (!data)
    return (
      <AppLayout>
        <div className="text-center py-20 text-gray-400">
          Erreur de chargement.
        </div>
      </AppLayout>
    );

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Mon espace élève
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <p className="text-3xl font-bold text-brand-600">
              {data.enrollments.length}
            </p>
            <p className="text-sm text-gray-500">Cours suivis</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <p className="text-3xl font-bold text-brand-600">
              {data.savedLessons.length}
            </p>
            <p className="text-sm text-gray-500">Leçons sauvegardées</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <p className="text-3xl font-bold text-brand-600">
              {data.bookings.length}
            </p>
            <p className="text-sm text-gray-500">Réservations</p>
          </div>
        </div>

        {/* Enrolled courses */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Mes cours</h2>
          {data.enrollments.length === 0 ? (
            <p className="text-sm text-gray-400">
              Vous n'êtes inscrit à aucun cours.{" "}
              <Link to="/courses" className="text-brand-600 hover:underline">
                Parcourir les cours
              </Link>
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.enrollments.map((e) => (
                <Link
                  key={e.id}
                  to={`/courses/${e.courseId}`}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition"
                >
                  <h3 className="font-medium text-gray-900">
                    {e.course?.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <span>{LEVEL_LABELS[e.course?.level ?? "AC1"]}</span>
                    <span>·</span>
                    <span>{SUBJECT_LABELS[e.course?.subject ?? "math"]}</span>
                  </div>
                  <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full"
                      style={{ width: `${e.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {e.progress}% complété
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Upcoming bookings */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">
              Réservations récentes
            </h2>
            <Link
              to="/bookings"
              className="text-sm text-brand-600 hover:underline"
            >
              Tout voir
            </Link>
          </div>
          {data.bookings.length === 0 ? (
            <p className="text-sm text-gray-400">Aucune réservation.</p>
          ) : (
            <div className="space-y-2">
              {data.bookings.slice(0, 5).map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-lg border border-gray-200 p-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {SUBJECT_LABELS[
                        b.subject as keyof typeof SUBJECT_LABELS
                      ] ?? b.subject}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(b.date).toLocaleDateString("fr-MA")} ·{" "}
                      {b.startTime}–{b.endTime}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                      b.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
