import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASEURL } from "../constants";
import { Button } from "react-bootstrap/";
import { Link } from "react-router-dom";
import "./Navbar.scss"

function Navbar(props) {
  const token = props.token;
  const navigate = useNavigate();

  function logOut() {
    axios
      .post(`${BASEURL}/logout`)
      .then(() => {
        props.removeToken();
        sessionStorage.removeItem("username");
        navigate("/login");
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }
  return (
    <nav className="nav centre-item">
        {!token && token !== "" && token !== undefined ? (
          <>
            <Link to="/register">
              <Button className="btn">Sign up</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" className="btn">
                Login
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/main-menu"><Button variant="info" className="btn">
                Log activity
              </Button></Link>

            <Button variant="light" onClick={logOut}>Logout</Button>
          </>
        )}
    </nav>
  );
}

export default Navbar;
