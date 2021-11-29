import { Button } from "@mui/material";
import React from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const ExecuteButton = ({ onClick }) => {
	return (
		<Button
			onClick={onClick}
			variant="contained"
			color="primary"
			startIcon={<PlayArrowIcon />}
		>
			Ejecutar
		</Button>
	);
};

export default ExecuteButton;
