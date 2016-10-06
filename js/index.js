/*NOTE: firefox setTimout() is bugged (Bug 814651)*/
/*TODO list: 
1. IA;
2. Sigle Player & Two Player mode
3. Personalized player names*/
var game = document.getElementById('game');
var clr = document.getElementById('clear');
var ctx = game.getContext('2d');
var w = game.width;
var h = game.height;
var cells = [
  {cx: w/2 - h/2, cy: 0},
  {cx: w/2 - h/6, cy: 0},
  {cx: w/2 + h/6, cy: 0},
  {cx: w/2 - h/2, cy: h/3},
  {cx: w/2 - h/6, cy: h/3},
  {cx: w/2 + h/6, cy: h/3},
  {cx: w/2 - h/2, cy: h*2/3},
  {cx: w/2 - h/6, cy: h*2/3},
  {cx: w/2 + h/6, cy: h*2/3}
];
var player = 1;
var points = [0, 0];
var start = 1;

gameBoard();

game.addEventListener('click', function(event) {
  var c = getCell(cells, event.offsetX, event.offsetY);
  if(cells[c].val === 0 && start === 1) {
    cells[c].val = turnSwitch(cells[c].cx, cells[c].cy);
    chkTris(cells);
  }

  return 0;
});

clr.addEventListener('click', function() {
  clear();
  points = [0, 0];
  document.getElementById('points1').innerHTML = 0;
  document.getElementById('points2').innerHTML = 0;
});

function gameBoard() {
  var px = 0;
  
  ctx.strokeStyle = '#FFF';
  
  for(var c in cells) {
    cells[c].val = 0;
  }
  
  start = 0;
  var slowDraw = setInterval(function(){
    px++;
    ctx.beginPath();
    ctx.moveTo(w/2 - h/6, px-1);
    ctx.lineTo(w/2 - h/6, px);
    ctx.moveTo(w/2 + h/6, h-px+1);
    ctx.lineTo(w/2 + h/6, h-px);
    ctx.moveTo(w/2 - h/2 + px-1, h/3);
    ctx.lineTo(w/2 - h/2 + px, h/3);
    ctx.moveTo(w/2 + h/2 - px + 1, 2*h/3);
    ctx.lineTo(w/2 + h/2 - px, 2*h/3);
    ctx.stroke();
    if(px === h) {
      px = 0;
      start = 1;
      clearInterval(slowDraw);
      return 0;
    }
  }, 1);
  
  return 0;
}
function getCell(cells, x, y) {
  for(var c in cells) {
    if(cells[c].cx <= x && cells[c].cx + h/3 >= x && cells[c].cy <= y && cells[c].cy + h/3 >= y) {
      //console.log(c, cells[c]);
      return c;
    } 
  }
}
function turnSwitch(x, y) {
  if(player === 1) {
    player = 2;
    cross(x, y);
    return 1;
  }
  else {
    player = 1;
    circle(x, y);
    return 2;
  }
}
function cross(x, y) {
  var pxh = 0, pxw = 0;
  
  ctx.strokeStyle = "#F00";
  
  start = 0;
  var slowDrawL = setInterval(function() {
    ctx.beginPath();
    ctx.moveTo(x+pxw+10, y+pxh+10);
    ctx.lineTo(x+(++pxw)+10, y+(++pxh)+10);
    ctx.stroke();
    if(pxh === Math.round(h/3)-20 && pxw === Math.round(h/3)-20) {
      start = 1;
      return clearInterval(slowDrawL);
    }
  }, 1);
  
  ctx.beginPath();
  ctx.moveTo(x+h/3-10, y+10);
  ctx.lineTo(x+10, y+h/3-10);
  ctx.stroke();
  
  return 0;
}
function circle(x, y) {
  var r = Math.sqrt(h*h/36) - 10;
  var perc = 0;
  ctx.strokeStyle = "#00F";
  
  start = 0;
  var slowDraw = setInterval(function() {
    ctx.beginPath();
    ctx.arc(x+h/6, y+h/6, r, 2*(perc/100)*Math.PI, 2*(++perc/100)*Math.PI);
    ctx.stroke();
    if(perc === 100) {
      start = 1;
      return clearInterval(slowDraw);
    }
  }, 1);
  
  return 0;
}
function clear() {
  ctx.clearRect(0,0,w,h);
  gameBoard();
  
  return 0;
}
function chkFull(cells) {
  var e = 0;
  for(var i = 0; i < cells.length; i++) {
    if(cells[i].val) e++;
  }
  if(e === i) setTimeout(clear, 1000);
  
  return 0;
}
function chkTris(cells) {
  var flag = 1, j = 0, i = 0;

  //check horizontals
  for( j = 0; j <= 6; j += 3) {
    flag = 1;
    for( i = j; i < j+2; i++) {
      if(cells[i].val !== 0 && cells[i].val === cells[i+1].val) flag++;
      if(flag === 3) {
        document.getElementById('points' + cells[i].val).innerHTML = ++points[cells[i].val-1];
        return alert('Player ' + cells[i].val + ' wins!', setTimeout(clear, 1000));
      }
    }
  }
  
  //check verticals
  for( j = 0; j < 3 ; j++) {
    flag = 1;
    for( i = j; i < j+6; i += 3) {
      if(cells[i].val === cells[i+3].val && cells[i].val !== 0) flag++;
      if(flag === 3) {
        document.getElementById('points' + cells[i].val).innerHTML = ++points[cells[i].val-1];
        return alert('Player ' + cells[i].val + ' wins!', setTimeout(clear, 1000));
      }
    }
  }

  //check 1st diagonal
  flag = 1;
  for( i = 0; i < 8; i += 4) {
    if(cells[i].val === cells[i+4].val && cells[i].val !== 0) flag++;
    if(flag === 3) {
      document.getElementById('points' + cells[i].val).innerHTML = ++points[cells[i].val-1];
      return alert('Player ' + cells[i].val + ' wins!', setTimeout(clear, 1000));
    }
  }
 
  //check 2nd diagonal
  flag = 1;
  for( i = 2; i < 6; i += 2) {
    if(cells[i].val === cells[i+2].val && cells[i].val !== 0) flag++;
    if(flag === 3) {
      document.getElementById('points' + cells[i].val).innerHTML = ++points[cells[i].val-1];
      return alert('Player ' + cells[i].val + ' wins!', setTimeout(clear, 1000));
    }
  }
  
  return chkFull(cells);
}