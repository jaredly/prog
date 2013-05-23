function HexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function HexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function HexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

function Hex2RGB(h){
    return [HexToR(h),HexToG(h),HexToB(h)];
}

function gradient_old(ctx,x,y,width,height,rgb1,rgb2,topleft){
    //var s=new Date().getTime()

    function drawLine(x,y,x1,y1,color){
        ctx.beginPath()
        ctx.moveTo(x,y)
        ctx.strokeStyle=color
        ctx.lineTo(x1,y1)
        ctx.stroke()
    }

    var rgb=rgb1||new Array(0,255,0);
    var rgb2=rgb2||new Array(255,0,0);
    for (i=0;i<3;i++){
        rgb[i]=parseInt(rgb[i])
        rgb2[i]=parseInt(rgb2[i])
    }
    var steps=(topleft?height:width)-1;
    var dr = (rgb2[0]-rgb[0])/steps;
    var dg = (rgb2[1]-rgb[1])/steps;
    var db = (rgb2[2]-rgb[2])/steps;

    for (var i=0;i<steps;i++){
        var rr="rgb("+parseInt(rgb[0])+","+parseInt(rgb[1])+","+parseInt(rgb[2])+")"
        var res=topleft?drawLine(x,y+i,x+width,y+i,rr):drawLine(x+i,y,x+i,y+height,rr)
        rgb[0]+=dr;
        rgb[1]+=dg;
        rgb[2]+=db;
    }
    var rr="rgb("+parseInt(rgb[0])+","+parseInt(rgb[1])+","+parseInt(rgb[2])+")"
    var res=topleft?drawLine(x,y+i,x+width,y+i,rr):drawLine(x+i,y,x+i,y+height,rr)
}

function gradient(ctx,x,y,width,height,color1,color2,topleft){
    var lingrad = ctx.createLinearGradient(0,0,0,30);
    lingrad.addColorStop(0, color1);
    lingrad.addColorStop(1, color2);
    ctx.fillStyle = lingrad;
    ctx.fillRect(x,y,width,height);
}



function fill(color){
    ctx.fillStyle=color||"white";
    ctx.fillRect(-1,-1,302,302)
}
// example gradient(ctx,100,100,200,200,new Array(0,0,0),new Array(255,255,255),1)