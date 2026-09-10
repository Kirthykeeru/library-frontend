import axios from "axios";
import { apiClient } from "./client";
import type { Member, MemberInput } from "./types";

export async function listMembers(): Promise<Member[]> {
  const res = await apiClient.get<Member[]>("/members");
  return res.data;
}

export async function createMember(payload: MemberInput): Promise<Member> {
  const res = await apiClient.post<Member>("/members", payload);
  return res.data;
}

export async function deleteMember(id: number): Promise<void> {
  await apiClient.delete(`/members/${id}`);
}

// Returns null (rather than throwing) when the logged-in user has no
// linked member profile — e.g. a staff account browsing before ever
// registering as a member. Callers can treat null as "not a member."
export async function getMyMemberProfile(): Promise<Member | null> {
  try {
    const res = await apiClient.get<Member>("/members/me");
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return null;
    }
    throw err;
  }
}
