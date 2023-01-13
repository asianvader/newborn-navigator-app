import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";
import DateTimePicker from "../components/DateTimePicker";
import { BASEURL } from "../constants";
import { Button, Form } from "react-bootstrap";
import "./AddNappy.scss"

function AddNappy(props) {
  const location = useLocation();
  const selectRef = useRef();
  const userID = location.state.id;
  const babyName = location.state.babyName;
  let date;
  const [message, setMessage] = useState();
  const [successMessage, setSuccessMessage] = useState();

  const onClickFormHandler = (event) => {
    event.preventDefault();
    // Get value of select form
    const selectedOption = selectRef.current.value;
    if (selectedOption === "") {
      setMessage("Required: select a nappy type");
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } else {
      // post to DB
      const nappyDetails = {
        information: selectedOption,
        activity: "nappy",
        date: date,
        name: babyName,
        id: userID,
      };
      axios
        .post(`${BASEURL}/add-nappy`, nappyDetails, {
          headers: {
            Authorization: "Bearer " + props.token,
          },
        })
        .then((response) => {
          const getMsg = response.data.message;
          // render success message
          setSuccessMessage(getMsg);
          // remove message after 5 seconds
          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  // Post to DB
  const submittedFormData = (data) => {};

  //  Get date selected from child component
  const getDateVal = (data) => {
    // convert date to ISO 8601 string
    date = dayjs(data).toISOString();
  };

  return (
    <div className="page-container">
      <div className="add-nappy">
        <h2>Add nappy change for {babyName}</h2>
        {successMessage && <p>{successMessage}</p>}
        <Form>
          <Form.Group>
            <Form.Label className="mb-3" htmlFor="nappy">
              Nappy type:
            </Form.Label>
            {message && <p className="errors">{message}</p>}

            <Form.Select required aria-label="nappy type" ref={selectRef}>
              <option></option>
              <option value="Wet">Wet</option>
              <option value="Soiled">Soiled</option>
            </Form.Select>
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label htmlFor="date">Enter date and time:</Form.Label>
            <div className="date-picker">
              <DateTimePicker dateVal={getDateVal} />
            </div>
          </Form.Group>
          <Button className="btn" type="submit" onClick={onClickFormHandler}>
            Add
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default AddNappy;
