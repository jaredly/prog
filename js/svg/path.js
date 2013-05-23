var svgNamespace = 'http://www.w3.org/2000/svg';
function createSVG(thing){
    return document.createElementNS(svgNamespace, thing);
}
function set(a,x,y){
    a.setAttribute(x,y);
}
function get(a,x){
    return a.getAttribute(x);
}
function hide(what){
    set(what,"visibility","hidden");
}
function show(what){
    set(what,'visibility','visible');
}
function ePos(e){
    if (e.pageX)return [e.pageX,e.pageY];
    return [e.clientX + document.body.scrollLeft - document.body.clientLeft,
        e.clientY + document.body.scrollTop  - document.body.clientTop]
}

function Line(parent,x1,y1,x2,y2,stroke,strokewidth){
    if ([x1,y1,x2,y2].indexOf(null)!=-1){
        throw "Sorry, you need to enter the parent,x1,y1,x2,y2 arguments";
    }
    var that = parent.appendChild(createSVG("line"));
    set(that,"stroke",stroke||"black");
    set(that,"stroke-width",strokewidth||1);
    set(that,"x1",x1);
    set(that,"x2",x2);
    set(that,"y1",y1);
    set(that,"y2",y2);
    that.set1=function(x,y){
        set(that,'x1',x)
        set(that,'y1',y);
    }
    that.set2=function(x,y){
        set(that,'x2',x)
        set(that,'y2',y);
    }
    return that;
}

function Rect(parent,x,y,w,h,lc,lw,fill){
    var that = parent.appendChild(createSVG("rect"));
    that.setPos = function(x,y){
        set(that,'x',x);
        set(that,'y',y);
    }
    that.setCenter = function(x,y){
        set(that,'x',x-that.width.baseVal.value/2)
        set(that,'y',y-that.height.baseVal.value/2)
    }
    that.setCenter(x,y)
    set(that,"width",w||2);
    set(that,"height",h||2);
    set(that,"stroke",lc||"black");
    set(that,"stroke-width",lw||1);
    set(that,"fill",fill||"white");
    return that;
}

function Box(parent,path,x,y,lc,fill,modpos){
    var that = Rect(parent,x-3.5,y-3.5,7,7,lc,1,fill);
    set(that,"style","cursor:pointer");
    var moving = false;
    that.addEventListener("mousedown",function(e){
        moving = true;e.preventDefault();e.stopPropagation();
    },false);
    path.boxes.push(that);
    that.update=function(){
        that.setCenter(modpos[0],modpos[1]);
    }
    modpos.onmove?null:(modpos.onmove=function(x,y){});
    parent.addEventListener("mousemove",function(e){
        if (!moving)return;
        e.stopPropagation();
        var [x,y]=ePos(e);
        modpos.onmove(x-get(that,'x'),y-get(that,'y'));
        that.setCenter(x,y);
        modpos[0]=x;
        modpos[1]=y;
        path.update();
    },false);
    parent.addEventListener("mouseup",function(){moving=false;},true);
    return that;
}
function LBox(parent,path,x,y,lc,fill,modpos,modpos2){
    var lbox = Line(parent,x,y,modpos2[0],modpos2[1],"lightblue",1);
    var that = Rect(parent,x-3.5,y-3.5,7,7,lc,1,fill);
    set(that,"style","cursor:pointer");
    var moving = false;
    that.addEventListener("mousedown",function(e){
        moving = true;e.preventDefault();e.stopPropagation();
    },false);
    that.line=lbox;
    path.boxes.push(that);
    that.update=function(){
        lbox.set1(modpos[0],modpos[1]);
        lbox.set2(modpos2[0],modpos2[1]);
        that.setCenter(modpos[0],modpos[1]);
    }
    modpos2.onmove=function(xx,yy){//console.log("move",x-3.5,y-3.5);
     //   modpos[0]=xx+get(that,'x');
     //   modpos[1]=yy+get(that,'y');
     //   path.update()
    }
    console.log(modpos2,modpos2.onmove);
    parent.addEventListener("mousemove",function(e){
        if (!moving)return;
        e.stopPropagation();
        var [x,y]=ePos(e);
        that.setCenter(x,y);
        modpos[0]=x;
        modpos[1]=y;
        that.update();
        path.update();
    },false);
    parent.addEventListener("mouseup",function(){moving=false;},true);
    return that;
}
function lineSeg(parent,path,x,y){
    var that = [[x,y]];
    path.segments.push(that);
    that.type="L";
    var l1=Box(parent,path,x,y,"red","red",that[0]);
    that[0].box=l1;
    l1.setCenter(x,y);
    that.show = function(){show(l1);}
    that.hide = function(){hide(l1);}
    that.update = function(){
      //  l1.update();
    }
    path.update();
    return that;
}
function moveSeg(parent,path,x,y){
    var that = [[x,y]];
    path.segments.push(that);
    that.type="M";
    var box=Box(parent,path,x,y,"red","red",that[0]);
    that[0].box=box;
    that.show=function(){show(box);}
    that.hide=function(){hide(box);}
    that.update = function(){
      //  l1.update();
    }
    path.update();
    return that;
}

function cubicSeg(parent,path,x,y,a,b,c,d){
    var that = [[x,y],[a,b],[c,d]];
    var leng = path.segments.length;
    path.segments.push(that);
    that.type="C";
    var box1=LBox(parent,path,x,y,"red","white",that[0],path.segments[leng-1].slice(-1)[0]);
    var box2=LBox(parent,path,x,y,"red","white",that[1],that[2]);
    var box3=Box(parent,path,x,y,"red","red",that[2]);
    that[0].box=box1;
    that[1].box=box2;
    that[2].box=box3;
    that.show=function(){
        show(box1);
        show(box1.line);
        show(box2);
        show(box2.line);
        show(box3);
    }
    that.hide=function(){
        hide(box1);
        hide(box1.line);
        hide(box2);
        hide(box2.line);
        hide(box3);
    }
    that.update = function(){
        box1.update();
        box2.update();
        box3.update();
    }
    path.update();
    return that;
}


function Path(parent){
    var that=parent.appendChild(createSVG("path"));
    set(that,"style","cursor:pointer");
    that.segments = [];
    that.boxes=[];
    var moving = false;
    set(that,"stroke","black");
    set(that,"fill","none");
    that.addSeg = function(x){
        that.segments.push(x);
        that.update();
    }
    that.update=function(){
        var data="";
        for (var i=0;i<that.segments.length;i++){
            data+=that.segments[i].type;
            for (var e=0;e<that.segments[i].length;e++){
                data+=that.segments[i][e].join(',')+" ";
            }
            that.segments[i].update();
        }
        set(that,"d",data);
    }
    that.hide=function(){
        for (var i=0;i<that.segments.length;i++){
            that.segments[i].hide()
        }
    }
    that.show=function(){
        for (var i=0;i<that.segments.length;i++){
            that.segments[i].show()
        }
    }
    parent.addEventListener("mouseup",function(){moving=false;},true);
    parent.addEventListener("mousemove",function(e){e.preventDefault();
        if (!moving)return;
        var [x,y]=ePos(e);
        var dx=moving[0]-x;
        var dy=moving[1]-y;
        for (var a=0;a<that.segments.length;a++){
            for (var b=0;b<that.segments[a].length;b++){
                that.segments[a][b][0]-=dx;
                that.segments[a][b][1]-=dy;
            }
        }
        for (var i=0;i<that.boxes.length;i++){
            that.boxes[i].update();
        }
        that.update();
        moving=[x,y];
    },false);
    var bgcolor=function(e){var pos=ePos(e);
        setTimeout(function(){
        color_pick(pos,function(x){set(that,"fill",x);});},20);
    }
    var scolor=function(e){var pos=ePos(e);
        setTimeout(function(){
        color_pick(pos,function(x){set(that,"stroke",x);});},20);
    }
    var swidth=function(e){var pos=ePos(e);
        setTimeout(function(){
        width_pick(pos,1,10,function(x){console.log('swidth',x);set(that,"stroke-width",x);});},20);
    }
    that.addEventListener("mousedown",function(e){
        if (e.button==0){
        moving=ePos(e);e.preventDefault();that.show();e.stopPropagation();}},false);
        
    that.addEventListener("contextmenu",function(e){
        e.preventDefault();
        open_menu(ePos(e),["set fill color",bgcolor],
                        ["set line color",scolor],
                        ["set line width",swidth],
                        ["move foreward",function(){MoveUp(that);}],
                        ["move backward",function(){MoveDown(that);}],
                        ["move to top",function(){MoveToTop(that);}],
                        ["move to bottom",function(){MoveToBottom(that);}]);
    },false);
    parent.addEventListener("mousedown",function(e){that.hide();},false);
    
    return that;
}

var main = document.body.appendChild(createSVG("svg"));
main.addEventListener("contextmenu",function(e){e.preventDefault();},true);
var p=Path(main);
moveSeg(main,p,100,100);
lineSeg(main,p,300,400);
lineSeg(main,p,400,300);
cubicSeg(main,p,100,100,150,100,150,150,150,200)
