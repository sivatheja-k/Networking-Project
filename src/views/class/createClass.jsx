import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, Grid, Modal, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
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
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useConfirm } from "material-ui-confirm";
import { AuthContext } from "../../context/AuthContext";
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

export default function CreateClass() {
  const { user } = React.useContext(AuthContext);
  const theme = useTheme();
  const [classes, setClasses] = React.useState([]);
  const [classId, setClassId] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [newClass, setNewClass] = React.useState(false);
  const confirm = useConfirm();

  React.useEffect(() => {
    const fetchedClasses = [];

    async function fetchData() {
      console.log(user.uid);
      const querySnapshot = await getDocs(collection(db, "classes"));
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        if (user.uid === "wucVzOYGZRg7T9jd4GDr8sqHqpK2") {
          fetchedClasses.push(doc.data());
        } else if (doc.data().instructorId === user.uid) {
          fetchedClasses.push(doc.data());
        }
      });
      console.log(fetchedClasses);
      setClasses(fetchedClasses);
    }
    fetchData();
  }, []);

  const handelClickEdit = (cls) => {
    setNewClass(false);
    setClassId(cls.id);
    setName(cls.name);

    handleOpen();
  };
  const handelCreateClick = () => {
    setNewClass(true);
    reset();
    handleOpen();
  };
  const handelClickDelete = async (id) => {
    confirm({ description: "This action is permanent!" })
      .then(async () => {
        try {
          await deleteDoc(doc(db, "classes", id));
          const filtered = classes.filter((cls) => cls.id !== id);
          setClasses(filtered);
          console.log("deleted");

          successToast("Class Deleted Successfully!! 🎉🎉");
        } catch (err) {
          errorToast("Something went wrong 😥");
        }
      })
      .catch((err) => {
        console.log("cancelled deletion");
      });
  };

  const handelSubmitEdit = async (e) => {
    e.preventDefault();
    const cls = {
      name,
    };
    console.log(classId);
    try {
      const mintRef = doc(db, "classes", classId);

      await setDoc(mintRef, cls, { merge: true });
      successToast("Class Edited Successfully!! 🎉🎉");
    } catch (err) {
      console.log(err);
      errorToast("Something went wrong 😥");
    }
    setClasses(
      produce((draft) => {
        const cls = draft.find((cls) => cls.id === classId);
        cls.name = name;
      })
    );
    reset();
    handleClose();
  };
  const handelSubmitCreate = async (e) => {
    e.preventDefault();

    const genratedID = uniqid();
    const cls = {
      name,
      instructorName: user.displayName,
      id: genratedID,
      instructorId: user.uid,
      students: [],
    };
    handleClose();
    reset();
    setNewClass(false);
    try {
      const mintRef = doc(db, "classes", cls.id);
      await setDoc(mintRef, cls);
      successToast("Class Created Successfully!! 🎉🎉");
      setClasses(
        produce((draft) => {
          draft.push(cls);
        })
      );
    } catch (err) {
      console.log(err);
      errorToast("Something went wrong 😥");
    }
  };

  const navigate = useNavigate();

  const reset = () => {
    if (classId) {
      setClassId("");
      setName("");
      console.log("resetting");
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
            if (newClass) {
              handelSubmitCreate(e);
            } else {
              handelSubmitEdit(e);
            }
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              minWidth: "fit-content",
              bgcolor: "background.paper",
              border: "2px solid #000",
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
              {newClass ? "Create Class" : "Edit Class"}
            </Typography>

            <Grid container spacing={2} mt={2}>
              {/* <Grid item xs={12} sm={6} md={4} rowSpacing={2}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Type of Lottery
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={type}
                    label="Type"
                    onChange={(e) => {
                      setType(e.target.value);
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
                    <MenuItem value={"Hybrid"}>Hybrid</MenuItem>
                    <MenuItem value={"NFT"}>NFT</MenuItem>
                    <MenuItem value={"Jackpot"}>Jackpot</MenuItem>
                    <MenuItem value={"Solana"}>Solana</MenuItem>
                  </Select>
                </FormControl>
              </Grid> */}
              <Grid item xs={12} rowSpacing={2}>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Class Name"
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

              {/*        
              <Grid item xs={12} sm={6} md={4} rowSpacing={2}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Status</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={status}
                    label="Status"
                    onChange={(e) => {
                      setStatus(e.target.value);
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
                    <MenuItem value={true}>Open</MenuItem>
                    <MenuItem value={false}>Close</MenuItem>
                  </Select>
                </FormControl>
              </Grid> */}
              {/* <Grid item xs={12} sm={6} md={4} rowSpacing={2}>
                <TextField
                  id="outlined-basic"
                  label="Merchant Wallet Address"
                  variant="outlined"
                  value={merchantWallet}
                  onChange={(e) => {
                    setMerchantWallet(e.target.value);
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
              </Grid> */}
            </Grid>

            <Box id="modal-modal-description" sx={{ mt: 2 }}>
              <Button type="submit" variant="outlined" color="success">
                {newClass ? "Create" : "Edit"}
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
              <StyledTableCell>Edit</StyledTableCell>
              <StyledTableCell align="center">Instructor</StyledTableCell>
              <StyledTableCell align="center">Class Name</StyledTableCell>
              <StyledTableCell align="center">Manage Students</StyledTableCell>
              <StyledTableCell align="center">
                Manage Attendance
              </StyledTableCell>
              <StyledTableCell align="center">View Attendance</StyledTableCell>
              <StyledTableCell align="center">Delete</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.map((cls) => (
              <StyledTableRow key={cls.id}>
                <StyledTableCell component="th" scope="row">
                  <Button
                    variant="outlined"
                    size="small"
                    color="secondary"
                    sx={{
                      padding: "2px 8px",
                      fontWeight: "bold",
                    }}
                    onClick={() => {
                      handelClickEdit(cls);
                    }}
                  >
                    Edit
                  </Button>
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    fontWeight: "bold",
                  }}
                  align="center"
                  component="th"
                  scope="row"
                >
                  {cls.instructorName}
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    fontWeight: "bold",
                  }}
                  align="center"
                  component="th"
                  scope="row"
                >
                  {cls.name}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      padding: "2px 8px",
                      fontWeight: "medium",
                    }}
                    onClick={() => {
                      navigate(`/class/${cls.id}`);
                    }}
                  >
                    Manage Students
                  </Button>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Button
                    color="secondary"
                    variant="contained"
                    size="small"
                    sx={{
                      padding: "2px 8px",
                      fontWeight: "medium",
                    }}
                    onClick={() => {
                      navigate(`/attendance/${cls.id}`);
                    }}
                  >
                    Manage Attendance
                  </Button>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Button
                    color="info"
                    variant="contained"
                    size="small"
                    sx={{
                      padding: "2px 8px",
                      fontWeight: "medium",
                    }}
                    onClick={() => {
                      navigate(`/view/${cls.id}`);
                    }}
                  >
                    View Attendance
                  </Button>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      padding: "2px 8px",
                      fontWeight: "medium",
                    }}
                    color="error"
                    onClick={() => {
                      handelClickDelete(cls.id);
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
        <Button
          type="submit"
          variant="contained"
          color="success"
          onClick={(e) => handelCreateClick(e)}
        >
          Create Class
        </Button>
      </Box>
    </>
  );
}
