import RequireAuth from "../Helpers/requreAuth";
import MainLayout from "../layout/MainLayout";
import MinimalLayout from "../layout/MinimalLayout";
import { Navigate, Route, Routes } from "react-router-dom";
import Account from "../views/account";
import Dashboard from "../views/dashboard/Default";
import ForgotPassword from "../views/pages/authentication/authentication/ForgotPassword";

// routes
import Login from "../views/pages/authentication/authentication/Login";
import Register from "../views/pages/authentication/authentication/Register";
import CreateClass from "../views/class/createClass";
import CreateStudents from "../views/students/createStudents";
import ManageClass from "../views/class/manageClass";
import ManageAttandance from "../views/class/manageAttandance";
import ViewAttendance from "../views/class/viewAttendance";

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/account" element={<Account />} />
        <Route exact path="/class" element={<CreateClass />} />
        <Route exact path="/class/:classId" element={<ManageClass />} />
        <Route
          exact
          path="/attendance/:classId"
          element={<ManageAttandance />}
        />

      <Route exact path="/view/:classId" element={<ViewAttendance />} />

        <Route exact path="/students" element={<CreateStudents />} />
      </Route>
      <Route exact path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/" element={<MinimalLayout />}>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
