var myMain = null;
var canv = null'
var ctx = null;

canv=document.createElement("canvas")
canv.id="draw"
canv.width="300"
canv.height="300"
document.body.appendChild(canv)
ctx = canv.getContext("2d"); 
ctx.fillStyle = "rgb(255,255,255)"; 
ctx.fillRect (0, 0, 300, 300);

console.log('hi')
myMain=new Main();

a=document.getElementById("but")
if (!a){
    a=document.createElement("button")
    document.body.appendChild(a)
    a.id="but"
    a.innerHTML="New Bez"
}
a.innerHTML="New Bez"
a.onclick=function(){
    myMain.making=1;
}
a=document.getElementById("but2")
if (!a){
    a=document.createElement("button")
    document.body.appendChild(a)
    a.id="but2"
    a.innerHTML="New Cub"
}
a.innerHTML="New Cub"
a.onclick=function(){
    myMain.making=2;
}

function press(evt){myMain.press(evt)}
function release(evt){myMain.release(evt)}
function move(evt){myMain.move(evt)}

canv.onmousedown=press
canv.onmouseup=release
canv.onmousemove=move


}



function circle(x,y,r,fill){
    ctx.beginPath();
    ctx.arc(x,y,r||6,0,Math.PI*2, 1);
    fill?ctx.fill():ctx.stroke();
    ctx.closePath()
}

function Circle(x,y,r){
    this.x=x;
    this.y=y;
    this.r=r;
    this.lcolor=[0,0,0]
    this.bgcolor=[255,255,255]
    this.lwidth=1
    this.moving=0;
    this.selected=0;
    function press(evt){
        var x=evt.layerX-canv.offsetLeft
        var y=evt.layerY-canv.offsetTop
        if (this.x-5<x & x<this.x+5 & this.y-5<y & y<this.y+5){
            this.moving=1;
            this.selected=1;
            return 1;
        }
        else if (this.x-this.r-5<x & x<this.x-this.r+5 & this.y-5<y & y<this.y+5){
            this.moving=2;
            this.selected=1;
            return 1;
        }
    }
    this.press=press;
    function release(evt){
        this.moving=0
    }
    this.release=release;
    function move(evt){
        if (this.moving==1){
            this.x=evt.layerX-canv.offsetLeft
            this.y=evt.layerY-canv.offsetTop
            return 1;
        }
        if (this.moving==2){
            this.r=evt.layerX-canv.offsetLeft-this.x
            return 1;
        }
        return 0;
    }
    this.move=move;
    function draw(cont){
        cont.lineStyle="rgb("+this.lcolor+')';
        cont.fillStyle="rgb("+this.bgcolor+')';
        circle(this.x,this.y,this.r,1);
        if (this.selected){
            cont.lineStyle="rgb(255,0,0)"
            circle(this.x,this.y)
            circle(this.x-this.r,this.y)
        }
    }
    this.draw=draw;
}


function Bez(x,y,a,b,c,d){
    this.x = x;
    this.y = y;
    this.a=a;
    this.b=b;
    this.c=c;
    this.d=d;
    this.moving=0;
    this.selected=1;
    function isOver(evt){
        if (!this.selected){return}
        var x=evt.layerX-canv.offsetLeft
        var y=evt.layerY-canv.offsetTop
        if (this.x-5<x & x<this.x+5 & this.y-5<y & y<this.y+5){
            return 1;
        }
        else if (this.a-5<x & x<this.a+5 & this.b-5<y & y<this.b+5){
            return 1;
        }
        else if (this.c-5<x & x<this.c+5 & this.d-5<y & y<this.d+5){
            return 1;
        }
    }
    this.isOver=isOver;
    function press(evt){
        var x=evt.layerX-canv.offsetLeft
        var y=evt.layerY-canv.offsetTop
        if (this.x-5<x & x<this.x+5 & this.y-5<y & y<this.y+5){
            this.moving=1;
            this.selected=1;
            return 1;
        }
        else if (this.a-5<x & x<this.a+5 & this.b-5<y & y<this.b+5){
            this.moving=2;
            this.selected=1;
            return 1;
        }
        else if (this.c-5<x & x<this.c+5 & this.d-5<y & y<this.d+5){
            this.moving=3;
            this.selected=1;
            return 1;
        }
        this.selected=0;
    }
    this.press=press;
    function release(evt){
        this.moving=0
    }
    this.release=release;
    function move(evt){
        if (this.moving==1){
            this.x=evt.layerX-canv.offsetLeft
            this.y=evt.layerY-canv.offsetTop
            return 1;
        }
        if (this.moving==2){
            this.a=evt.layerX-canv.offsetLeft
            this.b=evt.layerY-canv.offsetTop
            return 1;
        }
        if (this.moving==3){
            this.c=evt.layerX-canv.offsetLeft
            this.d=evt.layerY-canv.offsetTop
            return 1;
        }
        return 0;
    }
    this.move=move;
    function draw(cont){
        if (this.selected){
            cont.strokeStyle = "rgba(255,0,0,10)";
            cont.beginPath();
            cont.moveTo(this.x,this.y)
            cont.lineTo(this.a,this.b)
            cont.lineTo(this.c,this.d)
            cont.stroke()
            cont.strokeStyle = "rgb(0,0,200)";
            circle(this.x,this.y)
            circle(this.a,this.b)
            circle(this.c,this.d)
        }

        cont.strokeStyle = "rgb(0,0,0)";
        cont.beginPath();
        cont.moveTo(this.x,this.y);
        cont.quadraticCurveTo(this.a,this.b,this.c,this.d);
        cont.stroke();
    }
    this.draw=draw;
}

function Cub(x,y,a,b,c,d,e,f){
    this.x = x;
    this.y = y;
    this.a=a;
    this.b=b;
    this.c=c;
    this.d=d;
    this.e=e;
    this.f=f;
    this.moving=0;
    this.selected=1;
    function isOver(evt){
        var x=evt.layerX-canv.offsetLeft
        var y=evt.layerY-canv.offsetTop
        if (!this.selected){return}
        if (this.x-5<x & x<this.x+5 & this.y-5<y & y<this.y+5){
            return 1;
        }
        else if (this.a-5<x & x<this.a+5 & this.b-5<y & y<this.b+5){
            return 1;
        }
        else if (this.c-5<x & x<this.c+5 & this.d-5<y & y<this.d+5){
            return 1;
        }
        else if (this.e-5<x & x<this.e+5 & this.f-5<y & y<this.f+5){
            return 1;
        }
    }
    this.isOver=isOver;
    function press(evt,out){
        var x=evt.layerX-canv.offsetLeft
        var y=evt.layerY-canv.offsetTop
        if (this.a-5<x & x<this.a+5 & this.b-5<y & y<this.b+5){
            this.moving=2;
            this.selected=1;
            if (!evt.ctrlKey){return 1;}
        }
        else if (this.c-5<x & x<this.c+5 & this.d-5<y & y<this.d+5){
            this.moving=3;
            this.selected=1;
            if (!evt.ctrlKey){return 1;}
        }
        else if (this.x-5<x & x<this.x+5 & this.y-5<y & y<this.y+5){
            this.moving=1;
            this.selected=1;
            if (!evt.ctrlKey){return 1;}
        }
        else if (this.e-5<x & x<this.e+5 & this.f-5<y & y<this.f+5){
            this.moving=4;
            this.selected=1;
            if (!evt.ctrlKey){return 1;}
        }
        this.selected=0;
    }
    this.press=press;
    function release(evt){
        this.moving=0
    }
    this.release=release;
    function move(evt){
        var x=evt.layerX-canv.offsetLeft
        var y=evt.layerY-canv.offsetTop
        if (this.moving==1){
            this.a-=this.x-x;
            this.b-=this.y-y
            this.x=x
            this.y=y
            return 1;
        }
        if (this.moving==2){
            this.a=evt.layerX-canv.offsetLeft
            this.b=evt.layerY-canv.offsetTop
            return 1;
        }
        if (this.moving==3){
            this.c=evt.layerX-canv.offsetLeft
            this.d=evt.layerY-canv.offsetTop
            return 1;
        }
        if (this.moving==4){
            this.c-=this.e-x;
            this.d-=this.f-y
            this.e=x
            this.f=y
            return 1;
        }
        return 0;
    }
    this.move=move;
    function draw(cont){
        if (this.selected){
            cont.strokeStyle = "rgba(255,0,0,10)";
            cont.beginPath();
            cont.moveTo(this.x,this.y)
            cont.lineTo(this.a,this.b)
            cont.moveTo(this.e,this.f)
            cont.lineTo(this.c,this.d)
            cont.stroke()
            cont.strokeStyle = "rgb(0,0,200)";
            circle(this.x,this.y)
            circle(this.a,this.b)
            circle(this.c,this.d)
            circle(this.e,this.f)
        }
        cont.strokeStyle = "rgb(0,0,0)";
        cont.beginPath();
        cont.moveTo(this.x,this.y);
        cont.bezierCurveTo(this.a,this.b,this.c,this.d,this.e,this.f);
        cont.stroke();
    }
    this.draw=draw;
}






function Main()
{
    this.canv=document.getElementById("draw")
    this.cont = this.canv.getContext("2d"); 
    this.cont.fillStyle = "rgb(255,255,255)"; 
    this.cont.fillRect (0, 0, 300, 150);
    this.objects=Array();
    this.making=0;
    this.editing=1;
    function press(evt){
        if (!this.editing){
            return;
        }
        var x=evt.layerX-canv.offsetLeft
        var y=evt.layerY-canv.offsetTop
        if (this.making!=0){
            if (this.making==1){
                var newO = new Bez(x,y,x,y,x,y);
                newO.moving=1;
                this.objects.push(newO);
            }
            else if (this.making==2){
                var newO = new Cub(x,y,x,y,x,y,x,y)
                newO.moving=1;
                this.objects.push(newO);
            }
            this.making=0;
            return;
        }

        this.cont.fillStyle = "rgb(255,255,255)"; 
        this.cont.fillRect (0, 0, 300, 300);
        this.cont.strokeRect (0, 0, 300, 300);
        var out = 0;
        for (var i=0;i<this.objects.length;i++){
            if (!out){
               out = this.objects[i].press(evt);
            }else if (!evt.ctrlKey){this.objects[i].selected=0;}
            this.objects[i].draw(this.cont);
        }
    }
    this.press=press;

    function release(evt){
        if (!this.editing){
            return;
        }
        for (var i=0;i<this.objects.length;i++){
            this.objects[i].release(evt)
        }
    }
    this.release=release;

    function move(evt){
        if (!this.editing){
            return;
        }
        this.cont.fillStyle = "rgb(255,255,255)"; 
        this.cont.fillRect (0, 0, 300, 300);
        this.cont.strokeRect (0, 0, 300, 300);
        var over=0;
        for (var i=0;i<this.objects.length;i++){
            if (this.objects[i].isOver(evt)==1){over=1;}
            this.objects[i].move(evt)
            this.objects[i].draw(this.cont)
        }
        canv.style.cursor=over?"pointer":"auto";
    }
    this.move=move;
}



/*
myMain.cont.beginPath()
myMain.cont.fillStyle="blue"
var o1=myMain.objects[0]
var o2=myMain.objects[1]
var o3=myMain.objects[2]
myMain.cont.moveTo(o1.x,o1.y)
myMain.cont.quadraticCurveTo(o1.a,o1.b,o1.c,o1.d);
myMain.cont.quadraticCurveTo(o3.a,o3.b,o3.x,o3.y);
myMain.cont.lineTo(o2.e,o2.f);
myMain.cont.bezierCurveTo(o2.c,o2.d,o2.a,o2.b,o2.x,o2.y);
myMain.cont.fill()
*/


/*otherstuff

objs=myMain.objects
for (var i=0;i++;i<obj.length){
    bg=document.createElement('div');
    bg.innerHTML='['+i+'] '+objs[i].x+','+objs[i].y
    dv.appendChild(bg)
    bg2=document.createElement('div');
    var last=objs[i].e!=null?Array(objs[i].e,objs[i].f):Array(objs[i].c,objs[i].d)
    bg2.innerHTML='['+i+'] '+last[0]+','+last[1]
    bg.onmousemove=function(){
        myMain.cont.strokeStyle="red"
               circle(objs[i].x,objs[i].y)
    }
}
*/

console.log('hi')