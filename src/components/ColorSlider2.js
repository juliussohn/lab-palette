import React, { useState, useEffect, useCallback } from "react";
import chromajs from "chroma-js";
import styled, { css } from "styled-components";
import { scaleLinear } from "d3-scale";
import { clamp } from "../helpers.js";
import { connect } from "react-redux";
import { Input } from "./containers.js";
import ScaleSelect from "./ScaleSelect.js";

const Container = styled.div`
	margin: 10px 0;
`;
const Header = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 4px;
`;
const Inputs = styled.div`
	display: flex;
	justify-content: space-between;
	margin-top: 4px;
`;

const getRailGradient = ({ lightness, chroma, hue }) => {
	const getSteps = (count = 6) => {
		let steps = [];
		for (var i = 0; i < count * 2; i++) {
			const l = lightness[0] + ((lightness[1] - lightness[0]) / count) * i;
			const c = chroma[0] + ((chroma[1] - chroma[0]) / count) * i;
			const h = hue[0] + ((hue[1] - hue[0]) / count) * i;
			steps.push(chromajs.lch(l, c, h));
		}
		return steps;
	};

	const stepCount = 12;

	const scale = chromajs
		.scale(getSteps(stepCount))
		.domain([0, 360])
		.mode("lch");
	let steps = scale.classes(stepCount).colors(stepCount);

	const gradientSteps = steps.map(
		(step, i) => `${step} ${(100 / stepCount) * i}%`
	);

	return `linear-gradient(90deg, ${gradientSteps.join(`,`)})`;
};

const Rail = styled.div`
	position: relative;
	height: 15px;
	background: grey;
	border-radius: 2px;
`;

const handleWidth = 12;

const BaseHandle = styled.div`
	height: 21px;
	width: ${handleWidth}px;
	top: -4px;
	border-radius: 2px;
	box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
	border: 4px solid;
	background: transparent;
	position: absolute;
	margin-left: -${handleWidth / 2}px;
	cursor: pointer;
`;

const ShadeHandle = styled.div`
	height: 12px;
	width: ${handleWidth}px;
	top: 2px;
	border-radius: 100%;
	box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
	border: 1px solid;
	background: transparent;
	position: absolute;
	margin-left: -${handleWidth / 2}px;
	cursor: pointer;

	${(props) =>
		props.shade == "dark"
			? css`
					background-color: black;
					border-color: white;
			  `
			: props.shade == "light"
			? css`
					background-color: white;
					border-color: black;
			  `
			: ``}
`;

function ColorSlider({
	background,
	min,
	max,
	value,
	label,
	onChange,
	state: { options },
}) {
	const [markerPosition, setMarkerPosition] = useState({
		dark: 0,
		base: 0,
		light: 0,
	});
	const [isDragging, setDragging] = useState(false);
	const railRef = React.useRef();
	const [rail, setRail] = useState({ width: 0, left: 0 });
	const [gradient, setGradient] = useState("");

	useEffect(() => {
		setGradient(getRailGradient(background));
	});

	useEffect(() => {
		const handleResize = () => {
			const left = railRef.current.getBoundingClientRect().left;
			const width = railRef.current.offsetWidth;
			setRail({ left, width });
		};
		window.addEventListener("resize", handleResize);
		handleResize();

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [min, max, railRef]);

	useEffect(() => {
		const handleMouseUp = (event) => setDragging(false);

		const handleMouseMove = ({ clientX }) => {
			const scale = scaleLinear().domain([min, max]).range([0, rail.width]);
			const newPos = clientX - rail.left;
			let val = scale.invert(newPos);
			if (isDragging == "base") {
				val = clamp(val, min, max);
			} else {
				val = val - value.base;
			}
			handleChange(val, isDragging);
		};

		window.addEventListener("mouseup", handleMouseUp);
		if (isDragging) window.addEventListener("mousemove", handleMouseMove);

		return () => {
			window.removeEventListener("mouseup", handleMouseUp);
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, [isDragging]);

	const handleChange = (val, param) => {
		if (options.mirrorValues) {
			if (param == "light") {
				onChange({ ...value, light: val, dark: val * -1 });
			} else if (param == "dark") {
				onChange({ ...value, dark: val, light: val * -1 });
			} else {
				onChange({ ...value, [param]: val });
			}
		} else {
			onChange({ ...value, [param]: val });
		}
	};

	useEffect(() => {
		const scale = scaleLinear().domain([min, max]).range([0, rail.width]);
		const base = scale(parseFloat(value.base));
		let dark = scale(parseFloat(value.dark) + parseFloat(value.base));
		let light = scale(parseFloat(value.light) + parseFloat(value.base));

		dark = clamp(dark, 0, rail.width);
		light = clamp(light, 0, rail.width);

		setMarkerPosition({
			base,
			dark,
			light,
		});
	}, [value.base, value.dark, value.light, min, max, rail]);

	const handleMouseDown = (e, handle) => {
		setDragging(handle);
	};

	return (
		<Container>
			<Header>
				<label>{label}</label>
				<ScaleSelect
					onChange={(v) => onChange({ ...value, scale: v })}
					value={value.scale}
				></ScaleSelect>{" "}
			</Header>
			<Rail ref={railRef} style={{ background: gradient }}>
				{value.base && (
					<BaseHandle
						style={{ transform: `translateX(${markerPosition.base}px)` }}
						onMouseDown={(e) => handleMouseDown(e, "base")}
						className="handle base"
						base={true}
					></BaseHandle>
				)}
				<ShadeHandle
					shade={"dark"}
					style={{ transform: `translateX(${markerPosition.dark}px)` }}
					onMouseDown={(e) => handleMouseDown(e, "dark")}
					className="handle base"
				></ShadeHandle>
				<ShadeHandle
					shade={"light"}
					style={{ transform: `translateX(${markerPosition.light}px)` }}
					onMouseDown={(e) => handleMouseDown(e, "light")}
					className="handle base"
				></ShadeHandle>
			</Rail>

			<Inputs>
				<Input
					step="10"
					type="number"
					id="hue"
					name="hue"
					value={value.dark}
					onChange={(event) => handleChange(event.target.value, "dark")}
				/>
				<Input
					step="10"
					type="number"
					id="hue"
					name="hue"
					value={value.base}
					onChange={(event) => handleChange(event.target.value, "base")}
				/>
				<Input
					step="10"
					type="number"
					id="hue"
					name="hue"
					value={value.light}
					onChange={(event) => handleChange(event.target.value, "light")}
				/>
			</Inputs>
		</Container>
	);
}

const mapStateToProps = (state) => {
	return {
		...state,
	};
};

export default connect(mapStateToProps, null)(ColorSlider);
