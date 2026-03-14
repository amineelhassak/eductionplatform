/* ── School levels and subjects matching the backend enums ── */

export type SchoolLevel = "AC1" | "AC2" | "AC3" | "TCS" | "BAC1" | "BAC2";
export type Subject =
  | "math"
  | "physics_chemistry"
  | "svt"
  | "arabic"
  | "french"
  | "english"
  | "philosophy"
  | "islamic_education"
  | "history_geography";

export type LessonType = "video" | "pdf" | "exercise" | "exam" | "correction";
export type ExamType = "national" | "regional";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type LessonMode = "online" | "in_person" | "both";
export type UserRole = "student" | "teacher" | "admin";

/* ── Readable labels ── */
export const LEVEL_LABELS: Record<SchoolLevel, string> = {
  AC1: "1ère Année Collège",
  AC2: "2ème Année Collège",
  AC3: "3ème Année Collège",
  TCS: "Tronc Commun",
  BAC1: "1ère Année Bac",
  BAC2: "2ème Année Bac",
};

export const SUBJECT_LABELS: Record<Subject, string> = {
  math: "Mathématiques",
  physics_chemistry: "Physique-Chimie",
  svt: "SVT",
  arabic: "Arabe",
  french: "Français",
  english: "Anglais",
  philosophy: "Philosophie",
  islamic_education: "Éducation Islamique",
  history_geography: "Histoire-Géographie",
};

/* ── Data models ── */

export interface TeacherProfile {
  id: string;
  userId: string;
  bio: string | null;
  city: string | null;
  phone: string | null;
  pricePerHour: number | null;
  rating: number;
  subjects: Subject[];
  levels: SchoolLevel[];
  isVerified: boolean;
  user: {
    id: string;
    name: string | null;
    avatar: string | null;
    email?: string;
  };
  _count?: { courses: number; bookings: number };
  courses?: Course[];
  availability?: TeacherAvailability[];
}

export interface TeacherAvailability {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  level: SchoolLevel;
  subject: Subject;
  isPublished: boolean;
  isFeatured: boolean;
  teacherId: string;
  teacher?: TeacherProfile;
  _count?: { enrollments: number; reviews: number; lessons: number };
  avgRating?: number;
  lessons?: Lesson[];
  reviews?: Review[];
  createdAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string | null;
  type: LessonType;
  fileUrl: string;
  duration: number | null;
  sortOrder: number;
  courseId: string;
  course?: { title: string };
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  course?: Course;
  createdAt: string;
}

export interface Exam {
  id: string;
  title: string;
  year: number;
  session: string | null;
  level: SchoolLevel;
  subject: Subject;
  type: ExamType;
  fileUrl: string;
  correctionUrl: string | null;
}

export interface Booking {
  id: string;
  studentId: string;
  teacherId: string;
  date: string;
  startTime: string;
  endTime: string;
  mode: LessonMode;
  subject: string;
  note: string | null;
  status: BookingStatus;
  student?: { name: string | null; avatar: string | null; email?: string };
  teacher?: TeacherProfile;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  partner: { id: string; name: string | null; avatar: string | null };
  lastMessage: string;
  lastMessageAt: string;
  isRead: boolean;
}

export interface Review {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  comment: string | null;
  user?: { name: string | null; avatar: string | null };
  createdAt: string;
}

export interface TawjihArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  thumbnail: string | null;
  isPublished: boolean;
  createdAt: string;
}

/* ── Dashboard payloads ── */
export interface StudentDashboardData {
  enrollments: Enrollment[];
  savedLessons: Array<{ id: string; lesson: Lesson }>;
  bookings: Booking[];
}

export interface TeacherDashboardData {
  courses: Course[];
  bookings: Booking[];
  totalStudents: number;
  totalEarnings: number;
  unreadMessages: number;
}
