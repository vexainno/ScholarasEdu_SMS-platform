export type Role =
  | 'principal'
  | 'vice_principal'
  | 'dean'
  | 'registrar'
  | 'academic_officer'
  | 'teacher'
  | 'counselor'
  | 'finance'
  | 'librarian'
  | 'super_admin'
  | 'student'
  | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  avatarColor: string;
  phone?: string;
  linkedStudentIds?: string[];
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  class: string;
  rollNo: string;
  gender: 'M' | 'F';
  age: number;
  guardianName: string;
  guardianPhone: string;
  status: 'active' | 'inactive' | 'transferred';
  enrolledDate: string;
  photoColor: string;
}

export interface ClassInfo {
  id: string;
  name: string;
  grade: string;
  section: string;
  teacherId?: string;
  teacherName?: string;
  studentCount: number;
  room: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  classId: string;
  className: string;
  teacherId?: string;
  teacherName?: string;
}

export interface Assessment {
  id: string;
  title: string;
  type: 'assignment' | 'quiz' | 'test' | 'participation' | 'midterm' | 'final';
  subjectId: string;
  subjectName: string;
  classId: string;
  className: string;
  date: string;
  totalMarks: number;
  status: 'draft' | 'published' | 'graded';
}

export interface GradeEntry {
  id: string;
  studentId: string;
  studentName: string;
  assessmentId: string;
  assessmentTitle: string;
  subjectName: string;
  score: number;
  totalMarks: number;
  grade: string;
  status: 'entered' | 'submitted' | 'approved' | 'released';
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  note?: string;
}

export interface GradebookSubmission {
  id: string;
  teacherName: string;
  subjectName: string;
  className: string;
  term: string;
  submittedDate: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  studentCount: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  subject: string;
  category: string;
  gradeLevel: string;
  copiesTotal: number;
  copiesAvailable: number;
  status: 'available' | 'limited' | 'unavailable';
  coverColor: string;
}

export interface BookRequest {
  id: string;
  bookId: string;
  bookTitle: string;
  studentName: string;
  studentId: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'borrowed' | 'returned';
  dueDate?: string;
  returnDate?: string;
}

export interface Invoice {
  id: string;
  studentName: string;
  studentId: string;
  description: string;
  amount: number;
  amountPaid: number;
  term: string;
  status: 'paid' | 'partial' | 'unpaid' | 'overdue';
  dueDate: string;
  issueDate: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  studentName: string;
  amount: number;
  method: 'bank_slip' | 'online' | 'cash';
  date: string;
  status: 'pending_verification' | 'verified' | 'rejected';
  reference: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  author: string;
  authorRole: Role;
  date: string;
  audience: string;
  priority: 'normal' | 'important' | 'urgent';
}

export interface DisciplineCase {
  id: string;
  studentName: string;
  studentId: string;
  class: string;
  incident: string;
  date: string;
  severity: 'minor' | 'moderate' | 'major';
  status: 'open' | 'under_review' | 'resolved' | 'closed';
  action: string;
  reportedBy: string;
}

export interface CounselingCase {
  id: string;
  studentName: string;
  studentId: string;
  class: string;
  category: 'academic' | 'behavioral' | 'social' | 'family' | 'other';
  status: 'open' | 'in_progress' | 'follow_up' | 'closed';
  dateOpened: string;
  lastSession?: string;
  notes: string;
  confidential: boolean;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  status: 'active' | 'inactive' | 'locked';
  lastLogin?: string;
  createdDate: string;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  ip: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface NavItem {
  label: string;
  icon: string;
  page: string;
}
