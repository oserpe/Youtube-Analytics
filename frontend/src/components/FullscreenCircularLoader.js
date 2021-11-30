import { CircularProgress } from "@mui/material";
import React from "react";

const FullscreenCircularLoader = () => {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
				width: "100%",
				backgroundColor: "white",
				zIndex: 999,
			}}
		>
			<CircularProgress />
		</div>
	);
};

export default FullscreenCircularLoader;
