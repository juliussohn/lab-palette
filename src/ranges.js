import {
	scaleLinear,
	scaleTime,
	scaleSqrt,
	scalePow,
	scaleLog,
	scaleOrdinal,
	schemeCategory10,
} from "d3-scale";

export default {
	hue: [0, 720],
	chroma: [0, 150],
	lightness: [0, 150],
	scales: {
		linear: {
			label: "Linear",
			scale: scaleLinear,
		},
		pow0_5: {
			label: "Power(0.5)",
			scale: () => scalePow().exponent(0.5),
		},
		pow1_5: {
			label: "Power(1.5)",
			scale: () => scalePow().exponent(1.5),
		},
		pow2: {
			label: "Power(2)",
			scale: () => scalePow().exponent(2),
		},
	},
};
