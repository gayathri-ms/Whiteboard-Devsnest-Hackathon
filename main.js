// Getting the canvas
const board = document.getElementById('canvas');
board.height = window.innerHeight - 10;
board.width = window.innerWidth - 20;
const ctx = board.getContext('2d');
ctx.lineJoin = "round";
ctx.lineCap = "round";
let active = "";
let color = "";
let working = false;
// let x_initial, y_initial;
let flag = 0;
var undoStack = [];
// var redoStack = [];
var index=-1;
var r_index=-1;
var pen_style;
var x;
var x1,y1,x2,y2;
let painting=false;
var button=0;
var i=0

// Pencil Input........
const pencil = document.querySelector('.slider-pencil');
// Thickness of pencil
ctx.lineWidth = pencil.value;
let pencilWidth = pencil.value;

// Updating the thickness of the pencil on changing pencil input slider
pencil.oninput = () => {
    pencilWidth = pencil.value;
    if (x!== 'eraser') {
        ctx.lineWidth = pencil.value;
    }
}


const theme = document.querySelector("#theme");

theme.addEventListener('click', () => {
    
    theme.classList.toggle("fa-sun");
    theme.classList.toggle("fa-moon");

    if (theme.classList.contains("fa-moon")) 
    {
        console.log("the me"+theme);
        document.getElementById("canvas").classList.remove("dark1");
        document.getElementById("canvas").classList.add("light");
    
    }
    else
    {
        console.log("the me light"+theme);
        document.getElementById("canvas").classList.remove("light");
        document.getElementById("canvas").classList.add("dark1");

    }
        // document.body.classList.toggle("fa-sun");
})
    // Eraser Input.......
const eraser = document.querySelector('.slider-eraser');
// Thickness of eraser
ctx.lineWidth = eraser.value;
let eraserWidth = eraser.value;

// Updating the thickness of the eraser on changing eraser input silder
eraser.oninput = () => {
    eraserWidth = eraser.value;
    if (x === 'eraser') {
        ctx.lineWidth = eraser.value;
    }
}

// Changing the strokestyle color
document.querySelector('.dropdown-content').addEventListener('click', (e) => {
    console.log(e.target.parentElement.getAttribute('value'));
    ctx.strokeStyle = e.target.parentElement.getAttribute('value');
    pen_style=ctx.strokeStyle
})

function start(e)
{
    painting=true;
    const DOMRect = board.getBoundingClientRect();
    x1 = e.clientX;
    y1= e.clientY ;
}

function draw(e)
{
    if(!painting)
        return;

    x2=e.clientX;
    y2=e.clientY;
    
    if(x==="random" || x==="eraser")
    {
        ctx.lineCap="round";
        const DOMRect = board.getBoundingClientRect();
        ctx.moveTo(x1,y1);
        ctx.lineTo(e.clientX- DOMRect.left,e.clientY- DOMRect.top);
        ctx.stroke();
        x1=e.clientX- DOMRect.left;
        y1=e.clientY- DOMRect.top;
    }

}

function stop(e,y){
    if(painting==false)
        return;
    
    painting=false;
    const DOMRect = board.getBoundingClientRect();
    ctx.lineWidth = pencil.value;
  
    x2=e.clientX;
    y2=e.clientY;
    ctx.beginPath();
    
    if(y==="square")
    {
        ctx.moveTo(x1,y1);
        var a = Math.min(x2,  x1),
        b = Math.min(y2,y1),
        c = Math.abs(x2-x1),
        d = Math.abs(y2-y1);
        ctx.strokeRect(a,b,c,d);
    }
    else if(y==="triangle")
    {
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x1,y2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x1,y2);
        ctx.lineTo(x2,y2);
        ctx.stroke();
        ctx.beginPath();
    }
    else if(y==="circle")
    {
        ctx.beginPath();
        ctx.lineWidth = pencil.value;
        ctx.lineCap="round";
        var x_center=(x2+x1)/2;
        var y_center=(y2+y1)/2;
        const r=Math.pow(Math.pow(x2-x1,2)+Math.pow(y2-y1,2),0.5)/2;
        ctx.moveTo(x_center+r,y_center);
        ctx.arc(x_center,y_center,r,0,Math.PI*2);
        ctx.stroke();
    }
    else if(y==="line")
    {
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.stroke();
    }
    else if(y==="heart")
    {
        var x = x1;
        var y = y1;
        var width = Math.abs(x2-x1) ;
        var height = Math.abs(y2-y1);
        ctx.save();
        ctx.beginPath();
        var topCurveHeight = height * 0.3;
        ctx.moveTo(x, y + topCurveHeight);
        // top left curve
        ctx.bezierCurveTo(
          x, y, 
          x - width / 2, y, 
          x - width / 2, y + topCurveHeight
        );
      
        // bottom left curve
        ctx.bezierCurveTo(
          x - width / 2, y + (height + topCurveHeight) / 2, 
          x, y + (height + topCurveHeight) / 2, 
          x, y + height
        );
      
        // bottom right curve
        ctx.bezierCurveTo(
          x, y + (height + topCurveHeight) / 2, 
          x + width / 2, y + (height + topCurveHeight) / 2, 
          x + width / 2, y + topCurveHeight
        );
      
        // top right curve
        ctx.bezierCurveTo(
          x + width / 2, y, 
          x, y, 
          x, y + topCurveHeight
        );
        ctx.stroke();
    }
  
    if( e.type!=="mouseout"){
        undoStack.push(ctx.getImageData(0,0,board.width,board.height));
        index+=1;
    }
    
}

function triangles(){
    button+=1;
    x="triangle";
    ctx.strokeStyle=pen_style;
    ctx.lineWidth = pencil.width;
    board.addEventListener("mousedown",start);
    board.addEventListener("mouseup",(e)=>stop(e,x));

}
function square(){
    button+=1;
    x="square";
    ctx.strokeStyle=pen_style;
    ctx.lineWidth = pencil.width;
    board.addEventListener("mousedown",start);
    board.addEventListener("mouseup",(e)=>stop(e,x));
}
function circle(){
    button+=1;
    x="circle";
    ctx.strokeStyle=pen_style;
    ctx.lineWidth = pencil.width;
    board.addEventListener("mousedown",start);
    board.addEventListener("mouseup",(e)=>stop(e,x));
}
function line(){
    undoStack.pop();
    button+=1;
    x="line";
    ctx.strokeStyle=pen_style;
    ctx.lineWidth = pencil.width;
    board.addEventListener("mousedown",start);
    board.addEventListener("mouseup",(e)=>stop(e,x));
}
function random(){
    console.log("rand undo"+undoStack.length);
    undoStack.pop();
    button+=1;
    console.log("rbut"+button);
    x="random";
    ctx.strokeStyle=pen_style;
    ctx.lineWidth = pencil.width;
    board.addEventListener("mousedown",start);
    board.addEventListener("mousemove",draw) ;
    board.addEventListener("mouseup",(e)=>stop(e,x));
   
}
var color3="";
var ctheme;
function eraser1(e){
    console.log("err undo"+undoStack.length);
    undoStack.pop();
    x="eraser";
    if ( document.getElementById("canvas").classList.contains("light")) 
    {
        ctheme=document.querySelector(".light");
        color3=window.getComputedStyle(ctheme).backgroundColor;
    }
    else if( document.getElementById("canvas").classList.contains("dark1"))
        {
             ctheme=document.querySelector(".dark1");
            color3=window.getComputedStyle(ctheme).backgroundColor;
        }
    ctx.lineWidth =  eraser.value;
    ctx.strokeStyle=color3;
    board.addEventListener("mousedown",start);
    board.addEventListener("mousemove",draw) ;
    board.addEventListener("mouseup",(e)=>stop(e,x));

   
}

function drawHeart(e) {
    button+=1;
    x="heart";
    ctx.strokeStyle=pen_style;
    ctx.lineWidth = pencil.width;
    board.addEventListener("mousedown",start);
    //  board.addEventListener("mousemove",draw) 
    board.addEventListener("mouseup",(e)=>stop(e,x));

    
}

document.querySelector('.dropdown1-content .fa-square').addEventListener('click',square);

document.querySelector(' .fa-circle').addEventListener('click',circle);
document.querySelector(' .fa-play').addEventListener('click',triangles);



document.querySelector('.fa-marker').addEventListener('click',random);
document.querySelector('.fa-eraser').addEventListener('click',eraser1 );



//document.querySelector('.fa-eraser').addEventListener('click',eraser1)
document.querySelector('.fa-heart').addEventListener('click',drawHeart);
document.querySelector('.line').addEventListener('click',line);

// document.querySelector('.fa-eraser').addEventListener('click',random)
function clear_cvs(){
    ctx.clearRect(0,0,board.width,board.height);
    undoStack=[];
    index=-1;
}
function undo(){
   if(index>0){
    index-=1;
     let d= undoStack.pop();
     // redoStack.push(d)
       ctx.putImageData(undoStack[index],0,0);
       r_index+=1;
      
   }
   else {
       clear_cvs();

   }
}

// function redo(){
//     if(index<=0)
//     {
//         undoStack.push(redoStack.pop())
//         index+=1
//         r_index-=1
//     }
//     if(r_index>1 && index>0){  
//         r_index-=1
//         console.log("redo me hu")
    
//         let d=redoStack.pop()
//         ctx.putImageData(redoStack[r_index],0,0)
//         undoStack.push(d)
//         console.log(redoStack[r_index])
//         index+=1
//     }
// }

document.querySelector(".undo").addEventListener("click",undo);
// document.querySelector(".redo").addEventListener("click",redo)

// Clear All
document.querySelector('.fa-trash').addEventListener('click', clear_cvs);

// Sticky Note

const stickyNote = document.querySelector('.sticky-note');
const note = document.querySelector('.note-text');

// Displayig the sticky note on the screen
document.querySelector('.fa-sticky-note').addEventListener('click', () => {
    stickyNote.style.display = 'block';
    document.querySelector('.fa-sticky-note').classList.add('active');
});

// Minimizing and maximimzing the sticky note
document.querySelector('.min-note').addEventListener('click', () => {
    //Minimize
    console.log('note');
    if (note.style.display === 'block')
        note.style.display = 'none';
    //Maximize
    else if (note.style.display = 'none')
        note.style.display = 'block';
});

// Closing the sticky note
document.querySelector('.close-note').addEventListener('click', () => {
    stickyNote.style.display = 'none';
    note.value = '';
    document.querySelector('.fa-sticky-note').classList.remove('active');
});

// Moving the sticky note

let stickyX_inital, stickyY_initial;
let stickyPressed = false;

// When mouse is pressed down on sticky-note
document.querySelector('.sticky-note').addEventListener('mousedown', (e) => {
    stickyX_inital = e.clientX;
    stickyY_inital = e.clientY;
    stickyPressed = true;
});

// Handling the event of mousemove
document.querySelector('.sticky-note').addEventListener('mousemove', (e) => {
    if (stickyPressed === true) {
        const stickyX_final = e.clientX;
        const stickyY_final = e.clientY;
        const distX = stickyX_final - stickyX_inital;
        const distY = stickyY_final - stickyY_inital;
        const DOMRect = stickyNote.getBoundingClientRect();
        stickyNote.style.top = DOMRect.top + distY + 'px';
        stickyNote.style.left = DOMRect.left + distX + 'px';
        stickyX_inital = stickyX_final;
        stickyY_inital = stickyY_final;
    }
});

let imageX_inital, imageY_initial;
let imagePressed = false;


document.addEventListener('mouseup', () => {
    console.log('mouseup');
    stickyPressed = false;
});

// For Downloading
document.querySelector('.fa-download').addEventListener('click', () => {
    const el = document.createElement('a');
    el.href = board.toDataURL();
    console.log(el.href);
    el.download = 'image.png';
    el.click();
});

