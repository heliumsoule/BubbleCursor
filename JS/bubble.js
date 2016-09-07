// Initialization of experiment parameters
var docWidth;
var docHeight;

var Cursor = shuffle(["pointer", "bubble", "pointer", "bubble"]);
var A = [256 / 2.5, 512 / 2.5, 768 / 2.5];
var currA = [0, 0, 0, 1, 1, 1, 2, 2, 2];
var W = [8, 16, 32];
var Ratio = [4 / 3, 2, 3];
var Density = [0, 2, 4];
var Order = [];
var Slices = 18 ; // 360 / 18 = 20 degrees

var Block = 0;
var Trial = 0;
var Target = 0;
var currCircles = [];
var epsilon = 20;

var currCanvas;
var currContext;
var currRadius;

var currIncorrectCount = 0;
var centerX = docWidth / 2;
var centerY = docHeight / 2;
var previousX = docWidth / 2;
var previousY = docHeight / 2;
var distance = 0;

var cursorType = "";

// Randomize function from Stackoverflow 
// http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function startBlock() {
	Block = Block + 1;
	Trial = 0;
	Target = 0;
	cursorType = Cursor.pop();
	if (Block < 5) {
		currContext.clearRect(0, 0, currCanvas.width, currCanvas.height);
		Order = []
		for (var i = 0; i < W.length; i++) {
			for (var j = 0; j < Ratio.length; j++) {
				for (var k = 0; k < Density.length; k++) {
					var indices = {
						wIndex: i,
						rIndex: j,
						dIndex: k
					};
					Order.push(indices);
				}
			}
		}
		shuffle(Order);

		startTrial();
	} else {
		console.log("Finished");
	}
	$(document.body).off('click');
	$(document.body).off('mousemove');
	if (cursorType == "bubble") {
		$(document.body).on('click', function(e) {
			clickBubble(e);
		});
		$(document.body).on('mousemove', function(e) {
			mousemoveBubble(e);
		});
	}
}

function addTutorial() {
	var indices = {
		wIndex: parseInt(W.length * Math.random()),
		rIndex: parseInt(Ratio.length * Math.random()),
		dIndex: parseInt(Density.length * Math.random())
	};
	Order.splice(0, 0, indices);
}

function startTrial() {
	Trial = Trial + 1;
	Target = 0;
	currIncorrectCount = 0;
	centerX = docWidth / 2;
	centerY = docHeight / 2;
	previousX = docWidth / 2;
	previousY = docHeight / 2;

	currA = [0, 0, 0, 1, 1, 1, 2, 2, 2];
	shuffle(currA);

	if (Trial < 28) {
		startTarget();
	} else {
		startBlock();
	}
}

function startTarget() {
	Target = Target + 1;
	var currIndices = Order[Trial - 1];
	var dIndex = currIndices.dIndex;
	var wIndex = currIndices.wIndex;
	var rIndex = currIndices.rIndex;

	$('.circleBase').remove();
	if (Target == 1) {
		var centerX = (docWidth - W[wIndex]) / 2;
		var centerY = (docHeight - W[wIndex]) / 2;
		currRadius = W[wIndex] / 2;

		initializeCircle(1, W[wIndex], W[wIndex], centerX, centerY);
		currCircles = $('.circleBase');	
		currSelected = 0;
		prevSelected = 0;
	} else if (Target < 10) {

		setupTargetObject(wIndex, dIndex, rIndex);
		currCircles = $('.circleBase');
	} else {

		startTrial();
	}

}

function setupTargetObject(wIndex, dIndex, rIndex) {
	var randAngle = chooseAngle();
	var perpenAngle = randAngle + Math.PI / 2;
	distance = A[currA.pop()];

	var cornerCircles = [[1, 1], [-1, -1]];
	var effectiveWidth = Ratio[rIndex] * W[wIndex];

	var actualX = centerX - W[wIndex] / 2 + Math.cos(randAngle) * distance;
	var actualY = centerY - W[wIndex] / 2 + Math.sin(randAngle) * distance;

	previousX = centerX;
	previousY = centerY;
	centerX = actualX;
	centerY = actualY;

	for (var i = 0; i < cornerCircles.length; i++) {
		var scale = cornerCircles[i];
			initializeCircle(0, W[wIndex], W[wIndex], 
							 actualX + scale[0] * Math.cos(randAngle) * (W[wIndex] / 2 + effectiveWidth),
							 actualY + scale[1] * Math.sin(randAngle) * (W[wIndex] / 2 + effectiveWidth));
			initializeCircle(0, W[wIndex], W[wIndex], 
				 actualX + scale[0] * Math.cos(perpenAngle) * (W[wIndex] / 2 + effectiveWidth),
				 actualY + scale[1] * Math.sin(perpenAngle) * (W[wIndex] / 2 + effectiveWidth));
	}

	initializeCircle(2, W[wIndex], W[wIndex], actualX, actualY);

	setupDistractors(wIndex, dIndex, effectiveWidth, randAngle);
}

function setupDistractors(wIndex, dIndex, effectiveWidth, randAngle) {
	var startRadians = randAngle - Math.PI * 2 / (2 * Slices);
	
	for (var i = 0; i < Slices; i++) {
		for (var circleIndex = 0; circleIndex < Density[dIndex]; circleIndex++) {
			var output = findCoordinate(startRadians, i, effectiveWidth, wIndex);

			initializeCircle(0, W[wIndex], W[wIndex], output.x, output.y);
		}
	}
}

function findCoordinate(startRadians, i, effectiveWidth, wIndex) {
	var collisions = true;
	var circles = $('.circleBase');
	var currentX = 0;
	var currentY = 0;

	while (collisions) {
		collisions = false;
		var randRadians = startRadians + (i - 0.5) * Math.PI * 2 / Slices + Math.random() * Math.PI * 2 / Slices;
		var currDistance = docWidth / 2;

		currDistance = Math.max(currDistance * Math.random(), W[wIndex]);

		currentX = previousX + Math.cos(randRadians) * currDistance;
		currentY = previousY + Math.sin(randRadians) * currDistance;

		for (var i = 0; i < circles.length; i++) {
			var offsets = circles[i].getBoundingClientRect();

			if ((currentX > offsets.left - currRadius * 5 && currentX < offsets.left + currRadius * 4 &&
				currentY > offsets.top  - currRadius * 5 && currentY < offsets.top + currRadius * 4) ||
				(currentX > centerX - effectiveWidth * 1.5 && currentX < centerX + effectiveWidth * 1.5 && 
				currentY > centerY - effectiveWidth * 1.5 && currentY < centerY + effectiveWidth * 1.5)) {
				collisions = true;
				break;
			}
		}
	}
	return {
		x: currentX,
		y: currentY
	};
}





