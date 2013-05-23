function $(e){return document.getElementById(e);}
var canv = $("precanv");
var img = $("preview");
var ctx = canv.getContext("2d");
var entry = $("entry");
var display = $("display");

var fonts = {"Liberation-Regular.svg":loadSync("Liberation-Regular.svg")}

var letters = fonts["Liberation-Regular.svg"];

function load(what){
    if (!fonts[what]){
        var imgd = document.body.appendChild(document.createElement("div"));
        imgd.className = "back";
        var img = imgd.appendChild(new Image())
        img.className = "bimg";
        img.src="images/loading.gif";
        img.style.left = window.innerWidth/2-img.offsetWidth/2+"px";
        img.style.top = window.innerHeight/2-img.offsetHeight/2+"px";
        
        loadFont("fonts/"+what,function(x){
            fonts[what] = x
            letters = fonts[what];
            reload();
            document.body.removeChild(imgd);
        })
        return;
        
        
    }else{
        letters = fonts[what];
    }
    reload();
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

function ePos(e){
    if (e.pageX)return [e.pageX,e.pageY];
    return [e.clientX + document.body.scrollLeft - document.body.clientLeft,
        e.clientY + document.body.scrollTop  - document.body.clientTop]
}

function rounded_rect(x,y,w,h,rx,ry){

    ctx.beginPath()
    ctx.moveTo(x,y+ry)
    ctx.quadraticCurveTo(x,y,x+rx,y)
    ctx.lineTo(x+w-rx,y)
    ctx.quadraticCurveTo(x+w,y,x+w,y+ry)
    ctx.lineTo(x+w,y+h-ry)
    ctx.quadraticCurveTo(x+w,y+h,x+w-rx,y+h)
    ctx.lineTo(rx,y+h)
    ctx.quadraticCurveTo(x,y+h,x,y+h-ry)
    ctx.lineTo(x,y+ry)
    ctx.fill()

}

function MakeButton(start,end,hlight,text,size,tcolor){
    var tsize = string_size( letters, size, text );
    var width = tsize[0]/10*3+tsize[0];
    var height = tsize[1]/5*3+tsize[1];
    canv.width=width;
    canv.height=height;

    var tenth = width/10;
    var twent = width/20;

    var a=ctx.createLinearGradient(0,0,0,height);
    a.addColorStop(0,start);
    a.addColorStop(1,end);
    ctx.fillStyle = a;
    rounded_rect(0,0,width,height,width/20,width/20);
    
    var a=ctx.createLinearGradient(0,width/80,0,height);
    a.addColorStop(0,"#ffffff");
    a.addColorStop(hlight,"rgba(255,255,255,0)");
    ctx.fillStyle = a;

    rounded_rect(width/60,width/60,width-width/30,height-width/30,width/30,width/30)
    
    ctx.fillStyle = tcolor||"black";

    draw_center(ctx, letters, size, text, width/2,height/2-height/20);
    img.src = canv.toDataURL("image/png")
}

MakeButton("#525a38","#8e9c61",.15,"Click Me",20,"#000")

function reload(){
    MakeButton($("c1").value, $("c2").value, .15, $("text").value, parseInt($("size").value), $("tcolor").value)
    
}

$("text").onblur = function(){
    reload()
}
$("tcolor").onblur = function(){
    reload()
    this.style.borderColor = this.value
}
$("c1").onblur = function(){
    reload()
    this.style.borderColor = this.value
}
$("c2").onblur = function(){
    reload()
    this.style.borderColor = this.value
}
$("size").onchange = function(){
    reload()
}
$("font").onchange = function(){
    load(this.value);
}
var posat = findPos($("sizer"));
var slider = $("slider");
slider.onmousedown = function(){this.moving = true;}
document.body.onmouseup = function(){slider.moving = false;}
document.body.addEventListener("mousemove", function(e){
    posat = findPos($("sizer"));
    if (slider.moving){
        var pos = ePos(e);
        if (posat[0]<pos[0]+6 && pos[0]+6<posat[0]+200){
            slider.style.left = pos[0]-6+"px";
            $("size").value = (pos[0]-posat[0]+6)/2;
            reload();
        }
    }
},false);

font=$("font");
fonts = eval(sendSync("list.cgi"));
for (var i=0;i<fonts.length;i++){
    o=font.appendChild(document.createElement("option"));
    o.value = fonts[i];
    o.innerHTML = fonts[i];
}
$("download").onclick = function(){
    document.location = $("preview").src
}

