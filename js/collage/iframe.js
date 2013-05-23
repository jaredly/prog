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
    else return this.offsetWidth-4;
}
Node.prototype.h = function(e){
    if (e) this.style.height=e+"px";
    else return this.offsetHeight-4;
}
Node.prototype.move = function(x,y){
    this.cx(this.cx()+x);
    this.cy(this.cy()+y);
}
Node.prototype.resize = function(x,y){
    this.w(this.w()+x);
    this.h(this.h()+y);
}







var selected = false;
var old = false;
var objects = [];

document.onmousemove = move;
document.onmouseup = mouseup;
document.onmousedown = mousedown;


function move(e){
    var [x1,y1] = old;
    var [x,y] = mousePos(e);
    old = [x,y];
    var sel=selected;
    if (sel && sel.moving){
        if (sel.moving == 1){
            sel.move(x-x1,y-y1);
            sel.resize(x1-x,y1-y);
        }
        else if (sel.moving == 2){
            sel.move(0,y-y1);
            sel.resize(x-x1,y1-y);
        }
        else if (sel.moving == 3){
            sel.move(0,0);
            sel.resize(x-x1,y-y1);
        }
        else if (sel.moving == 4){
            sel.move(x-x1,0);
            sel.resize(x1-x,y-y1);
        }
        else if (sel.moving == 5){
            sel.move(x-x1,y-y1);
            sel.resize(0,0);
        }
    }
}

function mouseup(){
    selected.moving = false;
}

function mousedown(e){
    /*old = mousePos(e);
    if (selected)selected.deselect()
    console.log('desel');
    selected=false;*/
}

function Img(src){
    src=src||"http://jabasite.ej.am/collage/imgs/0.jpg"
    var that = document.body.appendChild( cE("img") );
    that.src = src
    
    that.onmousedown = function(e){
    if (selected) selected.deselect();
        this.select()
        old = mousePos(e);
        this.moving = corner(this,e)||5;
        return false;
    }
    that.onmousemove = function(e){
        cursor(corner(this,e));
    }
    that.deselect = function(){
        this.className="";
        this.move(2,2);
    }
    that.select = function(){
        this.className="selected";
        selected = this;
        this.move(-2,-2);
    }
    objects.push(that);
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
