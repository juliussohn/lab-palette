import React from "react";
import ranges from "../ranges.js";

function ScaleSelect({ value, onChange }) {
	return (
		<select value={value} onChange={(e) => onChange(e.target.value)}>
			{Object.keys(ranges.scales).map((key) => (
				<option value={key}>{ranges.scales[key].label}</option>
			))}
		</select>
	);
}

export default ScaleSelect;
