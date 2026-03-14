import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppLayout } from "../components";
import { getTawjihArticle } from "../services/platform";
import type { TawjihArticle } from "../types";

export function TawjihArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<TawjihArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getTawjihArticle(slug)
      .then(setArticle)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading)
    return (
      <AppLayout>
        <div className="text-center py-20 text-gray-400">Chargement…</div>
      </AppLayout>
    );
  if (!article)
    return (
      <AppLayout>
        <div className="text-center py-20 text-gray-400">
          Article introuvable.
        </div>
      </AppLayout>
    );

  return (
    <AppLayout>
      <article className="max-w-3xl mx-auto px-4 py-10">
        {article.thumbnail && (
          <img
            src={article.thumbnail}
            alt=""
            className="w-full h-56 object-cover rounded-xl mb-6"
          />
        )}
        <span className="text-xs px-2 py-0.5 bg-brand-100 text-brand-700 rounded-full capitalize">
          {article.category}
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mt-3 mb-2">
          {article.title}
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          {new Date(article.createdAt).toLocaleDateString("fr-MA")}
        </p>
        <div
          className="prose prose-brand max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </AppLayout>
  );
}
