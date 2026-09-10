import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { listBooks, createBook, updateBook, deleteBook } from "../api/books";
import { borrowBook } from "../api/borrow";
import { BookFormModal } from "../components/BookFormModal";
import { ErrorAlert } from "../components/ErrorAlert";
import type { Book, BookInput } from "../api/types";

export function BooksPage() {
  const { user, memberProfile } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [modalBook, setModalBook] = useState<Book | null | "new">(null);
  const [borrowingId, setBorrowingId] = useState<number | null>(null);

  async function refresh() {
    try {
      setBooks(await listBooks());
    } catch {
      setError("Could not load books.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleSave(payload: BookInput) {
    if (modalBook === "new") {
      await createBook(payload);
    } else if (modalBook) {
      await updateBook(modalBook.id, payload);
    }
    setModalBook(null);
    await refresh();
  }

  async function handleDelete(book: Book) {
    if (!confirm(`Delete "${book.title}"? This cannot be undone.`)) return;
    try {
      await deleteBook(book.id);
      await refresh();
    } catch {
      setActionError("Could not delete this book.");
    }
  }

  async function handleBorrow(book: Book) {
    if (!memberProfile) return;
    setActionError(null);
    setBorrowingId(book.id);
    try {
      await borrowBook(book.id, memberProfile.id);
      await refresh();
    } catch (err) {
      const detail = axios.isAxiosError(err) ? err.response?.data?.detail : null;
      setActionError(detail ?? "Could not borrow this book.");
    } finally {
      setBorrowingId(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Books</h1>
          <p className="text-sm text-slate-500 mt-1">
            {books.length} title{books.length === 1 ? "" : "s"} in the catalog
          </p>
        </div>
        {user?.role === "staff" && (
          <button
            onClick={() => setModalBook("new")}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors cursor-pointer"
          >
            + Add Book
          </button>
        )}
      </div>

      <div className="mb-4">
        <ErrorAlert message={actionError} />
      </div>

      {loading && <p className="text-slate-500">Loading books…</p>}
      {error && <ErrorAlert message={error} />}

      {!loading && !error && books.length === 0 && (
        <p className="text-slate-500">No books in the catalog yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col"
          >
            <h3 className="font-semibold text-slate-900 leading-snug">{book.title}</h3>
            <p className="text-sm text-slate-500 mt-1">{book.author}</p>
            <p className="text-xs text-slate-400 mt-1 font-mono">{book.isbn}</p>

            <div className="mt-4 flex items-center gap-2">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  book.available_copies > 0
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {book.available_copies} / {book.total_copies} available
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
              {user?.role === "staff" && (
                <>
                  <button
                    onClick={() => setModalBook(book)}
                    className="flex-1 text-sm border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-md py-1.5 transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(book)}
                    className="flex-1 text-sm border border-red-200 text-red-600 hover:bg-red-50 rounded-md py-1.5 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </>
              )}

              {user?.role === "student" && memberProfile && (
                <button
                  onClick={() => handleBorrow(book)}
                  disabled={book.available_copies === 0 || borrowingId === book.id}
                  className="flex-1 text-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-md py-1.5 transition-colors cursor-pointer"
                >
                  {borrowingId === book.id
                    ? "Borrowing…"
                    : book.available_copies === 0
                      ? "Unavailable"
                      : "Borrow"}
                </button>
              )}

              {!user && (
                <p className="text-xs text-slate-400">Log in to borrow this book</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {modalBook !== null && (
        <BookFormModal
          initial={modalBook === "new" ? null : modalBook}
          onClose={() => setModalBook(null)}
          onSubmit={handleSave}
        />
      )}
    </div>
  );
}
