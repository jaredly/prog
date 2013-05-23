
var Context = CanvasRenderingContext2D;

Context.prototype.drawCircle = function(x,y,r){
    this.beginPath();
    this.arc(x,y,r,0,Math.PI*2,true);
    this.fill()
}
Context.prototype.drawLine = function(x,y,a,b){
    this.beginPath();
    this.moveTo(x,y);
    this.lineTo(a,b);
    this.stroke();
}

function FlipBookCanv(canv,mouse,back){
    var that = canv;
    var ctx = that.ctx = canv.getContext("2d");
    that.action = "draw";
    that.color = "black";
    that.mode="normal";
    var cpos = that.cpos = findPos(canv);
    var mouse;
    that.points = [];
    
    that.load = function(){
        ctx.clearRect(0,0,200,200);
        ctx.strokeStyle = that.color;
        ctx.clearRect(0,0,200,200)
        ctx.fillStyle = that.color;
        ctx.lineCap = "round";
        
        back.src = canv.toDataURL();
        //cpos = 
        back.style.top=cpos[1]+"px";
        back.style.left=cpos[0]+"px";
        canv.style.position="absolute";
        canv.style.left=cpos[0]+"px";
        canv.style.top=cpos[1]+"px";
        that.mouse = mouse = FlipMouse(that, mouse);
    }
    that.collides = function([x,y]){
        if (x>=cpos[0] && y>cpos[1] && x<cpos[0]+canv.offsetWidth && y<cpos[1]+canv.offsetHeight){
            return [x-cpos[0],y-cpos[1]];
        }
    }
    that.conv = function([x,y]){
        return [x-cpos[0],y-cpos[1]];
    }
    that.load();
    return that;
}

function FlipMouse(canv,mouse){
    var that = mouse;
    var ctx = mouse.getContext("2d");
    var mdown = false;
    var pos = [0,0];
    var size = 20;
    
    that.draw = function(){
        ctx.clearRect(0,0,size*2,size*2);
        if (canv.action=="draw"){
            ctx.fillStyle=ctx.fillStyle;
            ctx.beginPath();
            ctx.arc(size, size, size, 0, Math.PI*2, true);
            ctx.fill()
        }else if (canv.action=="erase"){
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, size*2, size*2)
        }
    }
    
    that.size = function(w){
        if (!w)return size;
        size=w/2;
        that.width = size*2;
        that.height = size*2;
        canv.ctx.lineWidth=size*2;
        that.draw();
        that.rePos();
    }
    
    that.rePos = function(npos){
        if (npos)pos=npos;
        that.style.left = pos[0]-size+"px";
        that.style.top = pos[1]-size+"px";
    }
    var nc = 4;
    function move(e){
        var npos = ePos(e);
        if (mdown){
            var [x,y] = canv.conv(npos);
            var mpos = canv.conv(pos);
            if (canv.action=="draw")
                canv.ctx.drawLine(mpos[0],mpos[1],x,y);
            else if (canv.action=="erase")
                canv.ctx.clearRect(x-size, y-size, size*2, size*2);
            canv.points.slice(-1)[0].push([x,y])
            if (canv.mode=="live"){
                nc-=1;
                if (!nc){
                    _Next();
                    nc = 4;
                }
            }
        }else if (!canv.collides(npos)){
            that.style.visibility="hidden";
            return;
        }
        pos = npos;
        that.rePos();
    }
    
    function down(e){
        var npos = canv.collides(ePos(e));
        if (!npos)return;
        canv.points.push([canv.action]);
        mdown=true;
        var [x,y] = npos;
        if (canv.action=="draw")
            canv.ctx.drawCircle(x,y,size);
        else if (canv.action=="erase")
            canv.ctx.clearRect(x-size, y-size, size*2, size*2);
        
        pos=ePos(e);
        canv.points.slice(-1)[0].push(pos)
        if (canv.mode=="live")_Next();
    }
    
    function load(){
        canv.addEventListener("mouseover",function(){that.style.visibility="visible";},false);
        document.addEventListener("mousemove",move,false);
        document.addEventListener("mousedown",down,true);
        document.addEventListener("mouseup",function(){mdown=false;},false);
    }
    
    that.size(size);
    load();
    return that;
}

var fbc = FlipBookCanv($("canv"),$("mouse"),$("back"));

/****************
var canv = $("canv");
var ctx = canv.getContext("2d");
var cpos = findPos(canv);
var back = $("back");
var _down=false;

back.style.top=cpos[1]+"px";
back.style.left=cpos[0]+"px";
back.src = canv.toDataURL();
canv.style.position="absolute";
canv.style.left=cpos[0]+"px";
canv.style.top=cpos[1]+"px";
ctx.clearRect(0,0,200,200)
ctx.strokeStyle = "black";
ctx.fillStyle = "black";
ctx.lineCap = "round";

var draw_type = "draw";

var Context = CanvasRenderingContext2D;

Context.prototype.drawCircle = function(x,y,r){
    this.beginPath();
    this.arc(x,y,r,0,Math.PI*2,true);
    this.fill()
}
Context.prototype.drawLine = function(x,y,a,b){
    this.beginPath();
    this.moveTo(x,y);
    this.lineTo(a,b);
    this.stroke();
}

var points = [];


var mouse = $("mouse");
mouse.ctx = mouse.getContext("2d");
mouse.pos = [0,0];
mouse.draw = function(){
    this.ctx.clearRect(0,0,this.size*2,this.size*2);
    if (draw_type=="draw"){
        this.ctx.fillStyle=ctx.fillStyle;
        this.ctx.beginPath();
        this.ctx.arc(this.size,this.size,this.size,0,Math.PI*2,true);
        this.ctx.fill()
    }else if (draw_type=="erase"){
        this.ctx.fillStyle="white";
        this.ctx.fillRect(0,0,this.size*2,this.size*2)
    }
}

mouse.reSize = function(size){
    size=size/2;
    this.size=size;
    ctx.lineWidth=size*2;
    this.width=size*2;
    this.height=size*2;
    this.draw();
    this.rePos();
}

mouse.rePos = function(){
    this.style.left = this.pos[0]-this.size+"px";
    this.style.top = this.pos[1]-this.size+"px";
}

function draw_all(_points){
    for (var i=0;i<_points.length;i++){
        if (_points[i][0]=="erase")ctx.clearRect(_points[i][1][0]-mouse.size/2 ,_points[i][1][1]-mouse.size/2, mouse.size, mouse.size);
        else
            ctx.fillStyle=_points[i][0];
            ctx.drawCircle(_points[i][1][0]-cpos[0],_points[i][1][1]-cpos[1],mouse.size);
        for (var e=2;e<_points[i].length;e++){
            if (_points[i][0]=="erase"){
                ctx.clearRect(_points[i][e][0]-mouse.size/2 ,_points[i][e][1]-mouse.size/2, mouse.size, mouse.size);
            }
            ctx.drawLine(_points[i][e-1][0]-cpos[0],
                    _points[i][e-1][1]-cpos[1],
                    _points[i][e][0]-cpos[0],
                    _points[i][e][1]-cpos[1]);
        }
    }
    points=_points
}

function move(e){
    var pos = [x,y] = ePos(e);
    if (_down){
        if (draw_type=="draw")
            ctx.drawLine(mouse.pos[0]-cpos[0],mouse.pos[1]-cpos[1],pos[0]-cpos[0],pos[1]-cpos[1]);
        else if (draw_type=="erase")
            ctx.clearRect(x-mouse.size-cpos[0] ,y-mouse.size-cpos[1], mouse.size*2, mouse.size*2);
        points.slice(-1)[0].push(pos)
    }else if (!(cpos[0]<x && x<cpos[0]+300 && cpos[1]<y && y<cpos[1]+300)){
        mouse.style.visibility="hidden";
        return;
    }
    mouse.pos = pos;
    mouse.rePos();
}

function down(e){
    points.push([draw_type]);
    _down=true;
    var [x,y] = ePos(e);
    if (cpos[0]<x && x<cpos[0]+300 && cpos[1]<y && y<cpos[1]+300){
        if (draw_type=="draw")ctx.drawCircle(x-cpos[0],y-cpos[0],mouse.size);
        else if (draw_type=="erase")
            ctx.clearRect(x-mouse.size-cpos[0] ,y-mouse.size-cpos[1], mouse.size*2, mouse.size*2);
    }
    mouse.pos=[x,y]
    points.slice(-1)[0].push(mouse.pos)
}

canv.addEventListener("mouseover",function(){mouse.style.visibility="visible";},false);
document.addEventListener("mousemove",move,false);
mouse.reSize(20);
document.addEventListener("mousedown",down,true);
document.addEventListener("mouseup",function(){_down=false;},true);


*******/

//////// Main Functions /////////

function _Next(){
    var that = $("pages").appendChild(new Image());
    that.src = fbc.toDataURL("image/png");
    that.points = fbc.points;
    that.onclick = function(e){
        if (e.button == 0){ //left click
            
        }
    }
    that.oncontextmenu = function(e){
        e.preventDefault = true;
        that.parentNode.removeChild(that);
        return false;
    }
    
    $("back").style.backgroundImage = "url("+that.src+")"
}

function _White(){
    fbc.action="draw";
    fbc.ctx.fillStyle=fbc.ctx.strokeStyle="white";
    fbc.mouse.draw();
}
function _Black(){
    fbc.action="draw";
    fbc.ctx.fillStyle=fbc.ctx.strokeStyle="black";
    fbc.mouse.draw();
}
function _Clear(){
    fbc.ctx.clearRect(0,0,300,300);
}
function _Erase(){
    fbc.action="erase";
    fbc.mouse.draw();
}

function _Mode(who){
    if (fbc.mode=="normal"){
        fbc.mode="live";
        who.innerHTML = "Live";
    }else if (fbc.mode=="live"){
        fbc.mode="normal";
        who.innerHTML = "Normal";
    }
}
function _Play(){
    var main = document.body.appendChild(new Image())
    main.style.width="300px"
    main.style.height="300px"
    main.style.position="absolute"
    main.style.top=window.innerHeight/2-150;
    main.style.left=window.innerWidth/2-150;
    var chs = $("pages").childNodes
    var i=0,tm;
    function next(){
        main.src = chs[i].src;
        i++;if (i==chs.length)i=0;
        tm=setTimeout(next,60)
    }
    function stop(){
        document.body.removeChild(main);
        clearTimeout(tm);
        document.body.removeEventListener("click",stop,true)
    }
    document.body.addEventListener("click",stop,true)
    next()
}
function clean(x){return escape(x).replace("+","%2B");}
function save(){

data="save=1";
for each(child in $("pages").childNodes){
    data+="&img="+clean(child.src);
}
sendRequest("main2.cgi",function(){},data);

}
//save()

/************************************* image place functions *********************/



