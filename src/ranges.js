import {
	scaleLinear,
	scaleTime,
	scaleSqrt,
	scalePow,
	scaleLog,
	scaleOrdinal,
	schemeCategory10,
} from 'd3-scale'

export default {
	hue: [0, 720],
	chroma: [0, 150],
	lightness: [0, 150],
	scales: {
		linear: {
			label: 'Linear',
			scale: scaleLinear,
		},
		pow0_5: {
			label: 'Power(0.5)',
			scale: () => scalePow().exponent(0.5),
		},
		pow0_6: {
			label: 'Power(0.6)',
			scale: () => scalePow().exponent(0.6),
		},
		pow0_7: {
			label: 'Power(0.7)',
			scale: () => scalePow().exponent(0.7),
		},
		pow0_8: {
			label: 'Power(0.8)',
			scale: () => scalePow().exponent(0.8),
		},
		pow0_9: {
			label: 'Power(0.9)',
			scale: () => scalePow().exponent(0.9),
		},
		pow1_1: {
			label: 'Power(1.1)',
			scale: () => scalePow().exponent(1.1),
		},
		pow1_2: {
			label: 'Power(1.2)',
			scale: () => scalePow().exponent(1.2),
		},
		pow1_3: {
			label: 'Power(1.3)',
			scale: () => scalePow().exponent(1.3),
		},
		pow1_4: {
			label: 'Power(1.4)',
			scale: () => scalePow().exponent(1.4),
		},
		pow1_5: {
			label: 'Power(1.5)',
			scale: () => scalePow().exponent(1.5),
		},
		pow2: {
			label: 'Power(2)',
			scale: () => scalePow().exponent(2),
		},
	},
}
