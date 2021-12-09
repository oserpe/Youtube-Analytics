import { Chip, Typography } from "@mui/material";
import React from "react";
import { themeUtils } from "../theme";

const databaseImages = {
	Neo4J: "/img/neo4j.png",
	Elasticsearch: "/img/elasticsearch.svg",
	MongoDB: "/img/mongodb.svg",
};

const QueryHeader = ({ title, description, usedDatabases }) => {
	const databases = usedDatabases.join(", ");
	return (
		<div>
			<Typography variant="h4">{title}</Typography>
			<Typography variant="subtitle1">{description}</Typography>

			<div
				style={{ margin: "20px 0 0 0", display: "flex", alignItems: "center" }}
			>
				<Typography
					style={{ color: themeUtils.palette.grey.main, marginRight: 10 }}
				>
					Bases usadas:{" "}
				</Typography>

				{usedDatabases.map((db) => (
					<Chip
						key={db}
						label={db}
						icon={
							<img
								style={{
									height: "100%",
									width: "20%",
									objectFit: "contain",
									marginLeft: 0,
								}}
								src={databaseImages[db]}
								alt={`${db} logo`}
							/>
						}
					/>
				))}
			</div>
		</div>
	);
};

export default QueryHeader;
