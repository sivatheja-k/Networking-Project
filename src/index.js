import React from "react";
import ReactDOM from "react-dom";

// third party
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

// project imports
import { store } from "./store";

import App from "./App";

// style + assets
import "./assets/scss/style.scss";

// ===========================|| REACT DOM RENDER  ||=========================== //

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
