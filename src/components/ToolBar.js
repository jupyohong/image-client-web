import React, { useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { AuthContext } from "../context/AuthContext";

const ToolBar = () => {
  const [me, setMe] = useContext(AuthContext);

  const signoutHandler = async (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem("sessionId");
      await axios.patch("/users/signout", {});
      setMe();
      toast.success("Good bye ;)");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div>
      <Link to="/">
        <span>Image Manager</span>
      </Link>
      {me?.nickname ? (
        <>
          <span
            onClick={signoutHandler}
            style={{ float: "right", cursor: "pointer" }}
          >
            Sign out
          </span>
          <span
            style={{ float: "right", marginRight: "15px", cursor: "default" }}
          >
            {me.nickname}
          </span>
        </>
      ) : (
        <>
          <Link to="/auth/signup">
            <span style={{ float: "right" }}>Sign up</span>
          </Link>
          <Link to="/auth/signin">
            <span style={{ float: "right", marginRight: "15px" }}>Sign in</span>
          </Link>
        </>
      )}
    </div>
  );
};

export default ToolBar;
