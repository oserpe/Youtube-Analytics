import { Typography } from "@mui/material";
import React from "react";

const QueryHeader = ({ title, description }) => {
	return (
		<div>
			<Typography variant="h4">{title}</Typography>
			<Typography variant="subtitle1">{description}</Typography>
		</div>
	);
};

export default QueryHeader;
