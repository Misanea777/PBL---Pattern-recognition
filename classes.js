function Obj(id,posX,posY,color,size, full)
{
	this.id = id;
	this.posX = posX;
	this.posY = posY;
	this.color = color;
	this.size =size;
	(this.size === 's')? this.size = 50 : (this.size === 'm')? this.size = 100 : (this.size === 'l')? this.size = 150 : this.size = 0;
	this.full = full;
	this.drawOrderId = (this.id === 0)? 1 : (this.id === 1)? 2 : 0;

	this.draw = function(){
		push();
		if(this.full){fill(this.color);} else {fill(100); strokeWeight(5); stroke(this.color);}
		
		if(this.id === 0) {circle(this.posX,this.posY,this.size);} 
		if(this.id === 1) {square(this.posX,this.posY,this.size);}
		if(this.id === 2) {triangle(this.posX,(this.posY-this.size/2), (this.posX-this.size/2),(this.posY+this.size/2), (this.posX+this.size/2),(this.posY+this.size/2) );}
		pop();
	}

	this.move = function(x,y){
		this.posX = x;
		this.posY = y;
	}

	this.isMouseAbove = function(pointX,pointY){
		if(pointY === undefined){
			pointX = mouseX;
			pointY = mouseY-windowHeight/2;
		}
		if(this.id === 0) {return collidePointCircle(pointX,pointY, this.posX,this.posY,this.size);}
		if(this.id === 1) {return collidePointSqure(pointX,pointY, this.posX,this.posY,this.size);}
		if(this.id === 2) {return collidePointTriangle(pointX,pointY, this.posX,this.posY,this.size);}
	}
}

function Line(id,posX,posY,color)
{
	this.id = id;
	this.posX = posX;
	this.posY = posY;
	this.color = color;
	this.drawOrderId = 3;

	this.draw = function(){
		push();
		translate(this.posX, this.posY);
		stroke(this.color); 
		strokeWeight(5);
		(id === 1)? rotate(90) : (id === 2)? rotate(-45) : rotate(0);
		line(-65,0, +65,0);
		pop();
	}

	this.move = function(x,y){
		this.posX = x;
		this.posY = y;
	}

	this.isMouseAbove = function(){
		return collidePointLine(mouseX,-(mouseY-windowHeight/2),this.posX,this.posY,this.id);
	}
}

function ComplexObj(initialObj)
{
	this.objects = [initialObj];

	this.draw = function(){
		for(let i = 0; i<this.objects.length; i++){
			this.objects[i].draw(); 
		}
	}

	this.move = function(x,y){
		for(let i = 0; i<this.objects.length; i++){
			this.objects[i].move(x,y); 
		}
	}	

	this.isMouseAbove = function(){
		return this.objects[0].isMouseAbove();
	}

	this.getSize = function(){return this.objects[0].size;}
	this.getPosX = function(){return this.objects[0].posX;}
	this.getPosY = function(){return this.objects[0].posY;}


	this.add = function(obj){
		if(obj.constructor.name === 'Line') {this.objects.push(obj); return;}
		let len = this.objects.length; 
		for(let i = 0; i<len; i++){
			if(obj.full === this.objects[i].full){
				return;
			}
		}
		for(let i = 0; i<len; i++){
			if((obj.drawOrderId === this.objects[i].drawOrderId) && (obj.size === this.objects[i].size) && (obj.full !== this.objects[i].full)){
				if(!obj.full){
					this.objects.splice(i,0,obj); 
				}else {this.objects.splice(i+1,0,obj);}
				return;
			}
		}
		for(let i = 0; i<len; i++){
			if((obj.size === this.objects[i].size) && (obj.drawOrderId >= this.objects[i].drawOrderId)){
				this.objects.splice(i,0,obj); 
				return;
			}
		}
  		for(let i = 0; i<len; i++){
    		if(obj.size > this.objects[i].size){
    			this.objects.splice(i,0,obj); 
    			return;
    		} 
  		}
  		this.objects.push(obj); 
	}

	this.addComplexObj = function(complxObj){
		complxObj.move(this.getPosX(),this.getPosY());
		for(let i = 0; i<complxObj.objects.length; i++){ 
			if(!this.checkIfExists(complxObj.objects[i])){
				this.add(complxObj.objects[i]);
			}
		} 
	}

	this.checkIfExists = function(obj){
		for(let i = 0; i<this.objects.length; i++){
			if(obj === this.objects[i]) {return true;}
		}
		return false; 
	}

	this.isObjectAbove = function(obj){return obj.isMouseAbove(this.getPosX(),this.getPosY());}
}

function GameMode(id)
{
	this.gameObjects = [];
	this.selectableObj = [];
	this.selectedObj = null;
	this.selectedIndex = null;
	this.dropAnswerArea = new ComplexObj(new Obj(0,0,0,'white','l',false));
	this.level = 3;
	this.padding = 60;
	this.id = id;

	this.draw = function(){
		for(let i = 0; i<this.gameObjects.length; i++){
			this.gameObjects[i].draw(); 
		}
		for(let i = 0; i<this.selectableObj.length; i++){
			this.selectableObj[i].draw(); 
		} 
		if(this.selectedObj !== null){this.selectedObj.draw();}
		//this.dropAnswerArea.draw();
	}

	this.generateObjects = function(objNumber,objComplexity){
		if(objComplexity === undefined) {objComplexity = 1;}
		for(let i = 0; i<objNumber; i++){
			let obj = this.generateRandomObject(objComplexity);
			this.gameObjects.push(obj);
		}
	}

	this.generateRandomObject = function(objComplexity){
		const colors = ['red','green','blue'];
		const sizes = ['s','m','l'];
		const isFull = [true, false];
		const randomComplexity = getRand(objComplexity);

		let obj = new ComplexObj(new Obj(getRand(3),0,0,colors[getRand(3)],sizes[getRand(3)], isFull[getRand(2)]));
		for(let i = 0; i<randomComplexity; i++){
			if(getRand(4) === 0){
				obj.add(new Line(getRand(3),0,0,colors[getRand(3)]));
				continue;
			}
			obj.add(new Obj(getRand(3),0,0,colors[getRand(3)],sizes[getRand(3)], isFull[getRand(2)]));
		}
		return obj;
	}

	this.generateNextLvl = function(){
		this.level++;
		this.gameObjects = [];
		this.selectableObj = [];
		this.generateObjects(this.level,this.level%10-1); 
		this.arrangeInLineOnCanvas(this.padding);
	}

	this.arrangeInLineOnCanvas = function(){
		let prevSize = 0;
		let currentSize = 0;
		let prevPosX = 0;
		for(let i = 0; i<this.gameObjects.length; i++){
			currentSize = this.gameObjects[i].getSize();
			this.gameObjects[i].move(prevPosX+currentSize/2+prevSize/2+this.padding,0); 
			prevSize = currentSize;
			prevPosX = this.gameObjects[i].getPosX();
		}
		this.dropAnswerArea.move(prevPosX+this.dropAnswerArea.getSize()/2+prevSize/2+this.padding,0);
	}

	this.drawInterSymbols = function(){
		let padding = this.padding/2;
		let pos = 0;
		for(let i = 0; i<this.gameObjects.length-1; i++){
			pos = (this.gameObjects[i].getPosX()+this.gameObjects[i].getSize()/2+padding);
			drawPlusSymbol(pos,0);
		}
		pos = (this.gameObjects[this.gameObjects.length-1].getPosX()+this.gameObjects[this.gameObjects.length-1].getSize()/2+padding);
		drawEqualSymbol(pos,0);
	}

	this.chooseSelected = function(){
		for(let i = 0; i<this.selectableObj.length; i++){
			if(this.selectableObj[i].isMouseAbove()){
				this.selectedObj = this.selectableObj[i]; 
				this.selectedIndex = i;
				return;
			}
		}
	}

	this.moveSelected = function(){
		try{
			this.selectedObj.move(mouseX,mouseY-windowHeight/2);

		}catch(error){}
	}

	this.combineWithSelected = function(){
		for(let i = 0; i<this.selectableObj.length; i++){
			if(this.selectedObj === this.selectableObj[i]){
				continue;
			}
			if(this.selectedObj.isObjectAbove(this.selectableObj[i])){
				this.selectableObj[i].addComplexObj(this.selectedObj);
				this.selectableObj.splice(this.selectedIndex, 1);
			}
		}
	}

	this.checkAnswer = function () {
		if (this.selectedObj.isObjectAbove(this.dropAnswerArea)) {
			this.selectedObj.move(this.dropAnswerArea.getPosX(), this.dropAnswerArea.getPosY());
			input = `${this.printAll()};`;
			console.log(input)
			return fetch(`http://d9cc1e52c389.ngrok.io`, {
				method: "POST",
				mode: "cors",
				cache: "no-cache",
				credentials: "same-origin",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ input }),
			})
				.then(response => response.json())
				.then(data => {
					if (data.msg) {
						print("true")
						this.generateNextLvl();
					} else { print("false") 
								this.selectableObj.splice([this.selectedIndex],1);
							}
				})
		}
	}

	this.printObj = function(obj){
		let outputText = '';
		let tmpText = '';
		if(obj.constructor.name === 'Line'){
			outputText += 'line straight inclination ';
			(obj.id === 0)? tmpText = 'orizontal ' : (obj.id === 1)? tmpText = 'vertical ' : tmpText = 'oblique_pos ';
			outputText += tmpText + 'color ' + obj.color + ' ';
			//console.log(outputText);
			return outputText;
		}
		if(obj.constructor.name === 'Obj'){
			(obj.full)? tmpText = 'form ' : tmpText = 'border ';
			outputText += tmpText;
			(obj.id === 0)? tmpText = 'circle ' : (obj.id === 1)? tmpText = 'square ' : tmpText = 'triangle ';
			outputText += tmpText;
			outputText += 'color ' + obj.color + ' ';
			(obj.size === 50)? tmpText = 'small ' : (obj.size === 100)? tmpText = 'medium ' : tmpText = 'big ';
			outputText += 'size ' + tmpText + ' ';
			//console.log(outputText);
			return outputText;
		}

	}

	this.printComplexObj = function(complexObj){
		let outputText = '';
		for(let i = 0; i<complexObj.objects.length-1; i++){
			outputText += this.printObj(complexObj.objects[i]) + '& ';
		}
		outputText += this.printObj(complexObj.objects[complexObj.objects.length-1]) + ' ';
		//console.log(outputText);
		return outputText;
	}

	this.printAll = function(){
		let outputText = '';
		for(let i = 0; i<this.gameObjects.length-1; i++){
			outputText += this.printComplexObj(this.gameObjects[i]) + '+  ';
		}
		outputText += this.printComplexObj(this.gameObjects[this.gameObjects.length-1]) + '=  ';
		outputText += this.printComplexObj(this.selectedObj);
		//console.log(outputText);
		return outputText;
	}
}


function UI()
{
	this.filled = new Obj(1,0,0,'white','s',false);
	this.colors = new Obj(1,0,0,'red','m',true);
	this.sizes = new Obj(1,0,0,'white','m',false);
	this.shapes = new ComplexObj(new Obj(1,0,0,'white','m',true));
	this.shapes.objects[1] = (new Obj(1,0,0,this.colors.color,'s',false));
	this.outputObj = new Obj(0,-1000,-1000,'black','s',true);
	this.outputObj.id = this.shapes.objects[1].id;
	this.outputObj.color = this.shapes.objects[1].color;
	this.outputObj.size = this.sizes.size;
	this.orLine = new Line(0,-1000,-1000,'black');
	this.vrLine = new Line(1,-1000,-1000,'black');
	this.obLine = new Line(2,-1000,-1000,'black');
	

	this.draw = function(){
		push();
		fill(0);
		rect(0,-windowHeight/2,windowWidth*2,250 );

		this.shapes.move(50,-windowHeight/2+50);
		this.shapes.objects[1].color = this.colors.color;
		this.shapes.draw();

		this.colors.move(150,-windowHeight/2+50);
		this.colors.draw();
	
		this.sizes.move(325,-windowHeight/2+50);
		this.sizes.draw(); 

		this.filled.move(225,-windowHeight/2+50);
		this.filled.draw();
		
		this.outputObj.draw(); 
		this.orLine.draw();
		this.vrLine.draw();
		this.obLine.draw();
		pop();
	}

	this.changeValue = function(){
		if(this.shapes.isMouseAbove()) {
			(this.shapes.objects[1].id === 2)? this.shapes.objects[1].id=0 : this.shapes.objects[1].id++;
			this.constrctOutShape();
		} 
		if(this.colors.isMouseAbove()){
			this.colors.color = (this.colors.color === 'red')? this.colors.color ='blue' : (this.colors.color === 'blue')? this.colors.color='green' : 'red';
			this.constrctOutShape();
		}
		if(this.sizes.isMouseAbove()){
			this.sizes.size = (this.sizes.size === 50)? this.sizes.size =100 : (this.sizes.size === 100)? this.sizes.size=150 : 50;
			this.constrctOutShape();
		}
		if(this.filled.isMouseAbove()){
			this.filled.full = !this.filled.full; 
			this.constrctOutShape();
		}
		
	}

	this.constrctOutShape = function(){
		this.outputObj.move(500,-windowHeight/2+50);
		this.outputObj.id = this.shapes.objects[1].id;
		this.outputObj.color = this.colors.color;
		this.outputObj.size = this.sizes.size;
		this.outputObj.full = this.filled.full;

		this.orLine.move(700,-windowHeight/2+50);
		this.vrLine.move(900,-windowHeight/2+25);
		this.obLine.move(1100,-windowHeight/2+50);
		this.orLine.color = this.colors.color;
		this.vrLine.color = this.colors.color;
		this.obLine.color = this.colors.color;
	}

	this.copyObj = function(){
		let returnObj = new Obj(this.outputObj.id,this.outputObj.posX,this.outputObj.posY,this.outputObj.color,'s',this.outputObj.full);
		returnObj.size = this.outputObj.size;
		return new ComplexObj(returnObj);
	}

	this.copyLineOr = function(){
		return new ComplexObj(new Line(this.orLine.id,this.orLine.posX,this.orLine.posY,this.orLine.color));
	}
	this.copyLineVr = function(){
		return new ComplexObj(new Line(this.vrLine.id,this.vrLine.posX,this.vrLine.posY,this.vrLine.color));
	}
	this.copyLineOb = function(){
		return new ComplexObj(new Line(this.obLine.id,this.obLine.posX,this.obLine.posY,this.obLine.color));
	}


}
