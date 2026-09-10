import { useEffect, useState } from "react";
import { listMembers, createMember, deleteMember } from "../api/members";
import { MemberFormModal } from "../components/MemberFormModal";
import { ErrorAlert } from "../components/ErrorAlert";
import type { Member, MemberInput } from "../api/types";

export function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  async function refresh() {
    try {
      setMembers(await listMembers());
    } catch {
      setError("Could not load members.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleSave(payload: MemberInput) {
    await createMember(payload);
    setShowModal(false);
    await refresh();
  }

  async function handleDelete(member: Member) {
    if (!confirm(`Remove member "${member.name}"?`)) return;
    try {
      await deleteMember(member.id);
      await refresh();
    } catch {
      setActionError("Could not remove this member.");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Members</h1>
          <p className="text-sm text-slate-500 mt-1">
            {members.length} registered member{members.length === 1 ? "" : "s"}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors cursor-pointer"
        >
          + Add Member
        </button>
      </div>

      <div className="mb-4">
        <ErrorAlert message={actionError} />
      </div>

      {loading && <p className="text-slate-500">Loading members…</p>}
      {error && <ErrorAlert message={error} />}

      {!loading && !error && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Member ID</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((member) => (
                <tr key={member.id}>
                  <td className="px-5 py-3 text-slate-900 font-medium">{member.name}</td>
                  <td className="px-5 py-3 text-slate-600">{member.email}</td>
                  <td className="px-5 py-3 text-slate-600 font-mono">{member.member_id}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleDelete(member)}
                      className="text-red-600 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-slate-400">
                    No members yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <MemberFormModal onClose={() => setShowModal(false)} onSubmit={handleSave} />
      )}
    </div>
  );
}
