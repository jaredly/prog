var Shape = Class([],{
    __init__:function(self,parent,pts,color){
        self.pts = pts;
        self.parent = parent;
        self.color = color;
        self.connecteds = [];
    },
    draw:function(self,ctx,drawn){
        if (!drawn)drawn = [];
        if (drawn.indexOf(self)!=-1)return;
        if (!self.parent.wire){
            ctx.beginPath();
            ctx.fillStyle = 'white';
            ctx.moveTo(self.pts[0][0],self.pts[0][1]);
            for (var i=0;i<self.pts.length;i++){
                ctx.lineTo(self.pts[i][0],self.pts[i][1]);
            }
            ctx.lineTo(self.pts[0][0],self.pts[0][1]);
            ctx.fill();
        }
        ctx.beginPath();
        ctx.strokeStyle = self.color;
        ctx.moveTo(self.pts[0][0],self.pts[0][1]);
        for (var i=0;i<self.pts.length;i++){
            ctx.lineTo(self.pts[i][0],self.pts[i][1]);
        }
        ctx.lineTo(self.pts[0][0],self.pts[0][1]);
        ctx.stroke();
        drawn.push(self);
        for (var a=0;a<self.connecteds.length;a++)
            self.connecteds[a][1].draw(ctx,drawn);
    },
    fold:function(self,p1,p2,fromcon){
        var oneside = [];
        var otherside = [];
        var onside = 1;
        var onedir = null;
        var pts = self.pts.slice();
        var cl = [];
        pts.push(self.pts[0]);
        for (var i=0;i<pts.length;i++){
            var dt = angle_to(pts[i],pline2point(p1,p2,pts[i]));
            if (onedir===null)
                onedir=dt
            
            if (Math.abs(onedir-dt)<.5 && onside==2){
                if (vlog)dline(p1,p2,'red');
                if (vlog)dline(pts[i-1],pts[i],'red');
                if (tlog)console.log(p1,p2,pts[i-1],pts[i]);
                var cp = line2line(p1,p2,pts[i-1],pts[i],true);
                if (vlog)dpoint(cp,'yellow');
                if (tlog)console.log(cp);
                otherside.push(cp);
                oneside.push(cp);
                onside = 1;
                cl.push(cp);
            }else if (Math.abs(onedir-dt)>.5 && onside==1){
                if (vlog)dline(p1,p2,'blue');
                if (vlog)dline(pts[i-1],pts[i],'blue');
                if (tlog)console.log(p1,p2,pts[i-1],pts[i]);
                var cp = line2line(p1,p2,pts[i-1],pts[i],true);
                if (vlog)dpoint(cp,'yellow');
                if (tlog)console.log(cp);
                oneside.push(cp);
                otherside.push(cp);
                onside = 2;
                cl.push(cp);
            }
            if (i==pts.length-1)continue;
            if (Math.abs(onedir-dt)>.5)oneside.push(self.pts[i]);
            else otherside.push(self.pts[i]);
        }
        if (tlog)console.log(oneside,otherside);
        var ao = polyarea(oneside);
        var at = polyarea(otherside);
        
        if (typeof(fromcon)!='undefined'){
            if (Math.abs(onedir-fromcon)>.5){
                var t = oneside;
                oneside = otherside;
                otherside = t;
            }
        }else{
            if (at>ao){
                var t = oneside;
                oneside = otherside;
                otherside = t;
            }
        }
        self.pts = oneside;
        if (vlog)self.draw(ctx);
        for (var a=0;a<self.connecteds.length;a++){
            self.connecteds[a][1].fold(p1,p2,onedir);
        }
        for (var i=0;i<otherside.length;i++){
            otherside[i] = pointoverline(otherside[i],p1,p2);
        }
        self.connecteds.push([cp,Shape(self.parent,otherside,self.color)]);
    }
});

function polyPath(ctx,pts){
    ctx.moveTo(pts[0][0],pts[0][1]);
    for (var i=1;i<pts.length;i++)
        ctx.lineTo(pts[i][0],pts[i][1]);
    ctx.lineTo(pts[0][0],pts[0][1]);
}

var Shape = Class([],{
    __init__:function(self,parent,points,zI){
        self.parent = parent;
        self.points = points;
        self.zI = zI;
    },
    draw:function(self,ctx){
        ctx.fillStyle = 'white';
        ctx.lineStyle = 'black';
        ctx.beginPath();
        polyPath(ctx,self.points);
        ctx.fill();
        ctx.beginPath();
        polyPath(ctx,self.points);
        ctx.stroke();
    },
    fold:function(self,p1,p2,p3){
        var newshapes = [];
        var current = [self.points[0]];
        for (var i=1;i<self.points.length;i++){
            var np = line2line(self.points[i-1],self.points[i],p1,p2);
            if (np){
                current.push(np);
                newshapes.push(current);
                current = [np];
            }
            current.push(self.points[i]);
        }
        if (!newshapes)
            return;
        self.points = current.concat(newshapes[0]);
        var newShape = Shape(self.parent,newshapes[1]);/******work here*****/
    }
});


var OrigamiPaper = Class([],{
    __init__:function(self,canvas,size){
        size = size || 200;
        canvas.width = canvas.height = size + 80;
        //canvas.style.width = canvas.style.height = size + 80 + 'px';
        self.canv = canvas;
        self.cpos = findPos(canvas);
        self.size = size;
        self.ctx = canvas.getContext('2d');
        self.shapes = [];
        self.shapes.push(self.makePaper([40,40],size));
        //self.baseShape = Shape(self,[[40,40],[40+size,40],[40+size,40+size],[40,40+size]],'green');
        self.mdown = false;
        self.mpos = null;
        self.wire = false;
        self.register();
        self.draw();
    },
    makePaper:function(self,pos,size){
        return Shape(self,[[pos[0],pos[1]],[pos[0]+size,pos[1]],[pos[0]+size,pos[1]+size],[pos[0],pos[1]+size]],0);
    },
    draw:function(self){
        self.ctx.clearRect(0,0,self.size+80,self.size+80);
        self.baseShape.draw(self.ctx);
        if (self.mdown){
            self.ctx.beginPath();
            self.ctx.strokeStyle = 'black';
            self.ctx.moveTo(self.mdown[0],self.mdown[1]);
            self.ctx.lineTo(self.mpos[0],self.mpos[1]);
            self.ctx.stroke();
        }
        
    },
    event:function(self,e){
        if (!e)return;
        e.pos = ePos(e,self.cpos);
        if (e.type=='mousedown'){
            self.mdown = self.mpos = e.pos;
        }else if (e.type=='mouseup'){
            if (self.mdown){
                self.baseShape.fold(self.mdown,self.mpos);
            }
            self.mdown = false;
        }else if (e.type=='mousemove'){
            self.mpos = e.pos;
        }
        self.draw();
    },
    register:function(self){
        self.canv.addEventListener("mousedown",self.event,true);
        document.addEventListener("mouseup",self.event,true);
        document.addEventListener("mousemove",self.event,true);
        document.addEventListener("keydown",self.event,true);
        document.addEventListener("keyup",self.event,true);
    }
});

function dline(p1,p2,c){console.log(p1[0],p1[1],p2[0],p2[1],c);
    ctx.beginPath();
    ctx.strokeStyle = c;
    ctx.moveTo(p2[0],p2[1]);
    ctx.lineTo(p1[0],p1[1]);
    ctx.stroke();
}

function dpoint(p,c){
    ctx.fillStyle = c;
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(p[0],p[1],5,0,Math.PI*2,true);
    ctx.fill();
}

function polyarea(pts){
    if (!pts || pts==[] || !pts.length)return 0;
    var x = 0;
    var y = 0;
    for (var i=0;i<pts.length;i++){
        x+=pts[i][0];
        y+=pts[i][1];
    }
    x/=pts.length;
    y/=pts.length;
    var ta = 0;
    for (var i=0;i<pts.length-1;i++){
        ta += triarea([x,y],pts[i],pts[i+1]);
    }
    ta += triarea([x,y],pts[i],pts[0]);
    return ta;
}

function triarea(p1,p2,p3){
    return line2point(p1,p2,p3)*dst(p1,p2)/2;
}
var vlog = false;
var tlog = false;
/**var vlog = false;
var tlog = false;
var canv = $('screen');
var wire = false;
canv.width = 300;
canv.height = 300;
canv.style.width = '300px';
canv.style.height = '300px';
var ctx = canv.getContext('2d');
var baseShape = Shape([[20,20],[20,150],[150,150],[150,20]],'green');

baseShape.color='blue'
baseShape.fold([100,10],[10,100]);

tlog=true;
baseShape.fold([81,10],[85,160]);
baseShape.draw(ctx);**/
var op = OrigamiPaper($('screen'),200);
