function getFormatedString(string, values) {
    if ((typeof string !== "string") || (typeof values !== "object")) { return; }
	
    var regex = /%s\(([a-zA-Z0-9_]{1,15})\)/g, i;
    if (regex.test(string)) { string = string.replace(regex, function (found, match) { return values[match]; }); }
	else { for (i in values) { string = string.replace(/%s/, values[i]); } }
    return string;
}

module.exports = {
    getFormatedString: getFormatedString
};