import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import uniqid from "uniqid";
import produce from "immer";
import { errorToast, successToast } from "../../Helpers/toast";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useConfirm } from "material-ui-confirm";
import CameraClick from "../home";
import {
  addSubjectExample,
  deleteExampleById,
  fetchAllSubjects,
  fetchImagesBySubject,
  IMAGE_URL,
} from "../../api/api";
import { Stack } from "@mui/system";
import { DeleteRounded } from "@mui/icons-material";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function CreateStudents() {
  const theme = useTheme();
  const [students, setStudents] = React.useState([]);
  const [studentsImages, setStudentsImages] = React.useState([]);
  const [filteredStudentImages, setFilteredStudentsImages] = React.useState([]);
  const [studentId, setStudentId] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [dob, setDob] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [course, setCourse] = React.useState("");
  const [newStudent, setNewStudent] = React.useState(false);
  const [images, setImages] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const confirm = useConfirm();
  async function fetchData() {
    const fetchedClasses = [];

    const querySnapshot = await getDocs(collection(db, "students"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      fetchedClasses.push(doc.data());
    });
    console.log(fetchedClasses);
    setStudents(fetchedClasses);

    const data = await fetchAllSubjects();
    if (data) {
      setStudentsImages(data);
    }
  }
  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handelClickDelete = async (id) => {
    confirm({ description: "This action is permanent!" })
      .then(async () => {
        try {
          await deleteDoc(doc(db, "students", id));
          const filtered = students.filter((student) => student.id !== id);
          setStudents(filtered);
          console.log("deleted");

          successToast("Student Deleted Successfully!! 🎉🎉");
        } catch (err) {
          errorToast("Something went wrong 😥");
        }
      })
      .catch((err) => {
        console.log("cancelled deletion");
      });
  };

  const handelClickEdit = async (student) => {
    setNewStudent(false);
    setStudentId(student.id);
    setName(student.name);
    setGender(student.gender);
    setDob(student.dob);
    setEmail(student.email);
    setCourse(student.course);
    setOpen(true);
    setFilteredStudentsImages(
      studentsImages.filter((img) => img.subject === student.id)
    );
    // const data = await fetchImagesBySubject(student.id);
    // setImages((prevState) => [...prevState, ...data]);
  };

  const handelSubmitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const cls = {
      name,
      gender,
      dob,
      email,
      course,
    };
    try {
      const mintRef = doc(db, "students", studentId);

      await setDoc(mintRef, cls, { merge: true });
      setStudents(
        produce((draft) => {
          const cls = draft.find((cls) => cls.id === studentId);
          cls.name = name;
          cls.gender = gender;
          cls.dob = dob;
          cls.email = email;
          cls.course = course;
        })
      );

      reset();
      setLoading(false);

      setOpen(false);
      successToast("Class Edited Successfully!! 🎉🎉");

      images.forEach((image) => {
        if (image.blob) {
          setTimeout(() => {
            addSubjectExample(image.blob, studentId)
              .then((data) => {
                setStudentsImages((prevState) => [...prevState, data]);
              })
              .catch((err) => {
                console.log(image);
              });
          }, 300);
        }
      });
    } catch (err) {
      reset();
      setLoading(false);

      setOpen(false);
      console.log(err);
      errorToast("Something went wrong 😥");
    }
  };

  const handelCreateClick = () => {
    setNewStudent(true);
    reset();
    setOpen(true);
  };
  const handelSubmitCreate = async (e) => {
    e.preventDefault();
    console.log(images);
    setLoading(true);
    const genratedID = uniqid();
    const student = {
      name,
      gender,
      dob,
      email,
      course,
      id: genratedID,
      classes: [],
    };

    try {
      const studentRef = doc(db, "students", genratedID);
      await setDoc(studentRef, student);

      setStudents(
        produce((draft) => {
          draft.push(student);
        })
      );
      setLoading(false);

      setOpen(false);
      reset();
      setNewStudent(false);
      successToast("Student Created Successfully!! 🎉🎉");
      images.forEach((image) => {
        if (image.blob) {
          setTimeout(() => {
            addSubjectExample(image.blob, genratedID).catch((err) => {
              console.log(image);
            });
          }, 300);
        }
      });
    } catch (err) {
      console.log(err);
      setLoading(false);
      setOpen(false);

      reset();
      setNewStudent(false);
      errorToast("Something went wrong 😥");
    }
  };

  const reset = () => {
    setStudentId("");
    setName("");
    setGender("");
    setDob("");
    setEmail("");
    setCourse("");
    setImages([]);
  };
  const filterImages = async (id) => {
    const data = await deleteExampleById(id);
    if (data) {
      setStudentsImages((prevState) =>
        prevState.filter((img) => img.image_id !== id)
      );
    }
    setFilteredStudentsImages((prevState) =>
      prevState.filter((img) => img.image_id !== id)
    );
  };
  return (
    <>
      {open && (
        <>
          <form
            onSubmit={(e) => {
              if (newStudent) {
                handelSubmitCreate(e);
              } else {
                handelSubmitEdit(e);
              }
            }}
          >
            <Box
              sx={{
                bgcolor: "background.paper",
                p: 4,
                my: 2,
              }}
            >
              <Typography
                id="modal-modal-title"
                variant="h3"
                component="h1"
                gutterBottom
              >
                {newStudent ? "Register Student" : "Edit Student"}
              </Typography>

              <Grid container spacing={2} mt={2}>
                <Grid item xs={12} sm={6} md={4} rowSpacing={2}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Full Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    required
                    sx={{
                      mb: 3,
                      width: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      "& > .MuiOutlinedInput-root": {
                        background: theme.palette.background.default,
                      },
                      "& input": {
                        background: theme.palette.background.default,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} rowSpacing={2}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    value={email}
                    type="email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    required
                    sx={{
                      mb: 3,
                      width: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      "& > .MuiOutlinedInput-root": {
                        background: theme.palette.background.default,
                      },
                      "& input": {
                        background: theme.palette.background.default,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} rowSpacing={2}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Gender
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={gender}
                      label="Type"
                      onChange={(e) => {
                        setGender(e.target.value);
                      }}
                      required
                      sx={{
                        mb: 3,
                        width: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        "& > .MuiOutlinedInput-root": {
                          background: theme.palette.background.default,
                        },
                        "& > .MuiSelect-select ": {
                          background: theme.palette.background.default,
                        },
                      }}
                    >
                      <MenuItem value={"male"}>Male</MenuItem>
                      <MenuItem value={"female"}>Female</MenuItem>
                      <MenuItem value={"other"}>Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4} rowSpacing={2}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    variant="outlined"
                    value={dob}
                    type="date"
                    onChange={(e) => {
                      setDob(e.target.value);
                    }}
                    required
                    sx={{
                      mb: 3,
                      width: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      "& > .MuiOutlinedInput-root": {
                        background: theme.palette.background.default,
                      },
                      "& input": {
                        background: theme.palette.background.default,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} rowSpacing={2}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Course
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={course}
                      label="Type"
                      onChange={(e) => {
                        setCourse(e.target.value);
                      }}
                      required
                      sx={{
                        mb: 3,
                        width: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        "& > .MuiOutlinedInput-root": {
                          background: theme.palette.background.default,
                        },
                        "& > .MuiSelect-select ": {
                          background: theme.palette.background.default,
                        },
                      }}
                    >
                      <MenuItem value={"Computer Science"}>
                        Computer Science
                      </MenuItem>
                      <MenuItem value={"Petroleum Engineering"}>
                        Petroleum Engineering
                      </MenuItem>
                      <MenuItem value={"Embedded Systems"}>
                        Embedded Systems
                      </MenuItem>
                      <MenuItem value={"Wireless Communications"}>
                        Wireless Communications
                      </MenuItem>
                      <MenuItem value={"Power Engineering"}>
                        Power Engineering
                      </MenuItem>
                      <MenuItem value={"Management Information Systems"}>
                        Management Information Systems
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {/* <Grid item xs={12} sm={6} md={4} rowSpacing={2}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Phone"
                    variant="outlined"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                    sx={{
                      mb: 3,
                      width: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      "& > .MuiOutlinedInput-root": {
                        background: theme.palette.background.default,
                      },
                      "& input": {
                        background: theme.palette.background.default,
                      },
                    }}
                  />
                </Grid> */}
              </Grid>
              <CameraClick
                images={images}
                setImages={setImages}
                newStudent={newStudent}
              />

              {loading && <LinearProgress />}
              <Stack
                direction={"row"}
                spacing={2}
                id="modal-modal-description"
                sx={{ mt: 2 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setOpen(false);
                    reset();
                    setNewStudent(false);
                  }}
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  disabled={newStudent ? !images.length > 0 : false}
                >
                  {newStudent ? "Register" : "Edit"}
                </Button>
              </Stack>
              <Typography
                variant="h2"
                sx={{
                  my: 2,
                }}
              >
                Recent Click's
              </Typography>
              <section
                className="file-list"
                style={{
                  justifyContent: "flex-start",
                }}
              >
                {filteredStudentImages.map((image) => (
                  <div className="file-item" key={image.image_id}>
                    <IconButton
                      className="file-item-delete-icon"
                      aria-label="delete"
                      sx={{
                        position: "absolute",
                        right: 0,
                      }}
                      onClick={() => filterImages(image.image_id)}
                    >
                      <DeleteRounded
                        sx={{
                          color: "#ff0000",
                        }}
                      />
                    </IconButton>
                    <img
                      alt={`${image.id}`}
                      src={`${IMAGE_URL + image.image_id}`}
                      className="file-img"
                    />
                  </div>
                ))}
              </section>
            </Box>
          </form>
        </>
      )}

      <TableContainer
        component={Paper}
        sx={{ maxHeight: "45vh", overflow: "auto" }}
      >
        <Table stickyHeader aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Edit</StyledTableCell>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">Email</StyledTableCell>
              <StyledTableCell align="center">Gender</StyledTableCell>
              <StyledTableCell align="center">DOB</StyledTableCell>
              <StyledTableCell align="center">Course</StyledTableCell>
              <StyledTableCell align="center">Delete</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <StyledTableRow key={student.id}>
                <StyledTableCell component="th" scope="row">
                  <Button
                    variant="outlined"
                    size="small"
                    color="secondary"
                    sx={{
                      padding: "2px 8px",
                    }}
                    onClick={() => {
                      handelClickEdit(student);
                    }}
                  >
                    Edit
                  </Button>
                </StyledTableCell>
                <StyledTableCell align="center" component="th" scope="row">
                  {student.name}
                </StyledTableCell>
                <StyledTableCell align="center" component="th" scope="row">
                  {student.email}
                </StyledTableCell>
                <StyledTableCell align="center" component="th" scope="row">
                  {student.gender}
                </StyledTableCell>
                <StyledTableCell align="center" component="th" scope="row">
                  {student.dob}
                </StyledTableCell>
                <StyledTableCell align="center" component="th" scope="row">
                  {student.course}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      padding: "2px 8px",
                    }}
                    color="error"
                    onClick={() => {
                      handelClickDelete(student.id);
                    }}
                  >
                    Delete
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box id="modal-modal-description" sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" onClick={handelCreateClick}>
          Register Student
        </Button>
      </Box>
    </>
  );
}
