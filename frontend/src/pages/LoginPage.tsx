import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { GoogleLoginButton } from "../components";

export function LoginPage() {
  const { loginWithEmail, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/dashboard";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await loginWithEmail(email, password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ===== Left Panel — Brand ===== */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-b from-brand-400 via-brand-500 to-brand-900 rounded-r-3xl">
        {/* Decorative circles */}
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full border border-brand-300/30" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full border border-brand-300/20" />
        <div className="absolute top-20 right-10 w-32 h-32 rounded-full bg-brand-400/20" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-end p-12 pb-24">
          <h2 className="text-4xl font-extrabold text-white mb-3">
            Platform Learning
          </h2>
          <p className="text-brand-200 text-lg max-w-sm">
            The best platform to grow your skills and advance your career.
          </p>
          <div className="mt-6">
            <Link
              to="/register"
              className="inline-block px-6 py-2.5 text-sm font-semibold text-white bg-brand-300/30 hover:bg-brand-300/50 border border-brand-300/40 rounded-full backdrop-blur-sm transition-all duration-200"
            >
              Read More
            </Link>
          </div>
        </div>
      </div>

      {/* ===== Right Panel — Form ===== */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Hello Again!
            </h1>
            <p className="text-gray-500 mt-1 text-base">Welcome Back</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-full text-base text-gray-700 placeholder-gray-400 outline-none transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:bg-white"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Password"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-full text-base text-gray-700 placeholder-gray-400 outline-none transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:bg-white"
              />
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 text-base font-semibold text-white bg-brand-500 hover:bg-brand-600 active:bg-brand-700 rounded-full shadow-lg shadow-brand-500/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? "Signing in..." : "Login"}
            </button>
          </form>

          {/* Forgot password */}
          <p className="text-center text-sm text-brand-500 hover:text-brand-600 font-medium mt-5 cursor-pointer">
            Forgot Password
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <hr className="flex-1 border-gray-200" />
            <span className="text-sm text-gray-400">or</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          {/* Google */}
          <GoogleLoginButton />

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-500 mt-8">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-brand-500 hover:text-brand-600 font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
