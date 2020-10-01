import React from "react";
import chromajs from "chroma-js";
import Slider, { Range } from "rc-slider";
import ColorSlider from "./ColorSlider2";
import ranges from "../ranges";
import { clamp } from "../helpers.js";
import { Options } from "./containers.js";
import ColorTile from "./ColorTile.js";

import {
	scaleLinear,
	scaleTime,
	scaleSqrt,
	scalePow,
	scaleLog,
	scaleOrdinal,
	schemeCategory10,
} from "d3-scale";
import styled, { css } from "styled-components";

//import { setSteps } from "./actions/actions.js";
import { bindActionCreators } from "redux";

import { connect } from "react-redux";
const Container = styled.div`
	display: flex;
	width: 100%;
	padding: 0 15px;
	&:nth-child(even) {
		background-color: rgba(0, 0, 0, 0.07);
	}
`;

const Actions = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

const ColorRow = styled.div`
	display: flex;
	flex: 1;
`;

function Swatch({
	state: { options },
	lightness,
	hue,
	chroma,
	onChange,
	onDelete,
	onMoveUp,
	onMoveDown,
}) {
	const domain = [-1 * options.steps, 0, options.steps];

	const lightnessBase = parseFloat(lightness.base);
	const lightnessDark = clamp(
		lightnessBase + parseFloat(lightness.dark),
		ranges.lightness[0],
		ranges.lightness[1]
	);
	const lightnessLight = clamp(
		lightnessBase + parseFloat(lightness.light),
		ranges.lightness[0],
		ranges.lightness[1]
	);

	const lightnessScale = ranges.scales[lightness.scale]
		.scale()
		.domain(domain)
		.range([lightnessDark, lightnessBase, lightnessLight]);

	const hueBase = parseFloat(hue.base);
	const hueDark = clamp(
		hueBase + parseFloat(hue.dark),
		ranges.hue[0],
		ranges.hue[1]
	);
	const hueLight = clamp(
		hueBase + parseFloat(hue.light),
		ranges.hue[0],
		ranges.hue[1]
	);

	const hueScale = ranges.scales[hue.scale]
		.scale()
		.domain(domain)
		.range([hueDark, hueBase, hueLight]);

	const chromaBase = parseFloat(chroma.base);
	const chromaDark = clamp(
		chromaBase + parseFloat(chroma.dark),
		ranges.chroma[0],
		ranges.chroma[1]
	);
	const chromaLight = clamp(
		chromaBase + parseFloat(chroma.light),
		ranges.chroma[0],
		ranges.chroma[1]
	);

	const chromaScale = ranges.scales[chroma.scale]
		.scale()
		.domain(domain)
		.range([chromaDark, chromaBase, chromaLight]);

	let colors = [];
	for (let i = -1 * options.steps; i <= options.steps; i++) {
		colors.push(
			<ColorTile
				base={i === 0}
				color={chromajs.lch(
					Math.round(lightnessScale(i)),
					Math.round(chromaScale(i)),
					Math.round(hueScale(i))
				)}
				showImaginary={options.showImaginary}
				showContrast={options.showContrast}
			>
				L: {Math.round(lightnessScale(i))}
				<br />
				C: {Math.round(chromaScale(i))}
				<br />
				H: {Math.round(hueScale(i))}
			</ColorTile>
		);
	}

	const Marker = styled.div`
		height: 16px;
		width: 16px;
		padding: 3px;
		border: 1px solid black;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: -4px;
		margin-top: 4px;
		border-radius: 100%;
	`;

	return (
		<Container key={"container"}>
			<Options key={"options"}>
				{!options.globalLightness && (
					<ColorSlider
						label="Lightness"
						background={{
							hue: [hue.base, hue.base],
							chroma: [60, 60],
							lightness: [0, 70],
						}}
						min={ranges.lightness[0]}
						max={ranges.lightness[1]}
						value={lightness}
						onChange={(value) => onChange({ lightness: value })}
					/>
				)}
				<ColorSlider
					label="Hue"
					background={{
						hue: [0, 360],
						chroma: [90, 90],
						lightness: [70, 70],
					}}
					min={ranges.hue[0]}
					max={ranges.hue[1]}
					value={hue}
					onChange={(value) => onChange({ hue: value })}
					marks={{
						[hueDark]: <Marker>D</Marker>,
						[hueLight]: <Marker>L</Marker>,
					}}
				/>
				{!options.globalChroma && (
					<ColorSlider
						label="Chroma"
						background={{
							hue: [hue.base, hue.base],
							chroma: [0, 150],
							lightness: [70, 70],
						}}
						min={ranges.chroma[0]}
						max={ranges.chroma[1]}
						value={chroma}
						onChange={(value) => onChange({ chroma: value })}
						marks={{
							[chromaDark]: <Marker>D</Marker>,
							[chromaLight]: <Marker>L</Marker>,
						}}
					/>
				)}
			</Options>
			<Actions>
				<button onClick={onDelete}>×</button>
				<button onClick={onMoveUp}>↑</button>
				<button onClick={onMoveDown}>↓</button>
			</Actions>
			<ColorRow>{colors}</ColorRow>
		</Container>
	);
}

const mapStateToProps = (state) => {
	return {
		...state,
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Swatch);
