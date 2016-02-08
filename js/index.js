/*
* Js for Rainbow Snake
*
* By semsevens
*
* Just for fun
*
*/


// Basic parameter
var flag = 0;
var speed = 3;
var foodR = 5;
var snakeR = 50;
var drawWidth = document.documentElement.clientWidth;
var drawHeight = document.documentElement.clientHeight;
var snakeWidth = 2*foodR;
var addLength = Math.PI/6;

// Font information
var TitleHeight = 80;
var LineHeight = 40;
var LineSpacing = 4;

// Flag the timeout in oder to kill it
var timeoutID

// Just for loop
var i;
var j;

// Key value
var LEFT = 37;
var RIGHT = 39;
var ENTER = 13;

// Head position
var headX;
var headY;

// Store position data
var arrX = new Array(10000);
var arrY = new Array(10000);

// Store circle's angle
var arrS = new Array(10000);
var arrE = new Array(10000);

// Store direction data
// '0' => clockwise, '1' => anticlockwise
var arrD = new Array(10000);


/*
* Do it after pages loaded
*/

var $$ = function(func){
    var oldOnload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function(){
            oldOnload();
            func();
        }
    }
}


// Main
$$(function(){
    document.getElementById("box").width = drawWidth;
    document.getElementById("box").height = drawHeight;
    PreStart();
});


/*
* Draw some useful tips before start the game
*/

function PreStart(){
    c = document.getElementById("box");
    ctx = c.getContext("2d");
    ctx.font = TitleHeight+"px Verdana";
    gradient = ctx.createLinearGradient(0,0,drawWidth,0);
    gradient.addColorStop("0","magenta");
    gradient.addColorStop("0.5","blue");
    gradient.addColorStop("1.0","red");
    ctx.strokeStyle = gradient;
    ctx.fillStyle = gradient;
    ctx.textAlign = "center";

    // Draw title
    ctx.textBaseline = "bottom";
    ctx.fillText("WELCOME",drawWidth/2,drawHeight/2-TitleHeight-4*LineSpacing);
    ctx.fillText("Rainbow Snake",drawWidth/2,drawHeight/2-2*LineSpacing);

    // Draw context
    ctx.font = LineHeight+"px Verdana";
    ctx.textBaseline = "top";
    ctx.strokeText("Don't eat yourself",drawWidth/2,drawHeight/2);
    ctx.strokeText("Don't touch the borders",drawWidth/2,drawHeight/2+LineHeight+LineSpacing);
    ctx.strokeText("Press [<-] or [->] to control the snake",drawWidth/2,drawHeight/2+2*(LineHeight+LineSpacing));
    ctx.strokeText("Press [Enter] to start the interesting game",drawWidth/2,drawHeight/2+3*(LineHeight+LineSpacing));

}


/*
* Just restart the game
*/

function Restart(){

    // Kill the previous timeout(very important!!!)
    clearTimeout(timeoutID);

    Initialize();
    Draw();
}


/*
* Initialize data
*/

function Initialize(){

    // Temp data
    flag = 1;
    count = 1
    tail = 0;
    head = 0;
    next = head +1;

    // Fist circle data
    arrS[0] = 0;
    arrE[0] = addLength;
    arrD[0] = 0;

    // Food position
    foodX = Math.round(Math.random()*(drawWidth-2*foodR)+foodR);
    foodY = Math.round(Math.random()*(drawHeight-2*foodR)+foodR);

    // First head position
    arrX[0] = Math.round(Math.random()*(drawWidth-4*snakeR)+2*snakeR);
    arrY[0] = Math.round(Math.random()*(drawHeight-4*snakeR)+2*snakeR);

}


/*
* Draw snake and food
*/

function Draw()
{

    // Clear canvas
    ctx.clearRect(0,0,drawWidth,drawHeight);

    // Draw the food
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#ff0000";
    ctx.fillStyle = "#ff0000";
    ctx.arc(foodX,foodY,foodR,0,2*Math.PI);
    ctx.fill();
    ctx.stroke();


    /* Draw the snake */
    
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#00ff00";
    grd=ctx.createRadialGradient(foodX,foodY,30,foodX,foodY,drawWidth/2);
    grd.addColorStop(0,"red");
    grd.addColorStop("0.3","yellow");
    grd.addColorStop("0.5","green");
    grd.addColorStop("0.6","blue");
    grd.addColorStop("0.8","magenta");
    grd.addColorStop(1,"black");
    ctx.fillStyle = grd;
    
    // Draw the snake's outter shell
    for (i = tail; i<count; i++) {
        if (arrD[i] == 0) {
            ctx.arc(arrX[i],arrY[i],snakeR,arrS[i],arrE[i]);
        } else {
            ctx.arc(arrX[i],arrY[i],snakeR,arrS[i],arrE[i],true);
        }
    }
    
    // Draw the snake's inner shell
    for (j = count - 1; j >= tail; j--) {
        if (arrD[j] == 0) {
            ctx.arc(arrX[j],arrY[j],snakeR-snakeWidth,arrE[j],arrS[j],true);
        } else {
            ctx.arc(arrX[j],arrY[j],snakeR-snakeWidth,arrE[j],arrS[j]);
        }
        
    }
    
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Let the snake run
    if (arrD[tail] == 0) {
        arrS[tail] += Math.PI/(180/speed);
    } else {
        arrS[tail] -= Math.PI/(180/speed);
    }
    if (arrD[head] == 0) {
        arrE[head] += Math.PI/(180/speed);
    } else {
        arrE[head] -= Math.PI/(180/speed);
    }

    // Calculate the head and head's head position
    headX = Math.round(arrX[head]+Math.cos(arrE[head])*snakeR);
    headY = Math.round(arrY[head]+Math.sin(arrE[head])*snakeR);
    headXIn = arrX[head]+Math.cos(arrE[head]+Math.PI/180)*(snakeR-snakeWidth/2);
    headYIn = arrY[head]+Math.sin(arrE[head]+Math.PI/180)*(snakeR-snakeWidth/2);

    // Judge something
    Judge();

}


/*
* Judge section
*/

function Judge(){
    
    // Judge if the snake eat itself
    if (ctx.isPointInPath(headXIn,headYIn)) {
        flag = 0;
	};
    
    // Judge if the snake go out
    if (headX > drawWidth || headX < 0 || headY > drawHeight || headY < 0) {
        flag = 0;
    }
    
    // Judge if the snake eat the food
    if (((headXIn - foodX)*(headXIn - foodX) + (headYIn - foodY)*(headYIn - foodY)) <= (2*foodR*2*foodR)) {
        if (arrD[head] == 0) {
            arrE[head] += addLength;
        } else {
            arrE[head] -= addLength;
        }
        foodX = Math.round(Math.random()*(drawWidth-2*foodR)+foodR);
        foodY = Math.round(Math.random()*(drawHeight-2*foodR)+foodR);
    }
    
    // Judge if the tail circle run over
    if (arrD[tail] == 0) {
        if (arrS[tail] >= arrE[tail]) {
            arrS[tail] = arrE[tail];
            tail++;
        }
    } else {
        if (arrS[tail] <= arrE[tail]){
            arrS[tail] = arrE[tail];
            tail++;
        }
    }

    // Judge if it's time to game over
    if (flag == 1) {
        timeoutID = setTimeout("Draw()",10);
    } else {
        GameOver();
    }
    
}


/*
* Draw some text after game over
*/

function GameOver(){
    ctx.font = TitleHeight+"px Verdana";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.strokeStyle = gradient;
    ctx.strokeText(">.<",drawWidth/2,drawHeight/2);
    ctx.strokeText("Oh~no!",drawWidth/2,drawHeight/2-TitleHeight-2*LineSpacing);
    ctx.strokeText("Press [Enter] to restart",drawWidth/2,drawHeight/2+TitleHeight+2*LineSpacing);
    ctx.fillStyle = "gray";
    ctx.textAlign = "right";
    ctx.fillText("GAME    ",drawWidth/2,drawHeight/2);
    ctx.textAlign = "left";
    ctx.fillText("    OVER",drawWidth/2,drawHeight/2);
}


/*
* Keystroke Monitoring
*/

document.onkeyup=function(event){
	var event = event||window.event;
    if (event.keyCode == RIGHT && flag == 1) {
        arrD[next] = 0;
        arrS[next] = arrE[head]-Math.PI;
        arrE[next] = arrS[next];
        arrX[next] = arrX[head]+Math.cos(arrE[head])*2*snakeR;
        arrY[next] = arrY[head]+Math.sin(arrE[head])*2*snakeR;
        count++;
        next++;
        head++;
    } else if (event.keyCode == LEFT && flag == 1) {
        arrD[next] = 1;
        arrS[next] = arrE[head]-Math.PI;
        arrE[next] = arrS[next];
        arrX[next] = arrX[head]+Math.cos(arrE[head])*2*snakeR;
        arrY[next] = arrY[head]+Math.sin(arrE[head])*2*snakeR;
        count++;
        next++;
        head++;
    }else if (event.keyCode == ENTER && flag == 0) {
        Restart();
    }
}
