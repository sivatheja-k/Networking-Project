// material-ui
import logo from "../assets/images/logo.png";

// ==============================|| LOGO SVG ||============================== //

const Logo = ({ size }) => {
  return <img src={logo} alt="logo" width={size ? size : "auto"} />;
};

export default Logo;
