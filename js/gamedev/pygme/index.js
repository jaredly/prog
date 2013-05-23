var canv = document.getElementById('canv');
var ctx = canv.getContext('2d');

if (typeof console == "undefined") var console = {log:function(){}}


keys = {0: 'unknown', 8: 'backspace', 9: 'tab', 12: 'clear', 13: 'return', 19: 'pause', 27: 'escape', 32: 'space', 33: 'exclaim', 34: 'quotedbl', 35: 'hash', 36: 'dollar', 38: 'ampersand', 39: 'quote', 40: 'leftparen', 41: 'rightparen', 42: 'asterisk', 43: 'plus', 44: 'comma', 45: 'minus', 46: 'period', 47: 'slash', 48: '0', 49: '1', 50: '2', 51: '3', 52: '4', 53: '5', 54: '6', 55: '7', 56: '8', 57: '9', 58: 'colon', 59: 'semicolon', 60: 'less', 61: 'equals', 62: 'greater', 63: 'question', 64: 'at', 91: 'leftbracket', 92: 'backslash', 93: 'rightbracket', 94: 'caret', 95: 'underscore', 96: 'backquote', 97: 'a', 98: 'b', 99: 'c', 100: 'd', 101: 'e', 102: 'f', 103: 'g', 104: 'h', 105: 'i', 106: 'j', 107: 'k', 108: 'l', 109: 'm', 110: 'n', 111: 'o', 112: 'p', 113: 'q', 114: 'r', 115: 's', 116: 't', 117: 'u', 118: 'v', 119: 'w', 120: 'x', 121: 'y', 122: 'z', 127: 'delete', 256: 'kp0', 257: 'kp1', 258: 'kp2', 259: 'kp3', 260: 'kp4', 261: 'kp5', 262: 'kp6', 263: 'kp7', 264: 'kp8', 265: 'kp9', 266: 'kp_period', 267: 'kp_divide', 268: 'kp_multiply', 269: 'kp_minus', 270: 'kp_plus', 271: 'kp_enter', 272: 'kp_equals', 273: 'up', 274: 'down', 275: 'right', 276: 'left', 277: 'insert', 278: 'home', 279: 'end', 280: 'pageup', 281: 'pagedown', 282: 'f1', 283: 'f2', 284: 'f3', 285: 'f4', 286: 'f5', 287: 'f6', 288: 'f7', 289: 'f8', 290: 'f9', 291: 'f10', 292: 'f11', 293: 'f12', 294: 'f13', 295: 'f14', 296: 'f15', 300: 'numlock', 301: 'capslock', 302: 'scrollock', 303: 'rshift', 304: 'lshift', 305: 'rctrl', 306: 'lctrl', 307: 'ralt', 308: 'lalt', 309: 'rmeta', 310: 'lmeta', 311: 'lsuper', 312: 'rsuper', 313: 'mode', 315: 'help', 316: 'print', 317: 'sysreq', 318: 'break', 319: 'menu', 320: 'power', 321: 'euro', 323: 'last'}

mousepos = [0,0];


function ePos(e){
    if (e.pageX)return [e.pageX,e.pageY];
    var pos = [e.clientX + document.body.scrollLeft - document.body.clientLeft,
        e.clientY + document.body.scrollTop  - document.body.clientTop]
    if (isNaN(pos[0]) || isNaN(pos[1]))return mousepos;
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

function key_name(e){
    for (i in e){
        if (i.slice(0,3)=="DOM"){
            if (e[i]==e.keyCode){
                return i.slice(7).toLowerCase();
            }
        }
    }
}


function _class(obj){
    return function(args){
        var self = {};
        self.image = new Image();
        self.image.src = obj["image"];
        self.solid = obj["solid"];
        self.events = obj.events;
        self.visible = obj["visible"];
        [self.x,self.y] = args["pos"];
        self.dx = 0;
        self.dy = 0;
        self.name = args["name"] || null;
        
        self.event = function(e){
            if (e.type=="keydown"){
                if ("keydown-"+key_name(e) in self.events)
                    self.execute( self.events[ "keydown-"+key_name(e) ], {e:e});
            }
            else if (e.type=="keyup"){
                if ("keyup-"+key_name(e) in self.events)
                    self.execute( self.events[ "keyup-"+key_name(e) ], {e:e});
            }
            else if (self.events[e.type]){
                self.execute( self.events[e.type], {e:e});
            }
        }
        
        self.execute = function(actions,args){
            self.size = [self.image.width,self.image.height];
            if (args.e) e=args.e;
            if (args.ctx) ctx=args.ctx;
            for (var i=0;i<actions.length;i++){
                a = Action(actions[i]);
                eval( a.code );
            }
        }
        
        self.step = function(){
            self.x+=self.dx;
            self.y+=self.dy;
            if (self.events["step"]){
                self.execute(self.events["step"],{});
            }
        }
        
        self.draw = function(ctx){
            if (self.events.draw){
                self.execute(self.events["draw"],{ctx:ctx});
            }else{
                try{
                ctx.drawImage(self.image,self.x,self.y);
                }catch(e){
                    console.log(self.x,self.y);
                }
            }
        }
        
        return self;
    }
}

function Action(obj){
    var that={};
    actions = {
        moveTo:function([x,y,rel]){
            console.log(mousepos)
            if (rel) that.code = "self.x+="+x+";self.y+="+y;
            else that.code = "self.x="+x+";self.y="+y;
        },
        set:function(what,val,rel){
            if (rel) that.code = "self."+what+"+="+val;
            else that.code = "self."+what+"="+val;
        },
        setX:function([x,rel]){actions.set("x",x,rel);},
        setY:function([y,rel]){actions.set("y",y,rel);},
        setDx:function([dx,rel]){actions.set("dx",dx,rel);},
        setDy:function([dy,rel]){actions.set("dy",dy,rel);}
    }
    if (obj[0] in actions){
        actions[obj[0]](obj.slice(1))
    }else console.log('Error')
    return that;
}

function Main(obj){console.log(obj)
    that = {};
    that.obj = obj;
    that.objects = [];
    that.classes = {};
    that.events = [];
    for (i in obj.objects){//console.log('i',i)
        that.classes[i] = _class(obj.objects[i]);
    }
    
    that.event = function(){
        for (var e=0;e<that.events.length;e++){
            for (var i=0;i<that.objects.length;i++) that.objects[i].event(that.events[e]);
        }
        that.events = [];
    }
    that.create_object = function(dct){
        return that.classes[dct.type](dct);
    }
    that.step = function(){
        for (var e=0;e<that.objects.length;e++){ that.objects[e].step(); }
    }
    that.draw = function(ctx){
        for (var i=0;i<that.objects.length;i++){ that.objects[i].draw(ctx); }
    }
    that.loop = function(){
        ctx.clearRect(0,0,canv.width,canv.height);
        that.event();
        that.step();
        try{that.draw(ctx);}catch(e){}
        setTimeout(that.loop,1000/obj["fps"]);
    }
    
    for (var i=0;i<obj.instances.length;i++){
        that.objects.push( that.create_object(obj.instances[i]) );
    }
    
    document.addEventListener("keydown",function(e){that.events.push(e);},false);
    document.addEventListener("keyup",function(e){that.events.push(e);},false);
    document.addEventListener("mousemove",function(e){
        e.pos = mousepos = ePos(e);
        that.events.push(e);
    },false);
    document.addEventListener("click",function(e){
        e.pos = mousepos = ePos(e);
        that.events.push(e);
    },false);
    document.addEventListener("mousedown",function(e){
        e.pos = mousepos = ePos(e);
        that.events.push(e);
    },false);
    
    
    that.loop();
    return that;
}
var m=null;
function load(data){
    canv.width = window.innerWidth;
    canv.height = window.innerHeight;
    eval('var dt='+data);
    m=Main(dt);
}


sendRequest("keys.pyg",function(x){ load(x.responseText); });