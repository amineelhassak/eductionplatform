import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "../components";
import { getTeacherDashboard } from "../services/platform";
import type { TeacherDashboardData } from "../types";

export function TeacherDashboardPage() {
  const [data, setData] = useState<TeacherDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeacherDashboard()
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
          Tableau de bord enseignant
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <p className="text-3xl font-bold text-brand-600">
              {data.courses.length}
            </p>
            <p className="text-sm text-gray-500">Cours</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <p className="text-3xl font-bold text-brand-600">
              {data.totalStudents}
            </p>
            <p className="text-sm text-gray-500">Élèves</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <p className="text-3xl font-bold text-brand-600">
              {data.totalEarnings} DH
            </p>
            <p className="text-sm text-gray-500">Revenus</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <p className="text-3xl font-bold text-brand-600">
              {data.unreadMessages}
            </p>
            <p className="text-sm text-gray-500">Messages non lus</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Courses */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Mes cours</h2>
            {data.courses.length === 0 ? (
              <p className="text-sm text-gray-400">Aucun cours créé.</p>
            ) : (
              <div className="space-y-2">
                {data.courses.map((c) => (
                  <Link
                    key={c.id}
                    to={`/courses/${c.id}`}
                    className="block bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition"
                  >
                    <h3 className="font-medium text-gray-800">{c.title}</h3>
                    <div className="flex gap-3 mt-1 text-xs text-gray-400">
                      <span>{c._count?.enrollments ?? 0} élèves</span>
                      <span>{c._count?.lessons ?? 0} leçons</span>
                      <span>{c._count?.reviews ?? 0} avis</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Bookings */}
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
                {data.bookings.slice(0, 8).map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-lg border border-gray-200 p-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {b.student?.name ?? "Élève"}
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
                          : b.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
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
      </div>
    </AppLayout>
  );
}
