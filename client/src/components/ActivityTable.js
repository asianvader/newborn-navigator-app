import React from "react";
import dayjs from "dayjs";
import "./Table.scss";
import { Table } from "react-bootstrap";

function ActivityTable(props) {
  //   const [activityInfo, setActivityInfo] = useState("");
  const data = props.data;
  let activityInfo;
  let responses = true;
  //   Switch statement to check what type of activity
  if (data.length > 0) {
    const activity = data[0].activity;
    switch (activity) {
      case "feed":
        activityInfo = "Ml";
        break;
      case "nappy":
        activityInfo = "Type";
        break;
      case "sleep":
        activityInfo = "Duration";
        break;
    }
  } else {
    responses = false;
  }

  //   Sort data by descending date order
  data.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (dateA < dateB) {
      return 1;
    }
    if (dateA > dateB) {
      return -1;
    }
    return 0;
  });

  return (
    <div>
      {responses ? (
        <Table striped bordered hover size="sm">
          <thead>
            <tr key="title-row">
              <th>Date</th>
              <th>Activity</th>
              <th>{activityInfo}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={`row-${index}`}>
                <td>{dayjs(item.date).toString().replace("GMT", "")}</td>
                <td>{item.activity}</td>
                <td>{item.information}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No activity</p>
      )}
    </div>
  );
}

export default ActivityTable;
