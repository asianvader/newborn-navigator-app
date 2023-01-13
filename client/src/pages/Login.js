import React from "react";
import LoginForm from "../components/LoginForm";

const Login = (props) => {
  return (
    <div className="page-container">
      <h2>Please Login</h2>
      <LoginForm setToken={props.setToken} />
    </div>
  );
};

export default Login;
