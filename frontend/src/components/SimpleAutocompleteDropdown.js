import { Autocomplete, TextField, Box } from "@mui/material";
import React from "react";

const SimpleAutocompleteDropdown = ({
	label,
	icon,
	options,
	value,
	onChange,
	getOptionLabel,
}) => {
	return (
		<Box sx={{ display: "flex", alignItems: "center", width: 1 / 3 }}>
			{icon}

			<Autocomplete
				value={value}
				onChange={(_, value) => onChange(value)}
				disablePortal
				options={options}
				sx={{ width: 1 }}
				getOptionLabel={(option) => getOptionLabel(option)}
				renderInput={(params) => <TextField {...params} label={label} />}
			/>
		</Box>
	);
};

export default SimpleAutocompleteDropdown;
