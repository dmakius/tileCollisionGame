var canvas , ctx;
	var ballX = 275, ballY = 270;
	var ballSpeedX = 5, ballSpeedY = 7;

	const PADDLE_WIDTH = 100;
	const PADDLE_THICKNESS = 10;
	const PADDLE_DIST_FROM_EDGE = 60;

	const BRICK_W = 100;
	const BRICK_H = 50;
	const BRICK_GAP = 3;
	
	const BRICK_COLOMS = 8;
	const BRICK_ROWS = 5;
	
	var brickGrid =  new Array(BRICK_COLOMS*BRICK_ROWS);

	var paddleX = 400;
	var mouseX = 500;
	var mouseY= 400;

	function updateMousePos(evt){
		var rect = canvas.getBoundingClientRect();
		var root = document.documentElement;
		
		mouseX = evt.clientX - rect.left - root.scrollLeft;
		mouseY = evt.clientY - rect.top - root.scrollTop;
		//alert(mouseY);
		paddleX = mouseX - PADDLE_WIDTH/2;
	}

	window.onload= function(){
		canvas = document.getElementById("gamecanvas");
 		ctx = canvas.getContext('2d');

 		var framesPerSecond = 30;
 		brickReset();

 		setInterval(updateAll, 1000/framesPerSecond);
 		
 		canvas.addEventListener('mousemove', updateMousePos);
 	}

 	function updateAll(){
 		moveAll();
 		drawAll();
 	}
 	function reset(){
 		ballX = canvas.width/2;
 		ballY = canvas.height/2;
 	}

 	function moveAll(){
 		 ballX += ballSpeedX;
 		 ballY += ballSpeedY;
 		
 		if(ballX < 0){ballSpeedX *= -1}
 		if(ballX > canvas.width){ballSpeedX *= -1}
 		if(ballY < 0){ballSpeedY *= -1}
 		if(ballY > canvas.height){reset();}

 		var ballBrickCol = Math.floor(ballX/BRICK_W);
 		var ballBrickRow = Math.floor(ballY/BRICK_H);
 		var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);
		
		// colorText(mouseBrickX + " , " + mouseBrickY +":" +brickIndexUnderMouse, mouseX,mouseY, 'yellow');
		if(brickGrid[brickIndexUnderBall]){
			if(ballBrickCol >= 0 && ballBrickCol < BRICK_COLOMS &&
				ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS){
				
				brickGrid[brickIndexUnderBall] = false;
				ballSpeedY *= -1;
			}
		}
		
 		var paddleTopEdgeY = canvas.height - PADDLE_DIST_FROM_EDGE;
 		var paddleBottomEdgeY = paddleTopEdgeY - PADDLE_THICKNESS;
 		var paddleLeftEdgeX = paddleX;
 		var paddleRightEdgeX = paddleLeftEdgeX+ PADDLE_WIDTH;

 		if(	ballY < paddleTopEdgeY && 
 			ballY > paddleBottomEdgeY &&
 			ballX > paddleLeftEdgeX &&
 			ballX < paddleRightEdgeX){
 			
 			ballSpeedY *= -1;

 			var centerOfPaddleX = paddleX + PADDLE_WIDTH/2;
 			var BallDistFromPaddleCenterX = ballX - centerOfPaddleX;
 			ballSpeedX = BallDistFromPaddleCenterX * 0.35;
 		}

 	}
 	function drawAll(){
 		colorRect(0,0,canvas.width, canvas.height, 'black');
 		colorCircle(ballX,ballY,10, 'red');
 		colorRect(paddleX, canvas.height - PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS,"white");
 		
 		drawBricks();
	}
 	//helper Functions
 	function rowColToArrayIndex(col,row){
 		return col + BRICK_COLOMS * row;
 	}

 	function drawBricks(){
 		for(var eachRow = 0; eachRow < BRICK_ROWS; eachRow++){
 			for(var eachCol = 0; eachCol < BRICK_COLOMS; eachCol++){
 				var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
				console.log(arrayIndex);
 				
 				if(brickGrid[arrayIndex]){
 					colorRect(BRICK_W*eachCol,BRICK_H*eachRow, BRICK_W - BRICK_GAP,BRICK_H - BRICK_GAP, "blue");
 				}
 			}
			
 		}

	 	// for(var eachCol = 0 ; eachCol < BRICK_ROWS; eachCol++){
	 	// 	for(var eachRow = 0; eachRow < BRICK_COLOMS; eachRow ++){
	 	// 		var arrayIndex = rowColToArrayIndex(eachCol,eachRow);
	 			
	 	// 		if(brickGrid[arrayIndex]){
	 	// 			colorRect(BRICK_W*eachRow, BRICK_H*eachCol, BRICK_W - BRICK_GAP,BRICK_H - BRICK_GAP, "blue");
	 	// 		}	
	 	// 	}
	 	// }
	 }
 	function brickReset(){
 		for(var i = 0; i < BRICK_COLOMS * BRICK_ROWS; i++){
 			brickGrid[i] = true;
 		}
 	}
 	function colorRect(topLeftX,topLeftY, boxWidth,boxHeight, fillColor){
 		ctx.fillStyle = fillColor;
 		ctx.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
 	}
 	function colorCircle(centerX,centerY, radius, fillColor){
 		ctx.fillStyle = fillColor;
 		ctx.beginPath();
 		ctx.arc(centerX,centerY,radius,0, Math.PI*2, true);
 		ctx.fill();
 	}
 	function colorText(showWords, textX,textY, fillColor){
 		ctx.fillStyle = fillColor;
 		ctx.fillText(showWords, textX,textY);
 	}