Node.prototype.cx = function(e){
    if (e) this.style.left=e+"px";
    else return this.offsetLeft;
}
Node.prototype.cy = function(e){
    if (e) this.style.top=e+"px";
    else return this.offsetTop;
}
Node.prototype.w = function(e){
    if (e) this.style.width=e+"px";
    else return this.offsetWidth;
}
Node.prototype.h = function(e){
    if (e) this.style.height=e+"px";
    else return this.offsetHeight;
}
Node.prototype.move = function(x,y){
    this.cx(this.cx()+x);
    this.cy(this.cy()+y);
}
Node.prototype.resize = function(x,y){
    console.log('rz',x,y);
    this.w(this.w()+x);
    this.h(this.h()+y);
}



function r(){
    return 'abdefghijk'[Math.ceil(Math.random()*10)-1]
}
function mid(){
    x=''
    for (var i=0;i<10;i++){
        x+=r();
    }
    return x;
}

function upload_ask(){
    ask("Image type",function(x){if (x==1){upload()}else if (x==2){webupload()}},("From My Computer",1),("From the web",2),("Cancel",0));
}

function webupload(){
    askstring("Url",function(a){collage.contentWindow.Img(a)});
}

var id = mid();

var selected = false;
var old = false;
var collage = null;

document.onmousemove = move;
document.onmouseup = mouseup;


function New(){
    collage = document.body.appendChild(cE("iframe"));
    collage.src = "iframe.html"
    collage.className="collage";
}

function move(e){
    var [x1,y1] = old;
    var [x,y] = mousePos(e);
    old = [x,y];
    var sel=selected;
    if (sel && sel.moving){
        collage.move(x-x1,y-y1);
        collage.resize((x1-x)*2,(y1-y)*2);
    }
}

function mouseup(){
    selected.moving = false;
}

function mousedown(e){
    old = mousePos(e);
}

function resizer(){
    var that = document.body.appendChild( cE("div") );
    that.className="resizer";
    
    that.onmousedown = function(e){
        selected = this;
        old = mousePos(e);
        this.moving = true;
        return false;
    }
    return that;
}

function corner(i,e){
    [x,y]=mousePos(e);
    if ( x>=i.cx() && x<=i.cx()+10 &&
        y>=i.cy() && y<=i.cy()+10 )
        return 1;
    if ( x<=i.cx()+i.w() && x>=i.cx()+i.w()-10 &&
        y>=i.cy() && y<=i.cy()+10 )
        return 2;
    if ( x<=i.cx()+i.w() && x>=i.cx()+i.w()-10 &&
        y<=i.cy()+i.h() && y>=i.cy()+i.h()-10 )
        return 3;
    if ( x>=i.cx() && x<=i.cx()+10 &&
        y<=i.cy()+i.h() && y>=i.cy()+i.h()-10 )
        return 4;
    return false;
}

function cursor(e){
    if (e){
        var s = ["NW","NE","NW","NE"][e-1]
        document.body.style.cursor = s+"-resize"
    }else{document.body.style.cursor = ""}
}

function upload(){
    that=document.body.appendChild(cE("iframe"));
    that.className="upload";
    that.style.left=window.innerWidth/2-that.offsetWidth/2;
    that.src="upload.py";
    that.onload=function(){
        this.contentWindow.forms[0].id.value=id;
        this.onload=function(){
            collage.contentWindow.Img("imgs/"+id+"/"+images+".jpg");
            images+=1;
        }
    }
}

window.onload = function(){
New();
}