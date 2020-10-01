import React from "react";
import styled from "styled-components";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import ColorSlider from "./components/ColorSlider2";
import { connect } from "react-redux";
import Swatch from "./components/Swatch";
import Toggle from "./components/Toggle";
import { Options, Input } from "./components/containers.js";

import "./styles.scss";
import {
	setSteps,
	updateSwatch,
	addSwatch,
	setLightness,
	setChroma,
	setGlobalChroma,
	setImaginary,
	setMirrorValues,
	setGlobalLightness,
} from "./actions/actions.js";
import { bindActionCreators } from "redux";

const Settings = styled.div`
	display: flex;
`;
function App({
	state: { options, swatches },
	setSteps,
	updateSwatch,
	addSwatch,
	setLightness,
	setImaginary,
	setChroma,
	setGlobalChroma,
	setGlobalLightness,
	setMirrorValues,
}) {
	console.log(swatches);
	return (
		<div className="App">
			<Settings>
				<Options>
					{options.globalLightness && (
						<ColorSlider
							label={"Lightness"}
							background={{
								hue: [270, 270],
								chroma: [0, 0],
								lightness: [0, 70],
							}}
							min={0}
							max={150}
							value={options.lightness}
							onChange={(value) => setLightness(value)}
						/>
					)}

					{options.globalChroma && (
						<ColorSlider
							label={"Chroma"}
							background={{
								hue: [40, 40],
								chroma: [0, 150],
								lightness: [50, 70],
							}}
							min={0}
							max={150}
							value={options.chroma}
							onChange={(value) => setChroma(value)}
						/>
					)}
				</Options>
				<Options>
					<label>Steps</label>
					<Input
						type="number"
						id="steps"
						value={options.steps}
						onChange={(event) => setSteps(event.target.value)}
					/>
					<br />
					<Toggle
						label={"Use Global Lightness"}
						value={options.globalLightness}
						onChange={setGlobalLightness}
					/>
					<Toggle
						label={"Use Global Chroma"}
						value={options.globalChroma}
						onChange={setGlobalChroma}
					/>
					<Toggle
						label={"Mirror Values"}
						value={options.mirrorValues}
						onChange={setMirrorValues}
					/>
					<Toggle
						label={"Highlight Imaginary Colors"}
						value={options.showImaginary}
						onChange={setImaginary}
					/>
				</Options>
			</Settings>

			<hr />
			{swatches.map((swatch, i) => (
				<Swatch
					key={`swatch_${i}`}
					onChange={(swatch) => updateSwatch(i, swatch)}
					hue={swatch.hue}
					chroma={swatch.chroma}
					lightness={swatch.lightness}
				/>
			))}
			<button onClick={addSwatch}>Add</button>
		</div>
	);
}
const mapStateToProps = (state) => {
	return {
		...state,
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(
		{
			setSteps,
			updateSwatch,
			addSwatch,
			setLightness,
			setImaginary,
			setChroma,
			setGlobalChroma,
			setMirrorValues,
			setGlobalLightness,
		},
		dispatch
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
