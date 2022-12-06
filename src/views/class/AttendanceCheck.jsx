import { useEffect, useRef, useState } from "react";
import { Alert, Box, Button, IconButton, LinearProgress } from "@mui/material";
import {
  Camera,
  CameraFront,
  CameraRear,
  PlayArrow,
  Replay,
  SkipNext,
  Start,
  Verified,
} from "@mui/icons-material";
import uniqid from "uniqid";
import { Stack } from "@mui/system";
import { recognizeExample } from "../../api/api";

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
function AttendanceCheck({
  loading,
  setLoading,
  image,
  setImage,
  onImageSubmit,
  user,
  setUser,
}) {
  const videoTag = useRef(null);
  const canvas = useRef(null);
  const videoStream = useRef(null);
  const [useFrontCamera, setUseFrontCamera] = useState(true);

  const initializeCamera = async () => {
    stopVideoStream();
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
        setImage({ src, blob, id });
      },
      "image/jpeg",
      0.95
    );
    stopVideoStream();
  };
  const verifyImage = async () => {
    setLoading(true);
    if (!image) return;
    const subject = await recognizeExample(image.blob);
    if (subject && subject.similarity > 0.99) {
      console.log("Found User", { data: subject });
      onImageSubmit(subject);
    } else {
      onImageSubmit(null);
    }
    setLoading(false);
  };
  useEffect(() => {
    initializeCamera();
    return () => {
      stopVideoStream();
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
      <header
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {!image ? (
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
                initializeCamera();
              }}
              aria-label="delete"
            >
              {useFrontCamera ? <CameraRear /> : <CameraFront />}
            </IconButton>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                width: "70%",
                height: "70%",
                margin: "auto",
              }}
            >
              <img alt={`${image.id}`} src={image.src} className="file-img" />
            </Box>
            {loading ? (
              <LinearProgress />
            ) : (
              <Stack direction={"row"} columnGap={4}>
                {user.status === "DEFAULT" ? (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setImage(null);
                        initializeCamera();
                      }}
                      sx={{
                        my: 2,
                      }}
                      color="warning"
                      aria-label="delete"
                      startIcon={<Replay />}
                    >
                      Retake Picture
                    </Button>
                    <Button
                      variant="contained"
                      onClick={verifyImage}
                      sx={{
                        my: 2,
                      }}
                      color="success"
                      aria-label="delete"
                      startIcon={<Verified />}
                    >
                      Verify Image
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setUser({
                          status: "DEFAULT",
                          data: null,
                        });
                        setImage(null);
                        initializeCamera();
                      }}
                      sx={{
                        my: 2,
                      }}
                      color="warning"
                      aria-label="delete"
                      startIcon={<SkipNext />}
                    >
                      Next
                    </Button>
                  </>
                )}
              </Stack>
            )}
          </>
        )}

        {!!image ? null : (
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
            Please Capture a image to take attendance.
          </Alert>
        )}

        {/* <button type="button" onClick={recognizePicture}>
          Recognize
        </button> */}
      </header>
    </Box>
  );
}

export default AttendanceCheck;
