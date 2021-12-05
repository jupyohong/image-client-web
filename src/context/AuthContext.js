import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [me, setMe] = useState();

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

    if (me) {
      axios.defaults.headers.common.sessionid = me.sessionId;
      localStorage.setItem("sessionId", me.sessionId);
    } else if (sessionId) {
      try {
        // get my data
        const fetchData = async (sessionId) => {
          const result = await axios.get("/users/profile", {
            headers: { sessionid: sessionId },
          });
          setMe({
            username: result.data.username,
            nickname: result.data.nickname,
            sessionId: result.data.sessionId,
          });
        };
        fetchData(sessionId);
      } catch (error) {
        localStorage.removeItem("sessionId");
        delete axios.defaults.headers.common.sessionid;
      }
    } else {
      delete axios.defaults.headers.common.sessionid;
    }
  }, [me]);
  return (
    <AuthContext.Provider value={[me, setMe]}>{children}</AuthContext.Provider>
  );
};
