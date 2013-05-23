var canv=document.getElementById("draw")
var ctx = canv.getContext("2d"); 
ctx.fillStyle = "rgb(255,255,255)"; 
ctx.fillRect (0, 0, 300, 150);

function circle(x,y){
    ctx.beginPath();
    ctx.arc(x,y,6,0,Math.PI*2, 1);
    ctx.stroke()
    ctx.closePath()
}


function Bez(x,y,a,b,c,d){
    this.x = x;
    this.y = y;
    this.a=a;
    this.b=b;
    this.c=c;
    this.d=d;
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
            circle(this.x,this.y)
            circle(this.a,this.b)
            circle(this.c,this.d)
        }
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
    this.selected=0;
    function press(evt,out){
        var x=evt.layerX-canv.offsetLeft
        var y=evt.layerY-canv.offsetTop
        if (this.x-5<x & x<this.x+5 & this.y-5<y & y<this.y+5){
            this.moving=1;
            this.selected=1;
            if (!evt.ctrlKey){return 1;}
        }
        else if (this.a-5<x & x<this.a+5 & this.b-5<y & y<this.b+5){
            this.moving=2;
            this.selected=1;
            if (!evt.ctrlKey){return 1;}
        }
        else if (this.c-5<x & x<this.c+5 & this.d-5<y & y<this.d+5){
            this.moving=3;
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
        if (this.moving==4){
            this.e=evt.layerX-canv.offsetLeft
            this.f=evt.layerY-canv.offsetTop
            return 1;
        }
        return 0;
    }
    this.move=move;
    function draw(cont){
        if (this.selected){
            circle(this.x,this.y)
            circle(this.a,this.b)
            circle(this.c,this.d)
            circle(this.e,this.f)
        }
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

    function press(evt){
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
        this.cont.fillRect (0, 0, 300, 150);
        this.cont.strokeRect (0, 0, 300, 150);
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
        for (var i=0;i<this.objects.length;i++){
            this.objects[i].release(evt)
        }
    }
    this.release=release;

    function move(evt){
        this.cont.fillStyle = "rgb(255,255,255)"; 
        this.cont.fillRect (0, 0, 300, 150);
        this.cont.strokeRect (0, 0, 300, 150);
        for (var i=0;i<this.objects.length;i++){
            this.objects[i].move(evt)
            this.objects[i].draw(this.cont)
        }
    }
    this.move=move;
}


myMain=new Main();

a=document.getElementById("but")
a.onclick=function(){
    myMain.making=1;
}
a=document.getElementById("but2")
a.innerHTML="New Cub"
if (!a){
    a=document.createElement("button")
    document.body.appendChild(a)
    a.id="but2"
    a.innerHTML="New Cub"
}
a.onclick=function(){
    myMain.making=2;
}



function press(evt){myMain.press(evt)}
function release(evt){myMain.release(evt)}
function move(evt){myMain.move(evt)}

canv.onmousedown=press
canv.onmouseup=release
canv.onmousemove=move
