import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import CustomInput from "../components/CustomInput";

const SigninPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setMe] = useContext(AuthContext);
  const history = useHistory();

  const signinHandler = async (e) => {
    try {
      e.preventDefault();
      const result = await axios.patch("/users/signin", { username, password });
      setMe({
        username,
        nickname: result.data?.nickname,
        sessionId: result.data?.sessionId,
      });
      history.push("/");
      toast.success(`Welcome! ${result.data?.nickname} :)`);
    } catch (error) {
      console.error(error.response);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div style={{ margin: "100 auto", maxWidth: 350 }}>
      <h3>Sign in</h3>
      <form onSubmit={signinHandler}>
        <CustomInput label="User ID" value={username} setValue={setUsername} />
        <CustomInput
          label="Password"
          value={password}
          setValue={setPassword}
          type="password"
        />
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
};

export default SigninPage;
