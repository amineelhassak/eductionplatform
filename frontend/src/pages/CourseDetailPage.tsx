import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "../components";
import { getCourse, enrollCourse, addReview } from "../services/platform";
import { useAuth } from "../context/AuthContext";
import type { Course, LessonType } from "../types";
import { LEVEL_LABELS, SUBJECT_LABELS } from "../types";

const LESSON_ICONS: Record<LessonType, string> = {
  video: "🎬",
  pdf: "📄",
  exercise: "✏️",
  exam: "📝",
  correction: "✅",
};

export function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!id) return;
    getCourse(id)
      .then(setCourse)
      .catch(() => navigate("/courses"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  async function handleEnroll() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!id) return;
    setEnrolling(true);
    try {
      await enrollCourse(id);
      alert("Inscription réussie !");
    } catch {
      alert("Vous êtes déjà inscrit.");
    } finally {
      setEnrolling(false);
    }
  }

  async function handleReview(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    await addReview(id, { rating, comment });
    setComment("");
    const updated = await getCourse(id);
    setCourse(updated);
  }

  if (loading)
    return (
      <AppLayout>
        <div className="text-center py-20 text-gray-400">Chargement…</div>
      </AppLayout>
    );
  if (!course) return null;

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt=""
              className="w-full md:w-72 h-48 rounded-xl object-cover"
            />
          ) : (
            <div className="w-full md:w-72 h-48 rounded-xl bg-brand-100 flex items-center justify-center text-brand-400 text-5xl font-bold">
              {SUBJECT_LABELS[course.subject]?.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-0.5 bg-brand-100 text-brand-700 rounded-full font-medium">
                {LEVEL_LABELS[course.level]}
              </span>
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                {SUBJECT_LABELS[course.subject]}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {course.title}
            </h1>
            <p className="text-gray-500 text-sm mb-4">{course.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span>⭐ {course.avgRating?.toFixed(1) ?? "–"}</span>
              <span>{course._count?.enrollments ?? 0} élèves</span>
              <span>{course._count?.lessons ?? 0} leçons</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Par{" "}
              <span className="font-medium text-brand-600">
                {course.teacher?.user?.name ?? "Enseignant"}
              </span>
            </p>
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="px-6 py-2.5 rounded-full bg-brand-600 text-white font-medium hover:bg-brand-700 transition disabled:opacity-50"
            >
              {enrolling ? "Inscription…" : "S'inscrire au cours"}
            </button>
          </div>
        </div>

        {/* Lessons */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Contenu du cours
          </h2>
          {course.lessons && course.lessons.length > 0 ? (
            <div className="space-y-2">
              {course.lessons.map((l, i) => (
                <div
                  key={l.id}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
                >
                  <span className="text-lg">{LESSON_ICONS[l.type]}</span>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-800">
                      {i + 1}. {l.title}
                    </span>
                    {l.duration && (
                      <span className="ml-2 text-xs text-gray-400">
                        {l.duration} min
                      </span>
                    )}
                  </div>
                  <a
                    href={l.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-brand-600 hover:underline"
                  >
                    Ouvrir
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              Aucune leçon pour le moment.
            </p>
          )}
        </section>

        {/* Reviews */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Avis</h2>
          {course.reviews && course.reviews.length > 0 ? (
            <div className="space-y-3 mb-6">
              {course.reviews.map((r) => (
                <div
                  key={r.id}
                  className="p-3 bg-white rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-800">
                      {r.user?.name ?? "Élève"}
                    </span>
                    <span className="text-xs text-yellow-500">
                      {"⭐".repeat(r.rating)}
                    </span>
                  </div>
                  {r.comment && (
                    <p className="text-sm text-gray-600">{r.comment}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 mb-4">
              Aucun avis pour le moment.
            </p>
          )}

          {isAuthenticated && (
            <form
              onSubmit={handleReview}
              className="bg-white p-4 rounded-lg border border-gray-200 space-y-3"
            >
              <h3 className="text-sm font-semibold text-gray-800">
                Laisser un avis
              </h3>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Note :</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} ⭐
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Votre commentaire (optionnel)"
                rows={2}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
              <button className="px-4 py-2 bg-brand-600 text-white text-sm rounded-full hover:bg-brand-700 transition">
                Publier
              </button>
            </form>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
