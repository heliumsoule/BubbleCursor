var startTime = 0;
var endTime = 0;
var currSelected = 0;
var prevSelected = 0;
var mouse_moved = false;

// Returns (boolean, radius, otherX, otherY)
// boolean is true if a separate bubble should be created off the main bubble cursor.
function calculateRadius(currX, currY) {
	var IntDi = [];
	var ConDi = [];

	var lowest = {
		index: 0,
		distance: docWidth,
		offsetLeft: 0,
		offsetTop: 0
	};
	var secondLowest = {
		index: 0,
		distance: docWidth,
		offsetLeft: 0,
		offsetTop: 0
	};

	for (var i = 0; i < currCircles.length; i++) {
		var currTarget = currCircles[i]
		var offsets = currTarget.getBoundingClientRect();

		var centerDistance = Math.sqrt((currX - (offsets.left + currRadius)) * (currX - (offsets.left + currRadius)) +
							 		   (currY - (offsets.top + currRadius)) * (currY - (offsets.top + currRadius)));
		var minDistance = centerDistance - currRadius > 0 ? centerDistance - currRadius : currRadius;
		var maxDistance = centerDistance + currRadius;

		IntDi.push(minDistance);
		ConDi.push(maxDistance);

		if (minDistance < lowest.distance) {
			secondLowest.index = lowest.index;
			secondLowest.distance = lowest.distance;
			secondLowest.offsetLeft = lowest.offsetLeft;
			secondLowest.offsetTop = lowest.offsetTop;

			lowest.distance = minDistance;
			lowest.index = i;
			lowest.offsetLeft = offsets.left;
			lowest.offsetTop = offsets.top;
		} else if (minDistance < secondLowest.distance) {
			secondLowest.distance = minDistance;
			secondLowest.index = i;
			secondLowest.offsetLeft = offsets.left;
			secondLowest.offsetTop = offsets.top;
		}
	}

	var shortestConDi = ConDi[lowest.index];
	currSelected = lowest.index;

	currCircles[prevSelected].style.backgroundColor = currCircles[prevSelected].classList.contains('correct') ? "green" : "#5f5f5f";
	currCircles[currSelected].style.backgroundColor = "red";

	prevSelected = currSelected;

	if (shortestConDi + epsilon > secondLowest.distance && 
		currCircles.length != 1) {
		return {
			createSeparateBubble: true,
			circleRadius: secondLowest.distance * 0.9,
			sepCircleRadius: Math.max((currRadius + lowest.distance - secondLowest.distance * 0.8) * 1.02, currRadius * 3),
			offsetLeft: lowest.offsetLeft,
			offsetTop: lowest.offsetTop
		};
	} else {
		return {
			createSeparateBubble: false,
			circleRadius: shortestConDi,
			offsetLeft: lowest.offsetLeft,
			offsetTop: lowest.offsetTop
		};
	}

}

var nextItemHandler = function() {
	endTime = new Date().getTime();
	var timeTrial = endTime - startTime;
	
	console.log("On Block " + Block + " of cursor type " + cursorType + " and Trial " + Trial + " with selection " + Target + 
				" with A " + distance + " and W " + W[Order[Trial - 1].wIndex] + " R " + Ratio[Order[Trial - 1].rIndex] + 
				" D " + Density[Order[Trial - 1].dIndex] + " Time is " + timeTrial + " milliseconds with " +
				currIncorrectCount + " errors ");		
	

	startTime = endTime;
	currIncorrectCount = 0;
	startTarget();

	var textToSet = "On Block " + Block + " of cursor type " + cursorType + " and Trial " + Trial + " with Target " + Target;
				
	$('.titleDiv').text(textToSet);
}

var incorrectHandler = function() {
	currIncorrectCount = currIncorrectCount + 1;
	// if (Trial > 1) {
		$('.titleDiv').text("Clicking on an incorrect grey circle does nothing");
	// }
}

var startTimeHandler = function() {
	startTime = new Date().getTime();

	startTarget();

	var textToSet = "On Block " + Block + " of cursor type " + cursorType + " and Trial " + Trial + " with Target " + Target;

	$('.titleDiv').text(textToSet);
}

// circleType: 0 - distractor, 1 - start, 2 - target
function initializeCircle(circleType, width, height, left, top) {
	var backgroundColor;
	var callHandler;

	switch (circleType) {
		case 0:
			backgroundColor = "rgba(95, 95, 95, 1.0)";
			callHandler = incorrectHandler;
			classes = "circleBase";
			break;
		case 1:
			backgroundColor = "red";
			callHandler = startTimeHandler;
			classes = "circleBase start";
			break;
		case 2: 
			backgroundColor = "green";
			callHandler = nextItemHandler;
			classes = "circleBase correct";
			break;
	}
	$("<div>")
		.addClass(classes)
		.css({
			"position": "absolute",
			"width": width + "px",
			"height": height + "px",
			"left": left + "px",
			"top": top + "px",
			"zIndex": 5,
			"backgroundColor": backgroundColor
		})
		.appendTo(document.body)
		.on('click', function(e) {
			if (cursorType == "pointer") {
				callHandler();
			}
		});

}

function chooseAngle() {
	if (centerX <= docWidth / 2 && centerY <= docHeight / 2) {
		return Math.PI / 2 * (0.55 + Math.random() * 0.45);
	} else if (centerX > docWidth / 2 && centerY > docHeight / 2) {
		return Math.PI / 2 * (2 + 0.55 + Math.random() * 0.45);
	} else if (centerX > docWidth / 2 && centerY < docHeight / 2) {
		return Math.PI / 2 * (1 + 0.55 + Math.random() * 0.45);
	} else {
		return Math.PI / 2 * (3 + 0.55 + Math.random() * 0.45);
	}
}












