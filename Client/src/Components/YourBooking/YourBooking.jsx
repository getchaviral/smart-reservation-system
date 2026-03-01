import LogoFile from "../Header/Logo/logo";
import UserAccount from "../Header/UserAccount/AccountUser";
import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Preloader/loader";
import { Link } from "react-router-dom";

const YourBooking = () => {
  const [isLoading, SetisLoading] = useState(false);
  const [Data, SetData] = useState([]);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      SetisLoading(true);
      setFetchError("");
      try {
        const token = localStorage.getItem("accessToken");
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const res = await axios.get("/getYourBookings", { headers });
        SetData(res.data || []);
      } catch (error) {
        console.log(error);
        SetData([]);
        setFetchError(
          error?.response?.data?.message || "Unable to load your bookings right now."
        );
      } finally {
        SetisLoading(false);
      }
    };

    fetchBookings();
  }, []);

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

        <div className="mx-auto w-full max-w-[1320px] px-4 py-6 sm:px-5">
          <div className="mb-5 rounded-2xl border border-blue-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Your Bookings</h1>
            <p className="mt-1 text-sm text-slate-600">Track payment status and booking schedules in one place.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Data.length > 0 &&
              Data.map((Reserve) => {
                return (
                  <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="aspect-[16/10] overflow-hidden bg-slate-200">
                      <img src={Reserve.photo} alt="photo" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-4">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <h5 className="line-clamp-1 text-xl font-bold text-slate-900">{Reserve.MainTitle}</h5>
                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">Paid</span>
                      </div>

                      <p className="text-sm text-slate-600">{Reserve.location}, {Reserve.address}</p>
                      <p className="mt-1 text-sm text-slate-600">{Reserve.Schedule}</p>

                      <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                        <span className="text-sm font-medium text-slate-700">Amount Paid</span>
                        <span className="text-sm font-bold text-slate-900">${Reserve.amount}</span>
                      </div>

                      <p className="mt-3 text-center text-xs font-medium text-slate-500">Booked on {Reserve.Date}</p>
                    </div>
                  </div>
                );
              })}

            {!isLoading && Data.length === 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700">
                No bookings found yet.
              </div>
            )}

            {!isLoading && fetchError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                {fetchError}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default YourBooking;
