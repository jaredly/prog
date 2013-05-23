
var t=0;
function draw_circles(ctx){
    var n = 5;
    ctx.fillStyle = 'blue';
    /*for (var i=0;i<n;i++){
        draw_line([0,i,2],[i,i+1,2]);
        //draw_circle(ctx,Math.sin(2*Math.PI/n*i+t)*100,Math.cos(2*Math.PI/n*i+t)*100,1+Math.sin(2*Math.PI/n*i+t),5);
    }*/
    for (var i=0;i<pts.length;i++){
        //var [x,y,z] = rot(pts[i]);
        draw_rect(ctx,rot(pts[i]),200,50);
    }
    horiz+=Math.PI/100;
}

function draw_rect(ctx,[x,y,z],w,h){
    var [x,y] = dp(c[0]+x*100,c[1]+y*100,z+7);
    w = dz(w,z+7);
    h = dz(h,z+7);
    ctx.fillRect(x-w/2,y-h/2,w,h);
}

var pts = [];

function makeit(){
    var height = 10;
    for (var y=-height/2;y<=height/2;y++){
        var by = height;//-(parseInt(height/2/Math.abs(y)))*(height/2);
        var off = Math.PI/by*y;
        for (var t=0;t<Math.PI*2;t+=Math.PI*2/by){
            var x = Math.sin(t+off)*Math.pow(height*height/4+1-y*y,.5) * 10/height;
            var z = Math.cos(t+off)*Math.pow(height*height/4+1-y*y,.5) * 10/height;
            pts.push([x,y*10/height,z]);
        }
    }
}
makeit();

function rot([x,y,z]){
    var [nx,nz] = rot_around([x,z],[0,0],horiz);
    var [ny,nz] = rot_around([y,nz],[0,0],vert);
    return [nx,ny,nz];
}


function draw_line([a,b,d],[x,y,z]){
    
    var [nx,nz] = rot_around([x-1.5,z-1],[0,0],horiz);
    var [ny,nz] = rot_around([y-1.5,nz],[0,0],vert);
    var [na,nd] = rot_around([a-1.5,d-1],[0,0],horiz);
    var [nb,nd] = rot_around([b-1.5,nd],[0,0],vert);
    var p1 = dp(c[0]+nx*size,c[1]+ny*size,nz/5+1);
    var p2 = dp(c[0]+na*size,c[1]+nb*size,nd/5+1);
    ctx.beginPath();
    ctx.moveTo(p1[0],p1[1]);
    ctx.lineTo(p2[0],p2[1]);
    ctx.stroke();
}

var ctx,state,speed,show,running,colors,lines,frame;

function load(){
    var canv = $('screen');
    ctx = canv.getContext('2d');
    var cpos = findPos(canv);
    
    running = true;
    speed = [0,0];
    
    
    var sd = Math.PI/50;
    /** key handling for rotation **/
    document.addEventListener('keydown',function(e){
        if (e.keyCode == 37)
            speed[0] = -sd;
        else if (e.keyCode == 39)
            speed[0] = sd;
        else if (e.keyCode == 38)
            speed[1] = -sd;
        else if (e.keyCode == 40)
            speed[1] = sd;
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
            horiz -= (mdown[0]-pos[0])/100;
            vert -= (mdown[1]-pos[1])/100;
            mdown = pos;
        }
    },false);
    running = true;
    /** main loop function loop()**/
    (function(){
        ctx.clearRect(0,0,800,420);
        draw_circles(ctx);
        setTimeout(arguments.callee,33);
    })();
}

load();
