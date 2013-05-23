
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
        var [name,ret]=arguments[i];
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
    back.className="back"
    document.body.appendChild(back)
    document.body.appendChild(frame)
    back.addEventListener("click",function(){document.body.removeChild(frame);document.body.removeChild(this);func(false);},false);
}

function askstring(prompt,func){
    var frame = cE("div")
    frame.style.position="fixed"
    frame.style.width="300px";
    frame.style.height="200px";
    frame.style.top=(window.innerHeight/2-100)+"px";
    frame.style.left=(window.innerWidth/2-150)+"px";
    frame.style.backgroundColor="white"
    frame.style.textAlign="center";
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
    document.body.appendChild(frame)
    back.addEventListener("click",function(){document.body.removeChild(frame);document.body.removeChild(this);func(false);},false);
    
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

function mousePos(e) {
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
	return [posx,posy]
}

function mouseButton(e) {
	var rightclick;
	if (!e) var e = window.event;
	if (e.which) rightclick = (e.which == 3);
	else if (e.button) rightclick = (e.button == 2);
	return !rightclick
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