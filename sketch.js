var car,car_running,car_collided;
var track,track_image;
var fuel,fuel_image,cfuelGroup,fuelsound
var obstacle1,obstacle2,obGroup;
var score=0;
var coin=0;
var lives=3;
var PLAY=0;
var END=1;
var SERVE=2;
var Gamestate=PLAY;
var gameover,gameoverimg,gameoversound;
var restart,restartimg,restartsound;
var won,win;
var playi,playimg,playsound;
var inv_ground;
var stopper;
var stopper2;
var white;
var fuelBar_bck, fuelBar_bck_img;
var fuelBar_frnt,fuelBar_frnt_img;
var hider;
var fuelBar,fuelBar_img;

function preload(){
car_running=loadImage("car.png");
car_collided=loadImage("car.png")
track_image=loadImage("track1.jpg")
fuel_image=loadImage("fuel.png")
obstacle1=loadImage("obstacle1.png")
obstacle2=loadImage("obstacle2.png")
gameoverimg=loadImage("game_over.png")
restartimg=loadImage("restart_btn.png")
win=loadImage("you_win.jpg")
playimg=loadImage("play_btn.png")
fuelsound=loadSound("coinCollectSound.wav")
gameoversound=loadSound("gameOverSound.wav")
restartsound=loadSound("restartSound.wav")
playsound=loadSound("playSound.wav")
fuelBar_bck_img = loadImage("fuelBar_bck.png");
fuelBar_frnt_img = loadImage("fuelBar_frnt.png")
fuelBar_img = loadImage("fuel bar.png")
}

function setup() {
createCanvas(1300,220)

car=createSprite(240,height-40,20,20);
car.addImage("running",car_running);
car.addImage("collided",car_collided);
car.scale=0.3;
  
track=createSprite(250,100,600,30); 
track.addImage(track_image);
track.scale=0.5;
track.velocityY=-5;

hider = createSprite(622,110,305,250);

fuelBar = createSprite(700,50,30,25);
fuelBar.addImage(fuelBar_img)
fuelBar.scale = 0.2

stopper = createSprite(540,50,10,65);
stopper.shapeColor = "grey";

stopper2 = createSprite(1030,45,10,65)
stopper2.shapeColor = "grey"

inv_ground =  createSprite(55,158,30,30);
inv_ground.visible = false;

gameover=createSprite(225,70,20,20);
gameover.addImage(gameoverimg);
gameover.scale=0.4;
  
restart=createSprite(250,120,20,20);
restart.addImage(restartimg);
restart.scale=0.2;

won=createSprite(225,80,30,30);
won.addImage(win);
won.scale=0.5;
  
playi=createSprite(225,160,20,20);
playi.addImage(playimg);
playi.scale=0.5;

fuelBar_bck = createSprite(900,50,50,20);
fuelBar_bck.addImage(fuelBar_bck_img);
fuelBar_bck.scale = 0.8;

fuelBar_frnt = createSprite(900,48,70,20);
fuelBar_frnt.addImage(fuelBar_frnt_img);
fuelBar_frnt.scale = 0.8;
fuelBar_frnt.velocityX = -0.6;

console.log(fuelBar_frnt.x);

obGroup=new Group();
fuelGroup=new Group();
if(keyDown("UP_ARROW")||touches.length>0){
  player.y = player.y-30
}
if(keyDown("DOWN_ARROW")||touches.length>0){
 player.y = player.y+30
}

}

function draw() {
 background("gray");
 
stroke("black");
fill("green");    
textSize(20)
text("Score:"+score,550,50)
text("Lives:"+lives,200,20)
text("Fuel:"+coin,250,100)

stopper.depth = hider.depth
stopper.depth+=2

hider.debug = fuelBar_frnt.depth
hider.depth+=2
hider.debug = false

fuelBar_frnt.setCollider("rectangle",0,0,290,80)
fuelBar_frnt.debug = false

fuelBar.depth = hider.depth
fuelBar.depth+=2

  if(Gamestate===PLAY){

  score=score+Math.round(getFrameRate()/60);
    if(keyIsDown(RIGHT_ARROW)){
      car.x+=3
    }
    if(keyIsDown(LEFT_ARROW)){
      car.x-=3
    }

    if(fuelBar_frnt.isTouching(stopper)){
      Gamestate= END
      lives=lives-1
      gameoversound.play();
     fuelBar_frnt.velocityX = 0
    }

    if(fuelBar_frnt.isTouching(stopper2)){
      fuelBar_frnt.x = 900
    }
    

  if(obGroup.isTouching(car)){
    Gamestate= END
    lives=lives-1
    gameoversound.play();
  }
 
 
   if(fuelGroup.isTouching(car)){
     fuelBar_frnt.x+=60
     coin = coin+1
     fuelGroup[0].destroy()
     fuelsound.play();
   }
    
  if(track.y<10){
    track.y=145
  }
    car.depth = track.depth
    car.depth +=2

   if(lives===0){
   Gamestate=SERVE;
  }
 
   
    Fuel();
  Obstacle();
    
    restart.visible=false;
    gameover.visible=false;
    won.visible=false;
    playi.visible=false
  }

  else if (Gamestate===END){
  restart.visible=true  
 fuelBar_frnt.velocityX = 0
    
  car.changeAnimation("collided",car_collided)
  obGroup.setVelocityXEach(0)
  fuelGroup.setVelocityXEach(0)
  track.velocityY=0  
  obGroup.setLifetimeEach(-1);
  fuelGroup.setLifetimeEach(-1);
    
  if(mousePressedOver(restart)||touches.length>0){
    reset();
    restartsound.play();
   }
  }
  
  else if(Gamestate===SERVE){
    gameover.visible=true
    playi.visible=true
    car.changeAnimation("collided",car_collided)
  obGroup.setVelocityXEach(0)
  fuelGroup.setVelocityXEach(0)
  track.velocityY=0  
  obGroup.setLifetimeEach(-1);
  fuelGroup.setLifetimeEach(-1);

  fuelBar_frnt.velocityX =0
    
  if(mousePressedOver(playi)||touches.length>0){
    winning();
    playsound.play();
  }
    
  }
  
car.collide(inv_ground)
car.setCollider("rectangle",0,0,car.width,car.height) 
  car.debug  = false
  
 drawSprites();
}

function Fuel() {
if(frameCount % 80 ===0) {
 var fuels=createSprite(250,15,20,20) 
 fuels.x=Math.round(random(80,420))
 fuels.addImage(fuel_image)
  fuels.scale=0.01
  fuels.velocityY=3
  fuels.lifetime=200
  fuelGroup.add(fuels)
}
}


function Obstacle(){
if(frameCount%60===0){
   var obstacles = createSprite(250,20,10,40); 

  obstacles.addImage(obstacle1)
  obstacles.x = Math.round(random(80,420));

  obstacles.setCollider("rectangle",0,0,100,100)
  obstacles.debug = false

  obstacles.velocityY=3
  obstacles.scale=0.02
  obstacles.lifetime=300
  obGroup.add(obstacles);

}
}


function reset(){
  Gamestate=PLAY
  gameover.visible=false
  restart.visible=false
  obGroup.destroyEach();
  fuelGroup.destroyEach();
  score=0
  coin=0
  track.velocityY=-5
  fuelBar_frnt.x = 900
fuelBar_frnt.velocityX = -0.6
} 

function winning(){
  Gamestate=PLAY
  gameover.visible=false
  restart.visible=false
  obGroup.destroyEach();
  fuelGroup.destroyEach();
  score=0
  coin=0
  lives=3
  track.velocityY=-5
  fuelBar_frnt.x = 900
fuelBar_frnt.velocityX = -0.6
}
