var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


var dx = 2;
var numOfPars = 3;
var pars = [];
var _counter = 0;

//images sources
var planeSrc = 'resources/plane.png';
var boatSrc = 'resources/boat.png';
var parSrc = 'resources/parachutist.png';

var GameNode = function(x, y, imgSrc, name, radius, speed){
    this.imgSrc = imgSrc;
    this.x = x;
    this.y = y;
    this.name = name;
    this.radius = radius;
    this.speed =speed;
};

//for each object creats the abiity to draw it on canvas
GameNode.prototype.draw = function(){
    var image = new Image();
    image.src = this.imgSrc;
    ctx.drawImage(image, this.x, this.y , 100, 60);
};

var plane = new GameNode(canvas.width, canvas.height-300, planeSrc, 'plane', 25);
var boat = new GameNode(canvas.width/2, canvas.height-80, boatSrc, 'boat', 10);
var par = new GameNode(plane.x - 40, plane.y, parSrc, 'parachutist', 5);

var score = 0;
var lives = 3;

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, 8, 40);
}

function drawSea(){
    ctx.fillStyle="#0077BE";
    ctx.fillRect(0,canvas.height-30,canvas.width,canvas.height - 30);
}

function drawPars(){
    
    for (var i = 0; i < 1; i++) {
        if(pars[i] == null){
            break;
        } else {
            var image= new Image();
            image.src = pars[i].imgSrc;

            //make the parachutist to dissapear if it touches the boat
            if (pars[i].y < canvas.height - 70){
            ctx.drawImage(image, pars[i].x, pars[i].y, 30,50);
            } 

            pars[i].y += pars[i].speed;
              if (pars[i].y > canvas.height) {  
                //making the parachutist to fall :)
                pars[i].y = -25 
                 
                if (pars[i].y < canvas.height){
                    //checking collision between boat and parachutist
                    collisionDetection(pars[i], boat);
                    pars[i].y = plane.y;
                    pars[i].x = plane.x;
                   
                }
                //Make it appear randomly along the width  
                pars[i].x+= 20;      
        }
        }
    }
}

function collisionDetection(par, boat){
 
    //checks if the parachutist hits the boat 
        if(par.x > boat.x && par.x < boat.x + 100){
            //scores increase in 10 when parachutist touches the boat
           score+= 10;

    } else {
        //the parachutist got to the ocean and lost live
        lives--;
        
        if (lives == 0){
            alert('Game Over!');
            document.location.reload();
        }
    }
}

function startDropingPars(){
    
    //set random speed for each parachutist
    var randomSpeed = 0.2 + Math.random() * 0.5;
    
    //setting the time
    var time = Date.now();

    var spawnRate = 1500;
    // set how fast the objects will fall
    var spawnRateOfDescent = 0.50;
    // when was the last object fall
    var lastSpawn = -1;
    // save the starting time 
    var startTime = Date.now();
    if (time > (lastSpawn + spawnRate)) {
        lastSpawn = time;
        //creats no more than 10 parachutists

        if (pars.length < 10){
        var newPar = new GameNode(plane.x, plane.y, parSrc, 'parachutist', 5,randomSpeed); 
           pars.push(newPar);
    }     
    }
}


function draw(){

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //draw constant parts on canvas
    drawSea();
    drawScore();
    drawLives();
    //draw an object
    plane.draw();
    boat.draw();


    //making the plane to move left all the time and from time to time to drop par
     if (plane.x + dx > canvas.width-plane.radius || plane.x + dx < plane.radius) {
        //plane insert the screen from the other side
        plane.x = canvas.width-plane.radius;
        dx = -dx;
    }

    //plane moves left 
     plane.x += dx;

      //drop parachutist from time to time
      if (_counter % 100 === 0) {
        startDropingPars();     
      }
        _counter++;
   
    requestAnimationFrame(draw);
    requestAnimationFrame(drawPars);
}

//responsible for the user to control with the mouse!
document.addEventListener('mousemove', mouseMoveHandler, true);

    function mouseMoveHandler(e) {
        var relativeX = e.clientX - canvas.offsetLeft;
        var boatWidthAxis = canvas.width/2
        if (relativeX > 0 && relativeX < e.clientX) {
            boat.radius = relativeX - boat.radius/2;
            boat.x = relativeX - boat.x/2;
    } }


draw();