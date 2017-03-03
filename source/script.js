var mainCanvas = document.getElementById("mainCanvas");
var mainCtx = mainCanvas.getContext("2d");
var plotCanvas = document.getElementById("plotCanvas");
var plotCtx = plotCanvas.getContext("2d");

var plot = {
	//Plot bounds
	xMax: 10,
	xMin: -10,
	yMax: 10,
	yMin: -10,
	//Function selected on drop down
	selectedFunc: document.getElementById("selectFuncs").selectedIndex,
	//Functions available through drop down
	funcs: [
		firstX,
		firstY,
		secondX,
		secondY
		]
};

function firstX(inputX, inputY) {
	return 1*inputX + -1*inputY;
}

function firstY(inputX, inputY) {
	return 1*inputX + 1*inputY;
}

function secondX(inputX, inputY) {
	return 2*inputX + -1*inputY;
}

function secondY(inputX, inputY) {
	return 1*inputX + 2*inputY;
}




drawPlot();








/*
Draws plot labels onto canvas.
Default plot with (0,0) at center and
(+-10,+-10) at the corners

*/
function drawPlotLabels() {
	//Set custom font for plot labels
	mainCtx.save();
	mainCtx.font = "15px sans-serif";
	mainCtx.fillText(String(plot.yMax), 10, 65);
	mainCtx.fillText(String(plot.yMin), 10, 650);
	mainCtx.fillText(String(plot.xMin), 50, 690);
	mainCtx.fillText(String(plot.xMax), 635, 690);
	mainCtx.restore();
}

/*
Modifies input x coordinate relative to plot
into coordinate relative to canvas.
For example with default plot settings inputing (0,0)
returns (300,300)

*/
function convertXCoordinate(inputX) {
	//Each pixel on the plot corresponds to
	//(xMax-xMin)/600 units.
	//So the inputX relative to the canvas is
	//The number of units from xMin, scaled by
	//((xMax-xMin)/600)^-1.
	
	//Note we do not check for division by 0 here.
	//We catch xMax=xMin case elsewhere
	var temp = Math.floor((inputX-plot.xMin)/((plot.xMax-plot.xMin) / 600));
	return temp;
}

/*
Modifies input y coordinate relative to plot
into coordinate relative to canvas.

*/
function convertYCoordinate(inputY) {
	var temp = Math.floor((plot.yMax - inputY)/((plot.yMax-plot.yMin) / 600));
	return temp;
}

/*
Draws coordinate axes onto canvas.
Default plot with (0,0) at center
*/
function drawAxes() {
	//We use these for drawing axes
	var tempX = 0;
	var tempY = 0;
	
	//Check if we need to draw the x-axis
	if (plot.yMin <= 0 && 0 <= plot.yMax) {
		var tempY = convertYCoordinate(0);

		plotCtx.beginPath();
		plotCtx.moveTo(0, tempY);
		plotCtx.lineTo(600, tempY);
		plotCtx.strokeStyle = "blue";
		plotCtx.stroke();
		plotCtx.closePath();
	}
	
	//Check if we need to draw y-axis
	if (plot.xMin <= 0 && 0 <= plot.xMax) {
		var tempX = convertXCoordinate(0);

		plotCtx.beginPath();
		plotCtx.moveTo(tempX, 0);
		plotCtx.lineTo(tempX, tempY+600);
		plotCtx.strokeStyle = "blue";
		plotCtx.stroke();
		plotCtx.closePath();
	}
}

/*
Draws small arrow onto plot with given angle at
given (x,y) position. Input positions are relative
to the plot, NOT the canvas.

*/
function drawArrow(inputX, inputY, inputAngle) {
	plotCtx.save();
	var tempX = convertXCoordinate(inputX);
	var tempY = convertYCoordinate(inputY);

	plotCtx.translate(tempX, tempY);
	//Not sure about the negative angle here
	plotCtx.rotate(-inputAngle*Math.PI/180);

	plotCtx.beginPath();

	plotCtx.strokeStyle = "black";
	plotCtx.moveTo(0,0);
	plotCtx.lineTo(10,0);
	plotCtx.stroke();

	plotCtx.moveTo(10,0);
	plotCtx.lineTo(8,2);
	plotCtx.stroke();

	plotCtx.moveTo(10,0);
	plotCtx.lineTo(8,-2);
	plotCtx.stroke();

	plotCtx .closePath();
	plotCtx.restore();
}

/*
Draws vector field for given functions onto plot.
Draws 400 arrows using the drawArrow function.

*/
function drawVectorField(inputXFunc, inputYFunc) {
	//Find a small offset from the plot boundary
	//for visual reasons. We use 15 pixel offset
	var offsetX = 15*(plot.xMax-plot.xMin)/600;
	var offsetY = 15*(plot.yMax-plot.yMin)/600;
	
	//Find a step size to give us 20 arrows in
	//each direction
	var stepX = (plot.xMax-plot.xMin)/20;
	var stepY = (plot.yMax-plot.yMin)/20;


	for (var i = 0; i < 20; ++i) {
		for(var j=0; j < 20; ++j) {
			//For clarity. Calculated values
			var calcX = plot.xMin + offsetX + stepX*i;
			var calcY = plot.yMin + offsetY + stepY*j;
			//We calculate angle of vector
			//and convert to degrees
			var angle = Math.atan2(
				inputYFunc(calcX,calcY),
				inputXFunc(calcX,calcY))
				*180/Math.PI;
			angle = Math.round(angle);
			drawArrow(calcX, calcY, angle);
		}
	}
}

/*
Returns smaller of (xMax-xMin)/inputScale or
similar with yMax and yMin.

*/
function getMinScale(inputScale) {
	return Math.min(Math.abs((plot.xMax-plot.xMin)/inputScale),
			Math.abs((plot.yMax-plot.yMin)/inputScale));
}

/*
Draws a trajectory for given initial condition and two dimensional
system. First plots curve 'forward' in direction of vector field
and then 'backwards'. Only plot for a limited number of iterations

*/
function drawTrajectory(initX, initY, xFunc, yFunc) {
	//Need save and restore so trajectory
	//drawing settings aren't used elsewhere
	plotCtx.save();

	//Set step size
	var step = getMinScale(250);
	//For use in drawing trajectory. We reuse initX
	//and initY for calculations
	var canvasX = convertXCoordinate(initX);
	var canvasY = convertYCoordinate(initY);
	//For use in calculations and drawing
	var tempX = 0;
	var tempY = 0;

	plotCtx.lineWidth = 4;
	plotCtx.lineJoin = "round";
	
	for(var i = 0; i < 200; ++i) {
		plotCtx.beginPath();
		plotCtx.moveTo(canvasX, canvasY);

		//Note here that tempX and tempY represent
		//the difference between previous and next
		//position
		tempX = step*xFunc(initX, initY);
		tempY = step*yFunc(initX, initY);
		initX += tempX;
		initY += tempY;
		canvasX = convertXCoordinate(initX);
		canvasY = convertYCoordinate(initY);

		//Check to see how 'fast' particle is moving.
		//indigo slow, red FAST.
		//We compare speeds by finding the minimum difference
		//between next and previous position and comparing
		//it with some percentage of the step size.
		//This should give us an idea of speed relative to
		//the plot and it's boundaries
		if (step >= Math.abs(Math.min(tempX,tempY))) {
			plotCtx.strokeStyle = "indigo";
		} else if (2*step >= Math.abs(Math.min(tempX,tempY))) {
			plotCtx.strokeStyle = "blue";
		} else if (5*step >= Math.abs(Math.min(tempX,tempY))) {
			plotCtx.strokeStyle = "green";
		} else if (10*step >= Math.abs(Math.min(tempX,tempY))) {
			plotCtx.strokeStyle = "yellow";
		} else if (15*step >= Math.abs(Math.min(tempX,tempY))) {
			plotCtx.strokeStyle = "orange";
		} else if (25*step >= Math.abs(Math.min(tempX,tempY))) {
			plotCtx.strokeStyle = "orange";
		} else {
			plotCtx.strokeStyle = "red";
		}
		plotCtx.lineTo(canvasX, canvasY)
		plotCtx.stroke();
		plotCtx.closePath();

		//Check to see if we are very near a fixed point
		//or moving out of the plot boundary.
		//If so set i to 300 and break loop
		if (initX < plot.xMin-50*step ||initX > plot.xMax + 50*step
			|| initY < plot.yMin - 50*step|| initY > plot.yMax + 50*step
			|| Math.max(Math.abs(tempX),Math.abs(tempY)) <= 0.001*step) {
			i = 300;
		}
	}
	plotCtx.restore();
}

/*
Clears the canvases and draws the plot.

*/
function drawPlot() {
	plotCtx.beginPath();
	plotCtx.clearRect(0, 0, 600, 600);
	mainCtx.beginPath();
	mainCtx.clearRect(0,0,700, 700);
	drawPlotLabels();
	drawAxes();
	//We send the 2*ith and 2*ith+1 functions
	//from the plot.funcs array to the
	//drawVectorField function here
	drawVectorField(plot.funcs[2*plot.selectedFunc],
		plot.funcs[2*plot.selectedFunc+1]);
}

/*
Handles user click on plot canvas.

*/
function mouseDown(event) {
	//Mouse click position relative to plot canvas
	var inputX = event.pageX-70;
	var inputY = event.pageY-100;

	//converting from coordinates relative to plot canvas
	//to coordinates relative to plot
	inputX = plot.xMin + inputX*(plot.xMax-plot.xMin)/600;
	inputY = plot.yMax - inputY*(plot.yMax - plot.yMin)/600;
	drawPlot();
	//We send the 2*ith and 2*ith+1 functions
	//from the plot.funcs array to the
	//drawTrajectory function here
	drawTrajectory(inputX, inputY,
		plot.funcs[2*plot.selectedFunc],
		plot.funcs[2*plot.selectedFunc+1]);
}

/*
Updates the selected function when user selects new function
via drop down menu

*/
function updateSelectedFunc() {
	plot.selectedFunc =  document.getElementById("selectFuncs").selectedIndex;
}

/*
Handles button down on plotVectorField button.

*/
function buttonDown() {
	drawPlot();
}
