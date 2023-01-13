import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import DatePicker from "../components/DatePicker";
import dayjs from "dayjs";
import axios from "axios";
import { BASEURL } from "../constants";
import { Button, Form } from "react-bootstrap";
import "./AddBaby.scss";

const AddBaby = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userID = location.state.id;
  const username = location.state.username;
  let dob;
  const [message, setMessage] = useState();

  // Dependencies for form
  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const submittedFormData = (data) => {
    const babyDetails = {
      ...data,
      dob: dob,
      id: userID,
    };
    axios
      .post(`${BASEURL}/add-baby`, babyDetails, {
        headers: {
          Authorization: "Bearer " + props.token,
        },
      })
      .then((response) => {
        const getMsg = response.data.message;
        setMessage(getMsg);
        setTimeout(() => {
          navigate("/main-menu", { state: { username: username } });
        }, 2000);
      });
  };
  // Reset input fields if forms has been submitted
  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

  //  Get date selected from child component
  const getDateVal = (data) => {
    // convert date to ISO 8601 string
    dob = dayjs(data).toISOString();
  };
  return (
    <div className="page-container">
      <div className="add-baby">
        <h2>Add baby's details</h2>
        {message && <p>{message}</p>}
        <Form
          onSubmit={handleSubmit((data) => {
            submittedFormData(data);
          })}
        >
          <Form.Group>
            <Form.Label className="mb-3" htmlFor="name">
              Name
            </Form.Label>
            <Form.Control
              type="text"
              {...register("name", { required: "This is required" })}
            />
            <p className="errors">{errors.name?.message}</p>
          </Form.Group>
          <Form.Group>
            <Form.Label className="mb-3" htmlFor="dob">
              Date of birth
            </Form.Label>
            <div className="date-picker">
              <DatePicker dateVal={getDateVal} />
            </div>
          </Form.Group>
          <Button className="btn" type="submit">
            Add
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default AddBaby;
