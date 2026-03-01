import React, { useState, useEffect, useContext } from "react";
import LogoFile from "../../Header/Logo/logo";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import Datepicker from "react-tailwindcss-datepicker";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import Loader from "../../Preloader/loader";
import User from "../../../ContextApi/User/UserContext";
import UserAccount from "../../Header/UserAccount/AccountUser";
import { Link } from "react-router-dom";

const ReservePage = () => {
  const { UserDataCtx, hasData } = useContext(User);
  const nav = useNavigate();
  const [Data, SetData] = useState();
  const { id } = useParams();
  const [count, Setcount] = useState(0);
  const [Provider, SetProvider] = useState();
  const [isLoading, SetisLoading] = useState(false);

  const [BookingDetails, SetBookingDetails] = useState({
    ReserveId: "",
    Owner: "",
    MainTitle: "",
    Schedule: "",
    checkInDate: "",
    checkOutDate: "",
    bookingDate: "",
    timeSlot: "",
    photo: "",
    address: "",
    location: "",
    category: "",
    amount: "",
  });

  useEffect(() => {
    const fetchReserve = async () => {
      SetisLoading(true);
      try {
        const res = await axios.get(`/Reserve/${id}`);
        SetData(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        SetisLoading(false);
      }
    };

    fetchReserve();
  }, [id]);

  useEffect(() => {
    if (!Data?.Provider) return;
    axios.post("/Reserve/Provider", { id: Data.Provider }).then((res) => {
      SetProvider(res.data);
    });
  }, [Data]);

  const Nextphoto = () => {
    if (Data && count == Data.photos.length - 1) {
      Setcount(0);
    } else {
      Setcount((prev) => prev + 1);
    }
  };

  const Previousphoto = () => {
    if (Data && count == 0) {
      Setcount(0);
    } else {
      Setcount((prev) => prev - 1);
    }
  };

  const [Checkin, SetCheckIn] = useState();
  const [Checkout, SetCheckOut] = useState();
  const [TableTime, SetTableTime] = useState("5:00 PM");
  const [Tables, SetTables] = useState(1);

  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });

  const handleValueChange = (newValue) => {
    setValue(newValue);
    SetCheckIn(newValue.startDate);
    SetCheckOut(newValue.endDate);
  };

  let days = 0;
  if (Checkin && Checkout) {
    days = differenceInCalendarDays(new Date(Checkout), new Date(Checkin));
  }

  const TimeChange = (e) => {
    SetTableTime(e.target.value + " PM");
  };

  useEffect(() => {
    if (!Data) return;

    if (Data.category == "restaurant" && Checkin) {
      SetBookingDetails({
        ReserveId: Data && Data._id,
        Owner: Provider && Provider.name,
        MainTitle: Data && Data.MainTitle,
        Schedule: `Reserve on ${Checkin && Checkin} from ${TableTime}`,
        checkInDate: "",
        checkOutDate: "",
        bookingDate: Checkin || "",
        timeSlot: TableTime || "",
        photo: Data && Data.photos[0],
        address: Data && Data.address,
        location: Data && Data.location,
        amount: (Data && Data.price) * (Tables && Tables),
        category: Data && Data.category,
      });
    }

    if (Data.category == "accommodation" && Checkin && Checkout) {
      SetBookingDetails({
        ReserveId: Data && Data._id,
        Owner: Provider && Provider.name,
        MainTitle: Data && Data.MainTitle,
        Schedule: `Reserve from ${Checkin && Checkin} to ${Checkout && Checkout}`,
        checkInDate: Checkin || "",
        checkOutDate: Checkout || "",
        bookingDate: "",
        timeSlot: "",
        photo: Data && Data.photos[0],
        address: Data && Data.address,
        location: Data && Data.location,
        amount: (Data && Data.price) * (days && days),
        category: Data && Data.category,
      });
    }
  }, [Checkin, Checkout, TableTime, Tables, Provider, Data]);

  const [isValid, SetisValid] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    if (!BookingDetails?.MainTitle) return;

    axios.post("/Booking", BookingDetails).then((res) => {
      if (res.data.msg == "cookie") {
        SetisValid(true);
      }
      let booking = res.data.BookingToken;
      localStorage.setItem("BookingToken", booking);
    });
  }, [BookingDetails]);

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const startRazorpayPayment = async (Paybody) => {
    setPaymentError("");
    if (!UserDataCtx && hasData) {
      nav("/login");
    } else {
      if (!isValid) return;

      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        console.error("Razorpay SDK failed to load");
        return;
      }

      try {
        const { data } = await axios.post("/Payment", {
          Pay: Paybody,
          Book: BookingDetails,
        });

        const options = {
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          name: Paybody.name,
          description: Paybody.schedule,
          order_id: data.orderId,
          handler: async (response) => {
            const verify = await axios.post("/Payment/verify", {
              ...response,
              transactionId: data.transactionId,
            });
            if (verify?.data?.success) {
              nav("/success");
            }
          },
          theme: {
            color: "#1f4bff",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        console.error(error);
        setPaymentError(
          error?.response?.data?.message ||
            "Unable to start payment for this booking."
        );
      }
    }
  };

  const MakePaymentAcc = async () => {
    const Paybody = {
      amount: (Data && Data.price) * (days && days),
      name: Data && Data.MainTitle,
      schedule: `Enjoy your Reserve from ${Checkin} to ${Checkout}`,
    };
    await startRazorpayPayment(Paybody);
  };

  const MakePaymentRes = async () => {
    const Paybody = {
      amount: (Data && Data.price) * (Tables && Tables),
      name: Data && Data.MainTitle,
      schedule: `Enjoy your Reserve on ${Checkin} from ${TableTime}`,
    };
    await startRazorpayPayment(Paybody);
  };

  return (
    <>
      {isLoading ? <Loader /> : ""}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="sticky top-0 z-20 border-b border-blue-100 bg-white/80 px-4 py-3 backdrop-blur-md sm:px-5">
          <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between">
            <LogoFile />
            <Link to={"/account"}>
              <UserAccount />
            </Link>
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 gap-5 px-4 py-6 lg:grid-cols-[1fr_360px] sm:px-5">
          <div className="rounded-2xl border border-blue-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm md:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">{Data && Data.MainTitle}</h1>
              <p className="flex items-center rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700 shadow-sm">
                {Data && Data.rating}
                <img className="h-5 w-5" src="https://img.icons8.com/emoji/48/star-emoji.png" alt="star" />
              </p>
            </div>

            <div className="mt-3 flex flex-wrap justify-between gap-2 text-sm text-slate-600 md:text-base">
              <h2>
                <span className="font-semibold text-slate-800">{Data && Data.location}</span>, {Data && Data.address}
              </h2>
              <p>
                posted by: <span className="font-semibold text-slate-800">{Provider && Provider.name}</span>
              </p>
            </div>

            <div className="relative mt-4 h-[280px] w-full overflow-hidden rounded-2xl bg-slate-200 md:h-[540px]">
              <div
                style={{ backgroundImage: `url(${Data && Data.photos[count]})` }}
                className="h-full w-full bg-cover bg-center transition duration-500"
              ></div>

              <button
                onClick={Previousphoto}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 text-slate-800 shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              <button
                onClick={Nextphoto}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 text-slate-800 shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>

            <div className="mt-5">
              <h2 className="text-xl font-bold text-slate-900 md:text-2xl">About this place</h2>
              <p className="mt-2 text-sm text-slate-600 md:text-base">{Data && Data.description}</p>
            </div>

            <div className="mt-5">
              <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Amenities</h2>
              <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                {Data &&
                  Data.amenities.map((item) => {
                    return (
                      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-5 w-5 text-primary"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" />
                        </svg>
                        {item}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          <div className="h-fit rounded-2xl border border-blue-100 bg-white/85 p-4 shadow-sm backdrop-blur-sm md:p-5">
            {Data && Data.category == "accommodation" && (
              <>
                <h3 className="text-xl font-bold text-slate-900">Book Accommodation</h3>
                <p className="mt-1 text-sm font-medium text-slate-600">Price: ${Data && Data.price} / night</p>

                <div className="mt-4">
                  <p className="mb-2 text-sm font-semibold text-slate-700">Schedule</p>
                  <Datepicker minDate={new Date()} value={value} onChange={handleValueChange} separator={"to"} />
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">CheckIn</p>
                    <input type="text" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={Checkin || ""} readOnly />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">CheckOut</p>
                    <input type="text" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={Checkout || ""} readOnly />
                  </div>
                </div>

                {Checkin && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm text-slate-700">Your Total</p>
                    <div className="mt-2 flex items-center justify-between text-sm text-slate-700">
                      <span>
                        ${Data && Data.price} x {days && days} nights
                      </span>
                      <span className="text-lg font-bold text-slate-900">${(Data && Data.price) * (days && days)}</span>
                    </div>
                    <button
                      onClick={MakePaymentAcc}
                      className="mt-3 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-secondary"
                    >
                      Book Reserve
                    </button>
                    {paymentError && (
                      <p className="mt-2 text-sm font-semibold text-red-600">
                        {paymentError}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            {Data && Data.category == "restaurant" && (
              <>
                <h3 className="text-xl font-bold text-slate-900">Book Restaurant</h3>
                <p className="mt-1 text-sm font-medium text-slate-600">Price: ${Data && Data.price} / table for 2</p>

                <div className="mt-4">
                  <p className="mb-2 text-sm font-semibold text-slate-700">Schedule</p>
                  <Datepicker minDate={new Date()} useRange={false} asSingle={true} value={value} onChange={handleValueChange} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Select Time</p>
                    <select onChange={TimeChange} name="hours" className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
                      <option value="5:00">5:00</option>
                      <option value="5:30">5:30</option>
                      <option value="6:00">6:00</option>
                      <option value="6:30">6:30</option>
                      <option value="7:00">7:00</option>
                      <option value="7:30">7:30</option>
                      <option value="8:00">8:00</option>
                      <option value="8:30">8:30</option>
                      <option value="9:00">9:00</option>
                      <option value="9:30">9:30</option>
                      <option value="10:00">10:00</option>
                      <option value="10:30">10:30</option>
                      <option value="11:00">11:00</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Tables</p>
                    <input
                      type="number"
                      value={Tables}
                      min={1}
                      onChange={(e) => SetTables(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none"
                    />
                  </div>
                </div>

                {Checkin && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm text-slate-700">Your Total</p>
                    <div className="mt-2 flex items-center justify-between text-sm text-slate-700">
                      <span>
                        ${Data && Data.price} x {Tables && Tables} tables
                      </span>
                      <span className="text-lg font-bold text-slate-900">${(Data && Data.price) * (Tables && Tables)}</span>
                    </div>
                    <button
                      onClick={MakePaymentRes}
                      className="mt-3 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-secondary"
                    >
                      Book Reserve
                    </button>
                    {paymentError && (
                      <p className="mt-2 text-sm font-semibold text-red-600">
                        {paymentError}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReservePage;
