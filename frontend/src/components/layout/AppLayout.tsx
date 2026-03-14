import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { label: "Accueil", path: "/" },
  { label: "Cours", path: "/courses" },
  { label: "Examens", path: "/exams" },
  { label: "Profs", path: "/teachers" },
  { label: "Tawjih", path: "/tawjih" },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ─── Navbar ─── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold text-brand-600 tracking-tight"
          >
            EduMaroc
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={`text-sm font-medium transition ${
                  pathname === l.path || pathname.startsWith(l.path + "/")
                    ? "text-brand-600"
                    : "text-gray-600 hover:text-brand-600"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-gray-600 hover:text-brand-600"
                >
                  Tableau de bord
                </Link>
                <Link
                  to="/messages"
                  className="text-sm font-medium text-gray-600 hover:text-brand-600"
                >
                  Messages
                </Link>
                <div className="flex items-center gap-2 ml-2">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-sm font-bold">
                      {user?.name?.charAt(0) ?? "U"}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="text-xs text-gray-400 hover:text-red-500"
                  >
                    Déconnexion
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-brand-600"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-full bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm text-gray-600 hover:text-brand-600"
              >
                {l.label}
              </Link>
            ))}
            <hr className="my-2" />
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm text-gray-600"
                >
                  Tableau de bord
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="text-sm text-red-500 py-2"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm text-gray-600"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm text-brand-600 font-medium"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* ─── Main content ─── */}
      <main className="flex-1">{children}</main>

      {/* ─── Footer ─── */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <h4 className="text-white font-semibold mb-3">EduMaroc</h4>
            <p className="text-xs leading-relaxed">
              La plateforme éducative marocaine pour réussir du collège au
              baccalauréat.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Niveaux</h4>
            <ul className="space-y-1">
              {["1AC", "2AC", "3AC", "TC", "1Bac", "2Bac"].map((l) => (
                <li key={l}>
                  <Link
                    to={`/courses?level=${l}`}
                    className="hover:text-white transition"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Liens</h4>
            <ul className="space-y-1">
              <li>
                <Link to="/exams" className="hover:text-white transition">
                  Examens Nationaux
                </Link>
              </li>
              <li>
                <Link to="/teachers" className="hover:text-white transition">
                  Trouver un prof
                </Link>
              </li>
              <li>
                <Link to="/tawjih" className="hover:text-white transition">
                  Tawjih & Orientation
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <p className="text-xs">contact@edumaroc.ma</p>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} EduMaroc. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}
