import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Row,
  Col,
  Modal,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import "./App.css";
import { BACKEND_URL } from "./backEndKey";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyComponent from "./myComponent";

import { saveAs } from "file-saver";

toast.configure();

const Gallary = () => {
  const [gallaryImages, setGallaryImages] = useState([]);
  const [imageData, setImageData] = useState();
  const [pass, setPass] = useState();
  const [type, setType] = useState("Images");

  //Modal
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setImageData();
    setPass();
  };
  const handleShow = (image) => {
    setShow(true);
    setImageData(image);
  };

  //upload image modal
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => {
    setShow2(false);
    getAllImage(type);
  };
  const handleShow2 = () => {
    setShow2(true);
  };

  const getAllImage = (type) => {
    console.log("Type", type);

    axios
      .get(`${BACKEND_URL}/allImages`, {
        params: {
          type: type,
        },
      })
      .then((res) => {
        setGallaryImages(res.data);
        // toast.info("Data Fetched Successfully");
      })
      .catch((err) => {
        // console.log("error while getting all images", err);
        toast.error(err.response.data);
      });
  };

  useEffect(() => {
    console.log("UseEffect for type and fetching api to get all data");
    getAllImage(type);
  }, [type]);

  const deleteImage = () => {
    // console.log("Image To Be deleted is ", imageData);

    if (pass) {
      const payload = { key: pass };

      axios
        .delete(`${BACKEND_URL}/deleteFile/${imageData._id}`, {
          data: payload,
        })
        .then((res) => {
          // console.log("Delete Response", res.data);
          handleClose();
          toast.info(res.data);
          getAllImage(type);
        })
        .catch((err) => {
          // console.log("Delete error", err.response.data);
          toast.error(err.response.data);
          handleClose();
        });
    } else {
      toast.warning("Please enter the password");
    }
  };

  const saveFile = (fileURL) => {
    saveAs(fileURL, fileURL); //1st parameter is the image url and 2nd is the file name after download
  };

  return (
    <>
      <div className="Drop-Div">
        <DropdownButton
          variant="light"
          id="dropdown-basic-button"
          // title="Select File Type"
          title={type}
        >
          <Dropdown.Item
            onClick={() => {
              setType("Images");
              type != "Images" && setGallaryImages([]);
            }}
          >
            Images
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              setType("Video");
              type != "Video" && setGallaryImages([]);
            }}
          >
            Videos
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              setType("Files");
              type != "Files" && setGallaryImages([]);
            }}
          >
            Files
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              setType("PDF");
              type != "PDF" && setGallaryImages([]);
            }}
          >
            Pdf
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              setType("Songs");
              type != "Songs" && setGallaryImages([]);
            }}
          >
            Songs
          </Dropdown.Item>
        </DropdownButton>
      </div>

      {gallaryImages && gallaryImages.length == 0 && (
        <div className="NoFile-div">
          <h2>No Files To Show</h2>
        </div>
      )}

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Delete File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-field">
            <p>Please Enter Password To Delete This File</p>
            <input type="text" onChange={(e) => setPass(e.target.value)} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={() => deleteImage()}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <div style={{ overflowX: "hidden" }}>
        {type && type == "Files" ? (
          <div className="files-div">
            <h2>Only Css , Text , Js files will be displayed here</h2>
          </div>
        ) : null}

        <Row>
          {gallaryImages.map((image) => (
            <Col sm="12" md="4" lg="6">
              <Card
                //className="Main-Card"
                style={{
                  backgroundColor: "black",
                }}
              >
                <Card.Body /*className="zoom"*/>
                  {type && type == "Images" ? (
                    <img
                      className="card-content-image"
                      onClick={() => {
                        // history.push(`${BACKEND_URL}${image.displayName}`)
                        const win = window.open(
                          `${BACKEND_URL}${image.displayName}`,
                          "_blank"
                        );
                        win.focus();
                      }}
                      src={`${BACKEND_URL}${image.displayName}`}
                      // style={{ width: "420px" }}
                    />
                  ) : null}

                  {type && type == "Video" ? (
                    <video
                      className="card-content-video"
                      autoPlay={false}
                      mute={false}
                      type="video/mp4"
                      src={`${BACKEND_URL}${image.displayName}`}
                      controls
                    ></video>
                  ) : null}

                  {type && type == "Files" ? (
                    <div className="files-div">
                      <a
                        className="files-a"
                        href={`${BACKEND_URL}${image.displayName}`}
                        target="_blank"
                      >
                        {image.filename}
                      </a>
                    </div>
                  ) : null}

                  {type && type == "PDF" ? (
                    <div className="files-div">
                      <a
                        className="files-a"
                        href={`${BACKEND_URL}${image.displayName}`}
                        target="_blank"
                      >
                        {image.filename}
                      </a>
                    </div>
                  ) : null}

                  {type && type == "Songs" ? (
                    <div className="files-div">
                      <a
                        className="files-a"
                        href={`${BACKEND_URL}${image.displayName}`}
                        target="_blank"
                      >
                        {image.filename}
                      </a>
                    </div>
                  ) : null}
                </Card.Body>
                <Button
                  className="button-on-card"
                  variant="danger"
                  onClick={() => handleShow(image)}
                >
                  Delete
                </Button>

                <Button
                  variant="light"
                  onClick={() => saveFile(`${BACKEND_URL}${image.displayName}`)}
                >
                  Download
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Modal
        show={show2}
        onHide={handleClose2}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Upload File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ marginTop: "-20px" }}>
            <MyComponent
              showh2={false} /*setReload={setReload} reload={reload} */
            />
          </div>
        </Modal.Body>
        <Modal.Footer style={{ alignItems: "center" }}>
          <Button variant="dark" onClick={handleClose2}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Button className="sticky-button" variant="light" onClick={handleShow2}>
        <div className="plus">+</div>
      </Button>
    </>
  );
};

export default Gallary;
