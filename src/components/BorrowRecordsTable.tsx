import type { BorrowRecord } from "../api/types";

interface Props {
  records: BorrowRecord[];
  showMember: boolean;
  onReturn: (record: BorrowRecord) => void;
  returningId: number | null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function BorrowRecordsTable({ records, showMember, onReturn, returningId }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 text-left">
          <tr>
            <th className="px-5 py-3 font-medium">Book</th>
            {showMember && <th className="px-5 py-3 font-medium">Member</th>}
            <th className="px-5 py-3 font-medium">Borrowed</th>
            <th className="px-5 py-3 font-medium">Due</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {records.map((record) => {
            const isReturned = record.returned_at !== null;
            const isOverdue = !isReturned && new Date(record.due_date) < new Date();
            return (
              <tr key={record.id}>
                <td className="px-5 py-3 text-slate-900 font-medium">{record.book.title}</td>
                {showMember && (
                  <td className="px-5 py-3 text-slate-600">{record.member.name}</td>
                )}
                <td className="px-5 py-3 text-slate-600">{formatDate(record.borrowed_at)}</td>
                <td className="px-5 py-3 text-slate-600">{formatDate(record.due_date)}</td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      isReturned
                        ? "bg-slate-100 text-slate-500"
                        : isOverdue
                          ? "bg-red-50 text-red-700"
                          : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {isReturned ? "Returned" : isOverdue ? "Overdue" : "Active"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  {!isReturned && (
                    <button
                      onClick={() => onReturn(record)}
                      disabled={returningId === record.id}
                      className="text-indigo-600 hover:underline disabled:opacity-50 cursor-pointer"
                    >
                      {returningId === record.id ? "Returning…" : "Return"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
          {records.length === 0 && (
            <tr>
              <td colSpan={showMember ? 6 : 5} className="px-5 py-6 text-center text-slate-400">
                No borrow records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
