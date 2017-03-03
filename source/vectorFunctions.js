//First from ex 6.3.2
function firstX(x, y) {
	return -1*y +-0.01*x*(Math.pow(x,2)+Math.pow(y,2));
}

function firstY(x, y) {
	return x+-0.01*y*(Math.pow(x,2)+Math.pow(y,2));
}

//6.4
function secondX(x, y) {
	return x*(3.5-x-2.5*y);
}

function secondY(x, y) {
	return y*(2.5-x-y);
}

//6.5.2
function thirdX(x, y) {
	return y;
}

function thirdY(x, y) {
	return x-Math.pow(x,3);
}

//6.6.1
function fourthX(x, y) {
	return y-Math.pow(y,3);
}

function fourthY(x, y) {
	return -x-Math.pow(y,2);
}

//6.7
function fifthX(x, y) {
	return y;
}

function fifthY(x, y) {
	return -Math.sin(x);
}
