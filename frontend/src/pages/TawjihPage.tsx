import { useEffect, useState } from "react";
import { AppLayout } from "../components";
import { getTawjihArticles } from "../services/platform";
import type { TawjihArticle } from "../types";

const CATEGORIES = [
  { value: "", label: "Tous" },
  { value: "orientation", label: "Orientation" },
  { value: "bourses", label: "Bourses" },
  { value: "concours", label: "Concours" },
  { value: "metiers", label: "Métiers" },
  { value: "conseils", label: "Conseils" },
];

export function TawjihPage() {
  const [articles, setArticles] = useState<TawjihArticle[]>([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTawjihArticles(category || undefined)
      .then(setArticles)
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Tawjih – Orientation
          </h1>
          <p className="text-gray-500 mt-2">
            Guides, bourses, concours et conseils pour votre parcours scolaire
            au Maroc
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                category === c.value
                  ? "bg-brand-600 text-white"
                  : "bg-white border border-gray-300 text-gray-600 hover:bg-brand-50"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Chargement…</div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            Aucun article trouvé.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => (
              <a
                key={a.id}
                href={`/tawjih/${a.slug}`}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition group"
              >
                {a.thumbnail ? (
                  <img
                    src={a.thumbnail}
                    alt=""
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-brand-50 flex items-center justify-center text-brand-300 text-4xl">
                    📚
                  </div>
                )}
                <div className="p-4">
                  <span className="text-xs px-2 py-0.5 bg-brand-100 text-brand-700 rounded-full capitalize">
                    {a.category}
                  </span>
                  <h3 className="font-semibold text-gray-900 mt-2 group-hover:text-brand-600 transition line-clamp-2">
                    {a.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(a.createdAt).toLocaleDateString("fr-MA")}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
