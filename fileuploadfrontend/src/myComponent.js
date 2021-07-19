import React, { useEffect, useState } from "react";
import { Button, Row, Col } from "react-bootstrap";
import "./custom.css";
import axios from "axios";

import { BACKEND_URL } from "./backEndKey";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

const MyComponent = ({ showh2 }) => {
  const [image, setImage] = useState();

  const fileUpload = () => {
    const formData = new FormData();

    // console.log("image", image);

    if (image) {
      formData.append("file", image);
      axios
        .post(`${BACKEND_URL}/upload`, formData)
        .then((res) => {
          toast("File Uploaded Successfully");
          setImage();
          document.getElementById("file-type").value = "";
        })
        .catch((err) => {
          // console.log("Error", err);
          toast.error("Some Error Occured");
        });
    } else {
      toast.dark("Please Select a file first");
    }
  };

  return (
    <>
      <div className="main-div">
        {showh2 && (
          <h2 style={{ color: "white", fontSize: "45px" }}>
            File Upload Using Multer and Mongo DB
          </h2>
        )}

        <div className="second-div">
          <Row>
            <Col lg="8">
              <input
                type="file"
                id="file-type"
                style={{
                  border: "solid 0.5px",
                  borderRadius: "5px",
                  width: "100%",
                }}
                onClick={(e) => {
                  e.target.value = "";
                }}
                onChange={(e) => setImage(e.target.files[0])}
              />
            </Col>

            <Col lg="4">
              <Button
                className="button-upload"
                variant="dark"
                style={{ borderRadius: "12px" }}
                onClick={() => fileUpload()}
              >
                {" "}
                Upload File{" "}
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default MyComponent;
