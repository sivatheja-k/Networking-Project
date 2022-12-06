import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { Alert, Box, Button, LinearProgress, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import AttendanceCheck from "./AttendanceCheck";
import { Stack } from "@mui/system";
import dayjs from "dayjs";
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

export default function ManageAttandance() {
  const { classId } = useParams();
  const [classes, setClass] = React.useState([]);
  const [attendanceTaken, setAttendanceTaken] = React.useState(false);
  const [allStudents, setAllStudents] = React.useState([]);
  const [start, setStart] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [user, setUser] = React.useState({
    status: "DEFAULT",
    data: null,
  });
  const [attendance, setAttandance] = React.useState([]);
  async function fetchData() {
    //Fetching Students

    const fetchedStudents = [];

    const querySnapshot = await getDocs(collection(db, "students"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      fetchedStudents.push({ ...doc.data(), status: "NA" });
    });
    console.log(fetchedStudents);

    setAllStudents(fetchedStudents);

    const attRef = collection(db, "classes", classId, "attendance");
    const q = await query(attRef, orderBy("timestamp", "desc"), limit(1));
    let attData = "";
    const attShot = await getDocs(q);
    attShot.forEach((doc) => {
      attData = doc.data();
    });

    const docRef = doc(db, "classes", classId);

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      const stdIds = docSnap.data().students;
      const students = fetchedStudents.filter((student) =>
        stdIds.includes(student.id)
      );
      if (attData && dayjs().isSame(dayjs(attData.timestamp), "day")) {
        console.log("same day", attData);
        setAttendanceTaken(true);
        setClass({
          ...docSnap.data(),
          students: students.map((student) => {
            if (attData.attendance.includes(student.id)) {
              return { ...student, status: "PRESENT" };
            } else {
              return { ...student, status: "ABSENT" };
            }
          }),
        });
      } else {
        setClass({ ...docSnap.data(), students });
      }
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }
  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handelCreateClick = () => {
    handleOpen();
    setStart(true);
  };

  const reset = () => {
    handleClose();
    setAttandance([]);
    setUser({ status: "DEFAULT", data: null });
    setStart(false);
    setImage(null);
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onImageSubmit = async (result) => {
    if (!result) return;
    const data = allStudents.find(
      (student) =>
        student.id === result.subject && student.classes.includes(classId)
    );

    if (data) {
      if (attendance.includes(data.id)) {
        setUser({
          status: "DONE",
          data,
        });

        return;
      }
      let students = classes.students;

      students = students.map((student) => {
        if (student.id === result.subject) {
          return {
            ...student,
            status: "PRESENT",
          };
        } else {
          return student;
        }
      });
      setClass((data) => ({ ...data, students }));

      setAttandance((el) => [...el, data.id]);

      setUser({
        status: "SUCCESS",
        data,
      });
    } else {
      setUser({
        status: "FAIL",
        data: null,
      });
    }
  };

  const getResult = () => {
    switch (user.status) {
      case "SUCCESS":
        return (
          <Alert
            severity="success"
            sx={{
              margin: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              my: 2,
            }}
          >
            {user.data.name}'s Attendance got Captured Sucessfully!
          </Alert>
        );
      case "FAIL":
        return (
          <Alert
            severity="error"
            sx={{
              margin: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              my: 2,
            }}
          >
            Can't Detect this Image.
          </Alert>
        );
      case "DONE":
        return (
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
            {user.data.name} is already Captured.
          </Alert>
        );
      default:
        break;
    }
  };

  const postAttendance = async () => {
    setLoading(true);
    try {
      const docRef = await addDoc(
        collection(db, "classes", classId, "attendance"),
        {
          timestamp: new Date().getTime(),
          attendance,
        }
      );
      setLoading(false);

      reset();

      console.log("Document written with ID: ", docRef.id);
      let students = classes.students;

      students = students.map((student) => {
        if (student.status === "NA") {
          return {
            ...student,
            status: "ABSENT",
          };
        } else {
          return student;
        }
      });
      setClass((data) => ({ ...data, students }));
      setAttendanceTaken(true);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  return (
    <>
      {open && (
        <>
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
              Attendance
            </Typography>

            <AttendanceCheck
              user={user}
              setUser={setUser}
              image={image}
              setImage={setImage}
              onImageSubmit={onImageSubmit}
              loading={loading}
              setLoading={setLoading}
            />

            {loading && <LinearProgress />}

            {getResult()}

            <Stack
              direction={"row"}
              spacing={2}
              id="modal-modal-description"
              sx={{ mt: 2 }}
            >
              <Button
                onClick={postAttendance}
                variant="contained"
                color="secondary"
              >
                Submit
              </Button>
            </Stack>
          </Box>
        </>
      )}
      {attendanceTaken && (
        <Alert
          severity="success"
          sx={{
            backgroundColor: "black",
            color: "#fff",
            margin: "auto",
            width: "fit-content",
            my: 2,
          }}
        >
          Attendance taken today For this Class
        </Alert>
      )}
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
              <StyledTableCell align="center">Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes?.students?.map((cls) => (
              <StyledTableRow key={cls.id}>
                <StyledTableCell align="center" component="th" scope="row">
                  {cls.id}
                </StyledTableCell>
                <StyledTableCell align="center" component="th" scope="row">
                  {cls.name}
                </StyledTableCell>
                <StyledTableCell align="center" component="th" scope="row">
                  {classes.instructorName}
                </StyledTableCell>

                <StyledTableCell align="center">
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      padding: "2px 8px",
                    }}
                    color={
                      cls.status === "PRESENT"
                        ? "success"
                        : cls.status === "NA"
                        ? "info"
                        : "error"
                    }
                  >
                    {cls.status}
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box id="modal-modal-description" sx={{ mt: 2 }}>
        {start ? null : (
          <Button
            type="submit"
            variant="contained"
            onClick={handelCreateClick}
            disabled={attendanceTaken}
          >
            Take Attendance
          </Button>
        )}
      </Box>
    </>
  );
}
