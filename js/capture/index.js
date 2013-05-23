
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
    }
    that.step = function(){
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
        that.limit_speed(6);
        that.limit_pos(0,0,parent.size[0],parent.size[1]);
    }
    that.event = function(e){
        if (e.type=="keydown" && e.key==that.keys[4]){
            that.shoot();
        }
    }
    that.shoot = function(){
        parent.objects.push(Shot(parent,that,that.pos,that.theta));
    }
    return that;
}

function Shot(parent,ship,pos,theta){
    var that = Moveable(parent,pos.slice());
    that.v = Vector(theta,10);
    that.draw = function(ctx){
        ctx.save();
        ctx.strokeStyle = "blue";
        ctx.lineWidth=2;
        ctx.translate(that.pos[0],that.pos[1]);
        ctx.rotate(theta);
        ctx.beginPath();
        polygon(ctx,[[0,0],[5,0]]);
        ctx.stroke();
        ctx.restore();
    }
    setTimeout(that.remove,300);
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
            
            for each(o in parent.objects){
                if (that==o || o==that.attached)continue;
                if (that.dist_to(o.pos)<that.dist_to(that.attached.pos)){
                    that.attached = o;
                }
            }
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

function CaptureTheFlag(node){
    node = node||document.body.appendChild(cE("canv"));
    var that = Game(node,[800,500]);
    that.fps = 40;
    that.initialize = function(){
        that.objects = [];
        that.objects.push(Flag(that,"orange",[200,100]));
        that.objects.push(Ship(that,"black",[100,100],[KEYS.left,KEYS.up,KEYS.right,KEYS.down,KEYS.insert]));
        that.objects.push(Ship(that,"red",[200,100],[KEYS.a,KEYS.w,KEYS.d,KEYS.s,KEYS.e]));
        that.objects.push(Ship(that,"green",[200,200],[KEYS.j,KEYS.i,KEYS.l,KEYS.k,KEYS.o]));
        that.objects[0].attached = that.objects[2];
    }
    return that;
}

var CTF = CaptureTheFlag($("canv"));
CTF.run();