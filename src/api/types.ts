export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  total_copies: number;
  available_copies: number;
}

export type BookInput = Omit<Book, "id">;

export interface Member {
  id: number;
  name: string;
  email: string;
  member_id: string;
}

export type MemberInput = Omit<Member, "id">;

export interface BorrowRecord {
  id: number;
  book: Book;
  member: Member;
  borrowed_at: string;
  due_date: string;
  returned_at: string | null;
}

export type Role = "staff" | "student";

export interface User {
  id: number;
  username: string;
  role: Role;
}

export interface RegisterPayload {
  username: string;
  password: string;
  role: Role;
  name?: string;
  email?: string;
  member_id?: string;
}
