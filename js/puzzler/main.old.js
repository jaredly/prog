/******** General Functions *************/

function cE(e){return document.createElement(e);}
function $(e){return document.getElementById(e);}
function cTN(e){return document.createTextNode(e);}
if (typeof(console)=="undefined") console={log:function(){}};

function array(x){
    var that=[];
    for (var i=0;i<x.length;i++)that.push(x[i]);
    return that;
}
function ePos(e){
    if (e.pageX)return [e.pageX,e.pageY];
    return [e.clientX + document.body.scrollLeft - document.body.clientLeft,
        e.clientY + document.body.scrollTop  - document.body.clientTop]
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
function random(num){
    return parseInt(Math.random()*num)
}

/********** Global Variables ***********/

size = [4,3];

yahooapikey = "05ddee854b8109f61c74cb357df66465"
var html;
var url = "http://api.flickr.com/services/rest/"
url+="?method=flickr.interestingness.getList&per_page=1&format=json"
url+="&api_key=" +yahooapikey+"&page="+random(500)

var selected = false;

var canv = $('canv');
canv.addEventListener("click",mousedown,false);
cpos = findPos(canv);

ctx=canv.getContext("2d");
script = document.body.appendChild(document.createElement("script"));
script.src=url;

var img = $("show");//new Image();
img.onload = load;
var board = [];
var width=0;var height=0;



function 
















function swit(x,y,a,b){
    var tmp = board[x][y];
    board[x][y]=board[a][b];
    board[a][b]=tmp;
}
function make_board(){
    var w,h;
    if (img.width>img.height){
        w=size[0];h=size[1];
    }else{
        w=size[1];h=size[0];
    }
    board=[];
    width=Math.round(img.width/w);
    height=Math.round(img.height/h);
    for (var i=0;i<w;i++){
        board.push([])
        for (var o=0;o<h;o++){
            board.slice(-1)[0].push([i,o]);
        }
    }
    for (var i=0;i<w*h*2;i++){
        swit(random(w),random(h),random(w),random(h))
    }
}
function toURL(o){
    return "http://farm"+o.farm+".static.flickr.com/"+o.server+"/"+o.id+"_"+o.secret+".jpg"
}
function jsonFlickrApi(obj){
    img.src=toURL(obj.photos.photo[0])
}
function load(){
    canv.width=img.width;
    canv.height=img.height;
    canv.style.marginLeft = -img.width/2+"px"
    canv.style.marginTop = -img.height/2+"px"
    
    var show = $('show');
    show.style.marginLeft = -img.width/2-4+"px"
    show.style.marginTop = -img.height/2-4+"px"
    show.style.border = "4px solid white";
    
    cpos = findPos(canv);
    make_board()
    draw()
    var showb = $("showb");
    showb.onmouseover = function(){
        $("show").style.visibility = "visible";
    }
    showb.onmouseout = function(){
        $("show").style.visibility = "hidden";
    }
    $('check').onclick = _Check;
}
function draw(){
    ctx.globalAlpha=1
    for (var x=0;x<board.length;x++){
        for (var y=0;y<board[0].length;y++){
            draw_single(x,y);
        }
    }
}
function draw_single(x,y){
    ctx.fillStyle = "white";
    ctx.fillRect(x*width,y*height,width,height)
    ctx.drawImage(img,board[x][y][0]*width,
                board[x][y][1]*height,
                width,height,x*width,y*height,width,height);
}
function draw_selected(x,y){
    ctx.globalAlpha=0.5
    ctx.fillStyle="white";
    ctx.fillRect(x*width,y*height,width,height)
    ctx.globalAlpha=1
}
function mousedown(e){
    var pos = ePos(e);
    pos[0]-=cpos[0];pos[0]=Math.floor(pos[0]/width);
    pos[1]-=cpos[1];pos[1]=Math.floor(pos[1]/height);
    console.log(pos)
    if (selected){
        swit(pos[0],pos[1],selected[0],selected[1]);
        draw_single(pos[0],pos[1]);
        draw_single(selected[0],selected[1]);
        selected=null;
    }else{
        selected = pos;
        draw_selected(pos[0],pos[1])
    }
    if (check()){
        alert("You Won!!")
    }
}

function check_color(){
    ctx.fillStyle="red";
    ctx.globalAlpha=0.2
    for (var x=0;x<board.length;x++){
        for (var y=0;y<board[0].length;y++){
            if (!(board[x][y][0]==x && board[x][y][1]==y)){
                ctx.fillRect(x*width,y*height,width,height)
            }
        }
    }
}

function check(){
    for (var x=0;x<board.length;x++){
        for (var y=0;y<board[0].length;y++){
            if (!(board[x][y][0]==x && board[x][y][1]==y)){
                return false
            }
        }
    }
    return true;
}

function _Show(){
    img.style.visibility="visible";
    img.style.position="absolute";
    $("showb").innerHTML="Hide Image";
    $("showb").onclick=_Hide;
}

function _Hide(){
    img.style.visibility="hidden";
    //img.style.position="relative";
    $("showb").innerHTML="Show Image";
    $("showb").onclick=_Show;
}

function _Check(){
    check_color();
}