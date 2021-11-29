import { makeStyles } from "@mui/styles";
import React from "react";
import QueryHeader from "../components/QueryHeader";

const useStyles = makeStyles((theme) => ({
	headerContainer: {
		marginTop: "4rem",
		marginLeft: "4rem",
	},
}));

const QueryPage = ({ title, description, children }) => {
	const classes = useStyles();

	return (
		<div>
			<div className={classes.headerContainer}>
				<QueryHeader title={title} description={description} />
			</div>
			{children}
		</div>
	);
};

export default QueryPage;
