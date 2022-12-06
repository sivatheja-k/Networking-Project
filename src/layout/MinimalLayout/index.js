import { AuthContext } from "../../context/AuthContext";
import { useEffect } from "react";
import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";

// project imports
// import Customization from "../Customization";

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <Outlet />
      {/* <Customization /> */}
    </>
  );
};

export default MinimalLayout;
