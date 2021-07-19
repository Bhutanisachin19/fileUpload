import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import "./App.css";

const MyNavbar = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark" className="justify-content-center">
        <Nav.Item>
          <Nav.Link to="/">
            <Link className="link-a" to="/">
              Gallary
            </Link>
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link>
            <Link className="link-a" to="/uploadImage">
              Upload File
            </Link>
          </Nav.Link>
        </Nav.Item>
      </Navbar>
    </>
  );
};

export default MyNavbar;
