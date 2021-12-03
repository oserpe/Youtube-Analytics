export const formatDate = (date) => {
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();

	if (month < 10) return `${day}/0${month}/${year}`;

	return `${day}/${month}/${year}`;
};
