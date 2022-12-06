// material-ui
import {
  Alert,
  Button,
  Card,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";
import { Box, useTheme } from "@mui/system";
import { AuthContext } from "../../context/AuthContext";
import { updateEmail } from "firebase/auth";
import { Formik } from "formik";
import useScriptRef from "../../hooks/useScriptRef";
import { useState } from "react";
import { useContext } from "react";
import AnimateButton from "../../ui-component/extended/AnimateButton";
import * as Yup from "yup";
import { auth } from "../../firebase/firebase";
// project imports

// ==============================|| SAMPLE PAGE ||============================== //

const Account = () => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState(false);
  const handelFormSubmit = ({ email }) => {
    setUpdated(false);
    setError(false);
    updateEmail(auth.currentUser, email)
      .then(() => {
        console.log("updated");
        // Email updated!
        setUpdated(true);
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
        // An error occurred
        // ...
      });
  };

  return (
    <Box
      sx={{
        textAlign: "center",
      }}
    >
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h1" className="test" gutterBottom>
          User Account
        </Typography>
        <Card sx={{ display: "flex", flexDirection: "column" }}>
          <Box>
            <Formik
              initialValues={{
                email: user?.email,
                submit: null,
              }}
              validationSchema={Yup.object().shape({
                email: Yup.string()
                  .email("Must be a valid email")
                  .max(255)
                  .required("Email is required"),
              })}
              onSubmit={async (
                values,
                { setErrors, setStatus, setSubmitting }
              ) => {
                try {
                  if (scriptedRef.current) {
                    setStatus({ success: true });
                    setSubmitting(true);
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
                  <FormControl
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    sx={{ ...theme.typography.customInput }}
                  >
                    <InputLabel htmlFor="outlined-adornment-email-register">
                      Email Address
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-email-register"
                      type="email"
                      value={values.email}
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      inputProps={{}}
                    />
                    {touched.email && errors.email && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text--register"
                      >
                        {errors.email}
                      </FormHelperText>
                    )}
                  </FormControl>

                  {errors.submit && (
                    <Box sx={{ mt: 3 }}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Box>
                  )}

                  {!!error && (
                    <Box sx={{ mt: 2 }}>
                      <FormHelperText
                        sx={{
                          textAlign: "center",
                        }}
                        error
                      >
                        {error}
                      </FormHelperText>
                    </Box>
                  )}
                  {!!updated && <Alert severity="success">Email Updated</Alert>}
                  <Box sx={{ mt: 2 }}>
                    <AnimateButton>
                      <Button
                        disableElevation
                        // disabled
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="secondary"
                      >
                        Update Email
                      </Button>
                    </AnimateButton>
                  </Box>
                </form>
              )}
            </Formik>
          </Box>
        </Card>
      </Paper>
    </Box>
  );
};

export default Account;
