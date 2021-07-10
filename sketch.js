var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var highscore=0;

var gameOver, restart;

//localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  trex = createSprite(50,180,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(windowWidth/2,windowHeight/6+10,windowWidth,20);
  ground.addImage("ground",groundImage);
  ground.x = windowWidth/2+300;
  ground.velocityX = -(8 + 3*score/100);
  
  gameOver = createSprite(windowWidth/2,windowHeight/18);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(windowWidth/2,windowHeight/10);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.7;
  restart.scale = 0.7;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,700,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  
  highscore=localStorage.getItem("HighestScore")
  
  if (localStorage.getItem("HighestScore") === null) 
  {
    highscore=0;
    localStorage.setItem("HighestScore", 0)
  }
    
}

function draw() {
  //trex.debug = true;
  background("lightblue");
  textSize(14)
  text("Score: "+ score,trex.x,trex.y-80);
  text("Highscore:"+ highscore,trex.x,trex.y-100);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = (8 + 3*score/100);
    trex.velocityX = (8 + 3*score/100);
    
    invisibleGround.x = ground.x
    ground.x = trex.x + 200
    camera.x = trex.x
    camera.y = trex.y
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    // if (ground.x <720){
    //   ground.x = ground.width/2;
    // }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    gameOver.x = trex.x
    restart.x = trex.x
    gameOver.y = trex.y-180
    restart.y = trex.y-140
    camera.position.x = gameOver.x;
    camera.position.y = gameOver.y;
    
    if (score > highscore)
    {
      localStorage["HighestScore"] = score;
      highscore = score;
    }
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    invisibleGround.velocityX = 0;
    trex.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 120 === 0) {
    var cloud = createSprite(trex.x+1000,100,40,10);
    cloud.y = Math.round(random(windowHeight/30,windowHeight/15));
    cloud.addImage(cloudImage);
    cloud.scale = 1.3;
    // cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 100 === 0) {
    var obstacle = createSprite(trex.x+1000,windowHeight/6,10,40);
    //obstacle.debug = true;
    // obstacle.velocityX = -(8 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.6;
    obstacle.lifetime = 400;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
   
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}
