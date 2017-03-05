//Mode selection radio button handling
//Makes selected form visible and hides the others
document.getElementById("dropRadio").addEventListener("click", function (){
	document.getElementById("dropForm").style.display = "inline";
	document.getElementById("matrixForm").style.display = "none";
	document.getElementById("manualForm").style.display = "none";
});

document.getElementById("matrixRadio").addEventListener("click", function (){
	document.getElementById("dropForm").style.display = "none";
	document.getElementById("matrixForm").style.display = "inline";
	document.getElementById("manualForm").style.display = "none";
});

document.getElementById("manualRadio").addEventListener("click", function (){
	document.getElementById("dropForm").style.display = "none";
	document.getElementById("matrixForm").style.display = "none";
	document.getElementById("manualForm").style.display = "inline";
});

//Plot vector field button handling
//Checks for xmax >= xmin, ymax >= ymin, check general validity of form entries.
//If invalid displays invalid entry notification, otherwise plots
document.getElementById("plotButton").addEventListener("click", function (){
	if (document.getElementById("xmin").value >= document.getElementById("xmax").value ||
		document.getElementById("ymin").value >= document.getElementById("ymax").value ||
		!(document.getElementById("boundsForm").checkValidity()))
	{
		document.getElementById("invalidPar").style.display = "inline";
	} else {
		document.getElementById("invalidPar").style.display = "none";
	}
});

