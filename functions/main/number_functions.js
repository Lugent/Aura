function getRandomNumber(max) { return Math.floor(Math.random() * Math.floor(max)); }
function getRandomNumberRange(min, max) { return Math.floor(Math.random() * ((max - min) + 1)) + min; }

function getOrdinalNumber(number) {
	if (number <= 0) { return number; } // Zero or negatives doesn't supported
	if (((number % 100) >= 11) && ((number % 100) <= 13)) { return number + "th"; } // More or equals that 11 and less or equals that 13
	switch (number % 10) // Return depending number
	{
		case 1: { return number + "st"; } // One
		case 2: { return number + "nd"; } // Two
		case 3: { return number + "rd"; } // Three
		default: { return number + "th"; } // Four or more
	}
}

function getFormattedNumber(num, digits) {
	var formats = [
		{value: 1, symbol: ""}, // None
		{value: 1E3, symbol: "k"}, // Thousand
		{value: 1E6, symbol: "M"}, // Million
		{value: 1E9, symbol: "B"}, // Billion
		{value: 1E12, symbol: "T"}, // Trillion
		{value: 1E15, symbol: "QD"}, // Quadrillion
		{value: 1E18, symbol: "QT"}, // Quintillion
		{value: 1E21, symbol: "SX"}, // Sextillion
		{value: 1E24, symbol: "SP"}, // Septillion
		{value: 1E27, symbol: "OC"}, // Octillion
		{value: 1E30, symbol: "NO"}, // Nonillion
		{value: 1E33, symbol: "DE"}, // Decillion
		{value: 1E36, symbol: "UN"}, // Undecillion
		{value: 1E39, symbol: "DU"}, // Duodecillion
		{value: 1E42, symbol: "TR"}, // Tredecillion
		{value: 1E45, symbol: "QU"}, // Quattuordecillion
		{value: 1E48, symbol: "QN"}, // Quindecillion
		{value: 1E51, symbol: "SD"}, // Sexdecillion
		{value: 1E54, symbol: "SP"}, // Septendecillion
		{value: 1E57, symbol: "OD"}, // Octodecillion	
		{value: 1E60, symbol: "ND"}, // Novemdecillion
		{value: 1E63, symbol: "VT"}, // Vigintillion
		{value: 1E66, symbol: "CT"} // Centillion
	];
	
	let result = num;
	let rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	for (let i = formats.length - 1; i > 0; i--) {
		if (num >= formats[i].value) {
			result = (num / formats[i].value).toFixed(digits).replace(rx, "$1") + formats[i].symbol;
			break;
		}
	}
	return result;
}

module.exports = {
    getRandomNumber: getRandomNumber,
	getRandomNumberRange: getRandomNumberRange,
	getFormattedNumber: getFormattedNumber,
	getOrdinalNumber: getOrdinalNumber
};