import { useContext, useEffect, useState } from "react";

// material-ui
import { Grid, Typography } from "@mui/material";

// project imports
import EarningCard from "./EarningCard";
import TotalOrderLineChartCard from "./TotalOrderLineChartCard";
import TotalIncomeDarkCard from "./TotalIncomeDarkCard";
import TotalIncomeLightCard from "./TotalIncomeLightCard";
import { gridSpacing } from "../../../store/constant";
import { AuthContext } from "../../../context/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { School } from "@mui/icons-material";
import { Box } from "@mui/system";

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  async function fetchClasses() {
    const fetchedClasses = [];
    const querySnapshot = await getDocs(collection(db, "classes"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      fetchedClasses.push(doc.data());
    });
    setClasses(fetchedClasses);
  }
  async function fetchStudents() {
    const fetchedClasses = [];
    const querySnapshot = await getDocs(collection(db, "students"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      fetchedClasses.push(doc.data());
    });
    setStudents(fetchedClasses);
  }

  async function fetchInstructors() {
    const fetchedClasses = [];
    const querySnapshot = await getDocs(collection(db, "instructors"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      fetchedClasses.push(doc.data());
    });
    setInstructors(fetchedClasses);
  }

  useEffect(() => {
    setLoading(false);
    fetchClasses();
    fetchStudents();
    fetchInstructors();
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Box
        sx={{
          margin: "auto",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            textAlign: "center",
            mt: 3,
          }}
        >
          Welcome, {user.displayName || "New User"}
        </Typography>
      </Box>

      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard
              isLoading={isLoading}
              fillcolor={"secondary"}
              title={"Classes"}
              total={classes.length}
              icon={"https://img.icons8.com/bubbles/512/classroom.png"}
            />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard
              isLoading={isLoading}
              fillcolor={"primary"}
              title={"Students"}
              total={students.length}
              icon={
                "https://img.icons8.com/stickers/512/student-registration.png"
              }
            />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard
              isLoading={isLoading}
              fillcolor={"secondary"}
              title={"Instructors"}
              total={instructors.length}
              icon={
                "https://img.icons8.com/external-justicon-lineal-color-justicon/512/external-teacher-avatar-and-occupation-justicon-lineal-color-justicon.png"
              }
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
