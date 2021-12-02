import { makeStyles } from "@mui/styles";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { ChannelsContextProvider } from "../context/ChannelsContext";
import { PoliticiansContextProvider } from "../context/PoliticiansContext";
import queries from "../queries";
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
			<Sidebar routes={queries} />
			<div className={classes.pageContainer}>
				<ChannelsContextProvider>
					<PoliticiansContextProvider>
						<Switch>
							<Redirect from="/" to={Object.values(queries)[0].path} exact />

							{queries.map((route) => (
								<Route
									exact
									path={route.path}
									key={route.path}
									component={route.component}
								/>
							))}
						</Switch>
					</PoliticiansContextProvider>
				</ChannelsContextProvider>
				<Footer />
			</div>
		</div>
	);
};

export default App;
