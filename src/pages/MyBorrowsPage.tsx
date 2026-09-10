import { useEffect, useState } from "react";
import { listMyBorrowRecords, returnBook } from "../api/borrow";
import { BorrowRecordsTable } from "../components/BorrowRecordsTable";
import { ErrorAlert } from "../components/ErrorAlert";
import type { BorrowRecord } from "../api/types";

export function MyBorrowsPage() {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [returningId, setReturningId] = useState<number | null>(null);

  async function refresh() {
    try {
      setRecords(await listMyBorrowRecords());
    } catch {
      setError("Could not load your borrow history.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleReturn(record: BorrowRecord) {
    setReturningId(record.id);
    try {
      await returnBook(record.id);
      await refresh();
    } catch {
      setError("Could not process this return.");
    } finally {
      setReturningId(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold text-slate-900 mb-1">My Borrows</h1>
      <p className="text-sm text-slate-500 mb-6">Books you've checked out</p>

      {error && (
        <div className="mb-4">
          <ErrorAlert message={error} />
        </div>
      )}

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <BorrowRecordsTable
          records={records}
          showMember={false}
          onReturn={handleReturn}
          returningId={returningId}
        />
      )}
    </div>
  );
}
