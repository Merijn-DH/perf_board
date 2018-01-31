let objects = [];
let wires = [];
let tileSize = 40;

let tool = 1;
  // 1 - SELECT
  // 2 - ADD OBJECT
  // 3 - ADD WIRE

let startX = 0;
let startY = 0;
let drawing = false;
let wiring = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  loadFile();
}

function draw() {
  background(0);
  stroke(150);
  strokeWeight(1);
  for (let x = 0; x < width; x += tileSize) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += tileSize) {
    line(0, y, width, y);
  }

  for (let i = 0; i < objects.length; i++) {
    objects[i].show();
  }

  for (let i = 0; i < wires.length; i++) {
    wires[i].show();
  }

  strokeWeight(1);
  if (drawing) {
    fill(255,150);
    let endX = (mouseX-startX)+tileSize-((mouseX-startX)%tileSize);
    let endY = (mouseY-startY)+tileSize-((mouseY-startY)%tileSize);
    rect(startX, startY, endX, endY);
  }
  if (wiring) {
    stroke(currentR,currentG,currentB,150);
    strokeWeight(10);
    let endX = mouseX - mouseX % tileSize;
    let endY = mouseY - mouseY % tileSize;
    line(startX+tileSize/2, startY+tileSize/2, endX+tileSize/2, endY+tileSize/2);
  }
}

function mousePressed() {
  typing = false;
  startX = mouseX - mouseX % tileSize;
  startY = mouseY - mouseY % tileSize;

  if (tool == 2) {
    drawing = true;
  }
  if (tool == 3) {
    wiring = true;
  }

  let clickedWire = false;
  for (let i = 0; i < wires.length; i++) {
    wires[i].deselect();
    if (tool == 1)
      if (wires[i].clicked()) {
        clickedWire = true;
      }
  }

  if (clickedWire) return;

  for (let i = 0; i < objects.length; i++) {
    objects[i].deselect();
    if (tool == 1)
      if (objects[i].clicked()) {
      }
  }
}

function mouseDragged() {
  if (tool == 1) {
    for (let i = 0; i < objects.length; i++) {
      objects[i].drag(startX, startY);
    }
  }
}

function mouseReleased() {
  saveFile();
  if (tool == 2) {
    drawing = false;
    let endX = (mouseX-startX)+tileSize-((mouseX-startX)%tileSize);
    let endY = (mouseY-startY)+tileSize-((mouseY-startY)%tileSize);
    let object = new Item(startX, startY, endX, endY);
    objects.push(object);
  }
  if (tool == 3) {
    wiring = false;
    let endX = mouseX - mouseX % tileSize;
    let endY = mouseY - mouseY % tileSize;
    let wire = new Wire(startX, startY, endX, endY);
    wires.push(wire);
  }
}

let typing = false;

function keyPressed() {
  if (typing) {
    for (let i = 0; i < objects.length; i++) {
      if (objects[i].selected) {
        objects[i].text = objects[i].text + key;
      }
    }
  } else {
  if (key == '1') {
    tool = 1;
  } else if (key == '2') {
    tool = 2;
  } else if (key == '3') {
    tool = 3;
  }

  if (keyCode == BACKSPACE) {
    for (let i = 0; i < wires.length; i++) {
      if (wires[i].selected) {
        wires.splice(i,1);
        return;
      }
    }

    for (let i = 0; i < objects.length; i++) {
      if (objects[i].selected) {
        objects.splice(i,1);
        return;
      }
    }
  }

  if (key == 'R') {
    colorWire(255,0,0);
  } else if (key == 'G') {
    colorWire(0,255,0);
  } else if (key == 'B') {
    colorWire(0,0,255);
  } else if (key == 'D') {
    for (let i = 0; i < wires.length; i++) {
      if (wires[i].selected) {
        wires[i].dot = !wires[i].dot;
      }
    }
    colorWire(255,160,0);
  }
  }
  if (key == '»') {
    typing = !typing;
    if (typing) {
      tool = 1;
      for (let i = 0; i < objects.length; i++) {
        if (objects[i].selected) {
          objects[i].text = "";
        }
      }
    }
  }
}

function colorWire(r, g, b) {
  currentR = r;
  currentB = b;
  currentG = g;
  for (let i = 0; i < wires.length; i++) {
    if (wires[i].selected) {
      wires[i].r = r;
      wires[i].g = g;
      wires[i].b = b;
    }
  }
}

function saveFile() {
  localStorage["objects"] = JSON.stringify(objects);
  localStorage["wires"] = JSON.stringify(wires);
}

function loadFile() {
  if (typeof localStorage["objects"] !== "undefined") {
    let fo = JSON.parse(localStorage["objects"]);
    for (let i = 0; i < fo.length; i++) {
    let object = new Item(fo[i].x,fo[i].y,fo[i].w,fo[i].h);
    object.selected = false;
    object.text = fo[i].text;
    objects.push(object);
    }
  }
  if (typeof localStorage["wires"] !== "undefined") {
    let fo = JSON.parse(localStorage["wires"]);
    for (let i = 0; i < fo.length; i++) {
    let wire = new Wire(fo[i].x1,fo[i].y1,fo[i].x2,fo[i].y2);
    wire.r = fo[i].r;
    wire.g = fo[i].g;
    wire.b = fo[i].b;
    wire.dot = fo[i].dot;
    wire.selected = false;
    wires.push(wire);
    }
  }
}

function saveString() {
  print(JSON.stringify(objects) + "lalala" + JSON.stringify(wires));
}

function loadString(string) {
  let parts = string.split("lalala");
  let fo = JSON.parse(parts[0]);
  objects.splice(0);
  wires.splice(0);
  for (let i = 0; i < fo.length; i++) {
  let object = new Item(fo[i].x,fo[i].y,fo[i].w,fo[i].h);
  object.selected = false;
  object.text = fo[i].text;
  objects.push(object);
  }

  let fb = JSON.parse(parts[1]);
  for (let i = 0; i < fb.length; i++) {
  let wire = new Wire(fb[i].x1,fb[i].y1,fb[i].x2,fb[i].y2);
  wire.r = fb[i].r;
  wire.g = fb[i].g;
  wire.b = fb[i].b;
  wire.dot = fb[i].dot;
  wire.selected = false;
  wires.push(wire);
  }
}