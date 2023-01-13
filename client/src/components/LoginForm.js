import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASEURL } from "../constants";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap/";

const LoginForm = (props) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  // Create an initial state for the form data
  // Can be reused to reset form
  const INITIAL_STATE = {
    username: "",
    password: "",
  };

  // Dependencies for form
  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors, isSubmitSuccessful },
  } = useForm(INITIAL_STATE);

  const submittedFormData = async (data) => {
    try {
      // Check user in db
      const result = await axios.get(
        `${BASEURL}/login/${data.username}/${data.password}`
      );
      // Username and password are correct
      const message = result.data;
      if (Object.keys(message)[0] === "access_token") {
        // Add token to local storage
        props.setToken(result.data.access_token);
        // Add username to local storage
        sessionStorage.setItem("username", data.username);
        // Redirect to main menu
        navigate("/main-menu", { state: { username: data.username } });
      } else if (message["message"] === "no username") {
        setMessage("User doesn't exist. Please try again.");
      } else {
        setMessage("Wrong password, please try again.");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  // Reset input fields if forms has been submitted
  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

  return (
    <Form
      onSubmit={handleSubmit((data) => {
        submittedFormData(data);
      })}
    >
      {message && <p className="errors">{message}</p>}
      <Form.Group>
        <Form.Label className="mb-3" htmlFor="username">
          Username
        </Form.Label>
        <Form.Control
          type="text"
          {...register("username", { required: "This is required" })}
        />
        <p className="errors">{errors.username?.message}</p>
      </Form.Group>

      <Form.Group>
        <Form.Label className="mb-3" htmlFor="password">
          Password
        </Form.Label>
        <Form.Control
          type="password"
          {...register("password", { required: "This is required" })}
        />
        <p className="errors">{errors.password?.message}</p>
      </Form.Group>
      <Button variant="primary" type="submit">
        Login
      </Button>
    </Form>
  );
};

export default LoginForm;
