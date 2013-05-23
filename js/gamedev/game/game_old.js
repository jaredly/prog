Node.prototype.cx = function(e){
    if (e) this.style.left=e+"px";
    else return this.offsetLeft;
}
Node.prototype.cy = function(e){
    if (e) this.style.top=e+"px";
    else return this.offsetTop;
}
Node.prototype.w = function(e){
    if (e) this.style.width=e+"px";
    else return this.offsetWidth;
}
Node.prototype.h = function(e){
    if (e) this.style.height=e+"px";
    else return this.offsetHeight;
}
Node.prototype.move = function(x,y){
    this.cx(this.cx()+x);
    this.cy(this.cy()+y);
}
Node.prototype.resize = function(x,y){
    console.log('rz',x,y);
    this.w(this.w()+x);
    this.h(this.h()+y);
}

Array.prototype.remove = function(e){
    this.pop(this.indexOf(e));
}

function Sprite(img,x,y,parent){
    var that = {};
    that.obj = new Image();
    parent.add(that);
    that.obj.src = img;
    that.obj.pos = [x,y];
    that.obj.className = "sprite";
    that.parent = parent;
    var [x1,y1] = findPos(parent.obj);
    that.obj.cx(x1+x);
    that.obj.cy(y1+y);
    that.dx = 0;
    that.dy = 0;
    that.x = x;
    that.y = y;
    that.keydown = {};
    that.keyup = {};
    that.keypress = {};
    that.gravity = 0;
    that.drag = 0;
    that.move = function(x,y){
        that.x += x;
        that.y += y;
    }
    that.height = function(){
        return that.obj.offsetHeight;
    }
    that.width = function(){
        return that.obj.offsetWidth;
    }
    that.event = function(e){
        if (e.type=="keydown"){
            if (that.keydown[e.key]){that.keydown[e.key](e);}
        }
        else if (e.type=="keypress"){
            if (that.keypress[e.key]){that.keypress[e.key](e);}
        }
        else if (e.type=="keyup"){
            if (that.keyup[e.key]){that.keyup[e.key](e);}
        }else{
        }
    }
    that.step = function(){
    }
    that.update = function(){
        that.dy += that.gravity;
        if (that.dx<0)that.dx+=that.drag
        else if (that.dx>0)that.dx-=that.drag;
        that.y += that.dy;
        that.x += that.dx;
        var [x1,y1] = findPos(parent.obj);
        that.obj.cx(x1+that.x)
        that.obj.cy(y1+that.y);
    }
    return that;
}

function Event(type){
    return {
        type:type
    }
}

function KeyEvent(type,key){
 //   console.log(type,key)
    var that = Event(type);
    that.key=key;
 //   console.log(that)
    return that;
}

function Game(){
    that = {};
    that.obj = cE("div");
    document.body.appendChild(that.obj);
    that.obj.className="screen"
    that.objects = [];
    that.events = [];
    that.keys = {};
    that.add = function(child){
        that.objects.push( child );
        return that.obj.appendChild( child.obj );
    }
    that.height = function(){
        return that.obj.offsetHeight;
    }
    that.width = function(){
        return that.obj.offsetWidth;
    }
    document.onkeypress = function(e){
      //  console.log(e,keyCode(e))
        for (a in e){
            if (a.slice(0,3)=="DOM" && e[a]==keyCode(e)){
                key = a.split("_").slice(-1)[0];
                if (!that.keys[key]){
                    that.events.push(KeyEvent(e.type,key))
                    that.keys[key] = 1;
                }
                return
            }
        }
    }
    document.onkeyup = function(e){
        for (a in e){
            if (a.slice(0,3)=="DOM" && e[a]==keyCode(e)){
                key = a.split("_").slice(-1)[0];
                that.events.push(KeyEvent(e.type,key))
                that.keys[key] = 0;
                return
            }
        }
    }
    that.loop = function(){
        while (that.events.length){
            for (var e=0;e<that.objects.length;e++){
                that.objects[e].event(that.events.pop());
            }
        }
        for (key in that.keys){
            if (that.keys[key]){
                var ev = KeyEvent("keydown",key);
                for (var e=0;e<that.objects.length;e++){
                    that.objects[e].event(ev);
                }
            }
        }
        for (var i=0;i<that.objects.length;i++){
            that.objects[i].step();
            that.objects[i].update();
        }
        setTimeout(that.loop,"10");
    }
    return that;
}

