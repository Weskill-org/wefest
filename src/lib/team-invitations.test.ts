import { describe, it, expect } from "vitest";
import { enrichCurrentUser, CollegeTeamMember } from "./team-invitations";

describe("enrichCurrentUser", () => {
  const baseMember: CollegeTeamMember = {
    id: "1",
    college_id: "c1",
    user_id: "u1",
    role: "member",
    position: null,
    is_approved: true,
    created_at: "2023-01-01",
    full_name: "Original Name",
    email: "original@test.com",
    avatar_url: null,
  };

  it("should return unmodified member if ctx is missing", () => {
    const result = enrichCurrentUser(baseMember);
    expect(result).toBe(baseMember);
    expect(result.full_name).toBe("Original Name");
  });

  it("should return unmodified member if ctx.currentUserId is missing", () => {
    const ctx = {
      currentUserName: "New Name",
      currentUserEmail: "new@test.com",
    };
    const result = enrichCurrentUser(baseMember, ctx);
    expect(result).toBe(baseMember);
  });

  it("should return unmodified member if ctx.currentUserId does not match member.user_id", () => {
    const ctx = { currentUserId: "u2", currentUserName: "New Name" };
    const result = enrichCurrentUser(baseMember, ctx);
    expect(result).toBe(baseMember);
  });

  describe("when user IDs match", () => {
    const matchingCtx = {
      currentUserId: "u1",
    };

    it("should update name and email with trimmed values from context", () => {
      const ctx = {
        ...matchingCtx,
        currentUserName: "  Trimmed Name  ",
        currentUserEmail: "  trimmed@test.com  ",
      };
      const result = enrichCurrentUser(baseMember, ctx);
      expect(result).not.toBe(baseMember); // Should be a new object
      expect(result.full_name).toBe("Trimmed Name");
      expect(result.email).toBe("trimmed@test.com");
      expect(result.id).toBe(baseMember.id); // Other properties remain
    });

    it("should fallback to member.full_name if context name is empty or missing", () => {
      const result1 = enrichCurrentUser(baseMember, {
        ...matchingCtx,
        currentUserName: "",
      });
      expect(result1.full_name).toBe("Original Name");

      const result2 = enrichCurrentUser(baseMember, {
        ...matchingCtx,
        currentUserName: "   ",
      });
      expect(result2.full_name).toBe("Original Name");

      const result3 = enrichCurrentUser(baseMember, matchingCtx);
      expect(result3.full_name).toBe("Original Name");
    });

    it("should fallback to 'Organizer' if both context name and member name are missing/empty", () => {
      const namelessMember = { ...baseMember, full_name: "" };

      const result1 = enrichCurrentUser(namelessMember, matchingCtx);
      expect(result1.full_name).toBe("Organizer");

      const result2 = enrichCurrentUser(namelessMember, {
        ...matchingCtx,
        currentUserName: "  ",
      });
      expect(result2.full_name).toBe("Organizer");
    });

    it("should fallback to member.email if context email is empty or missing", () => {
      const result1 = enrichCurrentUser(baseMember, {
        ...matchingCtx,
        currentUserEmail: "",
      });
      expect(result1.email).toBe("original@test.com");

      const result2 = enrichCurrentUser(baseMember, {
        ...matchingCtx,
        currentUserEmail: "   ",
      });
      expect(result2.email).toBe("original@test.com");

      const result3 = enrichCurrentUser(baseMember, matchingCtx);
      expect(result3.email).toBe("original@test.com");
    });
  });
});
