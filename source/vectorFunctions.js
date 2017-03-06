//Array to hold function below. Acessed by functions
//in main script for use in plotting
funcs = [firstX,
	firstY,
	secondX,
	secondY,
	thirdX,
	thirdY,
	fourthX,
	fourthY,
	fifthX,
	fifthY,
	sixthX,
	sixthY,
	seventhX,
	seventhY
]

//Various systems for use
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

//7.3.1 Poincare bendixon example
//Should have closed orbit between 1/sqrt(2) = 0.7 and 1
function sixthX(x,y) {
	return x-y-x*(Math.pow(x,2)+5*Math.pow(y,2));
}

function sixthY(x,y) {
	return x + y - y*(Math.pow(x,2) + Math.pow(y,2));
}

//7.1.2 van der pols mu = -1.5
function seventhX(x,y) {
	return y;
}

function seventhY(x,y) {
	return -1.5*(Math.pow(x,2)-1)*y-x;
}

//Matrix object for use in matrix entry plotting
var matrix = {
	a: 0,
	b: 0,
	c: 0,
	d: 0
}

//Functions for use in matrix entry plotting
function matrixXFunc(inputX, inputY) {
	return matrix.a*inputX + matrix.b*inputY;
}

function matrixYFunc(inputX, inputY) {
	return matrix.c*inputX + matrix.d*inputY;
}
