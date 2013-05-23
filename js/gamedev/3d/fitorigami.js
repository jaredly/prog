/*** 3d functions ***/

var Three = Class([],{
    c:[200,200,0], // center
    hrot:0,
    vrot:0,
    size:120,
    pval:1,
    perspective:function(self,a,z){
        return a*(1/(z+1));
    },
    _rot:function(self,x,y,z){
        var [nx,nz] = rot_around([x,z],[0,0],d3.hrot);
        var [ny,nz] = rot_around([y,nz],[0,0],d3.vrot);
        return [nx,ny,nz/self.pval+1];
    },
    _3to2:function(self,x,y,z){
        var c = self.c;
        var [x,y,z] = self._rot(x,y,z);
        return [c[0] + self.perspective(x, z)*self.size, c[1]+self.perspective(y, z)*self.size];
    },
    draw_circle:function(self,ctx,x,y,z,size,line){
        var p = self._3to2(x,y,z);
        var [x,y,z] = self._rot(x,y,z);
        ctx.beginPath();
        ctx.arc(p[0],p[1],self.perspective(size*self.size,z),0,Math.PI*2,true);
        ctx.fill();
        if (line){
            ctx.strokeStyle = 'black';
            ctx.beginPath();
            ctx.arc(p[0],p[1],self.perspective(size*self.size,z),0,Math.PI*2,true);
            ctx.stroke();
        }
    },
});

var d3 = Three();

/** matrix factory function **/
function square(a,b,w,z,xp,yp,zp){
    if (xp==null)xp=0;
    if (yp==null)yp=1;
    if (zp==null)zp=2;
    var r = [];
    for (var x=a;x<a+w;x++){
    for (var y=b;y<b+w;y++){
        var pt = [0,0,0];
        pt[xp]=x;pt[yp]=y;pt[zp]=z;
        r.push(pt);
    }}
    return r;
}


function CheckBox(cv,x,y,c,fn){
    var that = {};
    var cpos = findPos(cv);
    that.checked = false;
    var changed = true;
    that.draw = function(ctx){
        if (!changed) return;
        changed = false;
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgb('+parseInt(c[0]/2)+','+parseInt(c[1]/2)+','+parseInt(c[2]/2)+')';
        ctx.fillRect(x,y,10,10);
        if (that.checked)
            ctx.fillStyle = 'rgb('+c[0]+','+c[1]+','+c[2]+')';
        else
            ctx.fillStyle = 'white';
        ctx.fillRect(x+2,y+2,6,6);
    }
    cv.addEventListener('mousedown',function(e){
        var [a,b] = ePos(e,cpos);
        if (x<=a && a<=x+10 && y<=b && b<=y+10){
            that.checked = !that.checked;
            changed = true;
            fn(that.checked);
        }
    },true);
    return that;
}
function RadioBox(cv,x,y,c,fn,rds){
    var that = {};
    var cpos = findPos(cv);
    that.checked = false;
    var changed = true;
    that.draw = function(ctx){
        if (!changed) return;
        changed = false;
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgb('+parseInt(c[0]/2)+','+parseInt(c[1]/2)+','+parseInt(c[2]/2)+')';
        ctx.fillRect(x,y,10,10);
        if (that.checked)
            ctx.fillStyle = 'rgb('+c[0]+','+c[1]+','+c[2]+')';
        else
            ctx.fillStyle = 'white';
        ctx.fillRect(x+2,y+2,6,6);
    }
    that.uncheck = function(){
        fn(false);
        changed = true;
        that.checked = false;
    }
    cv.addEventListener('mousedown',function(e){
        var [a,b] = ePos(e,cpos);
        if (x<=a && a<=x+10 && y<=b && b<=y+10){
            that.checked = !that.checked;
            changed = true;
            if (that.checked){
                for (var i=0;i<rds.length;i++){
                    if (rds[i]!=that)
                        rds[i].uncheck();
                }
            }
            fn(that.checked);
        }
    },true);
    return that;
}

function draw_tetra(dh,dv){
    var lines = [[[1,1,1],[-1,-1,1]],
        [[1,1,1],[-1,1,-1]],
        [[1,1,1],[1,-1,-1]],
        [[-1,-1,1],[-1,1,-1]],
        [[-1,-1,1],[1,-1,-1]],
        [[-1,1,-1],[1,-1,-1]]];
    var pts = [[1,1,1],[-1,-1,1],[-1,1,-1],[1,-1,-1]];
    d3.hrot+=dh;
    d3.vrot+=dv;
    /** draw lines **/
    for (var l=0;l<lines.length;l++){
        ctx.beginPath();
        var p1 = d3._3to2(lines[l][0][0],lines[l][0][1],lines[l][0][2]);
        var p2 = d3._3to2(lines[l][1][0],lines[l][1][1],lines[l][1][2]);
        ctx.moveTo(p1[0],p1[1]);
        ctx.lineTo(p2[0],p2[1]);
        ctx.stroke();
    }
    /** draw pts **/
    ctx.fillStyle = 'blue';
    for (var i=0;i<pts.length;i++){
        d3.draw_circle(ctx,pts[i][0],pts[i][1],pts[i][2],.1);
    }
    d3.hrot-=dh;
    d3.vrot-=dv;
}

var ctx,state,speed,show,running,colors,lines,frame;

d3.c=[400,400];
d3.size=250;

function load(){
    var canv = $('screen');
    ctx = canv.getContext('2d');
    var cpos = findPos(canv);
    var running  = true;
    var speed = [0,0];
    var sd = Math.PI/50;
    /** key handling for rotation **/
    document.addEventListener('keydown',function(e){
        if (e.keyCode == 37)
            speed[0] = -sd;
        else if (e.keyCode == 39)
            speed[0] = sd;
        else if (e.keyCode == 38){
            speed[1] = -sd;}//d3.pval+=1;}
        else if (e.keyCode == 40){
            speed[1] = sd;}//d3.pval-=1;}
    },true);
    
    document.addEventListener('keyup',function(e){
        if (e.keyCode == 37 && speed[0] == -sd)speed[0]=0;
        else if (e.keyCode == 39 && speed[0] == sd)speed[0]=0;
        else if (e.keyCode == 38 && speed[1] == -sd)speed[1]=0;
        else if (e.keyCode == 40 && speed[1] == sd)speed[1]=0;
    },true);
    
    /** mouse movement rotation **/
    var mdown = false;
    document.addEventListener('mousedown',function(e){
        mdown = ePos(e,cpos);
    },false);
    document.addEventListener('mouseup',function(e){
        mdown = false;
    },false);
    document.addEventListener('mousemove',function(e){
        if (mdown){
            var pos = ePos(e,cpos);
            d3.hrot -= (mdown[0]-pos[0])/100;
            d3.vrot -= (mdown[1]-pos[1])/100;
            mdown = pos;
        }
    },false);
    
        d3.pval = 3;
    /** main loop function loop()**/
    (function(){
        ctx.clearRect(0,0,700,720);
        var m=15;
        for (var i=0;i<m;i++){
            draw_tetra(Math.PI/m*i,0);
        }
        d3.hrot += speed[0];
        d3.vrot += speed[1];
        if (running)setTimeout(arguments.callee,33);
    })();
}

load();
