var mainCanvas = document.getElementById("mainCanvas");
var mainCtx = mainCanvas.getContext("2d");
var plotCanvas = document.getElementById("plotCanvas");
var plotCtx = plotCanvas.getContext("2d");

var plot = {
	//Plot bounds
	xMax: 10,
	xMin: -10,
	yMax: 10,
	yMin: -10
};

drawPlotLabels();
drawAxes();

/*
Draws plot labels onto canvas.
Default plot with (0,0) at center and
(+-10,+-10) at the corners

*/
function drawPlotLabels() {
	//Set custom font for plot labels
	mainCtx.font = "15px sans-serif";
	mainCtx.fillText(String(plot.yMax), 10, 65);
	mainCtx.fillText(String(plot.yMin), 10, 650);
	mainCtx.fillText(String(plot.xMin), 50, 690);
	mainCtx.fillText(String(plot.xMax), 635, 690);
}

/*
Modifies input x coordinate relative to plot
into coordinate relative to canvas.
For example with default plot settings inputing (0,0)
returns (300,300)

*/
function convertXCoordinate(inputX, inputY) {
	//Each pixel on the plot corresponds to
	//(xMax-xMin)/600 units.
	//So the inputX relative to the canvas is
	//The number of units from xMin, scaled by
	//((xMax-xMin)/600)^-1.
	
	//Note we do not check for division by 0 here.
	//We catch xMax=xMin case elsewhere
	var temp = Math.floor((inputX-plot.xMin)/((plot.xMax - plot.xMin) /600));
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
