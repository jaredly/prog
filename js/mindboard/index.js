function cE(e){return document.createElement(e);}
function $(e){return document.getElementById(e);}
function cTN(e){return document.createTextNode(e);}

function addEvent(obj,evt,fn) {
	if (obj.addEventListener)
		obj.addEventListener(evt,fn,false);
	else if (obj.attachEvent)
		obj.attachEvent('on'+evt,fn);
}
function removeEvent(obj,evt,fn) {
	if (obj.removeEventListener)
		obj.removeEventListener(evt,fn,false);
	else if (obj.detachEvent)
		obj.detachEvent('on'+evt,fn);
}
function stopEvent(e){
    e.stopPropagation?e.stopPropagation():(e.cancelBubble=true);
}
function ePos(e){
    if (e.pageX)return [e.pageX,e.pageY];
    return [e.clientX + document.body.scrollLeft - document.body.clientLeft,
        e.clientY + document.body.scrollTop  - document.body.clientTop]
}
function getPos(what){
    var pos = [what.offsetLeft,what.offsetTop];
    while (what=what.offsetParent){
        pos[0]+=what.offsetLeft;
        pos[1]+=what.offsetTop;
    }
    return pos;
}
function getPosition(node){
    var x=0;
    var y=0;
    while (p=node.offsetParent){
        x+=p.offsetLeft;
        y+=p.offsetTop;
    }
    x+=node.offsetLeft;
    y+=node.offsetTop;
    return [x,y];
}


var moving = null;
var lastpos = null;
var diffpos = null;
var over = null;
var entries = [];

addEvent(document,"mousedown",function(e){
    if (e.button==1){
        Item(ePos(e));
    }
},true);

document.oncontextmenu = function(){return false;}


    document.onmousedown=function(e){ if (e.button!=1)return
        stopEvent(e);
        if (e.preventDefault)
            e.preventDefault();
        e.returnValue = false;
        return false;
    }

addEvent(document,"mousemove",function(e){
    if (!moving) return;
    var pos = ePos(e);
    if (lastpos){
        diffpos = [lastpos[0]-pos[0], lastpos[1]-pos[1]];
    }{    moving.center = pos;
        if (moving.parentNode!=document.Body)
            document.body.appendChild(moving);
        moving.style.left = moving.center[0]-moving.text.offsetWidth/2;
        moving.style.top = moving.center[1]-moving.text.offsetHeight/2;
        moving.style.position="absolute";
    }
    over=null;
  /*  for (var i=0;i<entries.length;i++){
        if (entries[i]==moving)continue
        if (entries[i].collide(pos)){
            entries[i].text.style.border="2px dotted black";
            over=entries[i];
        }else{
            entries[i].text.style.border="none";
        }
    }*/
    lastpos = pos;
});

addEvent(document,"mouseup",function(e){
    if (!moving) return;
    var pos = ePos(e);
    if (over){
        over.children.appendChild(moving);
        moving.style.position="static";
        moving.style.top="";
        moving.style.left="";
    }
    moving = null;
    for (var i=0;i<entries.length;i++){
        entries[i].text.style.border="none";
    }
    
});

function Item(pos){
    var that = document.body.appendChild(cE("div"));
    entries.push(that);
    that.className = "entry";
    that.style.left = pos[0]+"px";
    that.style.top = pos[1]-5+"px";
    that.textSize = 0.8;
    that.vector = [0,0];
    
    that.center = pos;
    that.collide = function(pos){
        var tpos = getPos(that.text);
        if (tpos[0]<pos[0] && pos[0]<tpos[0]+that.text.offsetWidth){
            if(tpos[1]<pos[1] && pos[1]<tpos[1]+that.text.offsetHeight){
                return true;
            }
        }
        return false;
    }
    that.entry = that.appendChild(cE("input"));
    that.entry.type = "text";
    that.text = that.appendChild(cE("div"));
    that.text.style.display = "none";
    that.children = that.appendChild(cE("div"));
    that.children.className="children";
    that.reposition = function(){
        that.style.left = that.center[0]-that.text.offsetWidth/2
        that.style.top = that.center[1]-that.text.offsetHeight/2
    }
    that.loop = function(){
        if (that.vector == [0,0])return;
        that.center[0]-=that.vector[0];
        that.center[1]-=that.vector[1];
        that.reposition();
        that.vector[0]*=.9;
        that.vector[1]*=.9;
        if (Math.abs(that.vector[0])<4 && Math.abs(that.vector[1])<4){
            that.vector = [0,0];
            return;
        }
        setTimeout(that.loop,20);
    }
    that.remove = function(){
        entries.splice(entries.indexOf(that),1);
        document.body.removeChild(that);
    }
    that.entry.onblur = function(){
        if (!that.entry.value) that.remove();
        that.text.innerHTML = that.entry.value;
        that.text.style.display = "inline";
        that.entry.style.display = "none";
    }
    addEvent(that.entry,"keypress",function(){
        that.entry.style.width = that.entry.value.length*.8 +"em";
        that.style.width = that.entry.value.length*.8 +"em";
        that.style.left = that.center[0]-that.offsetWidth/2
    });
    that.text.onmousedown=function(e){
        if (e.button==1){
            var it = Item(ePos(e));
            entries.push(it);
            that.children.appendChild(it);
            it.entry.focus();console.log(it)
            it.style.position="static";
            it.style.top="";
            it.style.left="";
        }
        if (that.text.style.display=="inline"){
            moving = that;
            stopEvent(e);
            if (e.preventDefault)
                e.preventDefault();
            e.returnValue = false;
            return false;
        }
    }
    addEvent(that.entry,"keyrelease",function(){
        that.entry.style.width = that.entry.value.length*.8 +"em";
        that.style.width = that.entry.value.length*.8 +"em";
        that.style.left = that.center[0]-that.offsetWidth/2
    });
    addEvent(that,"dblclick",function(){
        that.text.style.display = "none";
        that.entry.style.display = "inline";
        that.entry.focus();
    });
    
    that.entry.focus();
    return that;
}

function wheel(event){
    var delta = 0;
    that = event.target.parentNode;
    if (that.className != "entry"){
        that=that.parentNode;
    }
    if (!that || !that.className == "entry") return;
    if (!event)
        event = window.event;
    if (event.wheelDelta) {
        delta = event.wheelDelta/120;
        if (window.opera)
            delta = -delta;
    } else if (event.detail) {
        delta = -event.detail/3;
    }
    delta /= 10;
    if (delta)
        that.textSize -= delta;
        that.style.fontSize = that.textSize+"em";
        that.reposition();
    if (event.preventDefault)
        event.preventDefault();
    event.returnValue = false;
}

function save(){
    
}


if (window.addEventListener)
    window.addEventListener('DOMMouseScroll', wheel, false);
window.onmousewheel = wheel;



//////////    Save/Load functions     /////////////////


function toString(node){
    var ls = "{";
    ls+='"value":' + '"' + node.entry.value + '",';
    ls+='"center":' + '[' + node.center + '],';
    ls+='"size": "' + node.style.fontSize + '",';
    ls+='"children": ['
    for (var i=0;i<node.children.childNodes.length;i++){
        ls += toString(node.children.childNodes[i]) +",";
}
    return ls + "]}"
}

function save(){
    var them = [];
    childs = document.body.childNodes 
    for (var i=0;i<childs.length;i++){
        if (childs[i].className && childs[i].className=="entry")
            them.push(childs[i])
    }
    var string = "["
    for (var i=0;i<them.length;i++){
        string+=toString(them[i]) + ",";
    }
    string+="]";
    return string;
}

function load(string){
    eval("var that="+string);
    revive(that)
}

function revive(that,parent){
    for (var i=0;i<that.length;i++){
        var node = Item(that[i].center);
        if (parent){
            parent.children.appendChild(node);
            node.style.position="static";
            node.style.top=node.style.left="";
        }
        node.entry.value = that[i].value;
        node.center = that[i].center
        node.text.innerHTML = that[i].value;
        node.style.fontSize = that[i].size
        node.textSize = that[i].size;
        revive(that[i].children,node);
        node.reposition();
    }
}

function setCookie(name, value, expires, path, domain, secure) {
  var curCookie = name + "=" + escape(value) +
      ((expires) ? "; expires=" + expires.toGMTString() : "") +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      ((secure) ? "; secure" : "");
  document.cookie = curCookie;
}

function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
} else
    begin += 2;
  var end = document.cookie.indexOf(";", begin);
  if (end == -1)
    end = dc.length;
  return unescape(dc.substring(begin + prefix.length, end));
}

function Load(){
   // old load(getCookie("stored"));
    load(_load()[0]);
}

function Save(){
   // old setCookie("stored",save());
    _Save(save());
}

Load();
//////////   Menu   //////////////