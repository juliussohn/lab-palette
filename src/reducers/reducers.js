import update from "react-addons-update";

const defaultChroma = [110, 100, 90];
const getSwatch = () => {
	const hue = Math.floor(Math.random() * 360);
	return {
		hue: {
			base: hue,
			dark: -0,
			light: 0,
		},
		chroma: {
			base: 100,
			dark: 10,
			light: -10,
		},
		lightness: {
			base: 70,
			dark: -20,
			light: 30,
		},
	};
};

const defaultState = {
	options: {
		steps: 5,
		lightness: {
			base: 70,
			dark: -20,
			light: 30,
		},
		chroma: {
			base: 100,
			dark: 10,
			light: -10,
		},
		globalChroma: true,
		globalLightness: true,
		showImaginary: false,
		mirrorValues: true,
	},
	swatches: [getSwatch()],
};

function reducers(state = defaultState, action) {
	console.log(action.chroma);
	switch (action.type) {
		case "ADD_SWATCH":
			return update(state, {
				swatches: {
					$push: [
						{
							...getSwatch(),
							chroma: state.options.chroma,
							chroma: state.options.lightness,
						},
					],
				},
			});

		case "SET_STEPS":
			return {
				...state,
				options: {
					...state.options,
					steps: action.steps,
				},
			};

		case "UPDATE_SWATCH":
			return update(state, {
				swatches: {
					[action.index]: { $merge: action.swatch },
				},
			});

		case "SET_LIGHTNESS":
			return update(state, {
				options: {
					lightness: { $set: action.lightness },
				},
				swatches: {
					$apply: (swatches) =>
						swatches.map((item) => {
							return {
								...item,
								lightness: action.lightness,
							};
						}),
				},
			});

		case "SET_CHROMA":
			return update(state, {
				options: {
					chroma: { $set: action.chroma },
				},
				swatches: {
					$apply: (swatches) =>
						swatches.map((item) => {
							return {
								...item,
								chroma: action.chroma,
							};
						}),
				},
			});

		case "SET_IMAGINARY":
			return update(state, {
				options: {
					showImaginary: { $set: action.imaginary },
				},
			});

		case "SET_GLOBAL_CHROMA":
			return update(state, {
				options: {
					globalChroma: { $set: action.globalChroma },
				},
				swatches: {
					$apply: (swatches) =>
						swatches.map((item) => {
							return {
								...item,
								chroma: state.options.chroma,
							};
						}),
				},
			});
		case "SET_GLOBAL_LIGHTNESS":
			return update(state, {
				options: {
					globalLightness: { $set: action.globalLightness },
				},
				swatches: {
					$apply: (swatches) =>
						swatches.map((item) => {
							return {
								...item,
								lightness: state.options.lightness,
							};
						}),
				},
			});
		case "SET_MIRROR_VALUES":
			if (action.mirrorValues == false) {
				return update(state, {
					options: {
						mirrorValues: { $set: action.mirrorValues },
					},
				});
			}

			const getMiddle = ({ dark, light }) => {
				const middle = (Math.abs(dark) + Math.abs(light)) / 2;
				return {
					dark:
						dark == 0 && light == 0
							? 0
							: dark == 0
							? -1 * middle * (light / Math.abs(light))
							: middle * (dark / Math.abs(dark)),

					light:
						dark == 0 && light == 0
							? 0
							: light == 0
							? -1 * middle * (dark / Math.abs(dark))
							: middle * (light / Math.abs(light)),
				};
			};
			return update(state, {
				options: {
					mirrorValues: { $set: action.mirrorValues },
					lightness: { $merge: getMiddle(state.options.lightness) },
					chroma: { $merge: getMiddle(state.options.chroma) },
				},
				swatches: {
					$apply: (swatches) =>
						swatches.map((item) => {
							return update(item, {
								chroma: { $merge: getMiddle(item.chroma) },
								hue: { $merge: getMiddle(item.hue) },
							});
						}),
				},
			});
		default:
			return state;
	}
}

export default reducers;
