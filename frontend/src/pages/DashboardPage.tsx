import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-brand-600 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-lg">&#x1F393;</span>
            </div>
            <h1 className="text-lg font-bold text-white">Platform Learning</h1>
          </div>
          <div className="flex items-center gap-4">
            {user?.avatar && (
              <img
                src={user.avatar}
                alt={user.name || "Avatar"}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white/30"
              />
            )}
            <span className="text-sm text-brand-100 hidden sm:inline">
              {user?.name || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-brand-600 bg-white hover:bg-brand-50 rounded-lg transition-all duration-200 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome card */}
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-8 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, {user?.name || "Learner"}! &#x1F44B;
          </h2>
          <p className="text-brand-100 text-base">
            You are successfully authenticated. Ready to continue your learning journey.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-1">Courses</p>
            <p className="text-3xl font-bold text-brand-600">0</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-1">Completed</p>
            <p className="text-3xl font-bold text-brand-600">0</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-1">Certificates</p>
            <p className="text-3xl font-bold text-brand-600">0</p>
          </div>
        </div>

        {/* Profile card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center text-sm font-bold">
              &#x1F464;
            </span>
            Your Profile
          </h3>
          <div className="divide-y divide-gray-100">
            <div className="flex py-3">
              <span className="w-32 text-sm font-medium text-gray-500">Email</span>
              <span className="text-sm text-gray-900">{user?.email}</span>
            </div>
            <div className="flex py-3">
              <span className="w-32 text-sm font-medium text-gray-500">Name</span>
              <span className="text-sm text-gray-900">{user?.name || "\u2014"}</span>
            </div>
            <div className="flex py-3">
              <span className="w-32 text-sm font-medium text-gray-500">Provider</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-700">
                {user?.provider}
              </span>
            </div>
            <div className="flex py-3">
              <span className="w-32 text-sm font-medium text-gray-500">User ID</span>
              <span className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">{user?.id}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
