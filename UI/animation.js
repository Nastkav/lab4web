var r = 10;
var x_min = 0 + r, x_max = document.getElementById('anim-wrapper').clientWidth - 10;
var y_min = 0 + r, y_max = document.getElementById('anim-wrapper').clientHeight -10;
var x_red = x_min, y_red = y_min;
var x_green = x_min, y_green = y_min;
var speed_red = 8, speed_green = 12;
var rnd_red_y, rnd_green_x;
var canvas = document.getElementById("anim");
var ctx = canvas.getContext("2d");
var reverse_red = false;
var reverse_green = false;
var ReqID = null;

function Play()
{
  document.getElementById('work').style.display = 'block';   
  document.getElementById('AnimStop').style.display = 'none';  
  document.getElementById('AnimReload').style.display = 'none';  
  resizeCanvas();
  var HistoryNode = document.getElementById("history");
  HistoryNode.innerHTML = '';
}

function Start() {
  anim();
  document.getElementById('AnimStart').style.display = 'none';  
  document.getElementById('AnimStop').style.display = 'inline';  
  AddToHistory("Press button START");
  AddEventToLocalStorageHistory("Press button START");
}

function Stop() {
  cancelAnimationFrame(ReqID);
  document.getElementById('AnimStart').style.display = 'inline';  
  document.getElementById('AnimStop').style.display = 'none';  
  AddToHistory("Press button STOP");
  AddEventToLocalStorageHistory("Press button STOP");
}

function Reload() {
  cancelAnimationFrame(ReqID);
  resizeCanvas();
  document.getElementById('AnimStop').style.display = 'none';  
  document.getElementById('AnimReload').style.display = 'none';  
  document.getElementById('AnimStart').style.display = 'inline';  
  AddToHistory("Press button RELOAD");
  AddEventToLocalStorageHistory("Press button RELOAD");
}

function AddToHistory(text_) {
  var tag = document.createElement("p");
  var text = document.createTextNode(text_);
  tag.appendChild(text);
  var element = document.getElementById("history");
  element.appendChild(tag);
}

function AddEventToLocalStorageHistory(text_) {
  var LSHistory = localStorage.getItem('AnimationEventHistory');
  var LSHistoryArray = [];
  if(LSHistory) {
    LSHistoryArray = JSON.parse(LSHistory);
  }
  LSHistoryArray.push({
    dt: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
    event: text_
  });
  var ArrayToStorage = JSON.stringify(LSHistoryArray); 
  localStorage.setItem('AnimationEventHistory', ArrayToStorage);
}

function GetLocaleStorageEvents() {
  var LSHistory = localStorage.getItem('AnimationEventHistory');
  var LSHistoryArray = [];
  if(LSHistory) {
    LSHistoryArray = JSON.parse(LSHistory);
  }
  var HistoryNode = document.getElementById("all-events");
  HistoryNode.innerHTML = '';
  LSHistoryArray.forEach(function(item, i) {
    var tag = document.createElement("p");
    var text = document.createTextNode(item.dt + " " + item.event);
    tag.appendChild(text);
    var element = document.getElementById("all-events");
    element.appendChild(tag);
  });
}

function Close()
{
  document.getElementById('work').style.display = 'none';
  Stop();
  AddEventToLocalStorageHistory("Press button CLOSE");
  GetLocaleStorageEvents();
}

function anim(time) {
  if(((x_green >= x_red - r && x_green <= x_red + r) && (y_green >= y_red - r && y_green <= y_red + r)) || 
  (x_red >= x_green - r && x_red <= x_green + r) && (y_red >= y_green - r && y_red <= y_green + r)) {
    document.getElementById('AnimStop').style.display = 'none'; 
    document.getElementById('AnimReload').style.display = 'inline'; 
    AddToHistory("Balls collided");
    AddEventToLocalStorageHistory("Balls collided");
    cancelAnimationFrame(ReqID);
    return;
  }
  if(x_red + r > x_max) {
    reverse_red = true;
    AddToHistory("Red ball touched the right wall");
    AddEventToLocalStorageHistory("Red ball touched the right wall");
  }
  if(x_red - r < x_min) {
    reverse_red = false;
    AddToHistory("Red ball touched the left wall");
    AddEventToLocalStorageHistory("Red ball touched the left wall");
  }
  if(reverse_red) {
    x_red -= speed_red;
  } else {
    x_red += speed_red;
  }
  y_red = rnd_red_y;
  // green
  if(y_green + r > y_max) {
    reverse_green = true;
    AddToHistory("Green ball touched the bottom wall");
    AddEventToLocalStorageHistory("Green ball touched the bottom wall");
  }
  if(y_green - r < y_min) {
    reverse_green = false;
    AddToHistory("Green ball touched the top wall");
    AddEventToLocalStorageHistory("Green ball touched the top wall");
  }
  if(reverse_green) {
    y_green -= speed_green;
  } else {
    y_green += speed_green;
  }
  x_green = rnd_green_x;
  draw(x_red, y_red, x_green, y_green);
  ReqID = requestAnimationFrame(anim);
}

window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
  x_max = document.getElementById('anim-wrapper').clientWidth - 10;
  y_max = document.getElementById('anim-wrapper').clientHeight - 10;
  canvas.width = x_max + 10;
  canvas.height = y_max + 10;
  rnd_red_y = getRandomInt(y_min, y_max);
  rnd_green_x = getRandomInt(x_min, x_max);
  x_red = x_min;
  y_red = rnd_red_y;
  x_green = rnd_green_x;
  y_green = y_min;
  draw(x_red, rnd_red_y, rnd_green_x, y_green);
}

function circle(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.fill();
}

function clear() {
  ctx.clearRect(0, 0, x_max + 10, y_max + 10);
}

function draw(x_red, y_red, x_green, y_green) {
  clear(x_max, y_max);
  ctx.fillStyle = "red";
  circle(x_red, y_red, r);
  ctx.fillStyle = "green";
  circle(x_green, y_green, r);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}



