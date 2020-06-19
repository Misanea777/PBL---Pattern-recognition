function drawPlusSymbol(posX,posY){
	push();
	stroke(255); 
	strokeWeight(5);
	line(posX-15,posY,posX+15,posY);
	line(posX,posY-15,posX,posY+15);
	pop();
}

function drawEqualSymbol(posX,posY){
	push();
	stroke(255); 
	strokeWeight(5);
	line(posX-15,posY+5,posX+15,posY+5);
	line(posX-15,posY-5,posX+15,posY-5);
	pop();
}

function getRand(range){
	var num = Math.floor(Math.random()*100);
	return num%range;
}


function collidePointCircle(x, y, cx, cy, d) {
	if( this.dist(x,y,cx,cy) <= d/2 ){
	  return true;
	}
	return false;
}

 function collidePointSqure(pointX,pointY, sx,sy,size) {  
 	let x1 = sx-size/2;
 	let y1 = sy+size/2;
 	let x2 = sx+size/2;
 	let y2 = sy-size/2;
	if (pointX >= x1 && pointY <= y1 && pointX <= x2 && pointY >= y2) {return true;}
	return false;
}

function collidePointTriangle(px, py, tx,ty,size) {
	let x1 = tx;
	let y1 = ty-size/2;
	let x2 = tx-size/2;
	let y2 = ty+size/2;
	let x3 = tx+size/2;
	let y3 = ty+size/2;
	let areaOrig = abs((x2-x1)*(y3-y1) - (x3-x1)*(y2-y1));
	let area1 = abs((x1-px)*(y2-py) - (x2-px)*(y1-py));
	let area2 = abs((x2-px)*(y3-py) - (x3-px)*(y2-py));
	let area3 = abs((x3-px)*(y1-py) - (x1-px)*(y3-py));
	if (area1 + area2 + area3 == areaOrig) {
		return true;
	}
	return false;
}

function collidePointLine(px,py,posX,posY,id,buffer){ 
	let angleInRad = (id === 1)? Math.PI/2 : (id === 2)? Math.PI/4 : 0;
	let cosVal = Math.cos(angleInRad);
	let sinVal = Math.sin(angleInRad);
	
	let x1 = 100*cosVal + posX; 
	let y2 = -(100*sinVal + posY);
	let x2 = -100*cosVal + posX;
	let y1 = -(-100*sinVal + posY); line(x1,-y1,x2,-y2);

	let d1 = this.dist(px,py, x1,y1);
	let d2 = this.dist(px,py, x2,y2);
	let lineLen = this.dist(x1,y1, x2,y2);
	if (buffer === undefined){ buffer = 0.3; }  
	if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
	  return true;
	}
	return false;
}

function jsonCopy(src) {
  return JSON.parse(JSON.stringify(src));
}