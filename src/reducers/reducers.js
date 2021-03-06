import update from 'react-addons-update'
import { bindActionCreators } from 'redux'

const defaultChroma = {
	base: 70,
	dark: 10,
	light: -10,
	scale: 'linear',
	global: true,
}
const defaultlightness = {
	base: 70,
	dark: -40,
	light: 40,
	scale: 'linear',
	global: true,
}
const getSwatch = (hue = 360) => {
	return {
		hue: {
			base: hue,
			dark: -0,
			light: 0,
			scale: 'linear',
		},
		chroma: defaultChroma,
		lightness: defaultlightness,
	}
}

const defaultState = {
	options: {
		steps: 4,
		chroma: defaultChroma,
		lightness: defaultlightness,
		globalChroma: true,
		globalLightness: true,
		mirrorValues: true,
	},
	view: {
		colorInfo: {
			show: false,
			contrast: true,
			hex: true,
			rgb: true,
			lch: true,
			hsl: true,
		},
		displayP3: false,
		showImaginary: false,
	},
	swatches: [],
}

function reducers(state = defaultState, action) {
	switch (action.type) {
		case 'ADD_SWATCH':
			let hue = state.swatches.length
				? parseInt(state.swatches[state.swatches.length - 1].hue.base) + 40
				: Math.round(Math.random() * 360)
			hue = hue > 720 ? hue - 720 : hue
			return update(state, {
				swatches: {
					$push: [
						{
							...getSwatch(hue),
							chroma: state.options.chroma,
							lightness: state.options.lightness,
						},
					],
				},
			})

		case 'DELETE_SWATCH':
			return update(state, {
				swatches: { $splice: [[action.index, 1]] },
			})

		case 'MOVE_SWATCH':
			return update(state, {
				swatches: {
					$apply: swatches =>
						swatches.map((element, index) =>
							index === action.currentIndex
								? swatches[action.newIndex]
								: index === action.newIndex
								? swatches[action.currentIndex]
								: element
						),
				},
			})

		case 'SET_STEPS':
			return {
				...state,
				options: {
					...state.options,
					steps: action.steps,
				},
			}

		case 'UPDATE_SWATCH':
			return update(state, {
				swatches: {
					[action.index]: { $merge: action.swatch },
				},
			})

		case 'SET_LIGHTNESS':
			return update(state, {
				options: {
					lightness: { $set: action.lightness },
				},
				swatches: {
					$apply: swatches =>
						swatches.map(item => {
							if (!item.lightness.global) return item
							return {
								...item,
								lightness: action.lightness,
							}
						}),
				},
			})

		case 'SET_CHROMA':
			return update(state, {
				options: {
					chroma: { $set: action.chroma },
				},
				swatches: {
					$apply: swatches =>
						swatches.map(item => {
							if (!item.chroma.global) return item
							return {
								...item,
								chroma: action.chroma,
							}
						}),
				},
			})

		case 'SET_IMAGINARY':
			return update(state, {
				view: {
					showImaginary: { $set: action.imaginary },
				},
			})

		case 'SET_COLOR_INFO':
			return update(state, {
				view: {
					colorInfo: { $merge: action.colorInfo },
				},
			})
		case 'SET_DISPLAY_P3':
			return update(state, {
				view: {
					displayP3: { $set: action.displayP3 },
				},
			})

		case 'SET_GLOBAL_CHROMA':
			return update(state, {
				options: {
					globalChroma: { $set: action.globalChroma },
				},
				swatches: {
					$apply: swatches =>
						swatches.map(item => {
							return {
								...item,
								chroma: state.options.chroma,
							}
						}),
				},
			})
		case 'SET_GLOBAL_LIGHTNESS':
			return update(state, {
				options: {
					globalLightness: { $set: action.globalLightness },
				},
				swatches: {
					$apply: swatches =>
						swatches.map(item => {
							return {
								...item,
								lightness: state.options.lightness,
							}
						}),
				},
			})
		case 'IMPORT_STATE_TREE':
			return update(state, {
				$merge: action.stateTree,
			})

		case 'SET_MIRROR_VALUES':
			if (action.mirrorValues == false) {
				return update(state, {
					options: {
						mirrorValues: { $set: action.mirrorValues },
					},
				})
			}

			const getMiddle = ({ dark, light }) => {
				const middle = (Math.abs(dark) + Math.abs(light)) / 2
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
				}
			}
			return update(state, {
				options: {
					mirrorValues: { $set: action.mirrorValues },
					lightness: { $merge: getMiddle(state.options.lightness) },
					chroma: { $merge: getMiddle(state.options.chroma) },
				},
				swatches: {
					$apply: swatches =>
						swatches.map(item => {
							return update(item, {
								chroma: { $merge: getMiddle(item.chroma) },
								hue: { $merge: getMiddle(item.hue) },
							})
						}),
				},
			})
		default:
			return state
	}
}

export default reducers
