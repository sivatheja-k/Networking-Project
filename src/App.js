import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { ConfirmProvider } from "material-ui-confirm";
// routing
import Routes from "./routes";

// defaultTheme
import themes from "./themes";

// project imports
import NavigationScroll from "./layout/NavigationScroll";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

import "./style.scss";
// ==============================|| APP ||============================== //

const App = () => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider
        theme={themes({ fontFamily: `'Roboto', sans-serif`, borderRadius: 12 })}
      >
        <CssBaseline />
        <ConfirmProvider>
          <NavigationScroll>
            <AuthProvider>
              <Toaster />
              <Routes />
            </AuthProvider>
          </NavigationScroll>
        </ConfirmProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
