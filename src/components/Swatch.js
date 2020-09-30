import React from "react";
import chromajs from "chroma-js";
import Slider, { Range } from "rc-slider";
import ColorSlider from "./ColorSlider";

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
`;

const linear = (step, a, b) => {
	return a + b * step;
};

const ColorBox = styled.div`
	flex: 1;
	padding: 5px;
	color: rgba(0, 0, 0, 0.3);
	${(props) =>
		props.base &&
		css`
			margin: 0 px;
		`}
	${(props) =>
		props.color.clipped() &&
		props.imaginary &&
		css`
			background: repeating-linear-gradient(
				45deg,
				rgba(0, 0, 0, 0),
				rgba(0, 0, 0, 0) 5px,
				rgba(0, 0, 0, 0.05) 5px,
				rgba(0, 0, 0, 0.05) 10px
			);
		`}
  background-color: ${(props) => props.color.hex() || "black"};
`;

const Options = styled.div`
	width: 400px;
	padding: 0 10px;
`;

const ColorRow = styled.div`
	display: flex;
	flex: 1;
`;

const getHueGradient = (min = 0, max = 360) => {
	const getSteps = (count = 6) => {
		let steps = [];
		for (var i = 0; i < count; i++) {
			steps.push(chromajs.lch(70, 90, (360 / count) * i));
		}
		return steps;
	};

	const stepCount = 6;

	const scale = chromajs
		.scale(getSteps(stepCount))
		.domain([0, 360])
		.mode("lch");
	let steps = scale.classes(stepCount).colors(stepCount);

	const gradientSteps = steps.map(
		(step, i) => `${step} ${(100 / stepCount) * i}%`
	);

	return `linear-gradient(90deg, ${gradientSteps.join(`,`)})`;
	/*

  let gradientSteps = [];
  const hueSteps = to - from;
  for (let i = from; i < to - from; i += skip) {
    gradientSteps.push(`hsl(${i},100%,${lightness}%) ${(100 / hueSteps) * i}%`);
  }
*/
};
function Swatch({ state: { options }, hue, chroma, onChange, key }) {
	let scaleFunction;

	switch ("sqrt") {
		case "linear":
			scaleFunction = scaleLinear;
			break;
		case "sqrt":
			scaleFunction = scaleSqrt;
			break;
		case "pow2":
			scaleFunction = () => scalePow().exponent(2);
			break;
		case "pow3":
			scaleFunction = () => scalePow().exponent(3);
			break;
		default:
			scaleFunction = scaleLinear;
			break;
	}

	const domain = [-1 * options.steps, 0, options.steps];
	const lightnessScale = scalePow()
		.exponent(2)
		.domain(domain)
		.range(options.lightness);

	const hueDark = parseFloat(hue.base) + parseFloat(hue.dark);
	const hueBase = parseFloat(hue.base);
	const hueLight = parseFloat(hue.base) + parseFloat(hue.light);

	console.log([hue.base + hue.dark, hue.base, hue.base + hue.light]);
	const hueScale = scaleFunction()
		.domain(domain)
		.range([hueDark, hueBase, hueLight]);

	const chromaDark = parseFloat(chroma.base) + parseFloat(chroma.dark);
	const chromaBase = parseFloat(chroma.base);
	const chromaLight = parseFloat(chroma.base) + parseFloat(chroma.light);

	const chromaScale = scaleFunction()
		.domain(domain)
		.range([chromaDark, chromaBase, chromaLight]);

	console.log(getHueGradient());

	let colors = [];
	for (let i = -1 * options.steps; i <= options.steps; i++) {
		colors.push(
			<ColorBox
				base={i === 0}
				color={chromajs.lch(
					Math.round(lightnessScale(i)),
					Math.round(chromaScale(i)),
					Math.round(hueScale(i))
				)}
				imaginary={options.showImaginary}
			>
				L: {Math.round(lightnessScale(i))}
				<br />
				C: {Math.round(chromaScale(i))}
				<br />
				H: {Math.round(hueScale(i))}
			</ColorBox>
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
				<ColorSlider
					label="Hue"
					count={hue.length}
					hue={[0, 360]}
					chroma={[90, 90]}
					lightness={[70, 70]}
					min={0}
					max={720}
					value={hue}
					onChange={(value) => onChange({ hue: value })}
					marks={{
						[hueDark]: <Marker>D</Marker>,
						[hueLight]: <Marker>L</Marker>,
					}}
				/>

				<ColorSlider
					label="Chroma"
					count={chroma.length}
					allowCross={false}
					hue={[hue[1], hue[1]]}
					chroma={[0, 150]}
					lightness={[70, 70]}
					min={0}
					max={150}
					value={chroma}
					onChange={(value) => onChange({ chroma: value })}
					marks={{
						[chromaDark]: <Marker>D</Marker>,
						[chromaLight]: <Marker>L</Marker>,
					}}
				/>
			</Options>
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
