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
var main = document.body.appendChild(createSVG("svg"));
main.style.height="100%";
set(main,"height","100%");
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

// Path

function Path(parent,stroke,width,fill,log){
    var that = {};
    that.node = parent.appendChild(createSVG("path"));
    that.logs = [];
    set(that.node,"stroke",stroke||"black");
    set(that.node,"stroke-width",width);
    set(that.node,"fill",fill||"none");
    that.segs = [];
    var prev = [];
    that.addSeg = function(seg){
        that.segs.push(seg);
        that.update();
        if (!log){
            if (seg.type=="M"){
                seg.logs.push(Dot(parent,seg[0],seg[1],"blue","white",width));
                prev = [seg[0],seg[1]];
            }
            if (seg.type=="L"){
                seg.logs.push(Dot(parent,seg[0],seg[1],"blue","white",width));
                prev = [seg[0],seg[1]];
            }
            if (seg.type=="C"){
                seg.logs.push(Line(parent,prev[0],prev[1],seg[0],seg[1],"lightblue"));
                seg.logs.push(Dot(parent,seg[0],seg[1],"red","white",width));
                seg.logs.push(Line(parent,seg[2],seg[3],seg[4],seg[5],"lightblue"));
                seg.logs.push(Dot(parent,seg[2],seg[3],"red","white",width));
                seg.logs.push(Dot(parent,seg[4],seg[5],"blue","white",width));
                prev = seg[4],seg[5];
            }
        }
    }
    that.update = function(){
        var text = "";
        for (var i=0;i<that.segs.length;i++){
            text+=that.segs[i].type;
            for (var o=0;o<that.segs[i].length;o++){
                text+=that.segs[i][o]+" ";
            }
        }
        // console.log(text);
        set(that.node,"d",text);
    }
    return that;
}
function Seg(type){
    var that = array(arguments).slice(1);
    that.type=type;
    that.logs = [];
    return that;
}

// Circle

function Circle(parent,cx,cy,r,stroke,strokewidth,fill){
    var that = parent.appendChild(createSVG("ellipse"));
    that.setCenter = function(x,y){
        set(that,'cx',x);
        set(that,'cy',y);
    }
    set(that,"cx",cx);
    set(that,"cy",cy);
    set(that,"rx",r);
    set(that,"ry",r);
    set(that,"stroke",stroke||"black");
    set(that,"stroke-width",strokewidth||1);
    set(that,"fill",fill||"white");
    that.setPos = function(x,y){
        set(that,"cx",x);
        set(that,"cy",y);
    }
    return that;
}

// Dot

function Dot(parent,x,y,color,fill,width){
    return Circle(parent,x,y,width||4,color||"black",width||4,fill||"white");
}

// Line

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

// Rect

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
// Bez

function Cubic(parent,x,y,a,b,c,d,e,f,width){
    var that = parent.appendChild(createSVG("path"));
    that.x=x;that.y=y;that.a=a;that.b=b;that.c=c;that.dd=d;that.e=e;that.f=f;
    set(that,"fill","none");
    set(that,"stroke","black");
    set(that,"stroke-width",width||2);
    set(that,"style","cursor:pointer");
    var l1 = Line(parent,x,y,a,b,"lightblue");
    var l2 = Line(parent,c,d,e,f,"lightblue");
    function update(){
        var g="M"+that.x+' '+that.y+' C'+that.a+' '+that.b+' '+that.c+' '+that.dd+' '+that.e+' '+that.f;
        set(that,"d",g);
        l1.set1(that.x,that.y);l1.set2(that.a,that.b);
        l2.set1(that.c,that.dd);l2.set2(that.e,that.f);
        udots();
    }
    function udots(){
        p1.setCenter(that.x,that.y);
        p2.setCenter(that.a,that.b);
        p3.setCenter(that.c,that.dd);
        p4.setCenter(that.e,that.f);
    }
    that.hide=function(){
        hide(p1);
        hide(p2);
        hide(p3);
        hide(p4);
        hide(l1);
        hide(l2);
    }
    that.show = function(){
        show(p1)
        show(p2)
        show(p3)
        show(p4)
        show(l1)
        show(l2)
    }
    that.setMP = function(m,p){moving=m;past=p;}
    that.setMoving=function(what){moving=what;}
    that.addEventListener("click",that.show,false);
    that.addEventListener("mousedown",function(e){
        e.stopPropagation();
        //console.log(this,"heremosedown");
        moving=4;past=ePos(e);
        if (selected.indexOf(that)==-1){
            if (e.shiftKey){
                selected.push(that);
                that.show();
                // join(selected,that);
                // remove(selected);remove(that);return false;
            }else{
                for (var i=0;i<selected.length;i++){
                    selected[i].hide();
                }
                selected = [that];
            }
        }
        for (var i=0;i<selected.length;i++){
            selected[i].setMP(4,ePos(e));
        }
        
    },false);
    //parent.addEventListener("mousedown",that.hide,false);
    
    var moves = [];10
    var past = [0,0];
    var moving = null;
    
    
    var p1 = Rect(parent,x,y,7,7,"red",1,"red"); //Dot(parent,x,y,"red");
    set(p1,"style","cursor:pointer");
    p1.addEventListener("mousedown", function(e){moving=0;e.stopPropagation();},false)
    moves.push(function(e){
        var [x,y] = ePos(e);
        that.a-=that.x-x;
        that.b-=that.y-y;
        that.x=x;that.y=y;
        update();
    })
    var p2 = Rect(parent,a,b,7,7,"red",1); //Dot(parent,a,b,"red");
    set(p2,"style","cursor:pointer");
    p2.addEventListener("mousedown", function(e){moving=1;e.stopPropagation();},false)
    moves.push( function(e){
        [a,b] = ePos(e);
        that.a=a;that.b=b;
        update();
    })
    var p4 = Rect(parent,e,f,7,7,"red",1,"red"); //Dot(parent,e,f,"red");
    var p3 = Rect(parent,c,d,7,7,"red",1); //Dot(parent,c,d,"red");
    set(p3,"style","cursor:pointer");
    p3.addEventListener("mousedown", function(e){moving=2;e.stopPropagation();},false)
    moves.push( function(e){
        [c,d] = ePos(e);
        that.c=c;that.dd=d;
        update();
    })
    set(p4,"style","cursor:pointer");
    p4.addEventListener("mousedown", function(e){moving=3;e.stopPropagation();},false)
    moves.push( function(e){
        [e,f] = ePos(e);
        that.c-=that.e-e;
        that.dd-=that.f-f;
        that.e=e;that.f=f;
        update();
    })
    
    moves.push( function(e){
        var pos=ePos(e);
        var l=['a','b','c','dd','e','f'];
        var dx=past[0]-pos[0];
        var dy=past[1]-pos[1];
        that.x-=dx;
        that.y-=dy;
        that.a-=dx;
        that.b-=dy;
        that.c-=dx;
        that.dd-=dy;
        that.e-=dx;
        that.f-=dy;
        past=pos;
        update();
    });
    parent.addEventListener("mousemove",function(ev){
        if (moving!=null)moves[moving](ev);
        ev.stopPropagation();
    },true);
    parent.addEventListener("mouseup",function(ev){
        moving=null;
        if (selected.indexOf(that)!=-1){
            that.show();
        }else{that.hide();}
    },true);
    parent.addEventListener("mousedown",function(ev){ev.preventDefault();},true);
    parent.addEventListener("mousedown",function(ev){ev.stopPropagation();},false);
    parent.onmousedown = function(e){e.preventDefault();return false;}
    that.dots = [p1,p2,p3,p4]
    update()
    return that;
}

function color_pick(pos,func){console.log(pos);
    open_menu(pos,["red",function(){func("red");}],
                      ["green",function(){func("green");}],
                      ["blue",function(){func("blue");}],
                      ["yellow",function(){func("yellow");}],
                      ["orange",function(){func("orange");}]);
}

function width_pick(pos,now,max,func){console.log(pos)
    var frame = document.body.appendChild(cE("div"));
  //  var pos=ePos(e);console.log(pos);
    frame.style.position="absolute";
    frame.style.width="100px";
    frame.style.height="10px";
    frame.style.backgroundColor="lightgray";
    frame.style.top=pos[1]+"px";
    frame.style.left=pos[0]+"px";
    var down=false;
    var bar = document.body.appendChild(cE("div"));
    bar.style.position="absolute";
    bar.style.top=pos[1]-5+"px";
    bar.style.width="10px";
    bar.style.height="20px";
    bar.style.backgroundColor="gray";
    bar.style.left=pos[0]-5+(now/max*100)+"px";
    bar.addEventListener("mousedown", function(e){down=true;
        e.stopPropagation();
        e.preventDefault();},false);
    document.addEventListener("mouseup",function(){down=false;},true);
    document.addEventListener("mousemove",function(e){if (down){
        bar.style.left = ePos(e)[0]-5+"px";
        console.log((ePos(e)[0]-pos[0])/max);
        func((ePos(e)[0]-pos[0])/max);
    }},true);

    frame.spy = function(e){
            frame.parentNode.removeChild(frame);
            bar.parentNode.removeChild(bar);
            removeEvent(document,"mousedown",frame.spy,true);
        }
    addEvent(document,"mousedown",frame.spy,true)
    return false;
}

function _Path(parent,d){
    var that = parent.appendChild(createSVG("path"));
    set(that,'d',d);
    that.addEventListener("mousedown",function(e){
        open_menu(ePos(e),["set fill color",bgcolor],
                        ["set line color",scolor],
                        ["set line width",swidth],
                        ["move foreward",function(){MoveUp(that);}],
                        ["move backward",function(){MoveDown(that);}],
                        ["move to top",function(){MoveToTop(that);}],
                        ["move to bottom",function(){MoveToBottom(that);}]);
                        
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
}

function declare_globals(){}

var creating = false;
var selected = [];

document.getElementById("bez").addEventListener("click",function(){creating=true;},false);
document.getElementById("load").addEventListener("click",Load,false);
document.getElementById("save").addEventListener("click",Save,false);

main.addEventListener("mousedown",function(e){
    selected = [];
    console.log("mousedown-global");
    if (creating){
    var [x,y]=ePos(e);console.log([x,y])
    var c=Cubic(main,x,y,x,y,x,y,x,y);
    c.setMoving(3);
    console.log(c);
    creating=false;
    }
},false);
main.addEventListener("mouseup",function(e){
    for (var i=0;i<selected.length;i++){
        selected[i].moving=null;
    }
},true);

function remove(what){main.removeChild(what);}

function reverse(x){
    var a=[];
    for (var i=x.length/2;i>0;i--){
        a.push(x[i*2-2]);
        a.push(x[i*2-1]);
    }
    return a;
}

function join(one,two){
    one.hide();two.hide();
    var o=[one.x,one.y,one.a,one.b,one.c,one.dd,one.e,one.f];
    var t=[two.x,two.y,two.a,two.b,two.c,two.dd,two.e,two.f];
    console.log(o,t,dst(one.x,one.y,two.x,two.y),dst(one.x,one.y,two.e,two.f))
    if (dst(one.x,one.y,two.x,two.y)<dst(one.x,one.y,two.e,two.f)){
        t=reverse(t);
    }
    //var np=main.appendChild(createSVG("path"));
    //set(np,"d","M"+o[0]+" "+o[1]+" C"+o.slice(2).join(' ')+"L"+t[0]+" "+t[1]+" C"+t.slice(2).join(' '));
    var d= "M"+o[0]+" "+o[1]+" C"+o.slice(2).join(' ')+"L"+t[0]+" "+t[1]+" C"+t.slice(2).join(' ');
    np=_Path(main,d);
}

function dst(a,b,c,d){
    return Math.abs(Math.sqrt(Math.abs((a-c)*(a-c)-(b-d)*(b-d))));
}

function MoveToTop( svgNode )
{
   svgNode.parentNode.appendChild( svgNode );
}

function MoveToBottom( svgNode )
{
   svgNode.parentNode.insertBefore( svgNode, svgNode.parentNode.firstChild );
}

function MoveDown( svgNode ){
    svgNode.parentNode.insertBefore(svgNode,svgNode.previousChild);
}

function MoveUp( svgNode ){
    svgNode.parentNode.insertBefore(svgNode,svgNode.nextChild.nextChild);
}

function zSwap(parent, elem1, elem2)
{
   var tmp = elem1.cloneNode( true );
   parent.replaceChild( tmp, elem2 );
   parent.replaceChild( elem2, elem1 );
}

function _save(){
    var paths=document.getElementsByTagName("path");
    var all=[];
    for (var i=0;i<paths.length;i++){
        all.push(paths[i].getAttribute("d"));
    }
    return all;
}

function int(x){return parseInt(x);}

function __load(what){
    var n=what.replace(/[MC]/g,"").split(/[, ]/g);
    Cubic(main,int(n[0]),int(n[1]),int(n[2]),int(n[3]),int(n[4]),int(n[5]),int(n[6]),int(n[7]));
}

function _load(all){
    for (var i=0;i<all.length;i++)__load(all[i]);
}

function Load(){
    getMultiLine("Enter Codes",function(x){
        _load(eval(x));
    })
}

function Save(){
    var z=_save();
    var a='["';
    for (var i=0;i<z.length;i++){
        a+=z[i]+'","';
    }
    showMultiLine(a.slice(0,-2)+"]");
}

