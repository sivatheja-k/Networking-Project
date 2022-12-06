// material-ui
import {
  Alert,
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  LinearProgress,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";
import { Box, useTheme } from "@mui/system";
import { AuthContext } from "context/AuthContext";
import { storage } from "../../firebase/firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { Formik } from "formik";
import useScriptRef from "../hooks/useScriptRef";
import { useState } from "react";
import { useRef } from "react";
import { useContext } from "react";
import AnimateButton from "../../ui-component/extended/AnimateButton";
import * as Yup from "yup";

// project imports

// ==============================|| SAMPLE PAGE ||============================== //

const Proflie = () => {
  const { user, updateUser } = useContext(AuthContext);
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const [uploadLoading, setUploadLoading] = useState(false);
  const inputRef = useRef(null);
  const [updated, setUpdated] = useState(false);

  const handelFormSubmit = async (values) => {
    setUploadLoading(true);
    setUpdated(false);

    await updateUser(values);
    setUpdated(true);
    setUploadLoading(false);
  };
  const imageChange = (e) => {
    console.log("file changed");
    if (e.target.files && e.target.files.length > 0) {
      // console.log(
      //   "This file size is: " +
      //     Number(e.target.files[0].size / 1024 / 1024).toFixed(2) +
      //     "MiB"
      // );

      onSubmitFile(e.target.files[0]);
    }
  };
  const onSubmitFile = async (file) => {
    try {
      if (file) {
        let storageRef = ref(storage, `${user?.uid}`);

        if (user?.photoUrl.includes("firebasestorage.googleapis.com")) {
          await deleteObject(storageRef);
        }
        uploadBytes(storageRef, file).then(() => {
          console.log("Uploaded a blob or file!");
          getDownloadURL(storageRef).then((url) => {
            if (url) {
              console.log(url);
              updateUser({
                photoUrl: url,
              });
              setUploadLoading(false);
            } else {
              setUploadLoading(false);
              console.log("Image Failed To Upload");
            }
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
    setUploadLoading(true);
  };
  return (
    <Box
      sx={{
        textAlign: "center",
      }}
    >
      <Paper elevation={3} sx={{ p: 3 }}>
        {uploadLoading ? (
          <LinearProgress sx={{ my: 2 }} color="secondary" />
        ) : null}

        <Typography variant="h1" gutterBottom>
          User Proflie
        </Typography>
        <Card sx={{ display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{ width: "10%", cursor: "pointer" }}
              className="edit-profile"
              onClick={() => {
                inputRef.current.click();
              }}
            >
              <input
                ref={inputRef}
                type="file"
                id="image"
                accept="image/png, image/jpeg"
                hidden
                onChange={imageChange}
              />
              <img
                style={{
                  width: "100%",
                  borderRadius: "50%",
                  objectFit: "fill",
                }}
                src={user?.photoUrl}
                alt="Live"
              />
            </Box>

            <CardContent
              sx={{
                textAlign: "left",
              }}
            >
              <Typography component="div" variant="h5">
                {user?.email}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                @{user?.username}
              </Typography>
            </CardContent>
          </Box>

          {user.username && (
            <Box>
              <Formik
                initialValues={{
                  firstName: user?.firstName,
                  lastName: user?.lastName,
                  username: user?.username,
                  phone: user?.phone,
                  address: user?.address,
                  // country: "",
                  // state: "",
                  // city: "",
                }}
                enableReinitialize
                validationSchema={Yup.object().shape({
                  firstName: Yup.string()
                    .min(4)
                    .max(255)
                    .required("First Name is required")
                    .matches(
                      /^[aA-zZ\s]+$/,
                      "Only alphabets are allowed for this field "
                    ),
                  lastName: Yup.string()
                    .min(1)
                    .max(255)
                    .required("Last Name is required")
                    .matches(
                      /^[aA-zZ\s]+$/,
                      "Only alphabets are allowed for this field "
                    ),
                  username: Yup.string()
                    .min(3)
                    .max(255)
                    .required("User Name is required"),
                  phone: Yup.string()
                    .min(10)
                    .max(10)
                    .required("Phone Number is required"),
                  address: Yup.string()
                    .min(3)
                    .max(255)
                    .required("Address is required"),
                })}
                onSubmit={async (
                  values,
                  { setErrors, setStatus, setSubmitting }
                ) => {
                  try {
                    if (scriptedRef.current) {
                      setStatus({ success: true });
                      setSubmitting(false);
                      handelFormSubmit(values);
                      console.log(values);
                    }
                  } catch (err) {
                    console.error(err);
                    if (scriptedRef.current) {
                      setStatus({ success: false });
                      setErrors({ submit: err.message });
                      setSubmitting(false);
                    }
                  }
                }}
              >
                {({
                  errors,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  touched,
                  values,
                }) => (
                  <form noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl
                          fullWidth
                          error={Boolean(touched.firstName && errors.firstName)}
                          sx={{ ...theme.typography.customInput }}
                        >
                          <InputLabel htmlFor="outlined-adornment-email-register">
                            First Name
                          </InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-email-register"
                            type="text"
                            defaultValue={values.firstName}
                            name="firstName"
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          {touched.firstName && errors.firstName && (
                            <FormHelperText
                              error
                              id="standard-weight-helper-text--register"
                            >
                              {errors.firstName}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl
                          fullWidth
                          error={Boolean(touched.lastName && errors.lastName)}
                          sx={{ ...theme.typography.customInput }}
                        >
                          <InputLabel htmlFor="outlined-adornment-email-register">
                            Last Name
                          </InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-email-register"
                            type="text"
                            defaultValue={values.lastName}
                            name="lastName"
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          {touched.lastName && errors.lastName && (
                            <FormHelperText
                              error
                              id="standard-weight-helper-text--register"
                            >
                              {errors.lastName}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl
                          fullWidth
                          error={Boolean(touched.username && errors.username)}
                          sx={{ ...theme.typography.customInput }}
                        >
                          <InputLabel htmlFor="outlined-adornment-email-register">
                            UserName
                          </InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-email-register"
                            type="text"
                            defaultValue={values.username}
                            name="username"
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          {touched.username && errors.username && (
                            <FormHelperText
                              error
                              id="standard-weight-helper-text--register"
                            >
                              {errors.username}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl
                          fullWidth
                          error={Boolean(touched.phone && errors.phone)}
                          sx={{ ...theme.typography.customInput }}
                        >
                          <InputLabel htmlFor="outlined-adornment-email-register">
                            Phone Number
                          </InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-email-register"
                            type="number"
                            defaultValue={values.phone}
                            name="phone"
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          {touched.phone && errors.phone && (
                            <FormHelperText
                              error
                              id="standard-weight-helper-text--register"
                            >
                              {errors.phone}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>

                    <FormControl
                      fullWidth
                      error={Boolean(touched.address && errors.address)}
                      sx={{ ...theme.typography.customInput }}
                    >
                      <InputLabel htmlFor="outlined-adornment-email-register">
                        Address
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-email-register"
                        type="text"
                        defaultValue={values.address}
                        name="address"
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      {touched.address && errors.address && (
                        <FormHelperText
                          error
                          id="standard-weight-helper-text--register"
                        >
                          {errors.address}
                        </FormHelperText>
                      )}
                    </FormControl>
                    {/* <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Country
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={""}
                          label="Country"
                          onChange={handleChange}
                        >
                          <MenuItem value={10}>Ten</MenuItem>
                          <MenuItem value={20}>Twenty</MenuItem>
                          <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          State
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={""}
                          label="State"
                          onChange={handleChange}
                        >
                          <MenuItem value={10}>Ten</MenuItem>
                          <MenuItem value={20}>Twenty</MenuItem>
                          <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          City
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={""}
                          label="City"
                          onChange={handleChange}
                        >
                          <MenuItem value={10}>Ten</MenuItem>
                          <MenuItem value={20}>Twenty</MenuItem>
                          <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid> */}

                    {errors.submit && (
                      <Box sx={{ mt: 3 }}>
                        <FormHelperText error>{errors.submit}</FormHelperText>
                      </Box>
                    )}
                    {!!updated && (
                      <Alert severity="success">Profile Updated</Alert>
                    )}
                    <Box sx={{ mt: 2 }}>
                      <AnimateButton>
                        <Button
                          disableElevation
                          disabled={isSubmitting}
                          fullWidth
                          size="large"
                          type="submit"
                          variant="contained"
                          color="secondary"
                        >
                          Update
                        </Button>
                      </AnimateButton>
                    </Box>
                  </form>
                )}
              </Formik>
            </Box>
          )}
        </Card>
      </Paper>
    </Box>
  );
};

export default Proflie;
