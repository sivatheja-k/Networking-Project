import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { Alert, Button, LinearProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import dayjs from "dayjs";
import { Box } from "@mui/system";
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

export default function ViewAttendance() {
  const { classId } = useParams();
  const [classes, setClass] = React.useState([]);
  const [attendance, setAttandance] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  async function fetchData() {
    //Fetching Students

    const fetchedStudents = [];

    const querySnapshot = await getDocs(collection(db, "students"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      fetchedStudents.push({ ...doc.data(), status: "NA" });
    });
    console.log(fetchedStudents);

    const docRef = doc(db, "classes", classId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let theClass = docSnap.data();
      console.log("Document data:", docSnap.data());
      const stdIds = docSnap.data().students;
      setClass(theClass);
      const students = fetchedStudents.filter((student) =>
        stdIds.includes(student.id)
      );

      const attRef = collection(db, "classes", classId, "attendance");
      const q = await query(attRef, orderBy("timestamp", "desc"));
      let attData = [];
      const attShot = await getDocs(q);
      attShot.forEach((doc) => {
        attData.push(doc.data());
      });
      console.log(attData);
      console.log(students);
      const finalData = attData.map(({ attendance, timestamp }) => {
        let result = students.map((student) => {
          let theStudent = { ...student };
          if (attendance.includes(student.id)) {
            theStudent.status = "PRESENT";
          } else {
            theStudent.status = "ABSENT";
          }
          return theStudent;
        });
        console.log(result);
        return { timestamp, students: result };
      });
      setAttandance(finalData || []);
      console.log(finalData);
      // setClass({
      //   ...docSnap.data(),
      //   students: students.map((student) => {
      //     if (attData.attendance.includes(student.id)) {
      //       return { ...student, status: "PRESENT" };
      //     } else {
      //       return { ...student, status: "ABSENT" };
      //     }
      //   }),
      // });
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
    setLoading(false);
  }
  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading ? (
        <LinearProgress />
      ) : (
        <>
          {attendance?.length === 0 && (
            <Alert
              sx={{
                backgroundColor: "black",
                color: "#fff",
                margin: "auto",
                width: "fit-content",
                my: 2,
              }}
            >
              No Attendance Records Found
            </Alert>
          )}
          {attendance?.map((attendance, idx) => (
            <Box key={idx}>
              <Alert
                sx={{
                  backgroundColor: "black",
                  color: "#fff",
                  margin: "auto",
                  width: "fit-content",
                  my: 2,
                }}
              >
                {dayjs(attendance.timestamp).format("DD MMMM, dddd")}
              </Alert>
              <TableContainer
                component={Paper}
                sx={{ maxHeight: "45vh", overflow: "auto" }}
              >
                <Table stickyHeader aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">
                        Student Id
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Student Name
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Instructor Name
                      </StyledTableCell>
                      <StyledTableCell align="center">Status</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendance?.students?.map((cls) => (
                      <StyledTableRow key={cls.id}>
                        <StyledTableCell
                          align="center"
                          component="th"
                          scope="row"
                        >
                          {cls.id}
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          component="th"
                          scope="row"
                        >
                          {cls.name}
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          component="th"
                          scope="row"
                        >
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
            </Box>
          ))}
        </>
      )}
    </>
  );
}