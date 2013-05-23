function $(e){return document.getElementById(e);}
function cE(e){return document.createElement(e);}

function findPos(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		curleft = obj.offsetLeft
		curtop = obj.offsetTop
		while (obj = obj.offsetParent) {
			curleft += obj.offsetLeft
			curtop += obj.offsetTop
		}
	}
	return [curleft,curtop];
}


function mousePos(e) {
	var posx = 0;
	var posy = 0;
	if (!e) var e = window.event;
	if (e.pageX || e.pageY) 	{
		posx = e.pageX;
		posy = e.pageY;
	}
	else if (e.clientX || e.clientY) 	{
		posx = e.clientX + document.body.scrollLeft
			+ document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop;
	}
	return [posx,posy]
}

function i(ar,fn){
    for (var x=0;x<ar.length;x++){
        fn(ar[x]);
    }
}

function EventHandler(node){
    var that = {};
    that.evts = [];
    var npos = findPos(node);
    that.push = function(evt){
        that.evts.push(evt);
    }
    that.get = function(){
        var meta = that.evts;
        that.evts = [];
        return meta;
    }
    node.addEventListener("mousemove",function(e){
        var epos = mousePos(e);
        that.push({
            type:"mousemove",
            pos:[epos[0]-npos[0],epos[1]-npos[1]],
            
        })
    },false);
    node.addEventListener("mousedown",function(e){
        var epos = mousePos(e);
        that.push({
            type:"mousedown",
            pos:[epos[0]-npos[0],epos[1]-npos[1]],
            button:e.button
        })
    },false);
    node.addEventListener("mouseup",function(e){
        var epos = mousePos(e);
        that.push({
            type:"mouseup",
            pos:[epos[0]-npos[0],epos[1]-npos[1]],
            button:e.button
        })
    },false);
    return that;
}

function CaptureTheFlag(canv){
    var that = {};
    that.canv = canv||document.body.appendChild(cE("canvas"));
    that.ctx = that.canv.getContext('2d');
    that.objects = [];
    that.running = false;
    that._event = EventHandler(that.canv);
    that.canv.width=300;
    that.canv.height=300;
    that.fps = 40;
    that._looping = 0;
    
    // make the objects
    that.objects.push(Ship("black",[100,100]));
    that.objects.push(Flag("red",[200,200]));
    
    
    that.pass = function(what,a,b,c,d){
        i(that.objects,function(x){x[what](a,b,c,d);});
    }
    that.draw = function(){
        that.ctx.clearRect(0,0,300,300);
        that.pass("draw",that.ctx);
    }
    that.step = function(){
        that.pass('step');
    }
    that.event = function(){
        i(that._event.get(),function(x){that.pass("event",x);});
    }
    that.loop = function(){
        that.running = true;
        that._looping = setInterval(that._loop,1000/that.fps);
    }
    that._loop = function(){
        if (!that.running){clearInterval(that._looping);return;}
        that.step();
        that.event();
        that.draw();
    }
    return that;
}

function angleTo(x,y,a,b){
    dx = a-x
    dy = b-y
    if (!dx){
        if (dy>0)return Math.PI/2  //-Math.PI/2
        else return Math.PI*3/2  //-Math.PI/2
    }
    if (dx>0) return Math.atan(dy/dx)  //-Math.PI/2
    else return Math.atan(dy/dx) + Math.PI  // -Math.PI/2
}

function addVectors(v1,v2){
    var [a,b]=v1;
    var [c,d]=v2;
    var tx = a*Math.cos(b) + c*Math.cos(d);
    var ty = a*Math.sin(b) + c*Math.sin(d);
    var mag = Math.sqrt(tx*tx+ty*ty)
    var dir = angleTo(tx,ty,0,0);
    return [mag,dir + Math.PI]
}

function Ship(color,pos){
    var that = {};
    that.color = color;
    that.pos = pos.slice();
    that.theta = 0;
    that.v = [0,0];
    that.mousedown = false;
    var count = 0;
    var pts = [pos.slice()];
    var ship = [[-5,-5],[10,0],[-5,5]];
    var flame = [[-7,-3],[-10,-5],[-8,-1],[-11,0],[-8,1],[-10,5],[-7,3],[-5,-3],[-8,-5],[-6,-1],[-9,0],[-6,1],[-8,5],[-5,3]]
    
    that.draw = function (ctx){
        ctx.fillStyle = that.color;
        ctx.save();
        ctx.translate(that.pos[0],that.pos[1]);
        ctx.rotate(that.theta);
        ctx.beginPath();
        ctx.moveTo(-5,-5)
        ctx.lineTo(10,0);
        ctx.lineTo(-5,5);
//        ctx.moveTo(-5,-5);
  //      ctx.lineTo(5,-5);
    //    ctx.lineTo(0,10);
        ctx.fill();
        
        if (that.mousedown){
            ctx.fillStyle="orange";
            ctx.beginPath();
            //if (count>0){
            ctx.moveTo(-7,-3)
            ctx.lineTo(-10,-5)
            ctx.lineTo(-8,-1)
            ctx.lineTo(-11,0)
            ctx.lineTo(-8,1)
            ctx.lineTo(-10,5)
            ctx.lineTo(-7,3)
            //ctx.fill()
            //ctx.beginPath();
            /*}else{
            ctx.fillStyle="yellow";
            ctx.moveTo(-5,-3)
            ctx.lineTo(-8,-5)
            ctx.lineTo(-6,-1)
            ctx.lineTo(-9,0)
            ctx.lineTo(-6,1)
            ctx.lineTo(-8,5)
            ctx.lineTo(-5,3)
            }*/
            ctx.fill()
        }
        
        ctx.restore();
        ctx.beginPath();
        ctx.moveTo(pts[0][0],pts[0][1]);
        for (var i=1;i<pts.length;i++){
            ctx.lineTo(pts[i][0],pts[i][1]);
        }
        ctx.stroke();
    }
    that.step = function(){
        if (count>5)count=-5;
        else count+=1;
        if (that.mousedown){
            that.v = addVectors([.2,angleTo(that.pos[0],that.pos[1], that.mousedown[0],that.mousedown[1])],that.v);
            if (that.v[0]>15)that.v[0]=15;
            that.theta = angleTo(that.pos[0],that.pos[1],that.mousedown[0],that.mousedown[1]);
        }
        that.pos[0] += that.v[0]*Math.cos(that.v[1]);
        that.pos[1] += that.v[0]*Math.sin(that.v[1]);
        pts.push(that.pos.slice())
    }
    that.event = function(e){
        if (e.type=="mousemove"){
            that.theta = angleTo(that.pos[0],that.pos[1],e.pos[0],e.pos[1]);
            if (that.mousedown) that.mousedown = e.pos;
        }else if (e.type=="mousedown"){
            that.mousedown = e.pos;
        }else if (e.type=="mouseup"){
            that.mousedown = false;
        }
    }
    return that;
}

function Flag(color,pos){
    var that = {};
    that.color = color;
    that.pos = pos;
    that.draw = function (ctx){
        ctx.fillStyle = that.color;
        ctx.beginPath();
        ctx.moveTo(that.pos[0],that.pos[1]);
        ctx.arc(that.pos[0],that.pos[1],20,0,Math.PI*2,true);
        ctx.fill();
    }
    that.step = function(){}
    that.event = function(){}
    return that;
}


var game = CaptureTheFlag($("canv"));
game.loop();