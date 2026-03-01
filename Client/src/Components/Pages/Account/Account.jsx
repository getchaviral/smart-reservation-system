import { useContext, useEffect } from "react";
import User from "../../../ContextApi/User/UserContext";
import { useNavigate, Link } from "react-router-dom";
import LogoFile from "../../Header/Logo/logo";
import UserAccount from "../../Header/UserAccount/AccountUser";

const actions = [
  {
    to: "/account/YourReserves",
    title: "Your Reserves",
    description: "View, edit, and manage listings you created.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
      />
    ),
  },
  {
    to: "/account/NewReserve",
    title: "Add New Reserve",
    description: "Create a new accommodation or restaurant listing.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  {
    to: "/YourBookings",
    title: "Your Bookings",
    description: "Track payments and all completed bookings.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  {
    to: "/account/SecurityLogin",
    title: "Login & Security",
    description: "Review account and sign out securely.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    ),
  },
];

const Account = () => {
  const { UserDataCtx, hasData } = useContext(User);
  const nav = useNavigate();

  useEffect(() => {
    if (!UserDataCtx && hasData) {
      nav("/login");
    }
  }, [UserDataCtx, hasData, nav]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="sticky top-0 z-20 border-b border-blue-100 bg-white/80 px-4 py-3 backdrop-blur-md sm:px-5">
          <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between">
            <LogoFile />
            <UserAccount />
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1320px] px-4 py-6 sm:px-5">
          <div className="mb-5 rounded-2xl border border-blue-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Your Account Hub</h1>
            <p className="mt-1 text-sm text-slate-600 md:text-base">
              Manage listings, bookings, and profile actions from one place.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {actions.map((action) => (
              <Link
                key={action.title}
                to={action.to}
                className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 rounded-xl bg-primary/10 p-2 text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      {action.icon}
                    </svg>
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{action.title}</h2>
                    <p className="mt-1 text-sm text-slate-600">{action.description}</p>
                    <p className="mt-2 text-sm font-semibold text-primary transition group-hover:translate-x-0.5">
                      Open
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
