function $(e){return document.getElementById(e);}
function cE(e){return document.createElement(e);}
function cTN(e){return document.createTextNode(e);}

try{if (!console)console={log:function(){}}}
catch(e){console={log:function(){}}}

if(!Array.indexOf){ /**freakin IE**/
	    Array.prototype.indexOf = function(obj){
	        for(var i=0; i<this.length; i++){
	            if(this[i]==obj){
	                return i;
	            }
	        }
	        return -1;
	    }
	}

if (!Array.map){ /**freakin IE**/
    Array.prototype.map = function(fun){
        var ret = [];
        for (var i=0;i<this.length;i++){
            ret.push(fun(this[i]));
        }
        return ret;
    }
}

/** Quirksmode.com **/
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

function keyCode(e) {
	var code;
	if (!e) var e = window.event;
	if (e.keyCode) code = e.keyCode;
	else if (e.which) code = e.which;
	return code;
}
/** usage: preload(oncompletedfunction,"img1.gif","img2.jpg",[...etc]) **/
function preload(completed){
    var loading = [];
    for (var i=1;i<arguments.length;i++){
        var img = new Image();
        img.className = "preloading";
        img.onload = function(){
            loading.splice(loading.indexOf(this),1);
            if (loading.length==0)completed();
        }
        img.src = arguments[i];
        loading.push(img);
    }
}
/** credit to Quirksmode.com **/
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
function int(x){return parseInt(x);} // I like this better ;)

/** NOT prototypes ;) **/

function remove(array,x){
    array.pop(array.indexOf(x));
}
function contains(array,x){
    return array.indexOf(x)!=-1;
}
function reversed(x){
    for(var i=0,a=[];i<x.length;i++){a.push(x.slice(-1-i)[0])}
    return a;
}
function mult(array,arg){ // go into some depth of a multi-dimensional array
    var e=array
    for (var i=0;i<arg.length;i++){
        e=e[arg[i]];
    }
    return e;
}
function setPos(node,pos){
    node.style.left=pos[0]+'px';
    node.style.top=pos[1]+'px';
}
function pos(node){
    return [int(node.style.left),int(node.style.top)];
}

/** a nice alert function i wrote
example usage: Alert("Whats your favorite color?",[
 **/
function Alert(message){
    /** background--greyed out**/
    var over=document.body.appendChild(document.createElement('div'));
    over.style.position="absolute"
    over.style.top='0px'
    over.style.left='0px'
    over.style.opacity=.7
    over.style.zIndex='1000';
    if (document.addEventListener)
        over.style.backgroundColor="black";
    else
        over.style.backgroundColor="gray";
    over.style.width='100%';
    over.style.height='100%';
    var alert=document.body.appendChild(document.createElement('div'));
    alert.style.visibility = "hidden"; //hide while we set things up
    alert.style.position="absolute"
    alert.style.zIndex=1001;
    alert.style.padding='20px'
    alert.style.backgroundColor='#D5FF85'
    alert.style.border='solid 2px #90AA20'
    alert.appendChild(document.createElement('p')).innerHTML=message;
    var args=arguments;
    if (args.length==1){
        args = [message,[function(){},"Ok"]];
    }
    buttons=alert.appendChild(document.createElement('div'));
    buttons.style.marginLeft="20px"
    for (var i=1;i<arguments.length;i++){
        var b=buttons.appendChild(document.createElement('button'));
        b.style.cursor = 'pointer';
        b.style.border='solid 1px #90AA20';
        b.style.backgroundColor='#DDD';
        b.style.margin = '0 2px';
        b.innerHTML=arguments[i][1] || "Ok"
        b.f=arguments[i][0];
        b.onclick = function(){
            document.body.removeChild(over);
            document.body.removeChild(alert);
            this.f();
        }
        b.onmouseover = function(){this.style.backgroundColor='#999';}
        b.onmouseout = function(){this.style.backgroundColor='#DDD';}
    }
    
    alert.style.top='50%';
    alert.style.left='50%';
    alert.style.marginLeft = -alert.offsetWidth/2+'px';
    alert.style.marginTop = -alert.offsetHeight/2+'px';
    alert.style.visibility = "visible";
}