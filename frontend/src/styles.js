const globalStyles = (theme) => ({
	contentContainer: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		margin: "3rem auto",
		width: "90%",
	},
	actionsContainer: {
		display: "flex",
		justifyContent: "space-evenly",
		flexWrap: "wrap",
		marginBottom: "1rem",
	},
	chartContainer: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		overflowX: "scroll",
	},
});

export default globalStyles;
