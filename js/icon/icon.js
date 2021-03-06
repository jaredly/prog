try{if (!console) console = {log:function(){}};}
catch(e){console = {log:function(){}};}
function Line(start,end){
    line=[start,end]

    function lin(x,way){
        [[x1,y1],[x2,y2]]=line;
        if (way==0){
        ret=((y2-y1)/(x2-x1))(x-x1)+y1
        }else{
        ret=(x-y1)/ ( (y2-y1)/(x2-x1) )+x1
        }
        return ret;
    }

    dx=line[0][0]-line[0][1]
    dy=line[0][1]-line[1][1]
    if (Math.abs(dx)>Math.abs(dy)){
        dr=[0,dx]
    }else{dr=[1,dy]}
    sign=dr[1]>0?-1:1
    
    for (var i=line[0][dr[0]];i!=line[1][dr[0]];i+=1*sign){
        raw=lin(i,dr[0]);
        pos=Math.round(raw);
        dif=Math.abs(raw-pos);
        obo=pos>raw?-1:1
        
        if (dr[0]){
            board[i][pos].style.backgroundColor=colorpicker.currentColor;
            board[i][pos].style.opacity=1-dif;
            board[i][pos+obo].style.backgroundColor=colorpicker.currentColor;
            board[i][pos+obo].style.opacity=dif;
        }else{
            board[pos][i].style.backgroundColor=colorpicker.currentColor;
            board[pos][i].style.opacity=1-dif
            board[pos+obo][i].style.backgroundColor=colorpicker.currentColor;
            board[pos+obo][i].style.opacity=dif;
        }
    }
}

Node.prototype.s=function(){
    return 'array('+this.color+','+127*this.opacity+')';
}

Array.prototype.str=function(e){
    var ret="array("
    for (var i=0;i<this.length;i++){
        if (this[i].str){
            ret+=this[i].str()+',';
            if (e){console.log(ret)}
        }
        else{
            ret+='array('+this[i].color+','+(127-127*Number(this[i].style.opacity))+'),'
        }
    }
    return ret.substr(0,ret.length-1)+')';
}


Node.prototype.addChild=function(x,newrow){
    if (!this.nodeName=="table"){return;}
    if (newrow){this.appendChild(document.createElement('tr'))}
    (this.lastChild||this.appendChild(document.createElement('tr'))).appendChild(document.createElement('td')).appendChild(x);
    return x;
}


table=document.body.appendChild(document.createElement('table'));


function full_rotate(){

function old(){
    var o=[]
    for (var i=0;i<board.length;i++){
        for (var e=0;e<board[i].length;e++){
            if (!o[e])o[e]=[];
            o[e][board.length-i-1]=[board[i][e].color,board[i][e].style.opacity]
        }
    }
    return o;
}
function rep(x){
    for (var i=0;i<board.length;i++){
               for (var e=0;e<board[i].length;e++){
            board[i][e].color=x[i][e][0];
            board[i][e].style.opacity=x[i][e][1];
        }
    }
}
save();
rep(old());
save()
rep(old());
save()
rep(old());
save()
rep(old());

}



function setColor(r,g,b){
    colorpicker.color=[r,g,b];
    colorpicker.currentColor="rgb("+r+","+g+","+b+")";
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

function mouseButton(e) {
    var rightclick;
    if (!e) var e = window.event;
    if (e.which) rightclick = (e.which == 3);
    else if (e.button) rightclick = (e.button == 2);
    return rightclick
}
function contextMenu(e){
    
}
function keyEvent(e) {
    var code;
    if (!e) var e = window.event;
    if (e.keyCode) code = e.keyCode;
    else if (e.which) code = e.which;
    return code;
}
////////  Color Picker   ////////////////

colorpicker=function(parent){
    obj=parent.addChild(document.createElement('table'))
    obj.currentColor="#000000"
    obj.color=[0,0,0]
    obj.className="colortable"
    obj.setAttribute('cellspacing','5')
    allcolors=[]
    for (var i=1;i<9;i++){
        for (var e=1;e<9;e++){
            for (var o=1;o<9;o++){
                allcolors[allcolors.length]=[i*32,e*32,o*32];
            }
        }
    }
    ind=0;
    tr=obj.appendChild(document.createElement('tr'));
    t1=tr.appendChild(document.createElement('td')).appendChild(document.createElement('table'));
    t1.setAttribute('cellspacing','0')
    t2=tr.appendChild(document.createElement('td')).appendChild(document.createElement('table'));
    t2.setAttribute('cellspacing','0')
    for (var i=0;i<64;i++){
        var tr=(i<32?t1:t2).appendChild(document.createElement('tr'));
        for (var e=0;e<8;e++){
            var td=tr.appendChild(document.createElement('td'));
            td.className="colorpick";
            td.color=allcolors[ind++];
            td.style.backgroundColor='rgb('+td.color+')';
            td.addEventListener('mousedown',function(){
                    obj.color=this.color;
                    obj.style.backgroundColor='rgb('+this.color+')';
                    obj.currentColor='rgb('+this.color+')';
                },true);
        }
    }
    return obj
}(table)


//////////  Icon Edit   ///////////////

width=20;
height=20;

board=[];

shift=0;

bg=table.addChild(document.createElement('div'));
bg.style.width=width*10+'px'
bg.style.height=height*10+'px'
bg.style.border="solid 1px black"
bg.style.background="url(back.png)"

mini=table.addChild(document.createElement('canvas'));
minic=mini.getContext('2d')
mini.width=width;
mini.height=height;
minic.update=function(that){
    this.fillStyle='rgba('+that.color+','+127*that.style.opacity+')'
    this.fillRect(that.pos[0],that.pos[1],1,1);
}
minic.clear=function(pos){
    this.clearRect(pos[0],pos[1],1,1)
}

pos=findPos(bg);
var bdown = false;
color='#f00'
click=0;
document.onmousedown=function(e){click=shift?2:1}
document.onmouseup=function(){click=0}
document.onkeydown=function(e){if (keyEvent(e)==16){shift=1;}}
document.onkeyup=function(e){if (keyEvent(e)==16){shift=0;}}
for (var x=0;x<width;x++){
    board[x]=[];
    for (var y=0;y<height;y++){
        var dv=bg.appendChild(document.createElement('div'));
        board[x][y]=dv
        dv.style.position="absolute"
        //dv.style.border="solid 1px black"
        dv.style.width="10px"
        dv.style.height="10px"
        dv.style.left=pos[0]+1+x*10+'px'
        dv.style.top=pos[1]+1+y*10+'px'
        dv.pos=[x,y];
        dv.color=[0,0,0]
        dv.style.opacity=0
        dv.onmousemove=function(e){
            if (click){
                if (shift || bdown!=0){
                    this.style.backgroundColor=""
                    this.style.opacity=0;
                    minic.clear(this.pos);
                }
                else{
                    this.style.opacity=1;
                    this.style.backgroundColor=colorpicker.currentColor;
                    this.color=colorpicker.color;
                    minic.update(this)
                }
            }
        }
        dv.mouseup = function(e){
            bdown = false;
        }
        dv.onmousedown=function(e){
            bdown = e.button;
                if (shift){
                    this.style.backgroundColor=""
                    this.style.opacity=0;
                    minic.clear(this.pos);
                }
                else{
                    this.style.opacity=1;
                    this.style.backgroundColor=colorpicker.currentColor;
                    this.color=colorpicker.color;
                    minic.update(this)
                }
            return false;
        }
        dv.oncontextmenu = function(e){
            bdown = e.button;
            this.style.backgroundColor = "";
            this.style.opacity=0;
            minic.clear(this.pos);
            return false;
        }
    }
}


function update(){


}


function save(name){
    name=name
    if (!name)return
    a=document.body.appendChild(document.createElement('canvas'));
    a.width=width;
    a.height=height;
    c=a.getContext('2d');
    for (var i=0;i<height;i++){
        for (var e=0;e<width;e++){
            c.fillStyle='rgba('+board[i][e].color+','+127*board[i][e].style.opacity+')'
        c.fillRect(i,e,1,1);
        }
    }
    
    s=a.toDataURL().replace(',','<comma>').replace(';','<semicolon>');
    sendRequest("save_img.py",function(){alert("Saved to"+name);},'name='+name+'&data='+s);
    

    i=document.body.appendChild(new Image());
    i.src=a.toDataURL();
    document.body.removeChild(a)
}

function set(x,y){
    board[y][x].color=colorpicker.color;
    board[y][x].style.opacity=1;
    board[y][x].style.backgroundColor=colorpicker.currentColor;
    minic.update(board[y][x]);
}

function clear(){
    console.log("clearing");
    for (var i=0;i<width;i++){
        for (var e=0;e<height;e++){
            board[i][e].color=[0,0,0];
            board[i][e].style.opacity=0;
            board[i][e].style.backgroundColor=""
            minic.clear([i,e]);
        }
    }

}

function load(src){
im=new Image();
im.src=src;
im.onload=function(){
minic.clearRect(0,0,width,height)
    minic.drawImage(this,0,0);

for (var i=0;i<width;i++){
for (var e=0;e<height;e++){
    d=minic.getImageData(i,e,1,1).data;
    board[i][e].color=[d[0],d[1],d[2]];
    board[i][e].style.opacity=d[3]/255;
    board[i][e].style.backgroundColor='rgb('+board[i][e].color+')'
}

}
}

}

function Save(){save(prompt("Save:"));}
function Clear(){clear();}
function Load(){load(prompt("Load:"));}

document.onkeypress=function(){save()}
