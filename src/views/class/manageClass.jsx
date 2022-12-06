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
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import produce from "immer";
import { errorToast, successToast } from "../../Helpers/toast";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useConfirm } from "material-ui-confirm";
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

export default function ManageClass() {
  const { classId } = useParams();
  const theme = useTheme();
  const [classes, setClass] = React.useState([]);
  const [allFiltered, setAllFltrStudents] = React.useState([]);
  const [allStudents, setAllStudents] = React.useState([]);

  const [studentId, setStudentId] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const confirm = useConfirm();
  async function fetchData() {
    const docRef = doc(db, "classes", classId);
    let studentData = null;
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setClass(docSnap.data());
      studentData = docSnap.data().students;
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }

    //Fetching Students

    const fetchedStudents = [];

    const querySnapshot = await getDocs(collection(db, "students"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      fetchedStudents.push(doc.data());
    });
    console.log(fetchedStudents);

    if (studentData && studentData?.length > 0) {
      setAllFltrStudents(
        fetchedStudents.filter((student) => !studentData.includes(student.id))
      );
    } else {
      setAllFltrStudents(fetchedStudents);
    }
    setAllStudents(fetchedStudents);
  }
  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handelClickDelete = async (id) => {
    const filtered = classes?.students.filter((cls) => cls !== id);
    confirm({ description: "This action is permanent!" })
      .then(async () => {
        try {
          const studentRef = doc(db, "classes", classId);
          await updateDoc(studentRef, {
            students: arrayRemove(id),
          });
          setClass((classes) => ({ ...classes, students: filtered }));
          const ref = doc(db, "students", id);
          await updateDoc(ref, {
            classes: arrayRemove(classes.id),
          });
          successToast("Class Deleted Successfully!! 🎉🎉");
        } catch (err) {
          errorToast("Something went wrong 😥");
        }
      })
      .catch((err) => {
        console.log("cancelled deletion");
      });
  };

  const handelCreateClick = () => {
    reset();
    handleOpen();
  };
  const handelSubmitCreate = async (e) => {
    e.preventDefault();

    try {
      const studentRef = doc(db, "classes", classId);
      await updateDoc(studentRef, {
        students: arrayUnion(studentId),
      });
      setOpen(false);

      setClass(
        produce((draft) => {
          draft.students.push(studentId);
        })
      );

      const ref = doc(db, "students", studentId);
      await updateDoc(ref, {
        classes: arrayUnion(classId),
      });

      reset();
      successToast("Student Added Successfully!! 🎉🎉");
    } catch (err) {
      console.log(err);

      setOpen(false);
      reset();
      errorToast("Something went wrong 😥");
    }
  };

  const reset = () => {
    setStudentId("");
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const fetchName = (id) => {
    const data = allStudents.find((student) => student.id === id);
    if (data) return data.name;
    else return "";
  };
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form
          onSubmit={(e) => {
            handelSubmitCreate(e);
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              minWidth: "300px",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography
              id="modal-modal-title"
              variant="h3"
              component="h1"
              gutterBottom
            >
              Add Student
            </Typography>

            <Grid container spacing={2} mt={2}>
              <Grid item xs={12} rowSpacing={2}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Select Student
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={studentId}
                    label="Select Student"
                    onChange={(e) => {
                      setStudentId(e.target.value);
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
                    {allFiltered.map((el) => (
                      <MenuItem key={el.id} value={el.id}>
                        {el.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box id="modal-modal-description" sx={{ mt: 2 }}>
              <Button type="submit" variant="outlined" color="success">
                Add
              </Button>
            </Box>
          </Box>
        </form>
      </Modal>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "45vh", overflow: "auto" }}
      >
        <Table stickyHeader aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Student Id</StyledTableCell>
              <StyledTableCell align="center">Student Name</StyledTableCell>
              <StyledTableCell align="center">Instructor Name</StyledTableCell>
              <StyledTableCell align="center">Delete</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes?.students?.map((cls) => (
              <StyledTableRow key={cls}>
                <StyledTableCell align="center" component="th" scope="row">
                  {cls}
                </StyledTableCell>
                <StyledTableCell align="center" component="th" scope="row">
                  {fetchName(cls)}
                </StyledTableCell>
                <StyledTableCell align="center" component="th" scope="row">
                  {classes.instructorName}
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
                      handelClickDelete(cls);
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
          Add Student
        </Button>
      </Box>
    </>
  );
}
