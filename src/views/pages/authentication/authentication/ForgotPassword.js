import { Link, useNavigate } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";

// project imports
import AuthWrapper1 from "../AuthWrapper1";
import AuthCardWrapper from "../AuthCardWrapper";
import Logo from "../../../../ui-component/Logo";
import AnimateButton from "../../../../ui-component/extended/AnimateButton";
import { Box } from "@mui/system";
import useScriptRef from "../../../../hooks/useScriptRef";
import { Formik } from "formik";
import * as Yup from "yup";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../../firebase/firebase";
import { useState } from "react";

// assets

// ================================|| AUTH3 - LOGIN ||================================ //

const ForgotPassword = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();
  const handlePasswordChange = (email) => {
    setSent(false);
    setError(false);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
        setSent(true);
        console.log("sent");
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
        console.log(error);

        // ..
      });
  };

  return (
    <AuthWrapper1>
      <Grid
        container
        direction="column"
        justifyContent="flex-end"
        sx={{ minHeight: "100vh" }}
      >
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ minHeight: "calc(100vh - 68px)" }}
          >
            <Grid item sx={{ m: { xs: 1, sm: 1 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid
                  container
                  spacing={1}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item sx={{ mb: 1 }}>
                    <Link to="#">
                      <Logo />
                    </Link>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid
                      container
                      direction={matchDownSM ? "column-reverse" : "row"}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Grid item>
                        <Stack
                          alignItems="center"
                          justifyContent="center"
                          spacing={1}
                        >
                          <Typography
                            color={theme.palette.secondary.main}
                            gutterBottom
                            variant={matchDownSM ? "h2" : "h1"}
                          >
                            Forgot Password
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Formik
                      initialValues={{
                        email: "",
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
                            setSubmitting(false);
                            handlePasswordChange(values.email);
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
                            <InputLabel htmlFor="outlined-adornment-email-login">
                              Email Address
                            </InputLabel>
                            <OutlinedInput
                              id="outlined-adornment-email-login"
                              type="email"
                              value={values.email}
                              name="email"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              label="Email Address / Username"
                              inputProps={{}}
                            />
                            {touched.email && errors.email && (
                              <FormHelperText
                                error
                                id="standard-weight-helper-text-email-login"
                              >
                                {errors.email}
                              </FormHelperText>
                            )}
                          </FormControl>

                          {errors.submit && (
                            <Box sx={{ mt: 2 }}>
                              <FormHelperText
                                sx={{
                                  textAlign: "center",
                                }}
                                error
                              >
                                {errors.submit}
                              </FormHelperText>
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
                          {!!sent && (
                            <Alert severity="success">
                              Email sent to reset password!
                            </Alert>
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
                                Reset Password
                              </Button>
                            </AnimateButton>
                          </Box>

                          <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                              <Button
                                disableElevation
                                fullWidth
                                size="large"
                                type="button"
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                  navigate(-1);
                                }}
                              >
                                Back
                              </Button>
                            </AnimateButton>
                          </Box>
                        </form>
                      )}
                    </Formik>
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default ForgotPassword;
