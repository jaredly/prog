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

function mousePos(em,e){
    pos=findPos(em)
    var posx = 0;
    var posy = 0;
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
    a=[posx+pos[0],posy+pos[1]];
    return a;
}



////////////////////////////////  Controller Objects   /////////////////////


//// Circle

function Circle(svg,x,y,r,style){
    this.obj=circle(x,y,r,style);
    svg.appendChild(this.obj);
    this.x=x;
    this.y=y;
    this.r=r;
    this.selected=0;
    this.moving=0;
    this.obj.parent=this;
    this.obj.mouseup=mouseup;
    this.obj.mousemove=mousemove;
    this.obj.blur=blur;
    this.obj.addEventListener('mouseup',mouseup,false);
    this.obj.addEventListener('mousedown',mousedown,false);
    this.obj.addEventListener('mousemove',mousemove,false);
    this.box=movebox(svg,this.x-this.r,this.y,this);
    this.apply=function(){
        this.obj.cx.baseVal.value=this.x;
        this.obj.cy.baseVal.value=this.y;
        this.obj.r.baseVal.value=this.r;
    }
    this.box.move=function(e){
        pos=mousePos(this.parentNode,e);
        if (this.moving){
            set(this,'x',pos[0]-5);
            this.parent.r=this.parent.x-pos[0];
            this.parent.apply();
        }
    }

    function mousedown(e){
        this.selected=1;this.parentNode.appendChild(this.parent.box)
        console.log(this,this.selected,e);
        this.moving=mousePos(this.parentNode,e);
    }
    function mouseup(e){
        this.moving=0;
    }
    function blur(){
        if (this.moving || this.parent.box.moving){return;}
        console.log('blur',this);
        if (this.selected)
        this.parentNode.removeChild(this.parent.box)
        this.selected=0;
    }
    function mousemove(e){
        pos=mousePos(this.parentNode,e)
        if (this.moving){
            this.parent.x+=pos[0]-this.moving[0];
            this.parent.y+=pos[1]-this.moving[1];
            this.parent.box.x.baseVal.value+=pos[0]-this.moving[0];
            this.parent.box.y.baseVal.value+=pos[1]-this.moving[1];
            this.moving=pos
            this.parent.apply();
        }
    }
}


////  Rectangle

function Rect(svg,x,y,w,h,style){
    this.obj=rect(x,y,w,h,0,0,style);
    svg.appendChild(this.obj);
    this.x=x;
    this.y=y;
    this.h=h;
    this.w=w;
    this.selected=0;
    this.moving=0;
    this.obj.parent=this;
    this.obj.mouseup=mouseup;
    this.obj.mousemove=mousemove;
    this.obj.blur=blur;
    this.obj.addEventListener('mouseup',mouseup,false);
    this.obj.addEventListener('mousedown',mousedown,false);
    this.obj.addEventListener('mousemove',mousemove,false);
    this.boxes=[movebox(svg,this.x,this.y,this),
        movebox(svg,this.x+this.w,this.y,this),
        movebox(svg,this.x+this.w,this.y+this.h,this),
        movebox(svg,this.x,this.y+this.h,this)];
    this.apply=function(){
        this.obj.x.baseVal.value=this.x;
        this.obj.y.baseVal.value=this.y;
        this.obj.width.baseVal.value=this.w;
        this.obj.height.baseVal.value=this.h;
    }

    this.boxes[0].move=function(e){
        pos=mousePos(this.parentNode,e);
        if (this.moving){
            this.parent.w+=this.parent.x-pos[0]
            this.parent.h+=this.parent.y-pos[1]
            set(this,'x',pos[0]-5);
            set(this,'y',pos[1]-5);
            this.parent.x=pos[0];
            this.parent.y=pos[1];
            this.parent.boxes[3].x.baseVal.value=this.parent.x-5
            this.parent.boxes[1].y.baseVal.value=this.parent.y-5
            this.parent.apply();
        }
    }
    this.boxes[1].move=function(e){
        pos=mousePos(this.parentNode,e);
        if (this.moving){
            this.parent.w=pos[0]-this.parent.x
            this.parent.h+=this.parent.y-pos[1]
            set(this,'x',pos[0]-5);
            set(this,'y',pos[1]-5);
            this.parent.boxes[0].y.baseVal.value=this.parent.y-5
            this.parent.boxes[2].x.baseVal.value=this.parent.x+this.parent.w-5
            this.parent.y=pos[1]
            this.parent.apply();
        }
    }
    this.boxes[2].move=function(e){
        pos=mousePos(this.parentNode,e);
        if (this.moving){
            set(this,'x',pos[0]-5);
            set(this,'y',pos[1]-5);
            this.parent.w=pos[0]-this.parent.x;
            this.parent.h=pos[1]-this.parent.y;
            this.parent.boxes[3].y.baseVal.value=this.parent.y+this.parent.h-5
            this.parent.boxes[1].x.baseVal.value=this.parent.x+this.parent.w-5
            this.parent.apply();
        }
    }
    this.boxes[3].move=function(e){
        pos=mousePos(this.parentNode,e);
        if (this.moving){
            set(this,'x',pos[0]-5);
            set(this,'y',pos[1]-5);
            this.parent.w+=this.parent.x-pos[0]
            this.parent.x=pos[0];
            this.parent.h=pos[1]-this.parent.y;
            this.parent.boxes[2].y.baseVal.value=this.parent.y+this.parent.h-5
            this.parent.boxes[0].x.baseVal.value=this.parent.x-5
            this.parent.apply();
        }
    }

    function mousedown(e){
        this.selected=1;
        for (var i=0;i<this.parent.boxes.length;i++){
            this.parentNode.appendChild(this.parent.boxes[i])
        }
        console.log(this,this.selected,e);
        this.moving=mousePos(this.parentNode,e);
    }
    function mouseup(e){
        this.moving=0;
    }
    function blur(){
        if (this.moving){return;}
        for (var i=0;i<4;i++){if (this.parent.boxes[i].moving){return}}
        //console.log('blur',this);
        if (this.selected)
        for (var i=0;i<this.parent.boxes.length;i++){
            this.parentNode.removeChild(this.parent.boxes[i])
        }
        this.selected=0;
    }
    function mousemove(e){
        pos=mousePos(this.parentNode,e)
        if (this.moving){
            this.parent.x+=pos[0]-this.moving[0];
            this.parent.y+=pos[1]-this.moving[1];
            for (var i=0;i<this.parent.boxes.length;i++){
                this.parent.boxes[i].x.baseVal.value+=pos[0]-this.moving[0];
                this.parent.boxes[i].y.baseVal.value+=pos[1]-this.moving[1];
            }
            this.moving=pos
            this.parent.apply();
        }
    }
}








///////////////////////////////  create SGV Elements  ///////////////


var svgNamespace = 'http://www.w3.org/2000/svg';
function createSVG(thing){
    return document.createElementNS(svgNamespace, thing);
}
function set(a,x,y){
    a.setAttribute(x,y);
}

function line(x1,y1,x2,y2,style){
    var obj=createSVG('line');
    set(obj,'x1',x1+'px');
    set(obj,'y1',y1+'px');
    set(obj,'x2',x2+'px');
    set(obj,'y2',y2+'px');
    set(obj,'stroke',style.color||"black");
    set(obj,'stroke-width',style.width||1);
    return obj;
}
function circle(x,y,r,style){
    var obj=createSVG('circle');
    set(obj,'cx',x+'px');
    set(obj,'cy',y+'px');
    set(obj,'r',r+'px');
    set(obj,'fill',style.bgcolor||"black");
    set(obj,'stroke',style.lcolor||"black");
    set(obj,'stroke-width',style.lwidth||1);
    return obj;
}
function rect(x,y,w,h,rx,ry,style){
    var obj=createSVG('rect');
    set(obj,'x',x+'px');
    set(obj,'y',y+'px');
    set(obj,'width',w+'px');
    set(obj,'height',h+'px');
    rx?set(obj,'rx',rx+'px'):null;
    ry?set(obj,'ry',ry+'px'):null;
    set(obj,'fill',style.bgcolor||"black");
    set(obj,'stroke',style.lcolor||"black");
    set(obj,'stroke-width',style.lwidth||1);
    return obj;
}
function movebox(svg,x,y,parent){
    var obj=createSVG('rect');
    //svg.appendChild(obj);
    set(obj,'x',x-5+'px');
    set(obj,'y',y-5+'px');
    set(obj,'width',10+'px');
    set(obj,'height',10+'px');
    set(obj,'fill',"white");
    set(obj,'stroke',"black");
    set(obj,'stroke-width',1);
    obj.parent=parent;
    obj.moving=0;
    obj.move=function(e){}
    obj.addEventListener('mousedown',function(e){this.moving=1;},false);
    obj.addEventListener('mouseup',function(){this.moving=0;},false);
    obj.addEventListener('mousemove',function(e){
        this.move(e);
    },false);
    obj.mousemove=function(e){
        this.move(e);
    }
    return obj;
}
function ellipse(x,y,rx,ry,style){
    var obj=createSVG('ellipse');
    set(obj,'cx',x+'px');
    set(obj,'cy',y+'px');
    set(obj,'rx',rx+'px');
    set(obj,'ry',ry+'px');
    set(obj,'fill',style.bgcolor||"black");
    set(obj,'stroke',style.lcolor||"black");
    set(obj,'stroke-width',style.lwidth||1);
    return obj;
}