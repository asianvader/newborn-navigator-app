import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASEURL } from "../constants";
import axios from "axios";
import { Button, Form } from "react-bootstrap/";
import "./MainMenu.scss";

const MainMenu = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state
    ? location.state.username
    : sessionStorage.getItem("username");

  const [userDetails, setUserDetails] = useState({
    username: username,
    id: null,
    children: false,
  });
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState();




  useEffect(() => {
    axios
      .get(`${BASEURL}/main-menu/${username}`, {
        headers: {
          Authorization: "Bearer " + props.token,
        },
      })
      .then((response) => {
        // If there are children in the db
        if (response.data.length !== undefined) {
          const id = response.data[0].id;
          console.log(response.data)
          // Add all children
          setChildren(response.data)
          // Default the selectedChild as the first from db.
          setSelectedChild(response.data[0])
          setUserDetails({
            ...userDetails,
            id: id,
            children: true,
          });
          
          console.log(children)
          console.log(selectedChild)
        } else {
          const id = response.data.id;
          setUserDetails({
            ...userDetails,
            id: id,
            children: false,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  const options = {
    add: "Add baby",
    feed: "Log feed",
    sleep: "Log sleep",
    nappy: "Nappy change",
    weight: "Log weight",
    "activity-history": "Activity history",
  };

  function addBaby() {
    navigate("/add-baby", {
      state: { id: userDetails.id, username: username },
    });
  }

  function addFeedHandler() {
    navigate("/add-feed", {
      state: {
        id: userDetails.id,
        username: username,
        babyName: children[0].baby_name,
      },
    });
  }

  function activityHistoryHandler() {
    navigate("/activity-history", {
      state: {
        id: userDetails.id,
        username: username,
        babyName: children[0].baby_name,
      },
    });
  }

  function addSleepHandler() {
    navigate("/add-sleep", {
      state: {
        id: userDetails.id,
        username: username,
        babyName: children[0].baby_name,
      },
    });
  }

  function addNappyHandler() {
    navigate("/add-nappy", {
      state: {
        id: userDetails.id,
        username: username,
        babyName: children[0].baby_name,
      },
    });
  }

  const handleBabySelection = (event) => {
    const value = event.target.value;
    console.log(value)
    setSelectedChild({babyName: value}) 
  }

  return (
    <div className="page-container main-menu">
      <h2>Welcome back {username}</h2>

      {userDetails.children && (
        <>
          <div>
            <Form>
              <Form.Group>
                <Form.Label className="mb-3" htmlFor="activities">
                  Baby: 
                  <Form.Select id="baby-selection" onChange={handleBabySelection} >
                    {children.map((child) => (
                      <option key={child.baby_name} value={child.baby_name}>{child.baby_name}</option>
                    ))}
                  </Form.Select>
                </Form.Label>
              </Form.Group>
            </Form>
          </div>
          <div className="button-container">
            <Button onClick={addFeedHandler}>{options.feed}</Button>
            <Button onClick={addSleepHandler}>{options.sleep}</Button>
            <Button onClick={addNappyHandler}>{options.nappy}</Button>
            <Button onClick={activityHistoryHandler}>
              {options["activity-history"]}
            </Button>
          </div>
        </>
      )}
      <div className="button-container">
        <Button onClick={addBaby}>{options.add}</Button>
      </div>
    </div>
  );
};

export default MainMenu;
