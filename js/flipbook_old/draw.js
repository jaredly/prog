var down=0
var old=null;
var ctx=null;
var canv=null;
var linewidth=10;
var linecolor="black"
var under=null;
var pen="draw"
var playspeed=20
var slider=null;
var mouseunder=null;
var insertpos=0;
var exitbutton=null;
var selected=null;

function MouseUnder(can){
    this.Draw=Draw
    this.canv=can
    this.at=Array(0,0)
    this.canv.par=this
    this.cstyle=can.style
    this.ctx=this.canv.getContext('2d')
    this.canv.onmousedown=canv.onmousedown
    this.canv.onmouseup=canv.onmouseup
    this.canv.onmousemove=Move
    
    function Draw(){
        sz=slider.big;
        this.canv.width=sz
        this.canv.height=sz
        this.cstyle.left=this.at[0]-sz/2
        this.cstyle.top=this.at[1]-sz/2
        this.ctx.clearRect(0,0,sz,sz)
        if (pen=="draw"){
            this.ctx.fillStyle=linecolor
            this.ctx.beginPath()
            this.ctx.arc(sz/2, sz/2, sz/2, 0, Math.PI*2, true);
            this.ctx.fill()
        }
        else if (pen=="erase"){
            this.ctx.fillStyle="white"
            this.ctx.fillRect(0,0,sz,sz)
        }
    }

    function Move(e){
	var posx = 0;
	var posy = 0;
        cpos=findPos(canv)
	if (!e) var e = window.event;
	if (e.pageX || e.pageY) 	{
		posx = e.pageX;
		posy = e.pageY;
	}
	else if (e.clientX || e.clientY) 	{
		posx = e.clientX + document.body.scrollLeft
			+ document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop;
	}
        if (posx<cpos[0]||posx>cpos[0]+canv.offsetWidth|| posy<cpos[1]||posy>cpos[1]+canv.offsetHeight){
            this.style.visibility="hidden"
        }
        else{this.style.visibility="visible"}
        this.par.at=Array(posx,posy)
        this.par.Draw()
        document.onmousemove(e,1)
    }
}

function Slider(canv,size){
    this.big=size||10
    this.Draw=Draw;
    this.canv=canv;
    this.canv.par=this;
    this.Mouse=Mouse
    this.size=Array(this.canv.offsetWidth,this.canv.offsetHeight)
    this.ctx=this.canv.getContext('2d');
    this.canv.onmousedown=function(e){this.par.down=1;this.par.Mouse(e)};
    this.canv.onmouseup=function(){this.par.down=0;}
    this.canv.onmousemove=function(e){this.par.Mouse(e)};
    this.down=0;
    function Draw(){
        this.ctx.fillStyle="white"
        this.ctx.clearRect(0,0,this.size[0],this.size[1])
        this.ctx.beginPath()
        this.ctx.lineWidth=3;
        this.ctx.strokeStyle="black"
        this.ctx.moveTo(this.size[0]/20,this.size[1]/2)
        this.ctx.lineTo(this.size[0]/20*19,this.size[1]/2)
        this.ctx.stroke()
        this.ctx.beginPath()
        this.ctx.arc(this.big, this.size[1]/2, this.big/2, 0, Math.PI*2, true);
        this.ctx.fill()
    }
    function Mouse(e){
        if (!this.down){return}
        mouse=mousecoords(e);
        bg=mouse[0]-findPos(this.canv)[0]
        if (bg<0){bg=1}
        if (bg>this.size[0]){bg=this.size[1]}
        this.big=bg
        this.Draw()
    }
}

function white(){
    linecolor="white"
    pen="draw"
}

function erase(){pen="erase"}

function black(){
    linecolor="black"
    pen="draw"
}

function setButtons(){
    var e
    for ( e in document.getElementsByTagName("span") ){
        if (e.className=="button"){
            e.onselectstart=function(){return false;}
        }
    }
}

function $(e){return document.getElementById(e);}

function setInsert(){
    seperators=$("thumbs").getElementsByTagName("div")
    for (i=0;i<seperators.length;i++){
        if (seperators[i]==this){
            insertpos=i
            if (seperator){seperator.className="seperator"}
            seperator=this
            this.className="selected_seperator"
        }
    }
}

function putback(){
    under.src=canv.toDataURL()
    under.style.visibility="visible"
    newim=document.createElement("img")
    newim.className="thumb"
    newim.src=canv.toDataURL()
    newim.onmouseover=addexit
    newim.onmouseout=remexit
    newim.onclick=select
    images=$("thumbs").getElementsByTagName("img")
    if (insertpos<images.length){
        $("thumbs").insertBefore(newim,images[insertpos])
    }
    else{
        $("thumbs").appendChild(newim)
    }
    insertpos+=1
}

function int_rgb(e){
    return Array(e%16,Math.floor(e/16),Math.floor(e/16/16))
}

function setColor(){
    col=document.getElementById("color")
    ct=col.getContext("2d")
    row=0
    col=0
    on=0
    sz=3
    for (var r=0;r<16;r++){
        for (var g=0;g<16;g++){
            for (var b=0;b<16;b++){
                ct.fillStyle="rgb("+r*16+','+g*16+","+b*16+')'
                ct.fillRect((g*sz+(r%4)*16*sz),b*sz+((r<4?0:r<8?1:r<12?2:r<16?3:4)*16*sz),sz,sz)
            }
        }
    }
}

function delthis(){
    $("thumbs").removeChild(this.over)
    insertpos-=1
    remexit()
}

function load(){
    canv=document.getElementById("canvas")
    canv.onmousedown=mousedown;
    ctx=canv.getContext('2d')
    under=document.getElementById("underlay")
    udiv=$("underdiv")
    under.style.left=findPos(udiv)[0]
    under.style.top=findPos(udiv)[1]
    canv.style.left=findPos(udiv)[0]
    canv.style.top=findPos(udiv)[1]
    //setColor()
    slider=new Slider($("slider"),10)
    slider.Draw()
    mouseunder=new MouseUnder($("mouseunder"))
    mouseunder.Draw()
    exitbutton=$("exitbutton")
    exitbutton.onclick=delthis;
}

function mousedown(event){
    down=1
    mouse=mousecoords(event);
    if (pen=="erase"){
        ctx.clearRect(mouse[0]-findPos(canv)[0]-5,mouse[1]-findPos(canv)[1]-5,10,10)
    }
    old=Array(mouse[0]-findPos(canv)[0],mouse[1]-findPos(canv)[1])

}

function mouseup(){
    down=0
    old=null;
}

function move(event,fro){
    if (!fro){mouseunder.canv.onmousemove(event);}
    
    if (!down){return}
    mouse=mousecoords(event)
    if (!old){
        old=Array(mouse[0]-findPos(canv)[0], mouse[1]-findPos(canv)[1])
    }
    if (pen=="erase"){
        ctx.clearRect(mouse[0]-findPos(canv)[0]-slider.big/2, mouse[1]-findPos(canv)[1]-slider.big/2,slider.big,slider.big)
    }
    else if (pen=="draw"){
        ctx.strokeStyle = linecolor
        ctx.lineWidth = slider.big;//linewidth;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(old[0],old[1]);
        ctx.lineTo(mouse[0]-findPos(canv)[0], mouse[1]-findPos(canv)[1]);
        ctx.stroke();
    }
    old=Array(mouse[0]-findPos(canv)[0], mouse[1]-findPos(canv)[1])
}

function clearit(){
    ctx.clearRect (0, 0, canv.offsetWidth, canv.offsetHeight);
}

function handle(delta) {
    if (delta < 0){
        slider.big+=10;
    }
    else if (slider.big>10)
    {
        slider.big-=10;
    }
    slider.Draw()
    mouseunder.Draw()
}

if (window.addEventListener)
        window.addEventListener('DOMMouseScroll', wheel, false);
window.onmousewheel = document.onmousewheel = wheel;

var playing=0;

function play(){
    playing=1
    ov=document.createElement("div")
    ov.className="over"
    ov.onclick=function(){playing=0}
    document.body.appendChild(ov)
    topim=document.createElement("img")
    topim.onclick=function(){playing=0}
    topim.className="topim"
    document.body.appendChild(topim)
    topim.style.top=topim.offsetTop-150
    topim.style.left=topim.offsetLeft-150
    var at=0
    images=$("thumbs").getElementsByTagName("img")
    function nex(){
        if (!playing){
            document.body.removeChild(topim)
            document.body.removeChild(ov)
            return;
        }
        if (!images[at]){
            at=0
            topim.src=images[at].src;
            at+=1;
            setTimeout(function(){nex()},playspeed);
            return;
        }
        else{
            topim.src=images[at].src;
            at+=1;
            setTimeout(function(){nex()},playspeed);
            return;
        }
    }
    nex()
}


function saveonline(dataurl,name,num) {

	var req = null;
	if (window.XMLHttpRequest) {
	  req = new XMLHttpRequest();
		//if (req.overrideMimeType) { req.overrideMimeType('text/xml'); }
	} else {
	  return;
	}

	req.onreadystatechange = function() { 
		if(req.readyState == 4) {
			if(req.status == 200) {
			}	else {
				alert("Post error code " + req.status + " " + req.statusText)
			}	
		} 
	}; 
	req.open("POST", "store.py", true);
	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	req.send('command=save&name='+name+'data='+dataurl+'&num='+num);

}

function save(){
    images=$("thumbs")
    for (i=0;i<images.length;i++){
        saveonline(images[i].src.replace(",","<comma>").replace(';','<semicolon>'),i)
    }
}

function saveonline(dataurl,name,num) {

	var req = null;
	if (window.XMLHttpRequest) {
	  req = new XMLHttpRequest();
		//if (req.overrideMimeType) { req.overrideMimeType('text/xml'); }
	} else {
	  return;
	}

	req.onreadystatechange = function() { 
		if(req.readyState == 4) {
			if(req.status == 200) {
                           // alert(req.responseText)
			}	else {
				alert("Post error code " + req.status + " " + req.statusText)
			}	
		} 
	}; 
	req.open("POST", "store.py", true);
	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	req.send('command=save&name='+name+'&data='+dataurl+'&num='+num);

}
function save(name){
    images=$("thumbs").getElementsByTagName("img")
    for (i=0;i<images.length;i++){
        saveonline(images[i].src.replace(",","<comma>").replace(';','<semicolon>'),name,i)
    }
}
function fetch(num,name) {
	var req = null;
       // if (num==8)
	if (window.XMLHttpRequest) {
	  req = new XMLHttpRequest();
	} else {
	  return;
	}
	req.onreadystatechange = function() { 
		if(req.readyState == 4) {
			if(req.status == 200) {
                            newim=document.createElement("img")
                            newim.className="thumb"
                            newim.src=req.responseText
                            $("thumbs").appendChild(newim)
                            if (num[0]=="0"){num=num.substring(1)}
                            fetch(parseInt(num)+1,name)
			}
                        else {
                            insertpos=num;
                            clearit()
                            last=$("thumbs").lastChild;last.src=last.src+""
                            ctx.drawImage(last,0,0)
                            under.src=last.src
                            under.style.visibility="visible"
			}	
		} 
	}; 
        if (name){if (name[name.length-1]!="/"){name+='/'}}
        else{name=""}
        if (num<10){num="0"+num}
        req.num=num
        req.name=name
	req.open("GET", "data/"+name+"img"+num+".dat", true);
	req.send(null);
}

function addexit(){
    at=findPos(this)
    exitbutton.over=this;
    exitbutton.style.visibility="visible";
    exitbutton.style.top=at[1]
    exitbutton.style.left=at[0]
}

function remexit(){
    exitbutton.style.visibility="hidden";
    exitbutton.over=null;
}

function fetch2(name,num){
    img=new Image()
    img.onmouseover=addexit
    img.onmouseout=remexit
    img.onclick=select
    img.className="thumb"
    img.onload=function(){
        $("thumbs").appendChild(this)
        insertpos=num
        fetch2(name,num+1)
    }
    img.src="data/"+name+"/img"+num+".png"
    return img
}

function select(){


}

function fetch3(name,num){
    img=new Image()
    img.onmouseover=addexit
    img.onmouseout=remexit
    img.onclick=select
    img.className="thumb"
    img.onload=function(){
        $("thumbs").appendChild(this)
        insertpos=num
        fetch2(name,num+1)
    }
    img.src="store.py?command=show&name="+name+"&num="+num
    return img
}

function load2(name){
    num=0
    $("thumbs").innerHTML=""
    fetch2(name,0)
}
function load_from(name){
    num=0
    $("thumbs").innerHTML=""
    fetch(0,name)
}
document.onmouseup=mouseup;
document.onmousemove=move;