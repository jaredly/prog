
function $(e){return document.getElementById(e);}
function cE(e){return document.createElement(e);}
function cTN(e){return document.createTextNode(e);}

function circle(x,y,r,color){
    ctx.fillStyle = color;
    ctx.beginPath()
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.fill()
}
function line(x,y,a,b,color){
    ctx.strokeStyle=color;
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(a,b);
    ctx.stroke();
}
function rect(x,y,w,h,color){
    ctx.fillStyle=color;
    ctx.fillRect(x,y,w,h);
}
function AddVectors(v,t,v2,t2){
    vx = v*Math.cos(t);
    vy = v*Math.sin(t);
    vx += v2*Math.cos(t2);
    vy += v2*Math.sin(t2);
    return [Math.sqrt(vx*vx+vy*vy),Math.atan(vy/vx)+(vx<0?Math.PI:0)];
}


function NewForm(x,y,m,v,t){
    var that = $("planets").appendChild(cE("div"));
    that.appendChild(cTN("x:"));
    that.x = that.appendChild(cE("input"));
    that.x.value = x!=null?x:"";
    that.appendChild(cTN('y:'));
    that.y = that.appendChild(cE("input"));
    that.y.value = y!=null?y:"";
    that.appendChild(cTN('mass:'));
    that.mass = that.appendChild(cE("input"));
    that.mass.value = m!=null?m:"";
    that.appendChild(cTN('v:'));
    that.v = that.appendChild(cE("input"));
    that.v.value = v!=null?v:"";
    that.appendChild(cTN('theta:'));
    that.theta = that.appendChild(cE("input"));
    that.theta.value = t!=null?t:"";
    var cl = that.appendChild(cE("button"));
    cl.innerHTML = "delete";
    cl.onclick = function(){$('planets').removeChild(that);}
}


function sq(x){return x*x;}

function Planet(x,y,mass,v,t){
    var that = [];
    that.x = int(x);
    that.y = int(y);
    that.mass = int(mass);
    that.speed = [int(v),int(t)] || [0,0];
    
    that.calc = function(){
        var [v,t]=[0,0];
        var rvx = 0;
        var rvy = 0;
        
        for (var i=0;i<planets.length;i++){
            if (planets[i]==that) continue;
            var theta = Math.atan((that.y-planets[i].y)/(that.x-planets[i].x));
            if (that.x-planets[i].x>0){
                theta += Math.PI
            }
            
            var leng = Math.sqrt(sq(planets[i].x-that.x) + sq(planets[i].y-that.y));
            var force = 10*(that.mass*planets[i].mass)/sq(leng);
            
            [v,t] = AddVectors(v,t,force/that.mass,theta);
        }
        that.speed = AddVectors(v,t,that.speed[0],that.speed[1]);
    }
    that.draw = function(){
        that.x+=that.speed[0]*Math.cos(that.speed[1]);
        that.y+=that.speed[0]*Math.sin(that.speed[1]);
        
        circle(that.x,that.y,that.mass/10,"green");
    }
    
    return that;
}



var planets = [];

function lines(){
    for (var i=0;i<planets.length;i++){
        pds[i].line();
    }
}
function circles(){
    for (var i=0;i<planets.length;i++){
        planets[i].draw();
    }
}
function steps(){
    for (var i=0;i<planets.length;i++){
        pds[i].step();
    }
}
function calcs(){
    for (var i=0;i<planets.length;i++){
        planets[i].calc();
    }
}
var stepping = false;
var ctx = document.getElementById('canv').getContext('2d')
var tl = [0,0];
var scale = [1,1];
ctx.save();
ctx.translate(0,0);
ctx.scale(scale[0],scale[1]);
function center(){
    var t = 0;var l = 0;var r = 300;var b = 300;
    for (var i=0;i<planets.length;i++){ if(planets[i].y<t) t = planets[i].y;}
    for (var i=0;i<planets.length;i++){ if(planets[i].x<l) l = planets[i].x;}
    for (var i=0;i<planets.length;i++){ if(planets[i].y>b) b = planets[i].y;}
    for (var i=0;i<planets.length;i++){ if(planets[i].y>r) r = planets[i].x;}
    //tl = [t,l];
    var nscale = [300/(r-l),300/(b-t)]
    ctx.restore();
    ctx.translate(l-tl[1],t-tl[0]);
    tl=[t,l];
    ctx.scale(scale[0]/nscale[0],scale[1]/nscale[1]);
    scale=nscale;
}


function step(){
    if (!stepping) return
    ctx.clearRect(0,0,600,600);
    calcs();
    //steps();
    //lines();
    //center();
    circles();
    
    setTimeout(step,20);
}

function stop(){
    stepping = 0;
}

function int(e){return parseInt(e);}

function start(){
    var div = $('planets');
    planets = [];
    for (var i=0;i<div.childNodes.length;i++){
        var d = div.childNodes[i];
        planets.push(Planet(d.x.value,d.y.value,d.mass.value,d.v.value,int(d.theta.value)*Math.PI/180));
    }
    stepping = true;
    step();
}
NewForm(300,300,100,-6,0);
NewForm(300,200,100,4,270);
NewForm(150,150,150,0,0);