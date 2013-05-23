//try{if (!console)console={log:function(){}}}
//catch(e){console={log:function(){}}}

try{
Node.prototype.scrollTo = function(line,rel){
    if (this.type != "textarea") return;
    var ln = this.scrollHeight / this.value.split('\n').length;
    if (rel) this.scrollTop+=line*ln;
    else this.scrollTop = line*ln;
}

Node.prototype.setPos=function(pos){
    this.style.top=pos[1]+'px';
    this.style.left=pos[0]+'px';
}
Node.prototype.pos=function(){
    return [parseInt(this.style.left),parseInt(this.style.top)];
}
}catch(e){}

String.prototype.findall = function(reg){
    all = [];
    this.replace(reg,function(a,b){all.push([a,b]);return a})
    return all
}

Array.prototype.remove=function(x){
    this.pop(this.indexOf(x));
}
Array.prototype.contains=function(x){
    return this.indexOf(x)!=-1;
}
Array.prototype.mult=function(arg){
    e=this
    for (var i=0;i<arg.length;i++){
        e=e[arg[i]];
    }
    return e;
}



function menu(pos){
    var frame = document.body.appendChild(cE("div"));
    frame.className = "inc_menu"
    frame.style.top=pos[1]+"px";
    frame.style.left=pos[0]+"px";
    
    for (var i=1;i<arguments.length;i++){
        var dv = frame.appendChild(cE("div"));
        dv.innerHTML = arguments[i][0]
        dv.act = arguments[i][1];
        dv.onclick =  function(){this.act(that)};
        dv.onmouseover = function(){this.className = "hover"}
        dv.onmouseout = function(){this.className = ""}
    }
    frame.spy = function(e){
            frame.parentNode.removeChild(frame);
            document.removeEventListener("mousedown",frame.spy,false);
        }
    document.addEventListener("mousedown",frame.spy,false)
    return false;
}


function open_window(url){
    var frame = cE("iframe")
    frame.style.position="fixed"
    frame.style.width="90%";
    frame.style.height="90%";
    frame.style.top="5%";
    frame.style.left="5%";
    frame.style.backgroundColor="white"
    frame.src=url
    var back=cE("div");
    back.className="back"
    document.body.appendChild(back)
    document.body.appendChild(frame)
    back.addEventListener("click",function(){document.body.removeChild(frame);document.body.removeChild(this);},false);
}

function askyesno(prompt,func){
    ask(prompt,func,["Ok",true],["Cancel",false])
}

function int(x){
    return parseInt(x);
}

function Alert(message){

    var over=document.body.appendChild(document.createElement('div'))
    over.style.position="absolute"
    over.style.top='0px'
    over.style.left='0px'
    over.style.opacity=.7
    over.style.zIndex=1000;
    over.style.backgroundColor="black"
    over.style.width=window.innerWidth+'px';
    over.style.height=window.innerHeight+'px';
    over.addEventListener("click",function(){document.body.removeChild(over);
            document.body.removeChild(alert);},true)
    var alert=document.body.appendChild(document.createElement('div'));
    alert.style.position="absolute"
    alert.style.zIndex=1001;
    alert.style.padding='20px'
    alert.style.backgroundColor='#D5FF85'
    alert.style.border='solid 2px #90AA20'
    alert.appendChild(document.createElement('p')).innerHTML=message;
    args=arguments
    buttons=alert.appendChild(document.createElement('div'));
    buttons.style.marginLeft="20px"
    for (var i=1;i<arguments.length;i++){
        var b=buttons.appendChild(document.createElement('button'))
        b.style.border='solid 1px #90AA20'
        b.innerHTML=arguments[i][1] || "Ok"
        b.f=arguments[i][0]
        b.addEventListener('click',function(){
            document.body.removeChild(over);
            document.body.removeChild(alert);
            this.f();
        },true);
    }
    
    alert.style.top=window.innerHeight/2-alert.offsetHeight/2+'px'
    alert.style.left=window.innerWidth/2-alert.offsetWidth/2+'px'
}

function ask(prompt,func){
    var frame = cE("div")
    frame.style.position="fixed"
    frame.style.width="300px";
    frame.style.height="200px";
    frame.style.top=(window.innerHeight/2-100)+"px";
    frame.style.left=(window.innerWidth/2-150)+"px";
    frame.style.backgroundColor="white"
    frame.style.textAlign="center";
    frame.appendChild(cE("p")).appendChild(cTN(prompt));
    buttons=frame.appendChild(cE("div"))
    
    for (var i=2;i<arguments.length;i++){
        var nameret=arguments[i];var name = nameret[0];var ret = nameret[1];
        var button=buttons.appendChild(cE("button"))
        button.ret=ret
        button.onclick=function(){
            document.body.removeChild(frame);
            document.body.removeChild(back);
            func(this.ret);
        }
        button.innerHTML=name;
    }
    
    var back=cE("div");
    back.className="inc_back"
    document.body.appendChild(back)
    document.body.appendChild(frame)
    back.addEventListener("click",function(){document.body.removeChild(frame);document.body.removeChild(this);func(false);},false);
}

function askstring(prompt,func,def){
    var frame = cE("div")
    frame.style.position="fixed"
    
    frame.style.left = "50%";
    frame.style.top = "50%";
    frame.style.padding = "20px";
    frame.style.border = "2px solid darkblue";
    
    frame.style.backgroundColor="white"
    frame.style.textAlign="center";
    var p=frame.appendChild(cE("p"))
    p.appendChild(cTN(prompt));
    var entry=p.appendChild(cE("input"))
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
    entry.onkeydown = function(e){
        e = e||window.event;
        if (e.keyCode==13){ //return key
            document.body.removeChild(frame);
            document.body.removeChild(back);
            func(entry.value);
        }else{console.log(e.keyCode);}
    }
    button.innerHTML="Cancel";
    
    var back=cE("div");
    back.className="inc_back"
    document.body.appendChild(back)
    
    document.body.appendChild(frame)
    
    frame.style.marginLeft = -frame.offsetWidth/2+"px";
    frame.style.marginTop = -frame.offsetHeight/2+"px";
    
    back.addEventListener("click",function(){document.body.removeChild(frame);document.body.removeChild(this);func(false);},false);
    entry.value = def || "";
    entry.focus();
    setTimeout(function(){entry.focus();},200);
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

function keyPress(e){
    var code;
    if (!e) var e = window.event;
    if (e.keyCode) code = e.keyCode;
    else if (e.which) code = e.which;
    keys = {37:"left",
        38: "up",
        39: "right",
        40: "down",
        8: "backspace"}
        
}

function keyCode(e){
    var code;
    if (!e) var e = window.event;
    if (e.keyCode) code = e.keyCode;
    else if (e.which) code = e.which;
    return code;
}

function mousePos(e,pos) {
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
        pos = pos || [0,0];
	return [posx-pos[0],posy-pos[1]]
}

function mouseButton(e){
    if (!e) e = window.event;
    if (e.which) return e.which;
    if (e.button==1)return 1;
    if (e.button==4)return 2;
    if (e.button==2)return 3;
}

function mouseMods(e){
    var ctrl=0;
    var alt=0;
    var shift=0;
    if (parseInt(navigator.appVersion)>3) {
        var evt = navigator.appName=="Netscape" ? e:event;
        if (navigator.appName=="Netscape" && parseInt(navigator.appVersion)==4) {
            var mString =(e.modifiers+32).toString(2).substring(3,6);
            shift=(mString.charAt(0)=="1");
            ctrl =(mString.charAt(1)=="1");
            alt  =(mString.charAt(2)=="1");
        }
        else {
            shift=evt.shiftKey;
            alt  =evt.altKey;
            ctrl =evt.ctrlKey;
        }
    }
    return {ctrl:ctrl,alt:alt,shift:shift}
}

function insertAtCursor(myField, myValue) {
    var top=myField.scrollTop;
    var where=caret(myField);
    if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
    }
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos)
        + myValue
        + myField.value.substring(endPos, myField.value.length);
    } else {
        myField.value += myValue;
    }
    myField.scrollTop=top;
    setSelRange(myField,where+myValue.length,where+myValue.length);
}

function caret(node) {
    if(node.selectionStart) return node.selectionStart;
    else if(!document.selection) return 0;
    var c = "\001";
    var sel = document.selection.createRange();
    var dul = sel.duplicate();
    var len = 0;
    dul.moveToElementText(node);
    sel.text = c;
    len = (dul.text.indexOf(c));
    sel.moveStart('character',-1);
    sel.text = "";
    return len;
}

function rfind(string, what, start){
    start=start||string.length-1
    while (string.charAt(start)!=what){
        start-=1;
    }
    return start
}

function setSelRange(inputEl, selStart, selEnd) { 
    if (inputEl.setSelectionRange) { 
        inputEl.focus(); 
        inputEl.setSelectionRange(selStart, selEnd); 
    } else if (inputEl.createTextRange) { 
        var range = inputEl.createTextRange(); 
        range.collapse(true); 
        range.moveEnd('character', selEnd); 
        range.moveStart('character', selStart); 
        range.select(); 
    } 
}

function setPos(what,pos,x,y){
    x=x||0;
    y=y||0;
    what.style.left=pos[0]+x;
    what.style.top=pos[1]+y;
}

function $(e){ return document.getElementById(e); }

function $$(e,n,f){
    if (n.nodeType){
        f=f||function(){}
    }
    else{
        f=n||function(){}
        n=document;
    }
    arr=[];
    if (e[0]=="#"){
        arr=n.getElementById(e.substr(1))
        f(arr);
        return arr;
    }
    else if (e[0]=='.'){
        lst=n.getElementsByTagName("*");
        for (var i=0;i<lst.length;i++){
            if (e.substr(1)==lst[i].className){
                arr.push(lst[i]);
                f(lst[i]);
            }
        }
        return arr;
    }
    else {
        [tag,className]=e.split('.');
        lst=n.getElementsByTagName(tag);
        for (var i=0;i<lst.length;i++){
            if (className==lst[i].className){
                arr.push(lst[i]);
                f(lst[i]);
            }
        }
        return arr;
    }
}

function cE(e){ return document.createElement(e); }
function cTN(e){ return document.createTextNode(e); }

function addEvent( obj, type, fn ) {
	if (obj.addEventListener) {
		obj.addEventListener( type, fn, false );
		EventCache.add(obj, type, fn);
	}
	else if (obj.attachEvent) {
		obj["e"+type+fn] = fn;
		obj[type+fn] = function() { obj["e"+type+fn]( window.event ); }
		obj.attachEvent( "on"+type, obj[type+fn] );
		EventCache.add(obj, type, fn);
	}
	else {
		obj["on"+type] = obj["e"+type+fn];
	}
}

var EventCache = function(){
	var listEvents = [];
	return {
		listEvents : listEvents,
		add : function(node, sEventName, fHandler){
			listEvents.push(arguments);
		},
		flush : function(){
			var i, item;
			for(i = listEvents.length - 1; i >= 0; i = i - 1){
				item = listEvents[i];
				if(item[0].removeEventListener){
					item[0].removeEventListener(item[1], item[2], item[3]);
				};
				if(item[1].substring(0, 2) != "on"){
					item[1] = "on" + item[1];
				};
				if(item[0].detachEvent){
					item[0].detachEvent(item[1], item[2]);
				};
				item[0][item[1]] = null;
			};
		}
	};
}();

var EventCache = function(){
	var listEvents = [];
	return {
		listEvents : listEvents,
		add : function(node, sEventName, fHandler){
			listEvents.push(arguments);
		},
		flush : function(){
			var i, item;
			for(i = listEvents.length - 1; i >= 0; i = i - 1){
				item = listEvents[i];
				if(item[0].removeEventListener){
					item[0].removeEventListener(item[1], item[2], item[3]);
				};
				if(item[1].substring(0, 2) != "on"){
					item[1] = "on" + item[1];
				};
				if(item[0].detachEvent){
					item[0].detachEvent(item[1], item[2]);
				};
				item[0][item[1]] = null;
			};
		}
	};
}();

function addEvent( obj, type, fn ) {
	if (obj.addEventListener) {
		obj.addEventListener( type, fn, false );
		EventCache.add(obj, type, fn);
	}
	else if (obj.attachEvent) {
		obj["e"+type+fn] = fn;
		obj[type+fn] = function() { obj["e"+type+fn]( window.event ); }
		obj.attachEvent( "on"+type, obj[type+fn] );
		EventCache.add(obj, type, fn);
	}
	else {
		obj["on"+type] = obj["e"+type+fn];
	}
}
addEvent(window,'unload',EventCache.flush);