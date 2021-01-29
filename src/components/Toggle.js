import React from 'react'

function Toggle({ label, value, onChange, key, level = 0, ...props }) {
	return (
		<div
			style={{
				paddingLeft: `${level * 15}px`,
				opacity: props.disabled ? 0.5 : 1,
			}}>
			<input
				{...props}
				type="checkbox"
				id={label}
				checked={value}
				onChange={event => onChange(event.target.checked)}
			/>
			<label for={label}>{label}</label>
		</div>
	)
}

export default Toggle
