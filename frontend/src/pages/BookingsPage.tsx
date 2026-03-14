import { useEffect, useState } from "react";
import { AppLayout } from "../components";
import { getBookings, updateBookingStatus } from "../services/platform";
import type { Booking, BookingStatus } from "../types";
import { SUBJECT_LABELS } from "../types";

const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  cancelled: "Annulé",
  completed: "Terminé",
};

export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookings()
      .then(setBookings)
      .finally(() => setLoading(false));
  }, []);

  async function handleStatusChange(id: string, status: string) {
    const updated = await updateBookingStatus(id, status);
    setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
  }

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Mes Réservations
        </h1>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Chargement…</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            Aucune réservation.
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[b.status]}`}
                    >
                      {STATUS_LABELS[b.status]}
                    </span>
                    <span className="text-xs text-gray-400 capitalize">
                      {b.mode === "online" ? "En ligne" : "Présentiel"}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {SUBJECT_LABELS[b.subject as keyof typeof SUBJECT_LABELS] ??
                      b.subject}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(b.date).toLocaleDateString("fr-MA")} ·{" "}
                    {b.startTime} – {b.endTime}
                  </p>
                  {b.student && (
                    <p className="text-xs text-gray-400 mt-1">
                      Élève : {b.student.name}
                    </p>
                  )}
                  {b.teacher?.user && (
                    <p className="text-xs text-gray-400 mt-1">
                      Prof : {b.teacher.user.name}
                    </p>
                  )}
                  {b.note && (
                    <p className="text-xs text-gray-400 mt-1 italic">
                      {b.note}
                    </p>
                  )}
                </div>
                {b.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(b.id, "confirmed")}
                      className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-full hover:bg-green-700 transition"
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={() => handleStatusChange(b.id, "cancelled")}
                      className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-full hover:bg-red-600 transition"
                    >
                      Annuler
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
