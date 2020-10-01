export function clamp(num, min, max) {
	num = parseFloat(num);
	min = parseFloat(min);
	max = parseFloat(max);
	return num <= min ? min : num >= max ? max : num;
}
