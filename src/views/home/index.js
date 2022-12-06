import { useEffect, useRef, useState } from "react";
import { Alert, Box, Button, IconButton } from "@mui/material";
import {
  Camera,
  CameraFront,
  CameraRear,
  DeleteRounded,
  NoPhotography,
  PhotoCamera,
} from "@mui/icons-material";
import uniqid from "uniqid";

const constraints = {
  video: {
    width: {
      min: 1280,
      ideal: 1920,
      max: 2560,
    },
    height: {
      min: 720,
      ideal: 1080,
      max: 1440,
    },
  },
};
function CameraClick({ images, setImages, newStudent }) {
  const videoTag = useRef(null);
  const canvas = useRef(null);
  const videoStream = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [useFrontCamera, setUseFrontCamera] = useState(true);

  const initializeCamera = async (show) => {
    stopVideoStream();
    if (!show) return;
    constraints.video.facingMode = useFrontCamera ? "user" : "environment";
    try {
      videoStream.current = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      videoTag.current.srcObject = videoStream.current;
    } catch (err) {
      console.log(err);
    }
  };
  function stopVideoStream() {
    if (videoStream.current) {
      videoStream.current.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }
  const captureImage = () => {
    canvas.current.width = videoTag.current.videoWidth;
    canvas.current.height = videoTag.current.videoHeight;
    canvas.current.getContext("2d").drawImage(videoTag.current, 0, 0);
    let src = canvas.current.toDataURL("image/png");

    const id = uniqid();
    canvas.current.toBlob(
      (blob) => {
        setImages((prevState) => [...prevState, { src, blob, id }]);
      },
      "image/jpeg",
      0.95
    );
  };
  const filterImages = (id) => {
    setImages((prevState) => prevState.filter((img) => img.id !== id));
  };

  useEffect(() => {
    return () => {
      initializeCamera(false);
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <canvas
        ref={canvas}
        width="640"
        id="canvas"
        height="480"
        style={{ display: "none" }}
      ></canvas>
      <Button
        variant="contained"
        onClick={() => {
          setShowCamera(!showCamera);
          initializeCamera(!showCamera ? true : false);
        }}
        sx={{
          mb: 2,
        }}
        color="warning"
        aria-label="delete"
        startIcon={showCamera ? <NoPhotography /> : <PhotoCamera />}
      >
        {showCamera ? "Close Camera" : "Open Camera"}
      </Button>
      <header className="App-header">
        {showCamera ? (
          <Box
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              width: "70%",
              margin: "auto",
            }}
          >
            <video ref={videoTag} width="100%" autoPlay muted></video>

            <IconButton
              size={"80px"}
              sx={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                bottom: "2%",
                color: "white",
                "& .MuiSvgIcon-root": {
                  width: { xs: "30px", sm: "35px", md: "40px", lg: "50px" },
                  height: { xs: "30px", sm: "35px", md: "40px", lg: "50px" },
                },
              }}
              onClick={captureImage}
              aria-label="delete"
            >
              <Camera />
            </IconButton>
            <IconButton
              sx={{
                position: "absolute",
                top: "5%",
                right: "1%",
                color: "white",
                "& .MuiSvgIcon-root": {
                  width: { xs: "20px", sm: "25px", md: "30px", lg: "30px" },
                  height: { xs: "20px", sm: "25px", md: "30px", lg: "30px" },
                },
              }}
              onClick={() => {
                setUseFrontCamera(!useFrontCamera);
                initializeCamera(true);
              }}
              aria-label="delete"
            >
              {useFrontCamera ? <CameraRear /> : <CameraFront />}
            </IconButton>
          </Box>
        ) : null}

        {images.length > 0 ? (
          <section className="file-list">
            {images.map((image) => (
              <div className="file-item" key={image.id}>
                <IconButton
                  className="file-item-delete-icon"
                  aria-label="delete"
                  sx={{
                    position: "absolute",
                    right: 0,
                  }}
                  onClick={() => filterImages(image.id)}
                >
                  <DeleteRounded
                    sx={{
                      color: "#ff0000",
                    }}
                  />
                </IconButton>
                <img alt={`${image.id}`} src={image.src} className="file-img" />
              </div>
            ))}
          </section>
        ) : (
          <>
            {newStudent ? (
              <Alert
                severity="info"
                sx={{
                  margin: "auto",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  my: 2,
                }}
              >
                Please Take at least one photo to continue.
              </Alert>
            ) : (
              <Alert
                severity="info"
                sx={{
                  margin: "auto",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  my: 2,
                }}
              >
                You can add more photos Which helps us for better recognition.
              </Alert>
            )}
          </>
        )}

        {/* <button type="button" onClick={recognizePicture}>
          Recognize
        </button> */}
      </header>
    </Box>
  );
}

export default CameraClick;
