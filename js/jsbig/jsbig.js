
function $(e){return document.getElementById(e);}

$('ok').onclick = function(){
    process($('text').value)
}

function tabs(y){
    a='';
    for (var i=0;i<y;i++){
        a+='\t';
    }
    return a
}
var hOn = false;
function hrefs(){
    if (hOn){
        getStyle('span.vername').color = '';
        hOn = false;
    }else{
        getStyle('span.vername').color = 'blue';
        hOn = true;
    }
}

function getStyle(sel){
    var sheet = document.styleSheets[0].cssRules;
    for (var i=0;i<sheet.length;i++){
        if (sheet[i].selectorText == sel){
            return sheet[i].style;
        }
    }
    return false;
}

function changeStyle(selector,style){
    var sheet =  getStyle(selector);
    for (var e=0;e<style.length;e++){
        sheet.style[style[e][0]]=style[e][1];
    }
}

function findall(string,instring){
    var i=[];
    string.replace(new RegExp(instring,"g"),function(a){i.push(a);});
    return i;
}

function count(str,istr){
    return findall(str,istr).length;
}

var reserved = ['abstract', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'double', 'else', 'enum', 'export', 'extends', 'false', 'final', 'finally', 'float', 'for', 'function', 'goto', 'if', 'implements', 'import', 'in', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'null', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'true', 'try', 'typeof', 'var', 'void', 'volatile', 'while', 'with'] 

function process(x){
    x=x.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/{/g,'<br>{<br>').replace(/}/g,'<br>}<br>').replace(/;/g,';<br>')
    x=x.split(/<br>/g);
    xn=[];
    lev=0;
    for (var i=0;i<x.length;i++){
        xn.push(tabs(lev)+x[i]);
        if (x[i].slice(-1)=='{'){
            lev+=1;
        }
        if (x[i].slice(-1)=='}'){
            lev-=1;
        }
    }
    x=xn.join('\n');
    
 //   x=x.replace(/(?<=[^A-Za-z0-9$])([A-Za-z$][A-Za-z0-9$]*?)(?=[^A-Za-z0-9$])/g, '<span class="vername">$1</span>');
  //  x=x.replace(/((<[^>]+>.*?)*?)([A-Za-z$_][A-Za-z0-9$_]*)/g, '$1<span class="vername">$3</span>');
    
    
    //x=x.replace(/(['"])(.*?\1)/g,'<span class="string">$1$2</span>')
    /*x=x.replace(/((<[^>]+>.*?)*?)((["']).*?(\4))/g,'$1<span class="string">$3</span>')
    */
    x=x.replace(/("[^"]*?")/g,'<span class="string">$1</span>')
    x=x.replace(/('[^']*?')/g,'<span class="string">$1</span>')
    
    x = x.replace(new RegExp("([\W^])("+reserved.join("|")+")([\W$])","g"),'$1<span class="this">$2</span>$3');
    
    /*x=x.replace(/this/g,'<span class="this">this</span>')
    x=x.replace(/var/g,'<span class="this">var</span>')*/
    x=x.replace(/(function\s+)(.+?)(?=\()/g,'<span class="function">$1</span><span class="funcname">$2</span>')
    
    //x=x.replace(/((<[^>]*>.*?)*?)(((["']).*?\5)*?)([A-Za-z$_][A-Za-z0-9$_]*)/g, '$1$3<span class="vername">$6</span>');
    x = x.replace(/[\w\.]+/g,function(string,pos,full){//console.log(arguments)
        if (count(full.slice(0,pos),'"')%2==0 && count(full.slice(0,pos),"<")==count(full.slice(0,pos),">")){
            if (reserved.indexOf(string)==-1)
                return '<span class="vername">'+string+'</span>';
        }
        return string;
    });
    var at = 0;
    while (x.indexOf("{",at)!=-1){
        var num = x.indexOf("{",at);
        at = num+1;
        var level = 0;
        for (var i=num;i<x.length;i++){
            if (x[i]=="{")level+=1;
            else if (x[i]=="}"){
                if (level==0)break;
                level-=1;
            }
        }
        if (level!=0)return;
        
        x = x.slice(0,num)+'<span class="chunk">'+x.slice(num,i)+'</span>';
        
        //return '<span class="chunk">'+a+'</span>';
    }
    
    $('res').innerHTML=x.replace(/\n/g,'<br>').replace(/\t/g,'<span class="tab"></span>');
    var sps = $('res').getElementsByTagName("span");
    for (var i=0;i<sps.length;i++){
        if (sps[i].className == 'vername'){
            sps[i].onclick = ver_click;
            sps[i].name = sps[i].innerHTML;
        }
    }
}

function ver_click(e){
    var that = this;
    menu(mousePos(e),
        ["change to value",function(){findverval(that)}],
        ["rename all",
            function(){
                      askstring("Rename to what?",
                                 function(x){if (that){rename(that,x)}},that.innerHTML
                                 )
                      }
            ]
        )
    return false;
}



function menu(pos){
    var frame = document.body.appendChild(cE("div"));
    console.log(frame)
    frame.className = "inc_menu"
    frame.style.top=pos[1]+"px";
    frame.style.left=pos[0]+"px";
    for (var i=1;i<arguments.length;i++){
        var dv = frame.appendChild(cE("div"));
        dv.innerHTML = arguments[i][0]
        dv.act = arguments[i][1];
        dv.addEventListener( 'mousedown', function(){ this.act()}, false);
        dv.onmouseover = function(){this.className = "hover"}
        dv.onmouseout = function(){this.className = ""}
    }
    frame.spy = function(e){
            console.log('brem');
            frame.parentNode.removeChild(frame);
            document.removeEventListener("mousedown",frame.spy,false);
        }
    document.addEventListener("mousedown",frame.spy,false)
    return false;
}

function findverval(what){
    var all = [];
    $('res').innerHTML.replace(new Regexp(what.name+'\s*=\s*[\[\]\w]'), function(x){all.push(x);return x});
}
function rename(what,to){
    var sps = $('res').getElementsByTagName("span");
    for (var i=0;i<sps.length;i++){
        if (sps[i].innerHTML == what.innerHTML){
            //sps[i].name = to;
            sps[i].innerHTML = to;
        }
    }
}