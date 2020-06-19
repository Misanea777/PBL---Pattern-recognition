function preload(){
  
}
let WIDTH;
let HEIGHT;

function setup() {
	WIDTH = windowWidth;
  	HEIGHT = windowHeight;
	createCanvas(windowWidth, windowHeight);
	rectMode(CENTER);
	angleMode(DEGREES);  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


let gm1 = new GameMode(0); 
gm1.generateNextLvl();

let ui = new UI();


function draw() {
  translate(0, windowHeight/2);
  background(100);

  // let ob = new Obj(1,150,0,'blue','l',false); 
  // let ob1 = new Obj(2,400,0,'red','s',true);
  // let ob2 = new Obj(0,150,0,'green','m',true); 
  // let l = new Line(1,150,0,'red'); let l1 = new Line(1,200,125,'blue'); let l2 = new Line(2,200,125,'blue'); 
  // let cob = new ComplexObj(ob); //cob.move(300,0);
  // let cob1 = new ComplexObj(ob1);
  //cob.addComplexObj(cob1);  
  ui.draw();
  gm1.drawInterSymbols();
  gm1.draw();
  
}

function mousePressed(){
	ui.changeValue();
	if(ui.outputObj.isMouseAbove()){
		gm1.selectableObj.push(ui.copyObj()); 
	}
	if(ui.orLine.isMouseAbove()){
		gm1.selectableObj.push(ui.copyLineOr());
	}
	if(ui.vrLine.isMouseAbove()){
		gm1.selectableObj.push(ui.copyLineVr());
	}
	if(ui.obLine.isMouseAbove()){
		gm1.selectableObj.push(ui.copyLineOb());
	}
	gm1.chooseSelected();
}

function mouseDragged(){
	gm1.moveSelected();
}

function mouseReleased(){
	if(gm1.selectedObj !== null){ 
		gm1.checkAnswer();
		gm1.combineWithSelected();
	}
	gm1.selectedObj = null;
	gm1.selectedIdex = null; 
}
