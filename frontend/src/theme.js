import { createTheme } from "@mui/material";
import "@fontsource/plus-jakarta-sans";
import "@fontsource/plus-jakarta-sans/300.css";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";

export const themeUtils = {
	palette: {
		red: {
			main: "#ff0000",
		},
	},
	sidebarWidth: 280,
};
const headerWeight = 500;

const theme = createTheme({
	palette: {
		primary: {
			main: "#ff0000",
		},
	},
	typography: {
		h1: {
			fontWeight: headerWeight,
		},
		h2: {
			fontWeight: headerWeight,
		},
		h3: {
			fontWeight: headerWeight,
		},
		h4: {
			fontWeight: headerWeight,
		},
		h5: {
			fontWeight: headerWeight,
		},
		h6: {
			fontWeight: headerWeight,
		},
		subtitle1: {
			fontWeight: headerWeight,
		},
		fontFamily: [
			'"Plus Jakarta Sans"',
			"Roboto",
			'"Segoe UI"',
			'"Helvetica Neue"',
			"Arial",
			"sans-serif",
		].join(","),
	},
});

export default theme;
