import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import CustomInput from "../components/CustomInput";

const SignupPage = () => {
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [, setMe] = useContext(AuthContext);
  const history = useHistory();

  const signupHandler = async (e) => {
    try {
      e.preventDefault();
      if (!username || username?.length < 4 || username?.length > 16) {
        throw new Error("Invalid User ID");
      }
      if (!nickname || nickname?.length < 4 || nickname?.length > 16) {
        throw new Error("Invalid nickname");
      }
      if (
        !password ||
        !passwordConfirm ||
        password !== passwordConfirm ||
        password?.length < 8 ||
        password?.length > 20
      ) {
        throw new Error("Invalid password");
      }
      const result = await axios.post("/users/signup", {
        nickname,
        username,
        password,
      });
      setMe({ username, nickname, sessionId: result.data?.sessionId });
      history.push("/");
      toast.success(`Welcome! ${nickname} :)`);
    } catch (error) {
      console.error(error.response);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div style={{ margin: "100 auto", maxWidth: 350 }}>
      <h3>SignUp</h3>
      <form onSubmit={signupHandler}>
        <CustomInput label="Nickname" value={nickname} setValue={setNickname} />
        <CustomInput label="User ID" value={username} setValue={setUsername} />
        <CustomInput
          label="Password"
          value={password}
          setValue={setPassword}
          type="password"
        />
        <CustomInput
          label="Confirm Password"
          value={passwordConfirm}
          setValue={setPasswordConfirm}
          type="password"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SignupPage;
