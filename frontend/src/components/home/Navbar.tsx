import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { ThemeLangSwitcher } from "./ThemeLangSwitcher";

const levelKeys = ["AC1", "AC2", "AC3", "TCS", "BAC1", "BAC2"] as const;

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [levelOpen, setLevelOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-dark-bg border-b border-gray-100 dark:border-dark-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="hidden sm:block text-xl font-bold text-gray-900 dark:text-white">
              Edu<span className="text-brand-500">Maroc</span>
            </span>
          </Link>

          {/* Desktop — Levels dropdown */}
          <div className="hidden lg:block relative">
            <button
              onClick={() => setLevelOpen(!levelOpen)}
              className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors cursor-pointer"
            >
              {t("nav.levels")}
              <svg
                className={`w-4 h-4 transition-transform ${levelOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {levelOpen && (
              <>
                <div
                  className="fixed inset-0"
                  onClick={() => setLevelOpen(false)}
                />
                <div className="absolute top-full inset-s-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-50">
                  {levelKeys.map((key) => (
                    <Link
                      key={key}
                      to={`/courses?level=${key}`}
                      onClick={() => setLevelOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                    >
                      {t(`levels.${key}`)}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-5">
            {(["courses", "exams", "teachers", "tawjih"] as const).map((k) => (
              <Link
                key={k}
                to={`/${k}`}
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
              >
                {t(`nav.${k}`)}
              </Link>
            ))}
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <svg
                className="absolute inset-s-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <input
                type="text"
                placeholder={t("nav.search")}
                className="w-full ps-10 pe-4 py-2.5 bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-full text-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-dark-text outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/50 transition-all"
              />
            </div>
          </div>

          {/* Theme & Language */}
          <ThemeLangSwitcher />

          {/* Auth buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                >
                  {t("nav.mySpace")}
                </Link>
                <Link
                  to="/messages"
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                >
                  {t("nav.messages")}
                </Link>
                <div className="flex items-center gap-2 ms-1">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-brand-600 dark:text-brand-400 text-sm font-bold">
                      {user?.name?.charAt(0) ?? "U"}
                    </div>
                  )}
                  <button
                    onClick={logout}
                    className="text-xs text-gray-400 hover:text-red-500 cursor-pointer"
                  >
                    {t("nav.logout")}
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-semibold text-brand-500 border border-brand-500 rounded-full hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-semibold text-white bg-brand-500 rounded-full hover:bg-brand-600 shadow-md shadow-brand-500/20 transition-all"
                >
                  {t("nav.register")}
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-brand-500 cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 dark:border-dark-border bg-white dark:bg-dark-bg px-4 pb-4">
          <div className="md:hidden py-3">
            <input
              type="text"
              placeholder={t("nav.searchMobile")}
              className="w-full ps-4 pe-4 py-2.5 bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-full text-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-dark-text outline-none focus:border-brand-500"
            />
          </div>
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
            {t("nav.levels")}
          </p>
          {levelKeys.map((key) => (
            <Link
              key={key}
              to={`/courses?level=${key}`}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-brand-500"
            >
              {t(`levels.${key}`)}
            </Link>
          ))}
          <hr className="my-3 border-gray-100 dark:border-dark-border" />
          {(["courses", "exams", "teachers", "tawjih"] as const).map((k) => (
            <Link
              key={k}
              to={`/${k}`}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brand-500"
            >
              {t(`nav.${k}`)}
            </Link>
          ))}
          <div className="flex gap-3 mt-4 sm:hidden">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2 text-sm font-semibold text-brand-500 border border-brand-500 rounded-full"
                >
                  {t("nav.mySpace")}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="flex-1 text-center px-4 py-2 text-sm font-semibold text-red-500 border border-red-300 rounded-full cursor-pointer"
                >
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2 text-sm font-semibold text-brand-500 border border-brand-500 rounded-full hover:bg-brand-50 dark:hover:bg-brand-900/30"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2 text-sm font-semibold text-white bg-brand-500 rounded-full hover:bg-brand-600"
                >
                  {t("nav.register")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
