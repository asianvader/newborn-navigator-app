import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";
import { useForm } from "react-hook-form";
import DateTimePicker from "../components/DateTimePicker";
import { BASEURL } from "../constants";
import { Button, Form } from "react-bootstrap";
import "./AddSleep.scss";

function AddSleep(props) {
  const location = useLocation();
  const userID = location.state.id;
  const babyName = location.state.babyName;
  let date;
  const [message, setMessage] = useState();

  // Dependencies for form
  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  //   Post to DB
  const submittedFormData = (data) => {
    // convert hours to minutes
    const hours = +data.hours;
    const mins = +data.minutes;
    const totalMins = hours * 60 + mins;

    const sleepDetails = {
      information: totalMins,
      id: userID,
      activity: "sleep",
      date: date,
      name: babyName,
    };
    axios
      .post(`${BASEURL}/add-sleep`, sleepDetails, {
        headers: {
          Authorization: "Bearer " + props.token,
        },
      })
      .then((response) => {
        const getMsg = response.data.message;
        // render success message
        setMessage(getMsg);
        // remove message after 5 seconds
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      })
      .catch((err) => {
        console.error(err);
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
    date = dayjs(data).toISOString();
  };

  return (
    <div className="page-container">
      <div className="add-sleep">
        <h2>Add sleep for {babyName}</h2>
        {message && <p>{message}</p>}
        <Form
          onSubmit={handleSubmit((data) => {
            submittedFormData(data);
          })}
        >
          Duration:
          <Form.Group>
            <Form.Label className="mb-3" htmlFor="hours">
              {" "}
              Hours
            </Form.Label>
            <Form.Control
              type="text"
              id="hours"
              placeholder="Hours"
              {...register("hours", {
                maxLength: 2,
                pattern: /^[0-9]*$/,
              })}
            />
            {errors.hours && errors.hours.type === "maxLength" && (
              <p className="errors">Max length exceeded</p>
            )}
            {errors.hours && errors.hours.type === "pattern" && (
              <p className="errors">Numbers only </p>
            )}
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label className="mb-3" htmlFor="minutes">
              Minutes
            </Form.Label>
            <Form.Control
              type="text"
              id="minutes"
              placeholder="Minutes"
              {...register("minutes", {
                required: "This is required",
                maxLength: 2,
                pattern: /^[0-9]*$/,
              })}
            />

            {errors.minutes && errors.minutes.type === "required" && (
              <p className="errors">This is required</p>
            )}
            {errors.minutes && errors.minutes.type === "maxLength" && (
              <p className="errors">Max length exceeded</p>
            )}
            {errors.minutes && errors.minutes.type === "pattern" && (
              <p className="errors">Numbers only </p>
            )}
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label htmlFor="date">Enter start time and date:</Form.Label>
            <div className="date-picker">
              <DateTimePicker dateVal={getDateVal} />
            </div>
          </Form.Group>
          <Button className="btn" type="submit">
            Add
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default AddSleep;
