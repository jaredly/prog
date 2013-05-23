
function polygon(ctx,pts){
    if (!pts || pts.length<2)return;
    ctx.moveTo(pts[0][0],pts[0][1]);
    [ctx.lineTo(x,y) for each([x,y] in pts.slice(1))];
}
var int = parseInt;
function Ship(parent,color,pos,keys){
    var that = Moveable(parent,pos);
    that.color = color;
    that.theta = 0;
    that.pts = [pos];
    that.keys = keys;
    var mousedown = false;
    var ship_pts = [[-5,-5],[10,0],[-5,5]];
    var flame = [[-6,-3],[-10,-5],[-8,-1],[-11,0],[-8,1],[-10,5],[-6,3]];
    var flame2 = [[-5,-3],[-8,-5],[-6,-1],[-9,0],[-6,1],[-8,5],[-5,3]];
    
    that.draw = function(ctx){
        ctx.save();
        ctx.fillStyle = that.color;
        ctx.translate(that.pos[0],that.pos[1]);
        ctx.rotate(that.theta);
        ctx.beginPath();
        polygon(ctx,ship_pts);
        ctx.fill();
        if (parent._handler.keys[that.keys[1]]){
            ctx.fillStyle = "orange";
            ctx.beginPath();
            polygon(ctx,flame);
            ctx.fill();
        }
        if (parent._handler.keys[that.keys[3]]){
            ctx.fillStyle = "blue";
            ctx.beginPath();
            polygon(ctx,flame);
            ctx.fill();
        }
        ctx.restore();
        /*ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(int(that.pts[0][0]),int(that.pts[0][1]));
        for each([x,y] in that.pts.slice(1)){
            ctx.lineTo(int(x),int(y));
            //console.log("pt:",x,y);
        }
        ctx.stroke()*/
    }
    that.step = function(){
        /*if (mousedown){
            that.theta = Math.atan2(mousedown[1]-that.pos[1],mousedown[0]-that.pos[0]);
            that.v = that.v.add(Vector(that.theta,.2));
            if (that.v.m>10)that.v.m=10;
        }
        if (that.v.m || 1){
            that.pts.push(that.pos);
        }*/
        var keys = parent._handler.keys;
        if (keys[that.keys[0]]){
            that.theta-=Math.PI/20;
        }
        if (keys[that.keys[2]]){
            that.theta+=Math.PI/20;
        }
        if (keys[that.keys[1]]){
            that.v = that.v.add(Vector(that.theta,.4));
        }
        if (keys[that.keys[3]]){
            that.v = that.v.add(Vector(that.theta,-.1));
        }
        that.update_pos();
        that.v.m*=.95
        that.limit_speed(6    );
        that.limit_pos(0,0,parent.size[0],parent.size[1]);
    }
    that.event = function(e){
        /*if (e.type=="mousedown")
            mousedown = e.pos;
        else if (e.type=="mouseup")
            mousedown = false;
        else if (e.type=="mousemove"){
            that.theta = Math.atan2(e.pos[1]-that.pos[1],e.pos[0]-that.pos[0]);
            if (mousedown)mousedown = e.pos;
        }
        if (e.type=="keydown"){
            alert(e.key);
        }*/
        if (e.type=="keydown" && e.key==that.keys[4]){
            that.shoot();
        }
    }
    that.shoot = function(){
        parent.objects.push(Shot(parent,that,that.pos,that.theta));
    }
    return that;
}

function arm(ar,m){for (var i=0,r=[];i<m;i++){r.push(ar);}return r;}

function morph_poly(pts,pos,ang){
    return map(function(x){return rot_around(x,pos,ang);},  map(function(x){return map(sum,x);}, map(zip,zip([pts,arm(pos,pts.length)]))))
}

function Shot(parent,ship,pos,theta){
    var that = Moveable(parent,pos.slice());
    that.v = Vector(theta,10);
    that.draw = function(ctx){
        ctx.save();
        ctx.strokeStyle = "orange";
        ctx.lineWidth=2;
        //ctx.translate(that.pos[0],that.pos[1]);
        //ctx.rotate(theta);
        ctx.beginPath();
        polygon(ctx,morph_poly([[0,0],[5,0]],that.pos,theta));
        ctx.stroke();
        ctx.restore();
    }
    that.step = function(){
        that.update_pos();
        that.loop_pos();
        for each(a in parent.asteroids){
            if (a.collide_with(morph_poly([[0,0],[5,0]],that.pos,theta))){
                a.explode();
            }
        }
    }
    setTimeout(that.remove,3000);
    return that;
}

//var asteroid = [[10,10],[0,5],[-10,10],[-5,0],[-10,-10],[0,-5],[10,-10],[5,0],[10,10]]

function make_asteroid(size){
    var npt = int(Math.random()*10)+10;
    var pts = [];
    for (var i=0;i<npt;i++){
        pts.push(rot_around([int(Math.random()*size/2+size/2),0],[0,0],Math.PI*2/npt*i));
    }
    pts.push(pts[0]);
    pts.push(pts[1]);
    return pts;
}

function Asteroid(parent,size,pos){
    var that = Moveable(parent,pos);
    that.v = Vector(Math.random()*Math.PI*2,Math.random()*4+1);
    var theta = 0;
    var dt = Math.random()*Math.PI/40-Math.PI/20;
    var asteroid = make_asteroid(60*size);
    that.draw = function(ctx){
        ctx.save();
        //ctx.translate(that.pos[0],that.pos[1]);
        //ctx.rotate(theta);
        
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.beginPath();
        polygon(ctx,morph_poly(asteroid,that.pos,theta));
        ctx.stroke();
        ctx.restore();
    }
    that.step = function(){
        theta+=dt;
        that.update_pos();
        that.loop_pos();
    }
    that.collide_with = function(other){
        var mine = morph_poly(asteroid,that.pos,theta);
        return poly2poly(mine,other);
    }
    that.explode = function(){
        remove(parent.objects,that);
        remove(parent.asteroids,that);
    }
    return that;
}

function Flag(parent,color,pos){
    var that = Moveable(parent,pos);
    that.color = color;
    that.attached = false;
    that.draw = function(ctx){
        if (that.attached){
            var c = "rgb("+int(255*that.dist_to(that.attached.pos)/50)+",155,155)"
            
            ctx.strokeStyle = "black";
            ctx.lineWidth=5-5*that.dist_to(that.attached.pos)/50;
            ctx.beginPath();
            ctx.moveTo(that.pos[0],that.pos[1]);
            ctx.lineTo(that.attached.pos[0],that.attached.pos[1]);
            ctx.stroke();
            ctx.lineWidth=1;
        }
        ctx.fillStyle = that.color;
        ctx.beginPath();
        ctx.moveTo(that.pos[0],that.pos[1]);
        ctx.arc(that.pos[0],that.pos[1],5,0,Math.PI*2,true);
        ctx.fill();
    }
    that.step = function(){
        if (that.attached){
            var dt = that.dist_to(that.attached.pos);
            if (dt>50){
                that.attached = false;
                return;
            }
            that.v = that.v.add(Vector(that.dir_to(that.attached.pos),dt/80));
        }else{
            for each(o in parent.objects){
                if (that==o)continue;
                if (that.dist_to(o.pos)<20){
                    that.attached = o;
                }
            }
        }
        that.update_pos();
        that.limit_pos();
        that.v.m*=.9;
    }
    return that;
}

function Onsteroids(node){
    node = node||document.body.appendChild(cE("canv"));
    var that = Game(node,[800,500]);
    that.fps = 40;
    that.initialize = function(){
        that.objects = [];
        that.asteroids = [];
        //that.objects.push(Flag(that,"orange",[200,100]));
        that.objects.push(Asteroid(that,1,[200,100]));
        that.asteroids.push(that.objects[0]);
        that.objects.push(Ship(that,"black",[100,100],[KEYS.left,KEYS.up,KEYS.right,KEYS.down,KEYS.insert]));
        that.objects.push(Ship(that,"red",[200,100],[KEYS.a,KEYS.w,KEYS.d,KEYS.s,KEYS.e]));
        that.objects.push(Ship(that,"green",[200,200],[KEYS.j,KEYS.i,KEYS.l,KEYS.k,KEYS.o]));
        that.objects[0].attached = that.objects[2];
    }
    return that;
}

var OS = Onsteroids($("canv"));
OS.run();