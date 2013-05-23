function cE(e){return document.createElement(e);}
function $(e){return document.getElementById(e);}
function cTN(e){return document.createTextNode(e);}
if (typeof(console)=="undefined") console={log:function(){}};


function dst(a,b,c,d){
    return Math.abs(Math.sqrt(Math.abs((a-c)*(a-c)-(b-d)*(b-d))));
}
function MoveToTop( node )
{
   node.parentNode.appendChild( node );
}
function MoveToBottom( node )
{
   node.parentNode.insertBefore( node, node.parentNode.firstChild );
}
function MoveDown( node ){
    node.parentNode.insertBefore(node,node.previousChild);
}
function MoveUp( node ){
    node.parentNode.insertBefore(node,node.nextChild.nextChild);
}
function zSwap(parent, elem1, elem2)
{
   var tmp = elem1.cloneNode( true );
   parent.replaceChild( tmp, elem2 );
   parent.replaceChild( elem2, elem1 );
}

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
function color_pick(pos,func){console.log(pos);
    open_menu(pos,["red",function(){func("red");}],
                      ["green",function(){func("green");}],
                      ["blue",function(){func("blue");}],
                      ["yellow",function(){func("yellow");}],
                      ["white",function(){func("white");}],
                      ["purple",function(){func("purple");}],
                      ["orange",function(){func("orange");}],
                      ["none",function(){func("none");}]);
}
function width_pick(pos,now,max,func){console.log(pos)
    var frame = document.body.appendChild(cE("div"));
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

function open_menu(pos){
    var frame = document.body.appendChild(cE("div"));
    frame.className = "menu"
    frame.style.top=pos[1]+"px";
    frame.style.left=pos[0]+"px";
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
function ePos(e){
    if (e.pageX)return [e.pageX,e.pageY];
    return [e.clientX + document.body.scrollLeft - document.body.clientLeft,
        e.clientY + document.body.scrollTop  - document.body.clientTop]
}

