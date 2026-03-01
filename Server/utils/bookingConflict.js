import Booking from "../Modals/Booking.js";

const toDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const validateBookingConflictInput = (bookingData = {}) => {
  const { category, ReserveId, checkInDate, checkOutDate, bookingDate, timeSlot } =
    bookingData;

  if (!ReserveId) {
    return { ok: false, status: 400, message: "ReserveId is required" };
  }

  if (category === "accommodation") {
    const start = toDate(checkInDate);
    const end = toDate(checkOutDate);

    if (!start || !end) {
      return {
        ok: false,
        status: 400,
        message: "Valid check-in and check-out dates are required",
      };
    }

    if (end <= start) {
      return {
        ok: false,
        status: 400,
        message: "Check-out date must be after check-in date",
      };
    }

    return { ok: true, category, ReserveId, start, end };
  }

  if (category === "restaurant") {
    if (!bookingDate || !timeSlot) {
      return {
        ok: false,
        status: 400,
        message: "Booking date and time slot are required",
      };
    }

    return { ok: true, category, ReserveId, bookingDate, timeSlot };
  }

  return { ok: false, status: 400, message: "Invalid booking category" };
};

export const hasBookingConflict = async (bookingData = {}) => {
  const validated = validateBookingConflictInput(bookingData);
  if (!validated.ok) {
    return validated;
  }

  if (validated.category === "accommodation") {
    const conflict = await Booking.exists({
      category: "accommodation",
      ReserveId: validated.ReserveId,
      ScheduleStart: { $lt: validated.end },
      ScheduleEnd: { $gt: validated.start },
    });

    if (conflict) {
      return {
        ok: false,
        status: 409,
        message: "This accommodation is already booked for the selected dates",
      };
    }
  }

  if (validated.category === "restaurant") {
    const conflict = await Booking.exists({
      category: "restaurant",
      ReserveId: validated.ReserveId,
      BookingDate: validated.bookingDate,
      TimeSlot: validated.timeSlot,
    });

    if (conflict) {
      return {
        ok: false,
        status: 409,
        message: "This restaurant slot is already booked for the selected time",
      };
    }
  }

  return { ok: true };
};
