import { makeStyles } from "@mui/styles";
import React from "react";
import QueryHeader from "../components/QueryHeader";

const useStyles = makeStyles((theme) => ({
	headerContainer: {
		margin: "4rem 4rem 0 4rem",
	},
}));

const QueryPage = ({ title, description, usedDatabases, children }) => {
	const classes = useStyles();

	return (
		<div>
			<div className={classes.headerContainer}>
				<QueryHeader
					title={title}
					description={description}
					usedDatabases={usedDatabases}
				/>
			</div>
			{children}
		</div>
	);
};

export default QueryPage;
