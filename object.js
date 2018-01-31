class Item {
	constructor(x,y,w,h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.selected = true;
		this.text = "";
	}
	show() {
		if (this.selected) {
			stroke(255,0,0, 150);
			strokeWeight(5);
		} else {
			noStroke();
		}
		fill(255);
		rect(this.x+5,this.y+5,this.w-10,this.h-10);

		noStroke();
		fill(0);
		textSize(18);
		textAlign(CENTER);
		text(this.text, this.x+this.w/2, this.y+this.h/2)
	}

	clicked() {
		if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
			this.selected = true;
			return true;
		}
		return false;
	}

	deselect() {
		this.selected = false;
	}

	drag(x, y) {
		if (this.selected) {
			let startX = mouseX - mouseX % tileSize;
	  		let startY = mouseY - mouseY % tileSize;
	  		this.x = startX;
	  		this.y = startY;
  		}
	}
}

let currentR = 255;
let currentG = 0;
let currentB = 0;

class Wire {
	constructor(x1,y1,x2,y2) {
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.r = currentR;
		this.g = currentG;
		this.b = currentB;
		this.selected = true;
		this.dot = false;

		if (x1 == x2 && y1 == y2) {
			this.x2 += 1;
			this.y2 += 1;
		}

		if (x2 < x1) {
			this.x1 = x2;
			this.x2 = x1;
		}
		if (y2 < y1) {
			this.y1 = y2;
			this.y2 = y1;
		}
	}

	show() {
		if (this.selected) {
			stroke(this.r,this.g,this.b, 100);
		} else {
			stroke(this.r,this.g,this.b, 200);
		}
		if (this.dot) {
			strokeWeight(20);
		} else {
			strokeWeight(10);
		}
		line(this.x1+tileSize/2,this.y1+tileSize/2,this.x2+tileSize/2,this.y2+tileSize/2);
	}

	clicked() {
        lerp=function(a,b,x){ return(a+x*(b-a)); };

        this.x1 += tileSize/2;
        this.x2 += tileSize/2;
        this.y1 += tileSize/2;
        this.y2 += tileSize/2;
        var dx=this.x2-this.x1;
        var dy=this.y2-this.y1;
        var t=((mouseX-this.x1)*dx+(mouseY-this.y1)*dy)/(dx*dx+dy*dy);
        var lineX=lerp(this.x1, this.x2, t);
        var lineY=lerp(this.y1, this.y2, t);
        let distance = dist(mouseX,mouseY,lineX,lineY);
        this.x1 -= tileSize/2;
        this.x2 -= tileSize/2;
        this.y1 -= tileSize/2;
        this.y2 -= tileSize/2;
        if (mouseX > this.x1 && mouseX < this.x2+tileSize && mouseY > this.y1 && mouseY < this.y2+tileSize && distance<10) {
        	this.selected = true;
        	return true;
        }
        if (mouseX < this.x1 && mouseX > this.x2+tileSize && mouseY < this.y1 && mouseY > this.y2+tileSize && distance<10) {
        	this.selected = true;
        	return true;
        }
        if (mouseX > this.x1 && mouseX < this.x2+tileSize && mouseY < this.y1 && mouseY > this.y2+tileSize && distance<10) {
        	this.selected = true;
        	return true;
        }
        if (mouseX < this.x1 && mouseX > this.x2+tileSize && mouseY > this.y1 && mouseY > this.y2+tileSize && distance<10) {
        	this.selected = true;
        	return true;
        }
        return false;
	}

	deselect() {
		this.selected = false;
	}
}