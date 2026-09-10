import { apiClient } from "./client";
import type { BorrowRecord } from "./types";

export async function borrowBook(bookId: number, memberId: number): Promise<BorrowRecord> {
  const res = await apiClient.post<BorrowRecord>("/borrow", {
    book_id: bookId,
    member_id: memberId,
  });
  return res.data;
}

export async function returnBook(recordId: number): Promise<BorrowRecord> {
  const res = await apiClient.post<BorrowRecord>(`/borrow/${recordId}/return`);
  return res.data;
}

export async function listAllBorrowRecords(activeOnly = false): Promise<BorrowRecord[]> {
  const res = await apiClient.get<BorrowRecord[]>("/borrow-records", {
    params: { active_only: activeOnly },
  });
  return res.data;
}

export async function listMyBorrowRecords(activeOnly = false): Promise<BorrowRecord[]> {
  const res = await apiClient.get<BorrowRecord[]>("/borrow-records/mine", {
    params: { active_only: activeOnly },
  });
  return res.data;
}
