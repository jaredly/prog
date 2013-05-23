function cE(e){return document.createElement(e);}
function $(e){return document.getElementById(e);}
function cTN(e){return document.createTextNode(e);}
if (typeof(console)=="undefined") console={log:function(){}};

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
function remove(what){main.removeChild(what);}
function reverse(x){
    var a=[];
    for (var i=x.length/2;i>0;i--){
        a.push(x[i*2-2]);
        a.push(x[i*2-1]);
    }
    return a;
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
function int(x){return parseInt(x);}



function getMultiLine(prompt,func){
    var frame = cE("div")
    frame.className = "dialog"
    frame.style.position="absolute";
    func=func||function(){}
    var p=frame.appendChild(cE("p"))
    p.style.marginTop="0px";
    p.appendChild(cTN(prompt))
    p.appendChild(cE("br"));
    entry=p.appendChild(cE("textarea"))
    entry.rows=7;
    entry.cols=40;
    var buttons=frame.appendChild(cE("div"))
    
    var button=buttons.appendChild(cE("button"))
    button.onclick=function(){
        document.body.removeChild(frame);
        document.body.removeChild(back);
        func(entry.value);
    }
    button.innerHTML="Ok";
    var button=buttons.appendChild(cE("button"))
    button.onclick=function(){
        document.body.removeChild(frame);
        document.body.removeChild(back);
        func(false);
    }
    button.innerHTML="Cancel";
    
    var back=cE("div");
    back.className="back"
    
    
    document.body.appendChild(back)
    document.body.appendChild(frame);
    
    
    var dim = windowSize();
    
    frame.style.top=(dim[1]/2-frame.offsetHeight/2)+"px";
    frame.style.left=(dim[0]/2-frame.offsetWidth/2)+"px";
    
    if (navigator.userAgent.indexOf("MSIE")!=-1){
        frame.style.position="absolute"
        back.style.position="absolute"
        var top = (document.documentElement && document.documentElement.scrollTop) ?
  document.documentElement.scrollTop : document.body.scrollTop;
  
        frame.style.top = top+frame.offsetTop+"px";
        back.style.top=top
    }
    frame.style.visibility = "visible"
    addEvent(back,"click",function(){
        document.body.removeChild(frame);
        document.body.removeChild(this);
        func(false);
        },false);
    
}


function showMultiLine(value){
    var frame = cE("div")
    frame.className = "dialog"
    frame.style.position="absolute";
    var p=frame.appendChild(cE("p"))
    p.style.marginTop="0px";
    entry=p.appendChild(cE("textarea"))
    entry.rows=7;
    entry.cols=40;
    entry.value=value;
    var buttons=frame.appendChild(cE("div"))
    
    var button=buttons.appendChild(cE("button"))
    button.onclick=function(){
        document.body.removeChild(frame);
        document.body.removeChild(back);
        func(false);
    }
    button.innerHTML="Close";
    
    var back=cE("div");
    back.className="back"
    
    
    document.body.appendChild(back)
    document.body.appendChild(frame);
    
    
    var dim = windowSize();
    
    frame.style.top=(dim[1]/2-frame.offsetHeight/2)+"px";
    frame.style.left=(dim[0]/2-frame.offsetWidth/2)+"px";
    
    if (navigator.userAgent.indexOf("MSIE")!=-1){
        frame.style.position="absolute"
        back.style.position="absolute"
        var top = (document.documentElement && document.documentElement.scrollTop) ?
  document.documentElement.scrollTop : document.body.scrollTop;
  
        frame.style.top = top+frame.offsetTop+"px";
        back.style.top=top
    }
    frame.style.visibility = "visible"
    addEvent(back,"click",function(){
        document.body.removeChild(frame);
        document.body.removeChild(this);
        },false);
    
}

function open_menu(pos){
    var frame = document.body.appendChild(cE("div"));
    frame.className = "menu"
    frame.style.top=pos[1]+"px";
    frame.style.left=pos[0]+"px";
    console.log("menu",pos,frame);

    for (var i=1;i<arguments.length;i++){
        var dv = frame.appendChild(cE("div"));
        dv.innerHTML = arguments[i][0];
        dv.act = arguments[i][1];
        dv.onmousedown =  function(e){this.act(e)};
        dv.onmouseover = function(){this.className = "hover"}
        dv.onmouseout = function(){this.className = ""}
    }

    frame.spy = function(e){
            frame.parentNode.removeChild(frame);
            removeEvent(document,"mousedown",frame.spy,true);
        }
    addEvent(document,"mousedown",frame.spy,false)
    return false;
}


function open_window(url){
    var frame = cE("iframe")
    frame.src=url;
    frame.className = "window"
    var back=cE("div");
    back.className="back"
    
    document.body.appendChild(back)
    document.body.appendChild(frame)
    if (navigator.userAgent.indexOf("MSIE")!=-1){
        frame.style.position="absolute"
        back.style.position="absolute"
        var top = (document.documentElement && document.documentElement.scrollTop) ?
  document.documentElement.scrollTop : document.body.scrollTop;
        frame.style.top = top+frame.offsetTop+"px";
        back.style.top=top
    }
    frame.style.visibility = "visible"
    addEvent(back,"click",function(){
        document.body.removeChild(frame);
        document.body.removeChild(back);
        },false);
    
}

function askstring(prompt,func){
    var frame = cE("div")
    frame.className = "dialog"
    func=funct||function(){}
    var p=frame.appendChild(cE("p"))
    p.appendChild(cTN(prompt));
    entry=p.appendChild(cE("input"))
    var buttons=frame.appendChild(cE("div"))
    
    var button=buttons.appendChild(cE("button"))
    button.onclick=function(){
        document.body.removeChild(frame);
        document.body.removeChild(back);
        func(entry.value);
    }
    button.innerHTML="Ok";
    var button=buttons.appendChild(cE("button"))
    button.onclick=function(){
        document.body.removeChild(frame);
        document.body.removeChild(back);
        func(false);
    }
    button.innerHTML="Cancel";
    
    var back=cE("div");
    back.className="back"
    
    
    document.body.appendChild(back)
    document.body.appendChild(frame);
    
    
    var dim = windowSize();
    
    frame.style.top=(dim[1]/2-frame.offsetHeight/2)+"px";
    frame.style.left=(dim[0]/2-frame.offsetWidth/2)+"px";
    
    if (navigator.userAgent.indexOf("MSIE")!=-1){
        frame.style.position="absolute"
        back.style.position="absolute"
        var top = (document.documentElement && document.documentElement.scrollTop) ?
  document.documentElement.scrollTop : document.body.scrollTop;
  
        frame.style.top = top+frame.offsetTop+"px";
        back.style.top=top
    }
    frame.style.visibility = "visible"
    addEvent(back,"click",function(){
        document.body.removeChild(frame);
        document.body.removeChild(this);
        func(false);
        },false);
    
}




function askyesno(prompt,func,defa){
    var buttons = ask(prompt,func,["Ok",true],["Cancel",false]);
    buttons.childNodes[defa==false?1:0].focus()
}

function ask(prompt,func){
    var frame = cE("div")
    frame.className = "dialog"
    frame.style.visibility="hidden";
    func=func||function(){}
    
    frame.appendChild(cE("p")).appendChild(cTN(prompt));
    buttons=frame.appendChild(cE("div"))
    
    for (var i=2;i<arguments.length;i++){
        var name=arguments[i][0];
        var ret =arguments[i][1];
        var button=buttons.appendChild(cE("button"));
        button.ret=ret
        button.onclick=function(){
            document.body.removeChild(frame);
            document.body.removeChild(back);
            func(this.ret);
        }
        button.innerHTML=name;
    }
    
    var back=cE("div");
    back.className="back"
    
    
    document.body.appendChild(back)
    document.body.appendChild(frame)
    
    var dim = windowSize();
    
    frame.style.top=(dim[1]/2-frame.offsetHeight/2)+"px";
    frame.style.left=(dim[0]/2-frame.offsetWidth/2)+"px";
    if (navigator.userAgent.indexOf("MSIE")!=-1){
        frame.style.position="absolute"
        back.style.position="absolute"
        var top = (document.documentElement && document.documentElement.scrollTop) ?
  document.documentElement.scrollTop : document.body.scrollTop;
  
        frame.style.top = top+frame.offsetTop+"px";
        back.style.top=top
    }
    
    
    addEvent(back,"click",function(){
        document.body.removeChild(frame);
        document.body.removeChild(this);
        func(false);
    },false);
    frame.style.visibility = "visible"
    return buttons;
}





// cross compat

function windowSize(){
    var myWidth = 0, myHeight = 0;
    if( typeof( window.innerWidth ) == 'number' ) {
        //Non-IE
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
    } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
        //IE 6+ in 'standards compliant mode'
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
    } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
        //IE 4 compatible
        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
  }
  return [myWidth,myHeight];
}

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

