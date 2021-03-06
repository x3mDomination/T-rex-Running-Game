var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var gameState,PLAY,END;
var score;
var gameOverImage,gameOver,restartButton,restart;

var jumpSound,dieSound,checkpointSound;

localStorage["high score"] = 0;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImage = loadImage("gameOver.png");
  restartButton = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkpointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  PLAY = 1;
  END = 0;
  gameState = PLAY;
  
  gameOver = createSprite(300,75,10,10);
  gameOver.addImage("text",gameOverImage);
  gameOver.scale = 0.5;
  gameOver.visible=false;
  
  restart = createSprite(300,150,10,10);
  restart.addImage("button",restartButton);
  restart.scale = 0.5;
  restart.visible=false;
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collide",trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  background(180);
  
  text("Score: "+ score, 500,50);
  text("HI: " + localStorage["high score"],500,75);
  
  if(gameState === PLAY) {
    score = score + Math.round(getFrameRate()/60);
    
    //console.log(trex.y);
    
    ground.velocityX = -(4 + score/100);
    
    if(keyDown("space")&&trex.y>161) {
      trex.velocityY = -10;
      jumpSound.play();
    }

    trex.velocityY = trex.velocityY + 0.8
    
    if(score % 100 === 0&&score>1) {
      checkpointSound.play();
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    spawnClouds();
    spawnObstacles();
    
    if(trex.isTouching(obstaclesGroup)) {
      gameState=END;
      dieSound.play();
    }
  }
  
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    obstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    cloudsGroup.setVelocityXEach(0);
    
    trex.velocityY = 0;
    trex.changeAnimation("collide",trex_collided);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  trex.collide(invisibleGround);
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
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
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -(4 + score*3/100);
    
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
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset() {
   gameState = PLAY;
   gameOver.visible=false;
   restart.visible=false;
  
   trex.changeAnimation("running",trex_running);
  
   obstaclesGroup.destroyEach();
   cloudsGroup.destroyEach();
  
  if(localStorage["high score"]<score) {
    localStorage["high score"] = score;
  }
  
  score = 0;
}
