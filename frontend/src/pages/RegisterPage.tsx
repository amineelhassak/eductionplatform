import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { GoogleLoginButton } from "../components";

export function RegisterPage() {
  const { registerWithEmail, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      await registerWithEmail(email, password, fullName);
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ===== Left Panel — Brand (same as Login) ===== */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-b from-brand-400 via-brand-500 to-brand-900 rounded-r-3xl">
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
              to="/login"
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
              Create Account
            </h1>
            <p className="text-gray-500 mt-1 text-base">
              Start your learning journey today
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First Name */}
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
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </span>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="First Name"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-full text-base text-gray-700 placeholder-gray-400 outline-none transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:bg-white"
              />
            </div>

            {/* Last Name */}
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
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </span>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Last Name"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-full text-base text-gray-700 placeholder-gray-400 outline-none transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:bg-white"
              />
            </div>

            {/* Mobile Number */}
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
                    d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                  />
                </svg>
              </span>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Mobile Number"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-full text-base text-gray-700 placeholder-gray-400 outline-none transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:bg-white"
              />
            </div>

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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Password"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-full text-base text-gray-700 placeholder-gray-400 outline-none transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:bg-white"
              />
            </div>

            {/* Confirm Password */}
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
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Confirm Password"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-full text-base text-gray-700 placeholder-gray-400 outline-none transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:bg-white"
              />
            </div>

            {/* Register button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 text-base font-semibold text-white bg-brand-500 hover:bg-brand-600 active:bg-brand-700 rounded-full shadow-lg shadow-brand-500/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <hr className="flex-1 border-gray-200" />
            <span className="text-sm text-gray-400">or</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          {/* Google */}
          <GoogleLoginButton />

          {/* Sign in link */}
          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-brand-500 hover:text-brand-600 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
