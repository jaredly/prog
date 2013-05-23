/*** 3d functions ***/

function dz(x,z){return x*(1/(z+1));}//Math.pow(1.5,-z+1)
function dp(x,y,z){
    return [c[0]+dz(x-c[0],z),c[1]+dz(y-c[1],z)];
}

function draw_circle(x,y,z,sz,line){
    var p = dp(c[0]+x,c[1]+y,z);
    ctx.beginPath();
    ctx.arc(p[0],p[1],dz(sz,z),0,Math.PI*2,true);
    ctx.fill();
    if (line){
        ctx.strokeStyle='black';
        ctx.beginPath();
        ctx.arc(p[0],p[1],dz(sz,z),0,Math.PI*2,true);
        ctx.stroke();
    }
}

var c = [200,200];
var horiz = 0;
var vert = 0;
var size = 120;

function draw_lines(){ctx.lineWidth=3.0;
    if (state[4]){ctx.globalAlpha = 1.0;
        for (var i=0;i<lines.length;i++){
            if (state[i]!=1)continue;
            for (var e=0;e<lines[i].length;e++){
                var [[x,y,z],[a,b,d]] = lines[i][e];
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
        }
    }ctx.lineWidth=1.0;
}
function draw_matrix(matrix){
    var all = [];
    if (frame == 0 || frame==2){
    for (var z=0;z<3;z++){
    for (var y=0;y<4;y++){
    for (var x=0;x<4;x++){
        var alpha = (show[0]!=-1 && show[0]!=x) || (show[1]!=-1 && show[1]!=y) || (show[2]!=-1 && show[2]!=z);
        var [nx,nz] = rot_around([x-1.5,z-1],[0,0],horiz);
        var [ny,nz] = rot_around([y-1.5,nz],[0,0],vert);
        all.push([nz,nx,ny,matrix[z][y][x],alpha]);
    }}}
    all = all.sort(function(a,b){return a[0]-b[0];}).reverse();
    for (var i=0;i<all.length;i++){
        var [z,x,y,c,a] = all[i];
            /**ctx.fillStyle = 'rgb('+c*255/3+','+c*255/3+','+c*255/3+')';
            ctx.globalAlpha = 1;
            draw_circle(x*40,y*40,z/5+1,10);**/
        if (state[c] == -1)
            continue;
        else if (state[c] == 0){
            ctx.fillStyle = 'black';
            ctx.globalAlpha = 0.5;
            if (a)ctx.globalAlpha = .1;
            draw_circle(all[i][1]*size,all[i][2]*size,(all[i][0]/5+1),6);
        }else{
            ctx.fillStyle = colors[c];
            ctx.globalAlpha = 1;
            if (a)ctx.globalAlpha = .1;
            draw_circle(all[i][1]*size,all[i][2]*size,(all[i][0]/5+1),30,true);
        }
    }
    }
    if (frame==1 || frame==2){
    draw_lines();
    }
    vert += speed[1];
    horiz += speed[0];
}

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


var ctx,state,speed,show,running,colors,lines,frame;

function load(){
    var canv = $('screen');
    ctx = canv.getContext('2d');
    var cpos = findPos(canv);
    state = [0,0,0,0,1];
    show = [-1,-1,-1];
    running = true;
    speed = [0,0];
    colors = ['red','orange','yellow','black'];
    lines = [];
    frame = 0; // 0=solid, 1=wire, 2=both;
    
    var one = square(0,1,3,2).concat(square(0,2,2,1)).concat([[0,3,0]]);
    var two = square(1,0,3,3,1,2,0).concat(square(2,0,2,2,1,2,0)).concat([[1,3,0]]);
    var three = square(0,0,3,0,0,2,1).concat(square(0,0,2,1,0,2,1)).concat([[0,2,0]]);
    
    lines.push( [[[0,1,2],[0,3,2]],[[0,1,2],[0,3,0]],[[0,1,2],[2,1,2]],[[2,1,2],[2,3,2]],[[2,3,2],[0,3,2]],[[2,3,2],[0,3,0]],[[0,3,2],[0,3,0]],[[2,1,2],[0,3,0]]] );
    lines.push( [[[3,3,0],[1,3,0]],[[1,3,0],[3,3,2]],[[3,3,0],[3,1,0]],[[3,1,0],[3,1,2]],[[3,1,2],[3,3,2]],[[3,3,2],[3,3,0]],[[1,3,0],[3,1,0]],[[1,3,0],[3,1,2]]] );
    lines.push( [[[0,0,2],[2,0,2]],[[2,0,2],[2,0,0]],[[2,0,0],[0,0,0]],[[0,0,0],[0,0,2]],[[0,0,0],[0,2,0]],[[0,2,0],[2,0,0]],[[0,2,0],[2,0,2]],[[0,2,0],[0,0,2]]] );
    lines.push( [[[3,0,0],[3,0,2]],[[3,0,2],[1,2,0]],[[1,2,0],[3,0,0]]] );
    
    
    var matrix = [];
    
    // initialize all to None
    for (var z=0;z<3;z++){matrix.push([])
    for (var y=0;y<4;y++){matrix[z].push([])
    for (var x=0;x<4;x++){
        matrix[z][y].push(3);
    }}}
    
    for (var i=0;i<one.length;i++){
        var [x,y,z] = one[i];
        matrix[z][y][x] = 0;
    }
    for (var i=0;i<two.length;i++){
        var [x,y,z] = two[i];
        matrix[z][y][x] = 1;
    }
    for (var i=0;i<three.length;i++){
        var [x,y,z] = three[i];
        matrix[z][y][x] = 2;
    }
    bt = 420;
    var checks = [];
    checks.push(CheckBox(canv,100,bt,[255,0,0],function(x){ // red
        if (x) state[0] = 1;
        else state[0] = 0;
    }));
    checks.push(CheckBox(canv,115,bt,[255,140,0],function(x){ // orange
        if (x) state[1] = 1;
        else state[1] = 0;
    }));
    checks.push(CheckBox(canv,130,bt,[255,255,0],function(x){ // yellow
        if (x) state[2] = 1;
        else state[2] = 0;
    }));
    checks.push(CheckBox(canv,145,bt,[50,50,50],function(x){ // black
        if (x) state[3] = 1;
        else state[3] = 0;
    }));
    
    var rx = [];
    rx.push(RadioBox(canv,100,bt+15,[100,100,100],function(x){ // black
        if (x) show[0] = 0;
        else show[0] = -1;
    },rx));
    rx.push(RadioBox(canv,115,bt+15,[100,100,100],function(x){ // black
        if (x) show[0] = 1;
        else show[0] = -1;
    },rx));
    rx.push(RadioBox(canv,130,bt+15,[100,100,100],function(x){ // black
        if (x) show[0] = 2;
        else show[0] = -1;
    },rx));
    rx.push(RadioBox(canv,145,bt+15,[100,100,100],function(x){ // black
        if (x) show[0] = 3;
        else show[0] = -1;
    },rx));
    
    var ry = [];
    ry.push(RadioBox(canv,160,bt,[200,200,200],function(x){ // black
        if (x) show[1] = 0;
        else show[1] = -1;
    },ry));
    ry.push(RadioBox(canv,160,bt+15,[200,200,200],function(x){ // black
        if (x) show[1] = 1;
        else show[1] = -1;
    },ry));
    ry.push(RadioBox(canv,160,bt+30,[200,200,200],function(x){ // black
        if (x) show[1] = 2;
        else show[1] = -1;
    },ry));
    ry.push(RadioBox(canv,145,bt+30,[200,200,200],function(x){ // black
        if (x) show[1] = 3;
        else show[1] = -1;
    },ry));
    
    var rz = [];
    rz.push(RadioBox(canv,100,bt+30,[100,100,100],function(x){ // black
        if (x) show[2] = 2;
        else show[2] = -1;
    },rz));
    rz.push(RadioBox(canv,115,bt+30,[100,100,100],function(x){ // black
        if (x) show[2] = 1;
        else show[2] = -1;
    },rz));
    rz.push(RadioBox(canv,130,bt+30,[100,100,100],function(x){ // black
        if (x) show[2] = 0;
        else show[2] = -1;
    },rz));
    
    var rw = [];
    rw.push(RadioBox(canv,85,bt,[100,100,100],function(x){ // black
        if (x) frame = 0;
    },rw));
    rw.push(RadioBox(canv,85,bt+15,[100,100,100],function(x){ // black
        if (x) frame = 1;
    },rw));
    rw.push(RadioBox(canv,85,bt+30,[100,100,100],function(x){ // black
        if (x) frame = 2;
    },rw));
    
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
    
    /** main loop function loop()**/
    (function(){
        ctx.clearRect(0,0,400,420);
        draw_matrix(matrix);
        for (var i=0;i<checks.length;i++)
            checks[i].draw(ctx);
        for (var i=0;i<rx.length;i++)
            rx[i].draw(ctx);
        for (var i=0;i<ry.length;i++)
            ry[i].draw(ctx);
        for (var i=0;i<rz.length;i++)
            rz[i].draw(ctx);
        for (var i=0;i<rw.length;i++)
            rw[i].draw(ctx);
        if (running)setTimeout(arguments.callee,33);
    })();
}

load();
