import React from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Switch, Route } from "react-router-dom";

import MainPage from "./pages/MainPage";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import ImagePage from "./pages/ImagePage";
import ToolBar from "./components/ToolBar";

const App = () => {
  return (
    <>
      <div style={{ maxWidth: 600, margin: "auto" }}>
        <ToastContainer />
        <ToolBar />
        <Switch>
          <Route path="/" exact component={MainPage} />
          <Route path="/auth/signup" exact component={SignupPage} />
          <Route path="/auth/signin" exact component={SigninPage} />
          <Route path="/images/:imageId" exact component={ImagePage} />
        </Switch>
      </div>
    </>
  );
};

export default App;
