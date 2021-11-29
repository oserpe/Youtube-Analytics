import { makeStyles } from "@mui/styles";
import React from "react";
import QueryHeader from "../components/QueryHeader";

const useStyles = makeStyles((theme) => ({
	headerContainer: {
		marginTop: "3rem",
		marginLeft: "2rem",
	},
	dataVisualizerContainer: {
		display: "flex",
		margin: "3rem auto",
		height: "600px",
		width: "70%",
		backgroundColor: "#f9f9f9",
	},
}));

const QueryPage = ({ title, description, dataVisualizer }) => {
	const classes = useStyles();

	return (
		<div>
			<div className={classes.headerContainer}>
				<QueryHeader title={title} description={description} />
			</div>
			<div className={classes.dataVisualizerContainer}>{dataVisualizer}</div>
		</div>
	);
};

export default QueryPage;
