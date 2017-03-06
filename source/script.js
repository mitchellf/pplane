var canvas = document.getElementById("plotCanvas");
var ctx = canvas.getContext("2d");

//Class to hold some plot properties, etc.
var plot = {
	//Plot bounds
	xmin: -10,
	xmax: 10,
	ymin: -10,
	ymax: 10,
	xFunc: firstX,
	yFunc: firstY
}


window.onload = function() {
	drawPlot();
}


function drawPlot(){
	ctx.clearRect(0,0,800,800);
//	drawPlotLabels();
	drawPlotAxes();
	drawVectorField();
}

/*
Draws plot labels based on user input values for plot
boundaries. Draws labels directly onto plot canvas at
respective corners.
*/
function drawPlotLabels() {
	ctx.save();
	ctx.beginPath();
	ctx.font = "bold 20px sans-serif";
	ctx.fillText(String(plot.xmax),765,790);
	ctx.fillText(String(plot.xmin),50,790);
	ctx.fillText(String(plot.ymax), 10,20);
	ctx.fillText(String(plot.ymin),10,770);
	ctx.closePath();
	ctx.restore();
}

/*
Takes in x coordinate relative to plot
and converts to coordinate relative to
canvas.

example for default plot
convertXCoord(0) returns 400
*/
function convertXCoord(inputX) {
	//Each pixel on the plot corresponds to
	//(xMax-xMin)/800 units.
	//So the inputX relative to the canvas is
	//The number of units from xMin, scaled by
	//((xMax-xMin)/800)^-1.
	
	//Note we do not check for division by 0 here.
	//We catch xMax=xMin case elsewhere
	return Math.floor((inputX-plot.xmin)/((plot.xmax-plot.xmin) / 800));
}

/*
Takes in y coordinate relative to plot
and converts to coordinate relative to
canvas.

example for default plot
convertYCoord(0) returns 400
*/
function convertYCoord(inputY) {
	return Math.floor((plot.ymax - inputY)/((plot.ymax-plot.ymin) / 800));
}

function drawPlotAxes() {
	ctx.save();
	ctx.strokeStyle = "blue";
	
	//Check if we need to draw y-axis
	if (plot.ymin <= 0 && 0 <= plot.ymax) {
		ctx.beginPath();
		ctx.moveTo(0,convertYCoord(0));
		ctx.lineTo(800, convertYCoord(0));
		ctx.stroke();
		ctx.closePath();
	}

	//Check if we need to draw x-axis
	if (plot.xmin <= 0 && 0 <= plot.xmax) {
		ctx.beginPath();
		ctx.moveTo(convertXCoord(0),0);
		ctx.lineTo(convertXCoord(0),800);
		ctx.stroke();
		ctx.closePath();
	}


	ctx.restore();
}

/*
Draws small arrow onto plot with given angle at
given (x,y) position. Input positions are relative
to the plot, NOT the canvas.
*/
function drawArrow(inputX, inputY, inputAngle) {
	ctx.save();
	var tempX = convertXCoord(inputX);
	var tempY = convertYCoord(inputY);

	ctx.translate(tempX, tempY);
	//Not sure about the negative angle here
	ctx.rotate(-inputAngle*Math.PI/180);

	ctx.beginPath();

	ctx.strokeStyle = "black";
	ctx.moveTo(0,0);
	ctx.lineTo(12,0);
	ctx.stroke();

	ctx.moveTo(12,0);
	ctx.lineTo(9,3);
	ctx.stroke();

	ctx.moveTo(12,0);
	ctx.lineTo(9,-3);
	ctx.stroke();

	ctx .closePath();
	ctx.restore();
}

/*
Draws vector field for given functions onto plot.
Draws arrows using the drawArrow function.
*/
function drawVectorField() {
	//Find a small offset from the plot boundary
	//for visual reasons. We use 15 pixel offset
	var offsetX = 16*(plot.xmax-plot.xmin)/800;
	var offsetY = 16*(plot.ymax-plot.ymin)/800;

	//Find a step size to give us 20 arrows in
	//each direction
	var stepX = (plot.xmax-plot.xmin)/30;
	var stepY = (plot.ymax-plot.ymin)/30;

	var calcX;
	var calcY;
	var angle;

	//placed outside for performance
	var i;
	var j;
	for (i = 0; i < 30; ++i) {
		for(j = 0; j < 30; ++j) {
			//For clarity. Calculated values
			calcX = plot.xmin + stepX*i + offsetX;
			calcY = plot.ymin + stepY*j + offsetY;
			//We calculate angle of vector
			//and convert to degrees
			angle = Math.atan2(
				plot.yFunc(calcX,calcY),
				plot.xFunc(calcX,calcY))
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
	return Math.min(Math.abs((plot.xmax-plot.xmin)/inputScale),
			Math.abs((plot.ymax-plot.ymin)/inputScale));
}

function drawTrajectory(initX, initY) {
	ctx.save();
	ctx.lineWidth = 4;
	ctx.lineJoin = "round";

	var step;
	var minScale = getMinScale(100);
	var i;
	//Used for calculations
	var tempX = initX;
	var tempY = initY;

	for(i = 0; i < 200; ++i) {
		ctx.beginPath();
		ctx.moveTo(convertXCoord(initX), convertYCoord(initY));
		tempX = plot.xFunc(initX, initY);
		tempY = plot.yFunc(initX, initY);

		//Compute the step size based on magnitude of difference
		//between previous and next point. This is done so that
		//when we compute a large difference we don't generate some
		//obscenely large trajectory that goes off of the plot.

		//We set step size to the inverse of the difference between
		//previous and next if there is a large difference
		//and to 200th a size of the plot if the difference is small
		
		//If we always set the step size to the inverse of the difference
		//for very small differences (near stable fixed points say) 
		//we would generate very large trajectories
		if(minScale > 0.5/Math.max(Math.abs(tempX),Math.abs(tempY))) {
			step = 0.5/Math.max(Math.abs(tempX),Math.abs(tempY));
		} else {
			step = minScale;
		}
		initX+=step*tempX;
		initY+=step*tempY;

		//Check to see how 'fast' particle is moving.
		//indigo slow, red FAST.
		//We compare speeds by finding the minimum difference
		//between next and previous position and comparing
		//it with some percentage of the step size.
		//This should give us an idea of speed relative to
		//the plot and it's boundaries
		if (minScale >= Math.max(Math.abs(tempX),Math.abs(tempY))) {
			ctx.strokeStyle = "indigo";
		} else if (5*minScale >= Math.max(Math.abs(tempX),Math.abs(tempY))) {
			ctx.strokeStyle = "blue";
		} else if (30*minScale >= Math.max(Math.abs(tempX),Math.abs(tempY))) {
			ctx.strokeStyle = " #00cc33"; //Darker green
		} else if (60*minScale >= Math.max(Math.abs(tempX),Math.abs(tempY))) {
			ctx.strokeStyle = "#73e600"; //Lighter green
		} else if (150*minScale >= Math.max(Math.abs(tempX),Math.abs(tempY))) {
			ctx.strokeStyle = "#e6e600"; //Yellowish
		} else if (250*minScale >= Math.max(Math.abs(tempX),Math.abs(tempY))) {
			ctx.strokeStyle = "orange";
		} else {
			ctx.strokeStyle = "red";
		}
		ctx.lineTo(convertXCoord(initX), convertYCoord(initY))
		ctx.stroke();
		ctx.closePath();

		//Check to see if we are very near a fixed point
		//or moving out of the plot boundary.
		//If so set i to 300 and break loop
		if (initX < plot.xmin-50*minScale ||initX > plot.xmax + 50*minScale
			|| initY < plot.ymin - 50*minScale|| initY > plot.ymax + 50*minScale
			|| Math.max(Math.abs(tempX),Math.abs(tempY)) <= 0.001*step) 
		{
			break;
		}
	}
	ctx.restore();
}

//Mode selection radio button handling
//Makes selected form visible and hides the others.
//Sets plot functions to necessary functions
document.getElementById("dropRadio").addEventListener("click", function (){
	document.getElementById("dropForm").style.display = "inline";
	document.getElementById("matrixForm").style.display = "none";
	document.getElementById("manualForm").style.display = "none";
	plot.xFunc = firstX;
	plot.yFunc = firstY;
	drawPlot();
});

document.getElementById("matrixRadio").addEventListener("click", function (){
	document.getElementById("dropForm").style.display = "none";
	document.getElementById("matrixForm").style.display = "inline";
	document.getElementById("manualForm").style.display = "none";
	plot.xFunc = matrixXFunc;
	plot.yFunc = matrixYFunc;
	drawPlot();
});

document.getElementById("manualRadio").addEventListener("click", function (){
	document.getElementById("dropForm").style.display = "none";
	document.getElementById("matrixForm").style.display = "none";
	document.getElementById("manualForm").style.display = "inline";
});

//Plot vector field button handling
//Checks for xmax >= xmin, ymax >= ymin, check general validity of form entries.
//If invalid entry found displays invalid entry notification, otherwise sets
//plot boundary values, drop down selected, and plots
document.getElementById("plotButton").addEventListener("click", function (){
	if (document.getElementById("xmin").value >= document.getElementById("xmax").value ||
		document.getElementById("ymin").value >= document.getElementById("ymax").value ||
		!(document.getElementById("boundsForm").checkValidity()))
	{
		document.getElementById("invalidPar").style.display = "inline";
	} else {
		document.getElementById("invalidPar").style.display = "none";
		plot.xmin = Number(document.getElementById("xmin").value);
		plot.xmax = Number(document.getElementById("xmax").value);
		plot.ymin = Number(document.getElementById("ymin").value);
		plot.ymax = Number(document.getElementById("ymax").value);	
		//Check to see which mode is selected
		if (document.getElementById("dropRadio").checked) {
			plot.xFunc = funcs[2*document.getElementById("dropSelect").selectedIndex];
			plot.yFunc = funcs[2*document.getElementById("dropSelect").selectedIndex+1];
		} else if (document.getElementById("matrixRadio").checked) {	
			plot.xFunc = matrixXFunc;
			plot.yFunc = matrixYFunc;
		} else {}
			
		drawPlot();
	}
});

//Handle mouseclick on plot. Clears and redraws plot then
//plots trajectory with initial conditions at mouse click coordinates.
document.getElementById("plotCanvas").addEventListener("mousedown", function(event) {
	//Clear plot
	drawPlot();

	//For use in calculations
	var rect = canvas.getBoundingClientRect();

	//convert from coordinates relative to canvas to coordinates relative
	//to plot
	var inputX = plot.xmin + (event.clientX-rect.left)*(plot.xmax-plot.xmin)/800;
	var inputY = plot.ymax - (event.clientY-rect.top)*(plot.ymax-plot.ymin)/800;

	drawTrajectory(inputX, inputY);
});


//Matrix entry slider change handling.
document.getElementById("aSlider").addEventListener("change",function () {
	matrix.a = this.value;
	document.getElementById("aValue").innerHTML = matrix.a;
	drawPlot();
});

document.getElementById("bSlider").addEventListener("change",function () {
	matrix.b = this.value;
	document.getElementById("bValue").innerHTML = matrix.b;
	drawPlot();
});

document.getElementById("cSlider").addEventListener("change",function () {
	matrix.c = this.value;
	document.getElementById("cValue").innerHTML = matrix.c;
	drawPlot();
});

document.getElementById("dSlider").addEventListener("change",function () {
	matrix.d = this.value;
	document.getElementById("dValue").innerHTML = matrix.d;
	drawPlot();
});
