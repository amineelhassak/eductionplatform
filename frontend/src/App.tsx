import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ProtectedRoute } from "./components";
import {
  LoginPage,
  RegisterPage,
  DashboardPage,
  HomePage,
  CoursesPage,
  CourseDetailPage,
  ExamsPage,
  TeachersPage,
  TeacherDetailPage,
  TawjihPage,
  TawjihArticlePage,
  MessagesPage,
  BookingsPage,
  StudentDashboardPage,
  TeacherDashboardPage,
} from "./pages";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/exams" element={<ExamsPage />} />
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="/teachers/:id" element={<TeacherDetailPage />} />
            <Route path="/tawjih" element={<TawjihPage />} />
            <Route path="/tawjih/:slug" element={<TawjihArticlePage />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/student"
              element={
                <ProtectedRoute>
                  <StudentDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/teacher"
              element={
                <ProtectedRoute>
                  <TeacherDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <BookingsPage />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
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
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
