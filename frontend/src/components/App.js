import { makeStyles } from "@mui/styles";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import routes from "../routes";
import { themeUtils } from "../theme";

import "./App.css";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

const useStyles = makeStyles((theme) => ({
	pageContainer: {
		paddingLeft: themeUtils.sidebarWidth,
		width: `calc(100% - ${themeUtils.sidebarWidth}px)`,
		marginRight: 0,
		marginLeft: "auto",
	},
}));

const App = () => {
	const classes = useStyles();

	return (
		<div>
			<Sidebar routes={routes} />
			<div className={classes.pageContainer}>
				<Switch>
					<Redirect from="/" to={Object.values(routes)[0].path} exact />

					{routes.map((route) => (
						<Route
							exact
							path={route.path}
							key={route.path}
							component={route.component}
						/>
					))}
				</Switch>
				<Footer />
			</div>
		</div>
	);
};

export default App;
