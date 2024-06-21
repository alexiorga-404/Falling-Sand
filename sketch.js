let height=600;
let width=600;
let cols;
let rows;
let size=2;
let grid;
let velocityGrid;
let hueValue=50;
let grav=0.1;

function setup() {
  createCanvas(600, 600);
  colorMode(HSB,360,255,255);
  cols=width/size;
  rows=height/size;
  grid=makeMatrix(cols,rows);
  velocityGrid=makeMatrix(cols,rows,1);
}

function draw() {
  background(0);
  if(mouseIsPressed){
    let x=floor(mouseX/size);
    let y=floor(mouseY/size);
    if(withinBounds(x,y)){
      colorMatrix(x,y);
      hueValue+=0.75;
    }
    if(hueValue>360){
      hueValue=0;
    }
  }

  for(let i=0;i<cols;i++){
    for(let j=0;j<rows;j++){
      noStroke();
      if(grid[i][j]>0){
        fill(grid[i][j],255,255);
        let x =i*size;
        let y=j*size;
        square(x,y,size);
      }
    }
  }
  let next=makeMatrix(cols,rows);
  let nextVel=makeMatrix(cols,rows);

  for(let i = 0; i < cols ; i++){
    for(let j = 0; j < rows; j++){
      let state=grid[i][j];
      let velocity=velocityGrid[i][j];
      let moved=false;

      if ( state > 0) {
        let newPos = int(j + velocity);
        for(let y = newPos; y > j; y--){
          let below = grid[i][y];
          let dir = random([-1,1]);

          let right,left;

          if(i>0 && i<cols-1){
            right=grid[i-dir][y];
            left=grid[i+dir][y];
          }

          if(below===0){
            next[i][y]=state;
            nextVel[i][y]=velocity+grav;
            moved=true;
            break;
          }else if(right===0){
            next[i-dir][y]=state;
            nextVel[i-dir][y]=velocity+grav;
            moved=true;
            break;
          } else if (left===0){
            next[i+dir][y]=state;   
            nextVel[i+dir][y]=velocity+grav;
            moved=true;
            break;
          }
        }
      }
      if(state>0 && !moved){
        next[i][j]=grid[i][j];
        nextVel[i][j]=velocityGrid[i][j]+grav;
      }
    }
  }

  grid=next;
  velocityGrid=nextVel;  
}

function makeMatrix(cols,rows, initialValue = 0){
    let arr=new Array(cols);
    for(let i=0;i<arr.length;i++){
        arr[i]= new Array(rows);
        for(let j=0;j<rows;j++){
          arr[i][j]=initialValue;
        }
    }
    return arr;
}

function mouseDragged() {}

function colorMatrix(x,y){
   let range=10;
   let radius=range/2;
   let squaredRadius = radius * radius;
     for(let i=x-range;i<=x+range;i++){
       for(let j=y-range;j<=y+range;j++){
         if(withinBounds(i,j) && grid[i][j]==0){
           let decision=random([1,0,1]);
           if(decision===1){
             let squaredDistance = (i - x) ** 2 + (j - y) ** 2;
              if (squaredDistance <= squaredRadius) {
                grid[i][j] = hueValue;
              }
             velocityGrid[i][j]=1;
           }
         }
       }
     }
}

function drawCircle(matrix, centerX, centerY, radius) {
  let squaredRadius = radius * radius;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      let squaredDistance = (i - centerX) ** 2 + (j - centerY) ** 2;
      if (squaredDistance <= squaredRadius) {
        matrix[i][j] = 1;
      }
    }
  }
}

function withinBounds(x,y){
  if(x>0 && x<rows && y>0 && y<cols){
    return true;
  }else{
    return false;
  }
}

function checkVacancy(i,j,grav){
  if(grid[i][j+grav]>0){
    return false;
  }
  return true;
}
