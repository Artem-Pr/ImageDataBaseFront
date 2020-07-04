import React from "react";
import { Header } from "./components/Header/Header";
import { ModalWindow } from "./components/ModalWindow/ModalWindow";

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from '@material-ui/styles';
import pink from "@material-ui/core/colors/pink";
import { blue } from "@material-ui/core/colors";

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: pink,
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Header />
      </ThemeProvider>
      {/* <ModalWindow /> */}
    </div>
  );
}

export default App;
