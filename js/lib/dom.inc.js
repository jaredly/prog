function $(e){return document.getElementById(e);}
function cE(e){return document.createElement(e);}
function cTN(e){return document.createTextNode(e);}
function ePos(e,sub){
    if (!sub) sub = [0,0];
    if (e.pageX)return [e.pageX-sub[0],e.pageY-sub[1]];
    return [e.clientX + document.body.scrollLeft - document.body.clientLeft-sub[0],
        e.clientY + document.body.scrollTop  - document.body.clientTop-sub[1]]
}
//if (typeof(console)=="undefined") console={log:function(){}};

function int(x){return parseInt(x);}
function map(f,x){for (var i=0,r=[];i<x.length;i++){r.push(f(x[i]));}return r;}
function zip(two){for (var i=0,r=[];i<two[0].length && i<two[1].length;i++){r.push([two[0][i],two[1][i]]);}return r;}
function sum(a){for (var i=0,r=0;i<a.length;i++){r+=a[i];}return r;}
function random(num){return parseInt(Math.random()*num)}
function array(x){for (var i=0,r=[];i<x.length;i++){r.push(x);}return r;}



function findPos(obj) {
    var curleft = curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft
            curtop += obj.offsetTop
        } while (obj = obj.offsetParent);
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
