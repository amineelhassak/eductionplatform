import api from "./api";
import type {
  Course,
  Exam,
  TeacherProfile,
  Booking,
  Message,
  Conversation,
  TawjihArticle,
  StudentDashboardData,
  TeacherDashboardData,
  Enrollment,
  Review,
  Lesson,
} from "../types";

/* ──────────── Courses ──────────── */

interface PaginatedCourses {
  courses: Course[];
  total: number;
  page: number;
}

export async function getCourses(
  params?: Record<string, string>,
): Promise<PaginatedCourses> {
  const { data } = await api.get("/courses", { params });
  return data;
}

export async function getCourse(id: string): Promise<Course> {
  const { data } = await api.get(`/courses/${id}`);
  return data;
}

export async function createCourse(body: Partial<Course>): Promise<Course> {
  const { data } = await api.post("/courses", body);
  return data;
}

export async function enrollCourse(id: string): Promise<Enrollment> {
  const { data } = await api.post(`/courses/${id}/enroll`);
  return data;
}

export async function addLesson(
  courseId: string,
  body: Partial<Lesson>,
): Promise<Lesson> {
  const { data } = await api.post(`/courses/${courseId}/lessons`, body);
  return data;
}

export async function addReview(
  courseId: string,
  body: { rating: number; comment?: string },
): Promise<Review> {
  const { data } = await api.post(`/courses/${courseId}/reviews`, body);
  return data;
}

/* ──────────── Exams ──────────── */

interface PaginatedExams {
  exams: Exam[];
  total: number;
  page: number;
}

export async function getExams(
  params?: Record<string, string>,
): Promise<PaginatedExams> {
  const { data } = await api.get("/exams", { params });
  return data;
}

export async function getExam(id: string): Promise<Exam> {
  const { data } = await api.get(`/exams/${id}`);
  return data;
}

/* ──────────── Teachers ──────────── */

interface PaginatedTeachers {
  teachers: TeacherProfile[];
  total: number;
  page: number;
}

export async function getTeachers(
  params?: Record<string, string>,
): Promise<PaginatedTeachers> {
  const { data } = await api.get("/teachers", { params });
  return data;
}

export async function getTeacher(id: string): Promise<TeacherProfile> {
  const { data } = await api.get(`/teachers/${id}`);
  return data;
}

export async function upsertTeacherProfile(
  body: Partial<TeacherProfile>,
): Promise<TeacherProfile> {
  const { data } = await api.post("/teachers/profile", body);
  return data;
}

/* ──────────── Bookings ──────────── */

export async function createBooking(body: Partial<Booking>): Promise<Booking> {
  const { data } = await api.post("/bookings", body);
  return data;
}

export async function getBookings(): Promise<Booking[]> {
  const { data } = await api.get("/bookings");
  return data;
}

export async function updateBookingStatus(
  id: string,
  status: string,
): Promise<Booking> {
  const { data } = await api.patch(`/bookings/${id}/status`, { status });
  return data;
}

/* ──────────── Messages ──────────── */

export async function sendMessage(
  receiverId: string,
  content: string,
): Promise<Message> {
  const { data } = await api.post("/messages", { receiverId, content });
  return data;
}

export async function getConversations(): Promise<Conversation[]> {
  const { data } = await api.get("/messages/conversations");
  return data;
}

export async function getMessages(userId: string): Promise<Message[]> {
  const { data } = await api.get(`/messages/${userId}`);
  return data;
}

/* ──────────── Tawjih ──────────── */

export async function getTawjihArticles(
  category?: string,
): Promise<TawjihArticle[]> {
  const { data } = await api.get("/tawjih", {
    params: category ? { category } : {},
  });
  return data;
}

export async function getTawjihArticle(slug: string): Promise<TawjihArticle> {
  const { data } = await api.get(`/tawjih/${slug}`);
  return data;
}

/* ──────────── Dashboard ──────────── */

export async function getStudentDashboard(): Promise<StudentDashboardData> {
  const { data } = await api.get("/dashboard/student");
  return data;
}

export async function getTeacherDashboard(): Promise<TeacherDashboardData> {
  const { data } = await api.get("/dashboard/teacher");
  return data;
}
