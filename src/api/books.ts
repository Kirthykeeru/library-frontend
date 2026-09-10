import { apiClient } from "./client";
import type { Book, BookInput } from "./types";

export async function listBooks(): Promise<Book[]> {
  const res = await apiClient.get<Book[]>("/books");
  return res.data;
}

export async function createBook(payload: BookInput): Promise<Book> {
  const res = await apiClient.post<Book>("/books", payload);
  return res.data;
}

export async function updateBook(id: number, payload: BookInput): Promise<Book> {
  const res = await apiClient.put<Book>(`/books/${id}`, payload);
  return res.data;
}

export async function deleteBook(id: number): Promise<void> {
  await apiClient.delete(`/books/${id}`);
}
