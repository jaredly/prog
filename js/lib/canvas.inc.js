
var KEYS = {'right': '39', 'ctrl': '17', 'm': '77', 'l': '76', 'down': '40', 'tab': '9', 'escape': '27', 'home': '36', 'alt': '18', 'pause': '19', 'end': '35', 'z': '90', '1': '49', '0': '48', '3': '51', '2': '50', 'backspace': '8', 'pagedown': '34', '7': '55', '6': '54', '9': '57', '5': '53', '4': '52', 'v': '86', 'caps': '20', 'h': '72', '8': '56', 'a': '65', 'insert': '45', 'c': '67', 'b': '66', 'e': '69', 'd': '68', 'g': '71', 'f': '70', 'i': '73', 'shift': '16', 'k': '75', 'j': '74', 'pageup': '33', 'up': '38', 'o': '79', 'n': '78', 'q': '81', 'p': '80', 's': '83', 'r': '82', 'u': '85', 't': '84', 'w': '87', 'enter': '13', 'y': '89', 'x': '88', 'left': '37', 'delete': '46', 'space':32}


/******** General Functions *************/

//ieCanvasInit();
/*** made in dom.inc.js
function cE(e){return document.createElement(e);}
function $(e){return document.getElementById(e);}
function cTN(e){return document.createTextNode(e);}
if (typeof(console)=="undefined") console={log:function(){}};

function ePos(e){
    if (e.pageX)return [e.pageX,e.pageY];
    return [e.clientX + document.body.scrollLeft - document.body.clientLeft,
        e.clientY + document.body.scrollTop  - document.body.clientTop]
}
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
****/


/** game engine **/

function EventHandler(node){
    var that = {};
    that.evts = [];
    that.keys = {};
    var npos = findPos(node);
    that.push = function(evt){
        that.evts.push(evt);
    }
    that.get = function(){
        var meta = that.evts;
        that.evts = [];
        return meta;
    }
    document.addEventListener("keydown",function(e){
        that.push({
            type:"keydown",
            key:e.keyCode,
        })
        that.keys[e.keyCode]=true;
    },false);
    document.addEventListener("keyup",function(e){
        that.push({
            type:"keyup",
            key:e.keyCode,
        })
        that.keys[e.keyCode]=false;
    },false);
    document.body.addEventListener("mousemove",function(e){
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

function remove(ar,x){
    ar.splice(ar.indexOf(x),1);
}
function Sprite(parent,pos){
    var that = {};
    that.z = 1;
    that.pos = pos;
    that.dist_to = function(pos){
        var b =that.pos[1];
        var a = that.pos[0];
        return dst(pos[0],pos[1],that.pos[0],that.pos[1]);
    }
    that.dir_to = function(p1){
        var x = p1[0];
        var y = p1[1];
        var a = that.pos[0], b = that.pos[1];
        return Math.atan2(y-b,x-a);
    }
    that.angle_to = that.dir_to;
    that.remove = function(){
        remove(parent.objects,that);
    }
    that.step = function(){};
    that.collides_with = function(other){};
    that.event = function(e){};
    that.draw = function(ctx){};
    return that;
}

function Moveable(parent,pos,vel){
    var that = Sprite(parent,pos);
    vel = vel || [0,0];
    that.v = Vector(vel[0],vel[1]);
    that.update_pos = function(){
        that.pos[0]+=that.v.x();
        that.pos[1]+=that.v.y();
    };
    that.loop_pos = function(x,y,a,b){
        if (!(x||y||a||b)){
            var x=0,y=0,a=parent.size[0],b=parent.size[1];
        }
        if (that.pos[0]<x)that.pos[0]=a;
        if (that.pos[1]<y)that.pos[1]=b;
        if (that.pos[0]>a)that.pos[0]=x;
        if (that.pos[1]>b)that.pos[1]=y;
    }
    that.limit_pos = function(x,y,a,b){
        if (!(x||y||a||b)){
            var x=0,y=0,a=parent.size[0],b=parent.size[1];
        }
        if (that.pos[0]<x)that.pos[0]=x;
        if (that.pos[1]<y)that.pos[1]=y;
        if (that.pos[0]>a)that.pos[0]=a;
        if (that.pos[1]>b)that.pos[1]=b;
    }
    that.limit_speed = function(x){
        if (that.v.m>x)that.v.m=x;
        if (that.v.m<-x)that.v.m=-x;
    }
    that.step = function(){that.update_pos();};
    return that;
}

function Box(parent,pos,p1,v,c){
  var w = p1[0];
  var h = p1[1];
    var that = Moveable(parent,pos,v);
    that.shape = "box";
    that.w = w;
    that.h = h;
    that.color = c;
    that.r = 0;
    that.draw = function(ctx){
        ctx.fillStyle = c;
        ctx.beginPath();
        var pts = rot_rect(that.pos[0]-that.w/2,that.pos[1]-that.h/2,that.w,that.h,that.r);
        ctx.moveTo(pts[0][0],pts[0][1]);
        for (var i=1;i<pts.length;i++){
            ctx.lineTo(pts[i][0],pts[i][1]);
        }
        ctx.fill();
    }
    that.collides_with = function(other){
        if (other.shape=="box"){
            /************************work here ******************/
            return poly2poly(that.pts(),other.pts());
        }
    }
    that.pts = function(){
        return _rect2pts(that.pos[0],that.pos[1],that.w,that.h);
    }
    return that;
}

function Ball(parent,pos,r,v,c){
    var that = Moveable(parent,pos);
    that.shape = "circle";
    that.r = r;
    that.color = c;
    
    that.draw = function(ctx){
        ctx.fillStyle = that.color;
        //ctx.clearRect(0,0,800,800);
        ctx.fillStyle=that.color;
        ctx.beginPath();
        ctx.arc(that.pos[0],that.pos[1],that.r,0,Math.PI*2,true);
        ctx.fill();
    }
    return that;
}

function Vector(t,m){
    var that = {};
    that.t = t;
    that.m = m;
    that.x = function(){
        return Math.cos(that.t)*that.m;
    }
    that.y = function(){
        return Math.sin(that.t)*that.m;
    }
    that.pos = function(){
        return [that.x(),that.y()];
    }
    that.add = function(other){
        var tx = that.x()+other.x();
        var ty = that.y()+other.y();
        return Vector(Math.atan2(ty,tx),dst(0,0,tx,ty));
    }
    return that;
}

function Box_Body(pos,sz,mass,v,c){
    var that = Box(pos,sz,v,c);
    that.t = 0;
    that.a = Vector(0,0);
    that.mass = mass;
    //that.g = Vector(Math.PI/2,0.1);

    that.forces = [Vector(Math.PI/2,9.81*that.mass)];

    that.update_rot = function(){
        that.r+=that.t;
    }
    /*that.apply_force(t,m){
        m/=that.mass;
        that.a = that.a.add(
    }*/
    
    that.update_a = function(){
        var total = Vector(0,0);
        for (var i=0; i<that.forces.length; i++){
            total = total.add(that.forces[i]);
        }
        total.m/=that.mass;
        that.a = total;
    }
    
    that.update_v = function(time_lapse){
        that.a.m*=time_lapse;
        that.v = that.v.add(that.a);
    }
    that.step= function(time_lapse){
        //that.a = that.a.add(that.g);
        that.update_a();
        that.update_v(time_lapse);
        that.update_rot();
        that.update_pos();
    }
    return that;
}

function Static_Box(pos,sz,c){
    var that = Box(pos,sz,[0,0],c);
    that.r = 0;
    that.static = true;
    that.step = function(){};
}

function draw_polygon(ctx,pts){
    if (!pts || pts.length<2)return;
    ctx.moveTo(pts[0][0],pts[0][1]);
    [ctx.lineTo(x,y) for each([x,y] in pts.slice(1))];
}


function Game(node,size){
    var that = {};
    that.redraw = true;
    that.canvas = node;
    if (!size)size = [200,200];
    node.width = size[0];
    node.height = size[1];
    that.size = size;
    
    that._handler = EventHandler(node);
    that.ctx = node.getContext('2d');
    that.objects = [];
    that.fps = 10;
    that.runtimer = null;
    that.running = false;
    that.bgc = "white"
    
    that.initialize = function(){};
    that._event = function(e){
        that.event(e);
        [o.event(e) for each(o in that.objects)];
    }
    that.event = function(){};
    that.events = function(){
        [that._event(e) for each(e in that._handler.get())];
    }
    that.collide = function(){
        var collisions = [];
        
        [[(a.collides_with(b) && collisions.indexOf([b,a])==-1 && collisions.push([a,b])) for each (a in that.objects)] for each(b in that.objects)];
        for (var i=0;i<collisions.length;i++){
            
        }
    }
    that.step = function(){
        [o.step(1/that.fps) for each(o in that.objects)];
    }
    that.draw = function(){
        /*var aso = that.ctx.globalAlpha;
        that.ctx.globalAlpha = 0.3;
        that.ctx.fillStyle="white";
        that.ctx.fillRect(0,0,800,800);
        that.ctx.globalAlpha = aso;*/
        if (that.redraw){ // that.ctx.clearRect(0,0,800,800);
            that.ctx.fillStyle = that.bgc;
            that.ctx.fillRect(0,0,that.size[0],that.size[1]);
        }
        //that.draw(that.ctx);
        var zsorted = [[o.z,o] for each(o in that.objects)].sort();
        [o[1].draw(that.ctx) for each(o in zsorted)];
    }
    that.loop = function(){
        if (!that.running){
            clearInterval(that.runtimer);
            return;
        }
        that.events();
        that.collide();
        that.step();
        that.draw();
    }
    that.run = function(){
        that.running = true;
        that.initialize();
        that.runtimer = setInterval(that.loop,1000/that.fps);
    }
    return that;
}
