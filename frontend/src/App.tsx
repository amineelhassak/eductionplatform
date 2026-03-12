import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components";
import { LoginPage, RegisterPage, DashboardPage } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center min-h-screen bg-brand-50">
                <h1 className="text-6xl font-bold text-brand-500">404</h1>
                <p className="mt-2 text-lg text-gray-500">Page not found</p>
                <a
                  href="/"
                  className="mt-4 text-brand-500 hover:text-brand-600 font-medium"
                >
                  Go home
                </a>
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
