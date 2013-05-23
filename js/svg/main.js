function range(s,e,i){var r=[];for (;s<e;s+=i){r.push(s);}return r;}


function SuperNode(parent,type){ /**************** fix confusion re that.node / that.x ***/
    var that=parent.appendChild(createSVG(type));   
    set(that,"style","cursor:pointer;"); 
    that._moving=false;
    that._menu = [];
    that.onmenu = function(){}
    that.ondown = function(){}
    that.addEventListener("mousedown",function(e){
        e.preventDefault = true;
        e.stopPropagation();
        that._moving = ePos(e);
        that.ondown(that._moving,e);
    },false);
    that.addEventListener("contextmenu",function(e){
        e.preventDefault();
        that.onmenu();
        if (!that._menu.length) return;
        open_menu(ePos(e),that._menu);
    },false);
    document.addEventListener("mouseup",function(e){that._moving=false;},false);
    return that;
}

function Box(parent,node,x,y,fill){
    var that = SuperNode(parent,"rect");
    that.onmove = function(){}
    set(that,"x",x-3.5);
    set(that,"y",y-3.5);
    set(that,"width",7);
    set(that,"height",7);
    set(that,"fill",fill||"white");
    set(that,"stroke","red");
    that._x=x;
    that._y=y;
    //that.ondown = function(){node.select();}
    document.addEventListener("mousemove",function(e){
        if (that._moving){
            var [x,y]=ePos(e);
            var [dx,dy]=[x-that._moving[0],y-that._moving[1]];
            that.onmove([x,y],[dx,dy]);
            that._moving = [x,y];
            that.setCenter(x,y);
        }
    },true);
    that.setCenter = function(x,y){
        set_pos(that,x-3.5,y-3.5);
        //set(that,"x",x-3.5);
        //set(that,"y",y-3.5);
    }
    that.getCenter = function(){
        return [that.x.baseVal.value+3.5,that.y.baseVal.value+3.5];
    }
    that.tostr = function(){
        var [x,y]=that.getCenter();
        return x+","+y;
    }
    return that;
}
function Box2(parent,node,x,y,funcs,partners,fill){
    var that = Box(parent,node,x,y,fill);
    that.onmove = function(pos,d){
        if (partners){
            [partner.move(d[0],d[1]) for each(partner in partners)];
        }
        that._onmove(pos,d);
    }
    that.addpartner = function(x){
        partners.push(x);
    }
    that._onmove = function(pos,d){
        [func(pos[0],pos[1]) for each(func in funcs)];
        node.update();
    }
    that.add_func = function(x){funcs.push(x);};
    that.move = function(x,y){
        var [a,b] = that.getCenter();
        that.setCenter(a+x,b+y);
        that._onmove([a+x,b+y]);
    }
    return that;
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

function geti(a,x){return int(a.getAttribute(x));}

function Rect(parent,x,y,w,h){
    var that = SuperNode(parent,"rect");
    var pos = null;
    
    var [left,top] = [x,y];
    var [width,height] = [w,h];
    
    that.onmove = function(pos,pos2){/*console.log(pos,pos2);*/}
    set(that,"x",x);
    set(that,"y",y);
    set(that,"width",w);
    set(that,"height",h);
    set(that,"fill","blue");
    document.addEventListener("mousemove",function(e){
        if (that._moving){
            var [ex,ey]=ePos(e);
            var [dx,dy]=[ex-that._moving[0],ey-that._moving[1]];
            that._moving = [ex,ey];
            that.onmove([ex,ey],[dx,dy]);
            left+=dx;
            top+=dy;
            that.update();
        }
    },false);
    
    document.addEventListener("mousedown",function(e){
        that.deselect();
    },true);
    
    that.deselect = function(){
        hide(box1);
        hide(box2);
        hide(box3);
        hide(box4);
    }
    that.select = function(){
        MoveToTop(that);
        show(box1);
        MoveToTop(box1);
        show(box2);
        MoveToTop(box2);
        show(box3);
        MoveToTop(box3);
        show(box4);
        MoveToTop(box4);
    }
    
    that.addEventListener("mousedown",function(){that.select();},false);
    
    that.update = function(){
        set(that,"x",left);
        set(that,"y",top);
        set(that,"width",width);
        set(that,"height",height);
        box1.setCenter(left,top);
        box2.setCenter(left+width,top);
        box3.setCenter(left+width,top+height);
        box4.setCenter(left,top+height);
    }
    
    var box1 = Box(parent,that,x,y);
    var box2 = Box(parent,that,x+w,y);
    var box3 = Box(parent,that,x+w,y+h);
    var box4 = Box(parent,that,x,y+h);
    
    box1.onmove = function(pos,rel){
        width-=pos[0]-left;
        height-=pos[1]-top;
        [left,top]=pos;
        that.update();
    }
    box2.onmove = function(pos,rel){
        width+=pos[0]-width-left;
        height-=pos[1]-top;
        [left,top]=[pos[0]-width,pos[1]];
        that.update();
    }
    box3.onmove = function(pos,rel){
        width+=pos[0]-width-left;
        height+=pos[1]-height-top;
        [left,top]=[pos[0]-width,pos[1]-height];
        that.update();
    }
    box4.onmove = function(pos,rel){
        width-=pos[0]-left;
        height+=pos[1]-height-top;
        [left,top]=[pos[0],pos[1]-height];
        that.update();
    }
    that.boxes = [box1,box2,box3,box4];
    
    return that;
}

function Ellipse(parent,cx,cy,rx,ry){
    var that = SuperNode(parent,"ellipse");
    var pos = null;
    
    var [width,height] = [rx*2,ry*2];
    var [left,top] = [cx-rx,cy-ry];
    
    that.onmove = function(pos,pos2){}
    set(that,"cx",cx);
    set(that,"cy",cy);
    set(that,"rx",rx);
    set(that,"ry",ry);
    set(that,"fill","blue");
    document.addEventListener("mousemove",function(e){
        if (that._moving){
            var [ex,ey]=ePos(e);
            var [dx,dy]=[ex-that._moving[0],ey-that._moving[1]];
            that._moving = [ex,ey];
            left+=dx;
            top+=dy;
            that.update();
        }
    },false);
    document.addEventListener("mousedown",function(e){
        that.deselect();
    },true);
    
    that.deselect = function(){
        hide(box1);
        hide(box2);
        hide(box3);
        hide(box4);
    }
    that.select = function(){
        MoveToTop(that);
        show(box1);
        MoveToTop(box1);
        show(box2);
        MoveToTop(box2);
        show(box3);
        MoveToTop(box3);
        show(box4);
        MoveToTop(box4);
    }
    
    that.addEventListener("mousedown",function(){that.select();},false);
    
    that.update = function(){
        set(that,"cx",left+width/2);
        set(that,"cy",top+height/2);
        set(that,"rx",width/2);
        set(that,"ry",height/2);
        box1.setCenter(left,top);
        box2.setCenter(left+width,top);
        box3.setCenter(left+width,top+height);
        box4.setCenter(left,top+height);
    }
    
    var box1 = Box(parent,that,left,top);
    var box2 = Box(parent,that,left+width,top);
    var box3 = Box(parent,that,left+width,top+height);
    var box4 = Box(parent,that,left,top+height);
    
    box1.onmove = function(pos,rel){
        width-=pos[0]-left;
        height-=pos[1]-top;
        [left,top]=pos;
        that.update();
    }
    box2.onmove = function(pos,rel){
        width+=pos[0]-width-left;
        height-=pos[1]-top;
        [left,top]=[pos[0]-width,pos[1]];
        that.update();
    }
    box3.onmove = function(pos,rel){
        width+=pos[0]-width-left;
        height+=pos[1]-height-top;
        [left,top]=[pos[0]-width,pos[1]-height];
        that.update();
    }
    box4.onmove = function(pos,rel){
        width-=pos[0]-left;
        height+=pos[1]-height-top;
        [left,top]=[pos[0],pos[1]-height];
        that.update();
    }
    that.boxes = [box1,box2,box3,box4];
    
    return that;
}

function Properties(title,func){ // soo (title,[name,type,defval,[opslist]],...) type = string|num|[list--choice]
    var frame = cE("div");
    frame.style.backgroundColor="lightgreen";
    frame.style.border = "solid 2px green";
    frame.appendChild(cE("h3")).innerHTML = title;
    var items = [];
    function metamaker(node){
        return function(){return node.value;};
    }
    for (var i=2;i<arguments.length;i++){
        var item = frame.appendChild(cE("div"));
        var name = item.appendChild(cE("span"));
        name.innerHTML = arguments[i][0];
        if (arguments[i][1]=="string"){
            var entry = item.appendChild(cE("input"));
            entry.value = arguments[i][2] || "";
            items.push([arguments[i][0],function(){return entry.value;}]);
        }else if(arguments[i][1]=="list"){
            var options = item.appendChild(cE("select"));
            for (var ii=0;ii<arguments[i][3].length;ii++){
                var op = options.appendChild(cE("option"));
                op.innerHTML = op.value = arguments[i][3][ii];
            }
            items.push([arguments[i][0],metamaker(options)]);
        }else if (arguments[i][1]=="number"){
            var entry = item.appendChild(cE("input"));
            entry.value = arguments[i][2] || "";
            var validate = function(){
                return !isNaN(parseInt(entry.value));
            }
            items.push([arguments[i][0],function(){return parseInt(entry.value);},validate]);
        }
    }
    var ok = frame.appendChild(cE("button"));
    ok.innerHTML = "Ok";
    ok.onclick = function(){
        var ret = [];
        for (var i=0;i<items.length;i++){
            if (items[i][2] && !items[i][2]()){
                alert("Invalid value for "+items[i][0]);
                return;
            }else{
                ret.push(items[i][1]());
            }
        }
        document.body.removeChild(frame);
        console.log(ret);
        func(ret);
        return;
    }
    var cancel = frame.appendChild(cE("button"));
    cancel.innerHTML = "Cancel";
    cancel.onclick = function(){
        document.body.removeChild(frame);
    }
    frame.style.visibility = "hidden";
    frame.style.position="absolute";
    frame.style.top = "50%";
    frame.style.left = "50%";
    document.body.appendChild(frame);
    var size = windowSize();
    frame.style.marginLeft = -frame.offsetWidth/2+"px";
    frame.style.marginTop = -frame.offsetHeight/2+'px';
    frame.style.visibility = "visible";
}

function Path(parent,d,lcolor,lwidth,fcolor){ /************** test this -- especially the selection *****/
    var that = SuperNode(parent,"path");
    that.segments = [];
    
    set(that,"fill",fcolor||"none");
    set(that,"stroke",lcolor||"black");
    set(that,"stroke-width",lwidth||2);
    set(that,"style","cursor:pointer");
    
    that.update = function(){
        var txt = "";
        [txt+=i.tostring() for each(i in that.segments)]
        set(that,"d",txt);
    }
    that.show = function(){
        [i.show() for each(i in that.segments)]
    }
    that.hide = function(){
        [i.hide() for each(i in that.segments)]
    }
    
    that.properties = function(){
        Properties("Path Properties",function(ret){
                set(that,"stroke",ret[0]);
                set(that,"stroke-width",ret[1]);
                set(that,"fill",ret[2]);
            },["Color","list","black",["black","red","blue","green","orange","yellow","pink"]],
            ["Width","number",1],
            ["Fill","list","none",["none","blue","red","green","orange","yellow","pink"]]);
    }
    that.clone = function(){alert("Clone not implemented");}
    that._delete = function(){
        parent.removeChild(that);
        if (selected.indexOf(that)!=-1)selected.splice(selected.indexOf(that),1);
        [seg._delete() for each(seg in that.segments)];
    }
    that.split = function(){alert("Not Implemented");}
    that.join = function(){
        var mylast = that.segments[0].boxes[0];
        for (var i=0;i<selected.length;i++){
            if (that!=selected[i]){
                for (var ii=0;ii<selected[i].segments.length;ii++){
                    var mylast = that.segments.slice(-1)[0].last();
                    var myfirst = that.segments[0].boxes[0];
                    that.segments.push(selected[i].segments[ii].clone(that,mylast,myfirst));
                }
                selected[i]._delete();
                break; // only join one other
            }
        }
        that.update();
    }
    that.join_to = function(what){
        var mylast = that.segments.slice(-1)[0].last();
        var myfirst = that.segments[0].boxes[0];
        for (var ii=0;ii<selected[i].segments.length;ii++){
            var mylast = that.segments.slice(-1)[0].last();
            var myfirst = that.segments[0].boxes[0];
            that.segments.push(selected[i].segments[ii].clone(that,mylast,myfirst));
        }
    }
    
    that.onmenu = function(){
        that._menu = [
            ["properties",that.properties],
            ["clone",that.clone],
            ["delete",that._delete]
        ]
        if (that.segments.length>1)that._menu.push(["split",that.split]);
        if (selected.length>1)that._menu.push(["join",that.join]);
    }
    that.ondown = function(pos,e){
        // past=ePos(e);
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
            selected[i]._moving = that._moving;
        }
    }
    that.move = function(dx,dy){
        [i.move(dx,dy) for each(i in that.segments)];
    }
    parent.addEventListener("mousemove",function(e){
        e.stopPropagation();
        if (that._moving==false)return;
        var [x,y] = ePos(e);
        var [ox,oy] = that._moving;
        var [dx,dy] = [x-ox,y-oy];
        that._moving = [x,y];
        [i.move(dx,dy) for each(i in selected)]
        that.update();
    },true);
    parent.addEventListener("mouseup",function(ev){
        that._moving = null;
        if (selected.indexOf(that)!=-1){
            that.show();
        }else{that.hide();}
    },true);
    var ddown = function(e){
        if (selected.indexOf(that)!=-1)selected.splice(selected.indexOf(that),1);
    }
    parent.addEventListener("mousedown",function(ev){ev.preventDefault=true;},true);
    parent.addEventListener("mousedown",function(ev){ev.stopPropagation();ddown(ev);},false);
    parent.onmousedown = function(e){e.preventDefault=true;return false;};
    parent.oncontextmenu = function(e){e.preventDefault = true;return false;};
    return that;
}
function Segment(type){
    var that = {};
    that.type = type;
    that.boxes = [];
    that.show = function(){
        for (var i=0;i<that.boxes.length;i++){
            show(that.boxes[i]);
        }
    }
    that.hide = function(){
        for (var i=0;i<that.boxes.length;i++){
            hide(that.boxes[i]);
        }
    }
    that.move = function(x,y){
        [i.move(x,y) for each(i in that.boxes)]
    }
    that._delete = function(){
        [i.parentNode.removeChild(i) for each(i in that.boxes)];
    }
    return that;
}
function distance(x,y,a,b){
    return Math.sqrt((x-a)*(x-a)+(y-b)*(y-b));
}
function Cubic(parent,path,x,y,a,b,c,d,e,f){
    var that = Segment("Cubic");
    var l1 = Line(parent,x,y,a,b,"lightblue");
    var l2 = Line(parent,c,d,e,f,"lightblue");
    l1.move = l2.move = function(){};
    var b2 = Box2(parent,path,a,b,[l1.set2]);
    set(b2,"fill","red");
    var b1 = Box2(parent,path,x,y,[l1.set1],[b2]);
    var b3 = Box2(parent,path,c,d,[l2.set1]);
    set(b3,"fill","red");
    var b4 = Box2(parent,path,e,f,[l2.set2],[b3]);
    MoveToTop(b2);MoveToTop(b3);
    that.boxes = [b1,b2,b3,b4,l1,l2];
    that.tostring = function(){
        return "M"+b1.tostr()+" C"+[b2.tostr(),b3.tostr(),b4.tostr()].join(" ");
    }
    that.clone = function(npath,endbox,startbox){
        var [ex,ey]=endbox.getCenter();
        var [sx,sy]=startbox.getCenter();
        var [ax,ay]=b1.getCenter();
        var [aa,ab]=b2.getCenter();
        var [ac,ad]=b3.getCenter();
        var [ae,af]=b4.getCenter();
        if (distance(ex,ey,ax,ay)<distance(ex,ey,ae,af)){
            return Partial_Cubic(parent,npath,endbox,aa,ab,ac,ad,ae,af);
        }else{
            return Partial_Cubic(parent,npath,endbox,ac,ad,aa,ab,ax,ay);
        }
    }
    that.last = function(){return b4};
    return that;
}
function Partial_Cubic(parent,path,b1,a,b,c,d,e,f){
    var that = Segment("Cubic");
    var [x,y] = b1.getCenter();
    var l1 = Line(parent,x,y,a,b,"lightblue");
    var l2 = Line(parent,c,d,e,f,"lightblue");
    l1.move = l2.move = function(){};
    var b2 = Box2(parent,path,a,b,[l1.set2]);
    set(b2,"fill","red");
    b1.addpartner(b2);
    b1.add_func(l1.set1);
    var b3 = Box2(parent,path,c,d,[l2.set1]);
    set(b3,"fill","red");
    var b4 = Box2(parent,path,e,f,[l2.set2],[b3]);
    MoveToTop(b2);MoveToTop(b3);
    that.boxes = [b2,b3,b4,l1,l2];
    that.tostring = function(){
        return " C"+[b2.tostr(),b3.tostr(),b4.tostr()].join(" ");
    }
    that.clone = function(npath,endbox){
        var [ex,ey]=endbox.getCenter();
        var [ax,ay]=b1.getCenter();
        var [aa,ab]=b2.getCenter();
        var [ac,ad]=b3.getCenter();
        var [ae,af]=b4.getCenter();
        if (distance(ex,ey,ax,ay)<distance(ex,ey,ae,af)){
            return Partial_Cubic(parent,npath,endbox,aa,ab,ac,ad,ae,af);
        }else{
            return Partial_Cubic(parent,npath,endbox,ac,ad,aa,ab,ax,ay);
        }
    }
    that.last = function(){return b4};
    return that;
}

function OldPath(parent,stroke,width,fill,log){
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
        set(that,"d",text);
    }
    return that;
}
function Seg(type){
    var that = array(arguments).slice(1);
    that.type=type;
    that.logs = [];
    return that;
}

function make(x){
    creating = x;
}

/*********** global variables *********/

var creating = null;
var main = document.body.appendChild(createSVG("svg"));
set(main,"height","500px");
var selected = [];

var p = Path(main,"");
var s = Cubic(main,p,100,100,110,110,200,150,350,275);
p.segments.push(s);
p.update();

main.addEventListener("mousedown",function(e){
    var [x,y]=ePos(e);
    if (creating=="ellipse"){
        var temp = Ellipse(main,x,y,2,2);
        temp.boxes[2]._moving=[x,y];
    }
    if (creating=="rect"){
        var temp = Rect(main,x,y,2,2);
        temp.boxes[2]._moving=[x,y];
    }
    if (creating=="bez"){
        var temp = Path(main,"");
        var cb = Cubic(main,temp,x,y,x,y,x,y,x,y);
        cb.boxes[0]._moving = [x,y];
        temp.segments.push(cb);
        temp.update();
    }
    creating = null;
},false);

