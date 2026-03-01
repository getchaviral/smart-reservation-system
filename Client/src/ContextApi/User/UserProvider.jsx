import React, { useState, useEffect } from "react";
import User from "./UserContext";
import axios from "axios";

const UserProvider = ({ children }) => {
  const [UserDataCtx, SetUserDataCtx] = useState(null);
  const [hasData, SetHasData] = useState(false);

  useEffect(() => {
    const getdata = async () => {
      const token = localStorage.getItem("accessToken");

      // No logged-in user yet; mark hydration complete.
      if (!token) {
        SetHasData(true);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const user = await axios.get("/Token", { headers });
        if (user?.data?.Userdata) {
          SetUserDataCtx(user.data.Userdata);
        }
      } catch (error) {
        // 401/403 is expected when token is missing/expired.
        localStorage.removeItem("accessToken");
        SetUserDataCtx(null);
      } finally {
        SetHasData(true);
      }
    };

    getdata();
  }, []);

  return (
    <User.Provider value={{ UserDataCtx, SetUserDataCtx, hasData, SetHasData }}>
      {children}
    </User.Provider>
  );
};

export default UserProvider;
