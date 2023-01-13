import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";
import { useForm } from "react-hook-form";
import DateTimePicker from "../components/DateTimePicker";
import { BASEURL } from "../constants";
import { Button, Form } from "react-bootstrap";
import "./AddFeed.scss"

function AddFeed(props) {
  const location = useLocation();
  const userID = location.state.id;
  const username = location.state.username;
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

  // Post to DB
  const submittedFormData = (data) => {
    const feedDetails = {
      information: data.volume,
      id: userID,
      activity: "feed",
      date: date,
      name: babyName,
    };
    axios
      .post(`${BASEURL}/add-feed`, feedDetails, {
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

  // Reset input fields if form has been submitted
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
      <div className="add-feed">
      <h2>Add feed for {babyName}</h2>
      {message && <p>{message}</p>}
      <Form
        onSubmit={handleSubmit((data) => {
          submittedFormData(data);
        })}
      >
        <Form.Group>
          <Form.Label className="mb-3" htmlFor="volume"> ml</Form.Label>
          <Form.Control
            type="text"
            id="volume"
            placeholder="Millilitres (ml)"
            {...register("volume", {
              required: "This is required",
              maxLength: 4,
              pattern: /^[0-9]*$/,
            })}
          />
          
          {errors.volume && errors.volume.type === "required" && (
            <p className="errors">This is required</p>
          )}
          {errors.volume && errors.volume.type === "maxLength" && (
            <p className="errors">Max length exceeded</p>
          )}
          {errors.volume && errors.volume.type === "pattern" && (
            <p className="errors">Numbers only </p>
          )}
        </Form.Group>
        <br/>
        <Form.Group>
          <Form.Label htmlFor="date">Enter date and time:</Form.Label>
            <div className="date-picker">
              <DateTimePicker  dateVal={getDateVal} />
            </div>
          
        </Form.Group>
        <Button className="btn" type="submit">Add</Button>
      </Form>
      </div>
    </div>
  );
}

export default AddFeed;
