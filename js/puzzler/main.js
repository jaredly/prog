/******** General Functions *************/

//ieCanvasInit();

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




function Puzzle(canvas,image,size){
    var that = {};
    that.canvas = canvas;
    that.ctx = canvas.getContext('2d');
    that.image = image;
    that.size = size;
    that.board = [];
    that.sing_width = 0;
    that.single_height = 0;
    that.selected = false;
    that.clicks = 0;
    
    that.make_board = function(){
        var w,h;
        if (img.width>img.height){
            w=that.size[0];h=that.size[1];
        }else{
            w=that.size[1];h=that.size[0];
        }
        that.board=[];
        that.single_width=Math.round(img.width/w);
        that.single_height=Math.round(img.height/h);
        
        for (var i=0;i<w;i++){
            that.board.push([])
            for (var o=0;o<h;o++){
                that.board.slice(-1)[0].push([i,o]);
            }
        }
        for (var i=0;i<w*h*2;i++){
            that.switch(random(w),random(h),random(w),random(h))
        }
    }
    that.switch = function(x,y,a,b){
        var tmp = that.board[x][y];
        that.board[x][y]=that.board[a][b];
        that.board[a][b]=tmp;
    }
    that.draw_board = function(){
        that.ctx.globalAlpha=1
        for (var x=0;x<that.board.length;x++){
            for (var y=0;y<that.board[0].length;y++){
                that.draw_single(x,y);
            }
        }
    }
    that.draw_single = function(x,y){
        that.ctx.fillStyle = "white";
        that.ctx.fillRect(x*that.single_width,y*that.single_height,that.single_width,that.single_height)
        that.ctx.drawImage(that.image, that.board[x][y][0]*that.single_width,
                that.board[x][y][1]*that.single_height,
                that.single_width, that.single_height,
                x*that.single_width, y*that.single_height,
                that.single_width, that.single_height);
    }
    that.highlight = function(x,y){
        that.ctx.globalAlpha=0.5
        that.ctx.fillStyle="white";
        that.ctx.fillRect(x*that.single_width,y*that.single_height,that.single_width,that.single_height)
        that.ctx.globalAlpha=1
    }
    that._mousedown = function(e){
        that.cpos = findPos(canvas);
        var pos = ePos(e);
        pos[0]-=that.cpos[0];
        pos[0]=Math.floor(pos[0]/that.single_width);
        pos[1]-=that.cpos[1];
        pos[1]=Math.floor(pos[1]/that.single_height);
        if (that.selected){
            if (that.selected[0]!=pos[0] || that.selected[1]!=pos[1]){
                that.switch(pos[0],pos[1],that.selected[0],that.selected[1]);
                that.draw_single(that.selected[0],that.selected[1]);
                that.clicks += 1;
                that.onchange();
            }
            that.draw_single(pos[0],pos[1]);
            that.selected=null;
        }else{
            that.selected = pos;
            that.highlight(pos[0],pos[1])
        }
        if (that.check()){
            alert("You Won!!")
        }
    }
    that.canvas.addEventListener("mousedown",that._mousedown,false);
    that.check = function(){
        for (var x=0;x<that.board.length;x++){
            for (var y=0;y<that.board[0].length;y++){
                if (!(that.board[x][y][0]==x && that.board[x][y][1]==y)){
                    return false
                }
            }
        }
        return true;
    }
    that.check_highlight = function(){
        that.ctx.fillStyle="red";
        that.ctx.globalAlpha=0.2
        for (var x=0;x<that.board.length;x++){
            for (var y=0;y<that.board[0].length;y++){
                if (!(that.board[x][y][0]==x && that.board[x][y][1]==y)){
                    that.ctx.fillRect(x*that.single_width,y*that.single_height,
                                 that.single_width,that.single_height)
                }
            }
        }
    }
    that.onchange = function(){
        /* anything you want to do here?*/
    }
    that.load = function(){
        canvas.width = image.width;
        canvas.height = image.height;
        that.cpos = findPos(canvas);
        that.clicks = 0;
        that.onchange();
        that.make_board();
        that.draw_board();
    }
    that.kill = function(){
        that.canvas.removeEventListener("mousedown",that._mousedown,false);
    }
    that.load();
    return that;
}

/************** Flick Functions ************/

function toURL(o){
    return "http://farm"+o.farm+".static.flickr.com/"+o.server+"/"+o.id+"_"+o.secret+".jpg"
}
function jsonFlickrApi(obj){
    img.src=toURL(obj.photos.photo[0])
}
var puzzle = null;
function load(){
    canv = $('canv')
    canv.style.marginLeft = -img.width/2+"px"
    canv.style.marginTop = -img.height/2+"px"
    
    var show = $('show');
    show.style.marginLeft = -img.width/2-4+"px"
    show.style.marginTop = -img.height/2-4+"px"
    show.style.border = "4px solid white";
    
    /*cpos = findPos(canv);
    make_board()
    draw()*/
    //if (puzzle)puzzle.kill();
    puzzle = Puzzle(canv,img,[6,4]);
    puzzle.onchange = function(){
        $("score").innerHTML = "Clicks: "+puzzle.clicks;
    }
    
    var showb = $("showb");
    showb.onmouseover = function(){
        $("show").style.visibility = "visible";
    }
    showb.onmouseout = function(){
        $("show").style.visibility = "hidden";
    }
}

function setSize(w,h){
    puzzle.size = [w,h];
    puzzle.load();
}

function setBest(xs,ys){
    var bx = [100,0];
    var by = [100,0];
    console.log("Image",puzzle.image.width,puzzle.image.height);
    
    for each(w in xs){
        var diff = puzzle.image.width - Math.round(puzzle.image.width/w)*w;
        console.log("w",w,diff);
        if (Math.abs(diff)<Math.abs(bx[0]))bx=[diff,w];
    }
    for each(h in ys){
        var diff = puzzle.image.height - Math.round(puzzle.image.height/h)*h;
        console.log("h",h,diff);
        if (Math.abs(diff)<Math.abs(by[0]))by=[diff,h];
    }
    console.log(bx,by);
    if (bx[0]==100 || by[0]==100)throw new Exception("bad width/height");
    setSize(bx[1],by[1]);
}

function setHard(){
    var xs = [11,10,9,8];
    var ys = [5,6,7];
    if (puzzle.image.height>puzzle.image.width)[xs,ys]=[ys,xs];
    setBest(xs,ys);
}

function setMed(){
    var xs = [8,7,6,5];
    var ys = [4,5];
    if (puzzle.image.height>puzzle.image.width)[xs,ys]=[ys,xs];
    setBest(xs,ys);
}

function setEasy(){
    if (puzzle.image.width>puzzle.image.height)
        setSize(4,3);
    else setSize(3,4);
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

function check_color(){
    puzzle.check_highlight();
}



/********** Global Variables ***********/

yahooapikey = "05ddee854b8109f61c74cb357df66465"
var url = "http://api.flickr.com/services/rest/"
url+="?method=flickr.interestingness.getList&per_page=1&format=json"
url+="&api_key=" +yahooapikey+"&page="
var html;
//script = document.body.appendChild(document.createElement("script"));
var img = $("show");
img.onload = load;


function reload(){
    if (puzzle)puzzle.kill();
    script = document.body.appendChild(document.createElement("script"));
    script.src=url+random(500);
}

reload()

