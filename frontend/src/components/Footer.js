import { makeStyles } from "@mui/styles";
import React from "react";
import { themeUtils } from "../theme";

const AUTHORS = [
	{
		name: "Gonzalo Arca",
		githubLink: "https://github.com/gonzaloarca",
	},
	{
		name: "Manuel Rodríguez",
		githubLink: "https://github.com/rodriguezmanueljoaquin",
	},
	{
		name: "Octavio Serpe",
		githubLink: "https://github.com/oserpe",
	},
];

const useStyles = makeStyles((theme) => ({
	footerContainer: {
		height: themeUtils.footerHeight,
		width: "100%",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		color: themeUtils.palette.grey.main,
		fontSize: "0.8rem",
	},
	text: {
		margin: "0.2rem",
	},
	link: {
		textDecoration: "none",
		fontWeight: 500,
	},
}));

const Footer = () => {
	const classes = useStyles();

	const renderAuthors = () => {
		return AUTHORS.map((author) => {
			return (
				<React.Fragment key={author.name}>
					<a className={classes.link} href={author.githubLink}>
						{author.name}
					</a>
					{", "}
				</React.Fragment>
			);
		});
	};

	return (
		<div className={classes.footerContainer}>
			<p className={classes.text}>Desarrollado por {renderAuthors()}</p>
			<p className={classes.text}>Base de Datos II - 2C 2021 - ITBA</p>
		</div>
	);
};

export default Footer;
