import { Autocomplete, TextField, Box } from "@mui/material";
import React from "react";

const SimpleAutocompleteDropdown = ({
	label,
	icon,
	options,
	value,
	onChange,
}) => {
	return (
		<Box sx={{ display: "flex", alignItems: "center" }}>
			{icon}

			<Autocomplete
				value={value}
				onChange={(_, value) => onChange(value)}
				disablePortal
				options={options}
				getOptionLabel={(option) => option.name || ""}
				sx={{ width: 300 }}
				renderInput={(params) => <TextField {...params} label={label} />}
			/>
		</Box>
	);
};

export default SimpleAutocompleteDropdown;