import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { BASEURL } from "../constants";
import axios from "axios";
import { Form } from "react-bootstrap";
import ActivityTable from "../components/ActivityTable";

function ActivityHistory(props) {
  const location = useLocation();
  const data = {
    username: location.state.username,
    babyName: location.state.babyName,
    id: location.state.id,
  };
  const activities = ["Activity", "Feed", "Sleep", "Nappies"];
  const [selectedOption, setSelectedOption] = useState("");
  const [resultsData, setResultsData] = useState([]);

  const handleActivityChange = (event) => {
    const value = event.target.value;
    let activity = value.toLowerCase();
    setSelectedOption(activity);

    // Check db
    if (event.target.value !== "Activity") {
      data["activity"] = activity;

      // Query db
      axios
        .get(
          `${BASEURL}/activity-history/${data.id}/${data.babyName}/${data.activity}`,
          {
            headers: {
              Authorization: "Bearer " + props.token,
            },
          }
        )
        .then((response) => {
          setResultsData(response.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <div className="page-container">
      <div className="history"></div>
      <h2>{data.babyName}'s Activity History</h2>
      <Form>
        <Form.Group>
          <Form.Label className="mb-3" htmlFor="activities">
            Choose an option:
            <Form.Select id="activies" onChange={handleActivityChange}>
              {activities.map((activity) => (
                <option key={activity} value={activity}>
                  {activity}
                </option>
              ))}
            </Form.Select>
          </Form.Label>
        </Form.Group>
      </Form>
      {selectedOption !== "" && <ActivityTable data={resultsData} />}
    </div>
  );
}

export default ActivityHistory;
