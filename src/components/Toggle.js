import React from "react";

function Toggle({ label, value, onChange, key }) {
	return (
		<div>
			<input
				type="checkbox"
				id={label}
				checked={value}
				onChange={(event) => onChange(event.target.checked)}
			/>
			<label for={label}>{label}</label>
		</div>
	);
}

export default Toggle;
