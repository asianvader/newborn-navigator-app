import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap/";
import { BrowserRouter as Router, Link } from "react-router-dom";
import "./Home.scss";
import bear from "../images/bear.png";

function Home(props) {
  return (
    <div className="page-container">
      <div className="home">
        <h1 className="centre-font">Newborn Navigator</h1>
        <div className="img-container">
          <img src={bear} alt="bear illustration" />
        </div>

        <p className="centre-font">
          Welcome to The Newborn Navigator, the ultimate companion for new
          parents! With features like feeding and nappy logs, growth charts, and
          helpful tips and resources, The Newborn Navigator is the perfect tool
          to help you navigate the challenges and joys of parenting a new little
          one.
        </p>
      </div>
    </div>
  );
}

export default Home;
