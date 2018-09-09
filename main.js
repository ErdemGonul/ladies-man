//setting canvas from main.html
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
//setting image files
const background = new Image();
background.src="./assets/background.png";
const enemyimg= new Image();
enemyimg.src = './assets/zombie.png';
const ladyimg=new Image();
ladyimg.src='./assets/lady.png';
let image = new Image();
image.src = './assets/x.png';

//defining variables
let enemies=[];
let girls=[];

let time=0;
let score=0;
let loser=false;
let  combocalled=false;
let spawnTime=120;

let currentCombo;
let currentKey;
let keyindex;
let charStr;
let charCode;

let xofgirlsposition=30;

let warning='';
let deathcause='';

const possible = "ASDQWERTFGYHUJ";
const textsingame = [
    'LADIES MAN',
    'SPACE TO START',
    'WP COWBOY',
    'BAD COMBO',
    'ZOMBIE GOT YOU',
    'DONT SHOT LADIES',
    'SPACE TO RESTART',
];
const colors= [
    'white',
    'black',
    '#F80000',
    '#70D038',
];
let colorsofcombopixels=[colors[2],colors[2],colors[2]];

//initializing kontra.js
kontra.init();

//creating animations and sprites with kontra.js
let spriteSheetEnemy = kontra.spriteSheet({
  image: enemyimg,
  frameWidth: 18.333333,
  frameHeight: 26,
  animations: {
    walk: {
      frames: '0..2',
      frameRate:10
    }
  }
});
let spriteback = kontra.sprite({
    x:0,
    y:0,
    image: background
});

let spriteSheetplayer = kontra.spriteSheet({
      image: image,
      frameWidth: 34.9,
      frameHeight: 39,
      animations: {
        walk: {
          frames: '0..3',
          frameRate:3
        }
      }
});
let spriteplayer = kontra.sprite({
      x: 40,
      y: 112,
      animations:spriteSheetplayer.animations
});

//creating zombie & lady 
function createEnemy(){
    let x= kontra.sprite({
    x: 250,
    y: 125,
    dx:-1,
    animations:spriteSheetEnemy.animations,
    name:'enemy',
    })
   enemies.push(x);
   return x;
}
function createGirl(){
    let x= kontra.sprite({
    x: 250,
    y: 128,
    dx:-1,
    image:ladyimg,
    name:'lady',
    });
   enemies.push(x);
   return x;
}
//getting 3-length random  string from 'possible' array to use in combos
function RandomChar() {
  var text = "";
  for (var i = 0; i < 3; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
 
  return text;
 }
//getting key-inputs from user (i didnt use kontra.js keyboard things because of minimizing)
document.onkeypress = function(evt) {
  evt = evt || window.event;
  charCode = evt.keyCode || evt.which;
  charStr = String.fromCharCode(charCode);
  if(charCode==32)
    loop.start();
  if(charCode==32 && loser)
    window.location.reload();
  
};
//rendering combos on screen
function callDraw(colors){
    var x=80;
    var index=0;
    colors.forEach(currentcolor => {
      drawText(currentCombo.charAt(index),3,x,50,currentcolor,60);
      x+=30;
      index++;
    });
}
//show lose screen
function toLoseScreen(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    spriteback.render();
    
    if(deathcause==textsingame[5])
    drawText(deathcause,3,20,30,colors[0],0);
    else
    drawText(deathcause,3,30,30,colors[0],0);
  
    drawText(score+' ladies saved',2,65,70,colors[1],0);
    drawText(textsingame[6],2,60,110,colors[0],0);
    loop.stop();
}
//start scene loading
background.onload = function () {
  spriteback.render();
  drawText(textsingame[0], 4,40,40,colors[0],0);
  drawText(textsingame[1],2,70,100,colors[1],0);
}

//Game Loop 
let loop = kontra.gameLoop({
  fps:60,
  update: function(dt) {
    time++;

    enemies.forEach(element => {
      element.update();
    });
    spriteplayer.update();
   
    //call this on every 120 frame (spawnTime=120 at start)
    if(time%spawnTime==0){
        if(!combocalled){
            currentCombo=RandomChar();
            keyindex=0;
            currentKey=currentCombo.charAt(0);
            combocalled=true;
        }
      if(Math.random()>0.3)
        createEnemy();
      else
        createGirl();
    }
    
    enemies.forEach(element => {
      //if enemy's x-position reaches player THE END
      if(element.x<45 && element.name=='enemy'){
        deathcause=textsingame[4];
        loser=true;
        sequencelose.play();
      }
      //if lady's x-position reaches player YOU GOT SCORE
      else if(element.x<45 && element.name=='lady'){
      element.x=xofgirlsposition;
      element.dx=0;
      score++;
      girls.push(element);
      xofgirlsposition-=10;
      sequencegotscore.play();
      //game get harder in every 5 score
      if(score>0 && score%3==0)
        spawnTime=parseInt((spawnTime*80)/100);
        
      }

      if(element.x<45)
      enemies.shift(); 
    });
    //if the pressed key is not 'space'
    if(currentKey!=null && charStr!=null && charCode!=32 ){
      //if combo's currentkey equals to pressed key
      if( charStr.toLowerCase()==currentKey.toLowerCase()){
        sequencecombo.play();
        //if the last pressed key is the last letter of combo
        if(keyindex==2 &&currentCombo.charAt(2)==currentKey){
            //game is lost if you shot a lady
            if(enemies[0].image==ladyimg){
                deathcause=textsingame[5];
                loser=true;
                sequencelose.play();
            }
            //kill zombie
            else{
            enemies.shift();
            sequencekill.play();
            currentKey=null;
            currentCombo=RandomChar();
            keyindex=0;
            currentKey=currentCombo.charAt(0);
            colorsofcombopixels=[colors[2],colors[2],colors[2]];
            warning=textsingame[2];
            }
        }
        //pressed matched key
        else{
            
          colorsofcombopixels[keyindex]=colors[3];
          keyindex++;
          currentKey=currentCombo[keyindex];
        }
    }
    //combo failed with wrong key
    else{
        sequencefailcombo.play();
        currentKey=null;
        currentCombo=RandomChar();
        keyindex=0;
        currentKey=currentCombo.charAt(0);
        colorsofcombopixels=[colors[2],colors[2],colors[2]];
        warning=textsingame[3];
    }
    charStr=null;
    }
  },
  //rendering stuff
  render: function() {
    
    //render player,background,ladies,enemies
    spriteback.render();
    girls.forEach(element => {
      element.render();
    });
    enemies.forEach(element => {
      element.render();
    });
    spriteplayer.render();
   
    //displaying score
    drawText(score+' ladies saved',2,10,10,colors[1],0);
    //displaying combo 
    if(currentCombo!=null)
    callDraw(colorsofcombopixels);
    //displaying on combo success or fail
    if(warning==textsingame[3])
    drawText(warning,2,60,30,colors[1],0);
    else
    drawText(warning,2,80,30,colors[1],0);
    //lose condition
    if(loser)
      toLoseScreen();
    }});


 
