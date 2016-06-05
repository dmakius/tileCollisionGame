	var canvas , ctx;
	var ballX = 275, ballY = 270;
	var ballSpeedX = 5, ballSpeedY = 7;
	var lives = 3;


	const PADDLE_WIDTH = 100;
	const PADDLE_THICKNESS = 10;
	const PADDLE_DIST_FROM_EDGE = 60;

	const BRICK_W = 80;
	const BRICK_H = 20;
	const BRICK_GAP = 3;
	
	const BRICK_COLOMS = 10;
	const BRICK_ROWS = 15;
	
	var brickGrid =  new Array(BRICK_COLOMS*BRICK_ROWS);
	var bricksLeft = 0;

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

		//cheat to move ball anywhere
		// ballX = mouseX;
		// ballY = mouseY;
		// ballSpeadX = 4;
		// BallSpeadY = -4;
	}

	window.onload= function(){
		canvas = document.getElementById("gamecanvas");
 		ctx = canvas.getContext('2d');

 		var framesPerSecond = 30;
 		brickReset();
 		reset();
 		setInterval(updateAll, 1000/framesPerSecond);
 		
 		canvas.addEventListener('mousemove', updateMousePos);
 	}

 	function updateAll(){
 		moveAll();
 		drawAll();
 	}
 	function reset(){
 		ballX = 300;
 		ballY = 300;
 		// ballX = canvas.width/2;
 		// ballY = canvas.height/2;
 	}
 	function ballMove(){
 		ballX += ballSpeedX;
 		ballY += ballSpeedY;
 		
 		if(ballX < 0 && ballSpeedX < 0.0){ballSpeedX *= -1}
 		if(ballX > canvas.width && ballSpeedX > 0.0){ballSpeedX *= -1}
 		if(ballY < 0 && ballSpeedY < 0.0){ballSpeedY *= -1}
 		if(ballY > canvas.height){
 			lives --;
 			reset();
 			if(lives == 0){brickReset();}
 		}
 	}
 	function ballBrickHandling(){
 		var ballBrickCol = Math.floor(ballX/BRICK_W);
 		var ballBrickRow = Math.floor(ballY/BRICK_H);
 		var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);
		
		// colorText(mouseBrickX + " , " + mouseBrickY +":" +brickIndexUnderMouse, mouseX,mouseY, 'yellow');
		var bothTestsFaild = true;

		//the ball 'TOUCHES' a Brick Coordiante
		if(brickGrid[brickIndexUnderBall]){
			if(ballBrickCol >= 0 && ballBrickCol < BRICK_COLOMS &&
				ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS){
				
				//calculates the Brick's previous frame
				var prevBallX = ballX - ballSpeedX;
				var prevBallY = ballY - ballSpeedY;
				var prevBrickCol = Math.floor(prevBallX/BRICK_W);
				var prevBrickRow = Math.floor(prevBallY/BRICK_H);
				
				//the ball moved horizontally
				if(prevBrickCol != ballBrickCol){
					//get the index for the brick to the left/right of the ball
					var adjBrickSide = rowColToArrayIndex(prevBrickCol,ballBrickRow); 
					if(brickGrid[adjBrickSide] == false){
						ballSpeedX *= -1;
						bothTestsFaild = false;
					}	
				}
				//the ball moved vertically
				if(prevBrickRow != ballBrickRow){
					//get the index for the brick above/below the ball
					var adjBrickSide = rowColToArrayIndex(ballBrickCol,prevBrickRow);
					// console.log(adjBrickSide);
					if(brickGrid[adjBrickSide] == false){
						ballSpeedY *= -1;
						bothTestsFaild = false;
					}
				}
				//the 'armpit case'
				if(bothTestsFaild){
					ballSpeedY *= -1;
					ballSpeedX *= -1;
				}

				brickGrid[brickIndexUnderBall] = false; //explodes the brick
				bricksLeft--;
				// console.log(bricksLeft);
			}
		}
 	}
 	function ballPaddleHndling(){
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

 			if(bricksLeft == 0){brickReset();}
 		}
 	}

 	function moveAll(){
 		ballMove();
		ballBrickHandling();
		ballPaddleHndling();
 	}

 	function drawAll(){
 		colorRect(0,0,canvas.width, canvas.height, 'black');
 		colorCircle(ballX,ballY,10, 'red');
 		colorRect(paddleX, canvas.height - PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS,"white");
 		drawBricks();
 		colorText('Lives: ' + lives, 650, 575, 'blue');
	}
 	//helper Functions
 	function rowColToArrayIndex(col,row){
 		return col + BRICK_COLOMS * row;
 	}

 	function drawBricks(){
 		for(var eachRow = 0; eachRow < BRICK_ROWS; eachRow++){
 			for(var eachCol = 0; eachCol < BRICK_COLOMS; eachCol++){
 				var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
				//console.log(arrayIndex);
 				
 				if(brickGrid[arrayIndex]){
 					colorRect(BRICK_W*eachCol,BRICK_H*eachRow, BRICK_W - BRICK_GAP,BRICK_H - BRICK_GAP, "blue");
 				}
 			}
			
 		}
	 }
 	function brickReset(){
 		bricksLeft = 0;
 		lives = 3;
 		var i;
 		//draw gutter
 		for (i = 0; i <  3* BRICK_COLOMS; i++){brickGrid[i] = false} 
 		//draw bricks
 		for(; i < BRICK_COLOMS * BRICK_ROWS; i++){
 			brickGrid[i] = true;
 			bricksLeft++;
 		}
 		//add 'invisible row' for vertical bounce on lowest row 
 		for(; i < ( BRICK_COLOMS * BRICK_ROWS) + BRICK_COLOMS; i ++){
 			brickGrid[i] = false;
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
 		ctx.font="30px bold Arial";
 		ctx.fillText(showWords, textX,textY);
 	}