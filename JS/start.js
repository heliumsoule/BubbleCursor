
$(document).ready(function() {
	$('.oneRowContainer').on('mouseover', function(e) {
		var self = $(this);
		self.css({
			'backgroundColor': 'rgba(255, 130, 26, 1.0)'
		});
	});
	$('.oneRowContainer').on('mouseout', function(e) {
		var self = $(this);
		self.css({
			'backgroundColor': 'rgba(255, 130, 26, 0.75)'
		});
	});
	$('.oneRowContainer').on('mousedown', function(e) {
		var self = $(this);
		self.css({
			'backgroundColor': 'rgba(220, 119, 23, 1.0)'
		});
	});
	$('.oneRowContainer').on('mouseup', function(e) {
		var self = $(this);

		self.css({
			'backgroundColor': 'rgba(255, 130, 26, 1.0)'
		});

		$('.oneRowContainer').remove();
		$('.titleRowContainer').remove();
		$('.multiRowContainer').remove();
		$(document.body).css({
			'background-image': 'none',
			'background-color': 'rgba(16, 16, 16, 1.0)'
		});

		$("<div>")
			.addClass('descriptionScreen customFont titleDiv')
			.appendTo($('.container'))
			.text('There are two cursor types: bubble and pointer. There are four blocks for each type. ' + 
				  'Each block is 27 trials. Each trial is 9 selections. A break will be held every two blocks. ' +  
				  'Click on the red target at the start of each trial to begin.');
		$('.container').css({
			"flex-flow": "row nowrap"
		});

		docWidth = $(window).width();
		docHeight = $(window).height();
		centerX = docWidth / 2;
		centerY = docHeight / 2;

		currCanvas = $('.clearCanvas')[0]
		currContext = currCanvas.getContext('2d');
		currContext.globalAlpha = 0.1

		currCanvas.width = docWidth;
		currCanvas.height = docHeight;
		document.body.style.cursor = "crosshair";
		addTutorial();
		startBlock();
	});

});

var mousemoveBubble = function(e) {
	currContext.clearRect(0, 0, currCanvas.width, currCanvas.height);

	var output = calculateRadius(e.clientX, e.clientY);
	if (!output.createSeparateBubble) {
		currContext.beginPath();
		currContext.arc(e.clientX, e.clientY, output.circleRadius, 0, Math.PI * 2, true);
		currContext.fillStyle = "rgba(48, 48, 48, 1)";
		currContext.fill();
	} else {
		currContext.beginPath();
		currContext.arc(e.clientX, e.clientY, output.circleRadius, 0, Math.PI * 2, true);
		currContext.fillStyle = "rgba(48, 48, 48, 1)";
		currContext.fill();

		currContext.arc(output.offsetLeft + currRadius, output.offsetTop + currRadius, output.sepCircleRadius, 0, Math.PI * 2, true);
		currContext.fillStyle = "rgba(48, 48, 48, 1)";
		currContext.fill();
	}
	mouse_moved = true;

}

var clickBubble = function(e) {
	var currElement = currCircles[currSelected];
	if (currElement.classList.contains('correct') && mouse_moved) {
		nextItemHandler();
	} else if (currElement.classList.contains('start')) {
		startTimeHandler();
	} else {
		incorrectHandler();
	}
	mouse_moved = false;
}




