let index = 0;

export default (prefix: string) => {
	const current = index;
	index++;
	return `${prefix}-${current}`;
};
