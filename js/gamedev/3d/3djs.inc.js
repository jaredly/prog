/*** 3d functions ***/

function dz(x,z){return x*(1/(z+1));}//Math.pow(1.5,-z+1)
function dp(x,y,z){
    return [c[0]+dz(x-c[0],z),c[1]+dz(y-c[1],z)];
}

function draw_circle(ctx,x,y,z,sz,line){
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

