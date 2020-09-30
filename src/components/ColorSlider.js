import React from "react";
import chromajs from "chroma-js";
import Slider, { Range } from "rc-slider";
import styled from "styled-components";

const Container = styled.div`
	margin-top: 15px;
`;
const Inputs = styled.div`
	display: flex;
	justify-content: space-between;
	margin-top: 10px;
`;

const Input = styled.input`
	display: flex;
	padding: 4px 0;
	border: none;
	outline: none;
	border-bottom: 1px solid rgba(0, 0, 0, 0.3);
	text-align: center;
`;

const getHueGradient = (lightness, chroma, hue) => {
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
function ColorSlider(props) {
	const height = 15;

	return (
		<Container>
			<label>{props.label}</label>

			<Slider
				{...props}
				railStyle={{
					backgroundImage: getHueGradient(
						props.lightness,
						props.chroma,
						props.hue
					),
					height: height,
					boxShadow: `0 1px 5px rgba(0,0,0,0.2) inset`,
					borderRadius: 2,
				}}
				trackStyle={[
					{
						backgroundColor: "transparent",
						height: height + 6,
						marginTop: -3,
						border: `3px solid`,
						borderRadius: 3,
					},
				]}
				pushable={true}
				allowCross={false}
			/>
			<Inputs>
				{props.value.map((val, i) => (
					<Input
						step="10"
						type="number"
						id="hue"
						name="hue"
						value={val}
						onChange={(event) =>
							props.onChange(
								Object.assign([], props.value, { [i]: event.target.value })
							)
						}
					/>
				))}
			</Inputs>
		</Container>
	);
}

export default ColorSlider;
