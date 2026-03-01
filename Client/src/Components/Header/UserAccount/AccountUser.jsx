import React, { useContext } from "react";
import User from "../../../ContextApi/User/UserContext";

const UserAccount = () => {
  const { UserDataCtx } = useContext(User);
  const UserName = UserDataCtx?.name || "Account";

  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-2 shadow-sm transition hover:shadow-md">
      <span className="hidden text-sm font-semibold text-slate-700 md:block">
        {UserName}
      </span>
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </span>
    </div>
  );
};

export default UserAccount;
