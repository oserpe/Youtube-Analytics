import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
	<ThemeProvider theme={theme}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</ThemeProvider>,
	document.querySelector("#root")
);
