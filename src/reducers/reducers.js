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
	};
};

const defaultState = {
	options: {
		steps: 5,
		lightness: [20, 70, 100],
		chroma: {
			base: 100,
			dark: 10,
			light: -10,
		},
		globalChroma: true,
		showImaginary: true,
	},
	swatches: [getSwatch()],
};

function reducers(state = defaultState, action) {
	console.log(action.chroma);
	switch (action.type) {
		case "ADD_SWATCH":
			return update(state, {
				swatches: { $push: [{ ...getSwatch(), chroma: state.options.chroma }] },
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
			});
		default:
			return state;
	}
}

export default reducers;
