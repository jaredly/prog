Node.prototype.cx = function(e){
    if (e) this.style.left=e+"px";
    else return this.style.offsetLeft;
}
Node.prototype.cy = function(e){
    if (e) this.style.top=e+"px";
    else return this.style.offsetTop;
}
Node.prototype.w = function(e){
    console.log("width")
    if (e) this.style.width=e+"px";
    else return this.offsetWidth;
}
Node.prototype.h = function(e){
    console.log("height");
    if (e) this.style.height=e+"px";
    else return this.offsetHeight;
}

function Img(src){
    var that = document.body.appendChild(cE("img"));
    that.src=src
    that.onmousedown = function(e){
        if (that.selected){
            that.moving = corner(that,e) || true;
            console.log("moving",that.moving);
        }
        else {
            that.moving = true;
            for (var i=0;i<objects.length;i++){
                if (!objects[i]==that)objects[i].unfocus();
            }
        }
        that.selected = true;
        that.className = "selected";
        that.old = mousePos(e);
    }
    
    that.unfocus = function(){
        that.selected = false;
        that.className = "";
        cconsole.log("un");
    }
    
    that.onmouseup = function(){
        that.moving = false;
        that.old = false;
        return false;
    }
    
    that.onmousemove = function(e){
        if (!that.moving)return;
        console.log(that.moving);
        [x,y] = mousePos(e);
        dx = x-that.old[0];
        dy = y-that.old[1];
        console.log(dx,dy);
        that.old = [x,y]
        
        if (that.moving == true){
            that.cx(that.cx()+dx);
            return console.log("move")
        }
        
        if (that.moving == 1){
            that.w(that.w()+dx);
            that.cx(that.cx()+dx);
            that.h(that.h()+dy);
            that.cy(that.cy()+dy);
        }
        else if (that.moving == 2){
            that.w(that.w()+dx);
            
            that.h(that.h()+dy);
            that.cy(that.cy()+dy);
        }
        else if (that.moving == 3){
            that.w(that.w()+dx);
            
            that.h(that.h()+dy);
            
        }
        else if (that.moving == 4){
            that.w(that.w()+dx);
            that.cx(that.cx()+dx);
            that.h(that.h()+dy);
            
        }
        else if (that.moving == true){
            console.log("move");
            that.cx(that.cx()+dx);
            that.cy(that.cy()+dy);
        }
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

function upload(){
    that=document.body.appendChild(cE("iframe"));
    that.className="upload";
    that.style.left=window.innerWidth/2-that.offsetWidth/2;
    that.src="upload.py";
    that.onload=function(){
        this.onload=function(){
        objects.push(Img("imgs/"+images+".jpg"));
        images+=1;
    }}
}









window.onload=function(){

var controls = function (){
    var that = document.body.appendChild(cE("div"));
    that.className = "controls";
    var img = that.appendChild(cE("img"))
    img.src="/images/jp.gif";
    img.onclick = upload;
    img.style.position="auto";
    
    var img2 = that.appendChild(cE("img"))
    img2.src = "/images/jp.gif";
    img2.style.position="auto";
    img2.onclick = function(){
        askstring("url",function(x){objects.push(Img(x))})
    }
}()

}

var images=0;
var objects=[];

document.onmousemove=function(e){
    for (var i=0;i<objects.length;i++){
        for (var a=0;a<4;a++){
            objects[i].onmousemove(e)
        }
    }
}
