import { useEffect, useState } from "react";
import { listAllBorrowRecords, returnBook } from "../api/borrow";
import { BorrowRecordsTable } from "../components/BorrowRecordsTable";
import { ErrorAlert } from "../components/ErrorAlert";
import type { BorrowRecord } from "../api/types";

export function BorrowRecordsPage() {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [activeOnly, setActiveOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [returningId, setReturningId] = useState<number | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      setRecords(await listAllBorrowRecords(activeOnly));
    } catch {
      setError("Could not load borrow records.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeOnly]);

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Borrow Records</h1>
          <p className="text-sm text-slate-500 mt-1">Every checkout across the library</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          Active only
        </label>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorAlert message={error} />
        </div>
      )}

      {loading ? (
        <p className="text-slate-500">Loading records…</p>
      ) : (
        <BorrowRecordsTable
          records={records}
          showMember
          onReturn={handleReturn}
          returningId={returningId}
        />
      )}
    </div>
  );
}
