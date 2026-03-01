import { describe, expect, it } from "vitest";
import { validateBookingConflictInput } from "../../utils/bookingConflict.js";

describe("validateBookingConflictInput", () => {
  it("returns 400 when ReserveId is missing", () => {
    const result = validateBookingConflictInput({
      category: "accommodation",
      checkInDate: "2026-03-10",
      checkOutDate: "2026-03-12",
    });

    expect(result.ok).toBe(false);
    expect(result.status).toBe(400);
    expect(result.message).toMatch(/ReserveId is required/i);
  });

  it("validates accommodation date order", () => {
    const result = validateBookingConflictInput({
      category: "accommodation",
      ReserveId: "507f1f77bcf86cd799439011",
      checkInDate: "2026-03-12",
      checkOutDate: "2026-03-10",
    });

    expect(result.ok).toBe(false);
    expect(result.status).toBe(400);
    expect(result.message).toMatch(/Check-out date must be after check-in date/i);
  });

  it("accepts valid restaurant payload", () => {
    const result = validateBookingConflictInput({
      category: "restaurant",
      ReserveId: "507f1f77bcf86cd799439011",
      bookingDate: "2026-03-20",
      timeSlot: "8:00 PM",
    });

    expect(result.ok).toBe(true);
    expect(result.category).toBe("restaurant");
  });
});
