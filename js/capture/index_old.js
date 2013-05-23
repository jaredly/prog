
function polygon(ctx,pts){
    if (!pts || pts.length<2)return;
    ctx.moveTo(pts[0][0],pts[0][1]);
    [ctx.lineTo(x,y) for each([x,y] in pts.slice(1))];
}
var int = parseInt;
function Ship(color,pos){
    var that = Moveable(pos);
    that.color = color;
    that.theta = 0;
    that.pts = [pos];
    var mousedown = false;
    var ship_pts = [[-5,-5],[10,0],[-5,5]];
    var flame = [[-7,-3],[-10,-5],[-8,-1],[-11,0],[-8,1],[-10,5],[-7,3]];
    var flame2 = [[-5,-3],[-8,-5],[-6,-1],[-9,0],[-6,1],[-8,5],[-5,3]];
    
    that.draw = function(ctx){
        ctx.save();
        ctx.fillStyle = that.color;
        ctx.translate(that.pos[0],that.pos[1]);
        ctx.rotate(that.theta);
        ctx.beginPath();
        polygon(ctx,ship_pts);
        ctx.fill();
        if (mousedown){
            ctx.fillStyle = "orange";
            ctx.beginPath();
            polygon(ctx,flame);
            ctx.fill();
        }
        ctx.restore();
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(int(that.pts[0][0]),int(that.pts[0][1]));
        for each([x,y] in that.pts.slice(1)){
            ctx.lineTo(int(x),int(y));
            //console.log("pt:",x,y);
        }
        ctx.stroke()
    }
    that.step = function(){
        if (mousedown){
            that.theta = Math.atan2(mousedown[1]-that.pos[1],mousedown[0]-that.pos[0]);
            that.v = that.v.add(Vector(that.theta,.2));
            if (that.v.m>10)that.v.m=10;
        }
        that.update_pos();
        if (that.v.m || 1){
            that.pts.push(that.pos);
        }
        if (that.pos[0]<0)that.pos[0]=400;
        if (that.pos[1]<0)that.pos[1]=400;
        if (that.pos[0]>400)that.pos[0]=0;
        if (that.pos[1]>400)that.pos[1]=0;
    }
    that.event = function(e){
        if (e.type=="mousedown")
            mousedown = e.pos;
        else if (e.type=="mouseup")
            mousedown = false;
        else if (e.type=="mousemove"){
            that.theta = Math.atan2(e.pos[1]-that.pos[1],e.pos[0]-that.pos[0]);
            if (mousedown)mousedown = e.pos;
        }
    }
    return that;
}

function Flag(color,pos){
    var that = Moveable(pos);
    that.color = color;
    that.draw = function(ctx){
        ctx.fillStyle = that.color;
        ctx.beginPath();
        ctx.moveTo(that.pos[0],that.pos[1]);
        ctx.arc(that.pos[0],that.pos[1],20,0,Math.PI*2,true);
        ctx.fill();
    }
    return that;
}

function CaptureTheFlag(node){
    node = node||document.body.appendChild(cE("canv"));
    var that = Game(node,[400,400]);
    that.fps = 40;
    that.initialize = function(){
        that.objects = [];
        that.objects.push(Ship("black",[100,100]));
        that.objects.push(Ship("red",[200,100]));
        that.objects.push(Ship("green",[200,200]));
        that.objects.push(Flag("green",[100,100]));
    }
    return that;
}

var CTF = CaptureTheFlag($("canv"));
CTF.run();