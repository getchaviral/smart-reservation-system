import axios from "axios";
import { useState, useEffect } from "react";
import LogoFile from "../Header/Logo/logo";
import { useNavigate } from "react-router";
import Loader from "../Preloader/loader";
import UserAccount from "../Header/UserAccount/AccountUser";
import { Link } from "react-router-dom";

const YourReserve = () => {
  const navigate = useNavigate();
  const [Data, SetData] = useState([]);
  const [Id, SetId] = useState();
  const [isLoading, SetisLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const token = localStorage.getItem("accessToken");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const config = {
    headers: headers,
  };

  const fetchReserves = async () => {
    SetisLoading(true);
    setFetchError("");
    try {
      const res = await axios.get("/getYourReserve", config);
      SetData(res.data || []);
    } catch (error) {
      console.log(error);
      SetData([]);
      setFetchError(
        error?.response?.data?.message || "Unable to load your reserves right now."
      );
    } finally {
      SetisLoading(false);
    }
  };

  useEffect(() => {
    fetchReserves();
  }, []);

  const Edit = (id) => {
    navigate(`/Edit/${id}`);
  };

  const [isDelete, SetisDelete] = useState(false);

  const DeleteClick = (id) => {
    SetId(id);
    SetisDelete(true);
  };

  const Cross = () => {
    SetisDelete(false);
  };

  const RemoveReserve = async () => {
    SetisLoading(true);
    setFetchError("");
    const data = { id: Id };
    try {
      const res = await axios.post("/DeleteReserve", data);
      if (res.data.msg === "Deleted") {
        SetData((prev) => prev.filter((item) => item._id !== Id));
        SetisDelete(false);
      }
    } catch (error) {
      console.log(error);
      setFetchError(
        error?.response?.data?.message || "Unable to remove reserve right now."
      );
    } finally {
      SetisLoading(false);
    }
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

        <div className="mx-auto w-full max-w-[1320px] px-4 py-6 sm:px-5">
          <div className="mb-5 rounded-2xl border border-blue-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Your Reserves</h1>
            <p className="mt-1 text-sm text-slate-600">Manage your listings, update details, or remove old entries.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Data.length > 0 &&
              Data.map((Reserve) => {
                return (
                  <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                      <img src={Reserve.photos[0]} alt="photo" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700">
                        {Reserve.category}
                      </span>
                    </div>
                    <div className="p-4">
                      <h5 className="mb-2 line-clamp-1 text-xl font-bold text-slate-900">{Reserve.MainTitle}</h5>
                      <p className="text-sm text-slate-600">Situated at {Reserve.location}</p>
                      <p className="text-sm text-slate-600">Created on {Reserve.Date}</p>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => Edit(Reserve._id)}
                          className="flex-1 rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                        >
                          Customize
                        </button>
                        <button
                          onClick={() => DeleteClick(Reserve._id)}
                          className="flex-1 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

            {!isLoading && Data.length === 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700">
                You have not added any reserves yet.
              </div>
            )}

            {!isLoading && fetchError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                {fetchError}
              </div>
            )}
          </div>
        </div>

        <div
          className={`${
            isDelete ? "fixed" : "hidden"
          } top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.55)]`}
        >
          <div className="w-[300px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl md:w-[420px]">
            <div className="flex justify-end">
              <button onClick={Cross} className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <h2 className="text-center text-lg font-bold text-slate-900 md:text-xl">Do you really want to remove this reserve?</h2>
            <button
              onClick={RemoveReserve}
              className="mt-4 w-full rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Confirm Remove
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default YourReserve;
