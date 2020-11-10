//Create variables here
var dog,sadDog,happyDog,garden,washroom, database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
garden=loadImage("Garden.png");
washroom=loadImage("Wash Room.png");
bedroom=loadImage("Bed Room.png");
}

function setup() {
  database=firebase.database();
  createCanvas(800,500);
  
  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
   
  dog=createSprite(200,400,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  //create button to feed
  feed=createButton("Feed Romeo the dog");
  feed.position(500,95);
  feed.mousePressed(feedDog);

  //create button to add food
  addFood=createButton("Add Food for Romeo");
  addFood.position(700,95);
  addFood.mousePressed(addFoods);
}

function draw() {
  background(72,61,139);

  //change bg according to fedtime
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   //hide food and dog if gamestate is hungry
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock 
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}



//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}





// function to update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}








