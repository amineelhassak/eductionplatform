import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AppLayout } from "../components";
import { getTeacher, createBooking } from "../services/platform";
import { useAuth } from "../context/AuthContext";
import type { TeacherProfile } from "../types";
import { SUBJECT_LABELS, LEVEL_LABELS } from "../types";

const DAYS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

export function TeacherDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  // Booking form
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [mode, setMode] = useState("online");
  const [subject, setSubject] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    getTeacher(id)
      .then(setTeacher)
      .catch(() => navigate("/teachers"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!id) return;
    setSubmitting(true);
    try {
      await createBooking({
        teacherId: id,
        date,
        startTime,
        endTime,
        mode: mode as "online" | "in_person" | "both",
        subject,
        note,
      });
      alert("Réservation envoyée !");
      setShowBooking(false);
    } catch {
      alert("Erreur lors de la réservation.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading)
    return (
      <AppLayout>
        <div className="text-center py-20 text-gray-400">Chargement…</div>
      </AppLayout>
    );
  if (!teacher) return null;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {teacher.user.avatar ? (
              <img
                src={teacher.user.avatar}
                alt=""
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-2xl font-bold">
                {teacher.user.name?.charAt(0) ?? "P"}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {teacher.user.name}
              </h1>
              {teacher.city && (
                <p className="text-sm text-gray-500">{teacher.city}</p>
              )}
              <div className="flex items-center gap-3 mt-2 text-sm">
                <span className="text-yellow-500">
                  ⭐ {teacher.rating.toFixed(1)}
                </span>
                {teacher.pricePerHour != null && (
                  <span className="font-semibold text-brand-600">
                    {teacher.pricePerHour} DH/h
                  </span>
                )}
                {teacher.isVerified && (
                  <span className="text-green-600">✅ Vérifié</span>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowBooking(true)}
              className="px-6 py-2.5 rounded-full bg-brand-600 text-white font-medium hover:bg-brand-700 transition"
            >
              Réserver un cours
            </button>
          </div>
          {teacher.bio && (
            <p className="text-gray-600 text-sm mt-4">{teacher.bio}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-4">
            {teacher.subjects.map((s) => (
              <span
                key={s}
                className="text-xs px-2 py-0.5 bg-brand-100 text-brand-700 rounded-full"
              >
                {SUBJECT_LABELS[s]}
              </span>
            ))}
            {teacher.levels.map((l) => (
              <span
                key={l}
                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
              >
                {LEVEL_LABELS[l]}
              </span>
            ))}
          </div>
        </div>

        {/* Availability */}
        {teacher.availability && teacher.availability.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              Disponibilités
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {teacher.availability.map((a) => (
                <div key={a.id} className="p-2 bg-green-50 rounded-lg text-sm">
                  <span className="font-medium text-green-800">
                    {DAYS[a.dayOfWeek]}
                  </span>
                  <span className="text-green-600 ml-2">
                    {a.startTime} - {a.endTime}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Courses */}
        {teacher.courses && teacher.courses.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              Cours publiés
            </h2>
            <div className="space-y-2">
              {teacher.courses.map((c) => (
                <Link
                  key={c.id}
                  to={`/courses/${c.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <div>
                    <h3 className="font-medium text-gray-800">{c.title}</h3>
                    <span className="text-xs text-gray-400">
                      {SUBJECT_LABELS[c.subject]} · {LEVEL_LABELS[c.level]}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {c._count?.enrollments ?? 0} élèves
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Booking modal */}
        {showBooking && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <form
              onSubmit={handleBooking}
              className="bg-white rounded-xl p-6 w-full max-w-md space-y-4"
            >
              <h2 className="text-lg font-bold text-gray-900">
                Réserver un cours
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Mode</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="online">En ligne</option>
                    <option value="in_person">Présentiel</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Début</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Fin</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500">Matière</label>
                <select
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Choisir…</option>
                  {teacher.subjects.map((s) => (
                    <option key={s} value={s}>
                      {SUBJECT_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">
                  Note (optionnel)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBooking(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  disabled={submitting}
                  className="px-5 py-2 bg-brand-600 text-white text-sm rounded-full hover:bg-brand-700 transition disabled:opacity-50"
                >
                  {submitting ? "Envoi…" : "Confirmer"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
