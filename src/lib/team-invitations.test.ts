import { describe, it, expect } from "bun:test";
import { enrichCurrentUser, type CollegeTeamMember } from "./team-invitations";

describe("enrichCurrentUser", () => {
  const baseMember: CollegeTeamMember = {
    id: "m-1",
    college_id: "c-1",
    user_id: "u-1",
    role: "member",
    position: null,
    is_approved: true,
    created_at: new Date().toISOString(),
    full_name: "Original Name",
    email: "original@example.com",
    avatar_url: null,
  };

  it("returns original member when ctx is undefined", () => {
    const result = enrichCurrentUser(baseMember);
    expect(result).toEqual(baseMember);
  });

  it("returns original member when ctx.currentUserId is not provided", () => {
    const result = enrichCurrentUser(baseMember, {
      currentUserName: "New Name",
      currentUserEmail: "new@example.com",
    });
    expect(result).toEqual(baseMember);
  });

  it("returns original member when member.user_id does not match ctx.currentUserId", () => {
    const result = enrichCurrentUser(baseMember, {
      currentUserId: "u-different",
      currentUserName: "New Name",
      currentUserEmail: "new@example.com",
    });
    expect(result).toEqual(baseMember);
  });

  it("enriches member with ctx.currentUserName and trims it", () => {
    const result = enrichCurrentUser(baseMember, {
      currentUserId: "u-1",
      currentUserName: "  Trimmed Name  ",
    });
    expect(result.full_name).toBe("Trimmed Name");
    expect(result.email).toBe(baseMember.email);
  });

  it("enriches member with ctx.currentUserEmail and trims it", () => {
    const result = enrichCurrentUser(baseMember, {
      currentUserId: "u-1",
      currentUserEmail: "  trimmed@example.com  ",
    });
    expect(result.full_name).toBe(baseMember.full_name);
    expect(result.email).toBe("trimmed@example.com");
  });

  it("falls back to member.full_name if ctx.currentUserName is empty string after trim", () => {
    const result = enrichCurrentUser(baseMember, {
      currentUserId: "u-1",
      currentUserName: "   ",
    });
    expect(result.full_name).toBe("Original Name");
  });

  it("falls back to 'Organizer' if both ctx.currentUserName and member.full_name are falsy/empty", () => {
    const noNameMember = { ...baseMember, full_name: "" };
    const result = enrichCurrentUser(noNameMember, {
      currentUserId: "u-1",
    });
    expect(result.full_name).toBe("Organizer");
  });

  it("falls back to member.email if ctx.currentUserEmail is undefined or empty string after trim", () => {
    const result = enrichCurrentUser(baseMember, {
      currentUserId: "u-1",
      currentUserEmail: "   ",
    });
    expect(result.email).toBe("original@example.com");
  });

  it("enriches both name and email correctly", () => {
    const result = enrichCurrentUser(baseMember, {
      currentUserId: "u-1",
      currentUserName: "Updated Name",
      currentUserEmail: "updated@example.com",
    });
    expect(result.full_name).toBe("Updated Name");
    expect(result.email).toBe("updated@example.com");
  });
});
