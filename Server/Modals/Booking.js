import mongoose from "mongoose";

const BookingScheme = new mongoose.Schema({

  ReserveId: { type: mongoose.Schema.Types.ObjectId, ref: "Reserve" },
  Owner:String,
  Customer: {type:mongoose.Schema.Types.ObjectId , ref:'User'},
  MainTitle:String,
  Schedule:String,
  ScheduleStart: Date,
  ScheduleEnd: Date,
  BookingDate: String,
  TimeSlot: String,
  photo: String,
  address:String,
  location:String,
  category:String,
  amount:String,
  Date:String


 

}) 

BookingScheme.index({ ReserveId: 1, category: 1, ScheduleStart: 1, ScheduleEnd: 1 });
BookingScheme.index({ ReserveId: 1, category: 1, BookingDate: 1, TimeSlot: 1 });

 const Booking = mongoose.model('Booking',BookingScheme );

 export default Booking;
