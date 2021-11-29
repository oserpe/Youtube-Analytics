import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { makeStyles } from "@mui/styles";
import { themeUtils } from "../theme";
import { Link } from "react-router-dom";

const { sidebarWidth } = themeUtils;

const useStyles = makeStyles((theme) => ({
	logoContainer: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		padding: "1rem",
		width: "100%",
	},
	selectedTab: {
		backgroundColor: themeUtils.palette.red.main + " !important",
		color: "white !important",
	},
	selectedIcon: {
		color: "white !important",
	},
}));

const Sidebar = ({ routes }) => {
	const classes = useStyles();
	const [currentRoute, setCurrentRoute] = useState(window.location.pathname);
	const isSelected = (route) =>
		route.path === currentRoute ||
		(route.path === "/query1" && currentRoute === "/");

	const onClick = (path) => {
		setCurrentRoute(path);
	};

	const renderRouteList = (routes) => {
		return routes.map((route) => (
			<ListItem
				onClick={() => {
					onClick(route.path);
				}}
				// TODO: arreglar este fix nefasto
				selected={isSelected(route)}
				classes={{ selected: classes.selectedTab }}
				button
				key={route.path}
				component={Link}
				to={route.path}
			>
				<ListItemIcon>
					<ManageSearchIcon
						className={isSelected(route) ? classes.selectedIcon : ""}
					/>
				</ListItemIcon>

				<ListItemText primary={route.title} />
			</ListItem>
		));
	};

	return (
		<>
			<AppBar
				position="fixed"
				sx={{
					width: `calc(100% - ${sidebarWidth}px)`,
					ml: `${sidebarWidth}px`,
				}}
			></AppBar>
			<Drawer
				sx={{
					width: sidebarWidth,
					flexShrink: 0,
					"& .MuiDrawer-paper": {
						width: sidebarWidth,
						boxSizing: "border-box",
					},
				}}
				variant="permanent"
				anchor="left"
			>
				<Toolbar style={{ justifyContent: "center" }}>
					<div className={classes.logoContainer}>
						<img src="/img/yt-analytics-logo.svg" alt="site logo" />
						<Typography ml={1} variant="h5">
							YouTube Analytics
						</Typography>
					</div>
				</Toolbar>

				<Divider />
				<Typography m={2} mb={1} variant="h6">
					Queries
				</Typography>

				<List>{renderRouteList(routes)}</List>
			</Drawer>
		</>
	);
};

export default Sidebar;
