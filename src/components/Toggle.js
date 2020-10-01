import React from "react";

function Toggle({ label, value, onChange }) {
	return (
		<div>
			<input
				type="checkbox"
				id="imaginary"
				checked={value}
				onChange={(event) => onChange(event.target.checked)}
			/>
			<label>{label}</label>
		</div>
	);
}

export default Toggle;
