var images = [['apple','apple.gif'],['block','block.png'],['face','face.png'],['teleport','teleport.png']];
images.loaded = {};

function rm(ar,x){
    for (var i=0;i<ar.length;i++){
        if (ar[i][0]==x){
            return ar.splice(i,1);Image
        }
    }
}
function load_images(images,ondone){
    if (images.length==0)ondone(); //all images are loaded
    for (var i=0;i<images.length;i++){
        (function(name,src){
            var img = new Image();
            img.onload = function(){
                images.loaded[name] = this;
                rm(images,name);
                if (images.length==0)ondone(); //all images are loaded
            }
            img.src = images[i][1];
        })(images[i][0],images[i][1]);
    }
}

var Rect = Class([],{
    x:0,
    y:0,
    w:0,
    h:0,
    __init__:function(self){
        if (arguments.length==2){
            if (arguments[1]._class==self._class){
                self.set_pts(arguments[1].pts());
            }else{
                self.set_pts(arguments[1]);
            }
        }else if (arguments.length==5){
            self.set_pts(Array.prototype.slice.call(arguments,1));
        }else if (arguments.length!=1){
            console.error("Bad Arguments",arguments.length,Array.prototype.slice.call(arguments,0));
        }
    },
    set_pts:function(self,[x,y,w,h]){
        self.x=x;
        self.y=y;
        self.w=w;
        self.h=h;
    },
    pts:function(self){
        return [self.x,self.y,self.w,self.h];
    },
    move:function(self,x,y){
        if (typeof(y)=='undefined')
            [x,y] = x;
        return Rect(self.x+x,self.y+y,self.w,self.h);
    },
    move_ip:function(self,x,y){
        if (typeof(y)=='undefined')
            [x,y] = x;
        self.x+=x;
        self.y+=y;
    },
    colliderect:function(self,rect){
        if (rect._class==self._class)var [x,y,w,h] = rect.pts();
        else var [x,y,w,h] = rect;
        var [a,b,c,d] = self.pts();
        var xs = x<=a && a<x+w || a<=x && x<a+c;
        var ys = y<=b && b<y+h || b<=y && y<b+d;
        return xs && ys;
    },
    collidepoint:function(self,x,y){
        if (typeof(y)=='undefined')
            [x,y] = x;
        var [a,b,c,d] = self.pts();
        return a<=x && x<=a+c && b<=y && y<=b+d;
    }
});

var Sprite = Class([],{
    __init__:function(self){},
    step:function(self){},
    event:function(self){},
    draw:function(){}
});

var ImageSprite = Class([Sprite],{
    iname:null,
    __init__:function(self,parent,pos,size){
        self.parent = parent;
        var container = parent.screen.appendChild(cE("div"));
        container.className = "container";
        var image = images.loaded[self.iname];
        self.img = container.appendChild(cE("div"));
        self.img.style.backgroundImage = 'url('+image.src+")";
        self.img.className = "sprite";
        size = size || self.size || [image.width,image.height];
        self.rect = Rect(pos[0],pos[1],size[0],size[1]);
    },
    draw:function(self){
        self.img.style.left = self.rect.x+"px";
        self.img.style.top = self.rect.y+"px";
        self.img.style.width = self.rect.w+"px";
        self.img.style.height = self.rect.h+"px";
    }
    /*setsize:function(self,w,h){
        if (typeof(h)=='undefined')
            [w,h] = w;
        self.size = [w,h];
        self.img.style.width = w+"px";
        self.img.style.height = h+"px";
        self.rect.w=w;
        self.rect.h=h;
    },
    setpos:function(self,x,y){
        if (typeof(y)=='undefined')
            [x,y] = x;
        self.img.style.left = x+"px";
        self.img.style.top = y+"px";
        self.pos = [x,y];
        self.rect.x=x;
        self.rect.y=y;
    },
    move:function(self,[x,y]){
        var [a,b] = self.pos;
        self.setpos([a+x,b+y]);
    }*/
});

var MovingSprite = Class([ImageSprite],{
    __init__:function(self,parent,pos){
        ImageSprite.__init__(self,parent,pos);
        self.dx = self.dy = 0;
        self.gravity = 0;
    },
    step:function(self){
        self.dy += self.gravity;
        self.rect.move_ip(self.dx,self.dy);
    },
    collision_at:function(self,x,y){
        if (typeof(y)=='undefined')
            [x,y] = x;
        var nr = self.rect.move(x,y);
        for (var i=0;i<self.parent.objects.length;i++){
            if (self.parent.objects[i]==self)continue;
            if (nr.colliderect(self.parent.objects[i].rect))
                return self.parent.objects[i];
        }
        return false;
    },
    get_collisions:function(self){
        for (var i=0;i<self.parent.objects.length;i++){
            if (self.parent.objects[i]==self)continue;
            if (self.rect.colliderect(self.parent.objects[i].rect))
                self.collide(self.parent.objects[i]);
        }
    },
    collide:function(self){}
});

var Man = Class([MovingSprite],{
    iname:'face',
    event:function(self,e){
        if (e.type=='keydown'){
            if (e.keyCode==37)self.dx = -3;
            if (e.keyCode==38 && !self.gravity)self.dy = -7;
            if (e.keyCode==39)self.dx = 3;
        }
        if (e.type=='keyup'){
            if (e.keyCode==37 && self.dx==-3)self.dx = 0;
            if (e.keyCode==39 && self.dx==3)self.dx = 0;
        }
    },
    collide:function(self,other,bounce){
        if (!self.rect.colliderect(other.rect)){console.log('false');
            return;
            }
        self.rect.move_ip(-self.dx,-self.dy);
        var cx = self.rect.move(self.dx,0).colliderect(other.rect);
        var cy = self.rect.move(0,self.dy).colliderect(other.rect);
        if (cx){
            if (self.dx>0)
                self.rect.x = other.rect.x-self.rect.w;
            else
                self.rect.x = other.rect.x+other.rect.w;
            //self.dx = 0;
        }else if (cy){
            self.rect.x += self.dx;
        }
        if (cy){
            if (self.dy>0){
                self.rect.y = other.rect.y-self.rect.h;
                self.gravity = 0;
            }
            else{
                self.rect.y = other.rect.y+other.rect.h;
            }
            self.dy = 0;
        }else if (cx){
            self.rect.y+= self.dy;
        }else{
            if (self.dx>0)
                self.rect.x = other.rect.x-self.rect.w;
            else
                self.rect.x = other.rect.x+other.rect.w;
            //self.dx = 0;
        }
    },
    step:function(self){
        MovingSprite.step(self);
        self.get_collisions();
        
        if (self.rect.x>self.parent.size[0]-self.rect.w){
            self.rect.x = self.parent.size[0]-self.rect.w;
            self.dx = 0;
        }else if (self.rect.x<0){
            self.rect.x = 0;
            self.dx = 0;
        }
        var dcol = self.collision_at(0,1);
        if (self.rect.y>self.parent.size[1]-self.rect.h){
            self.rect.y = self.parent.size[1]-self.rect.h;
            if (self.dy>0)
                self.dy = 0;
        }else if (dcol && self.dy>0){
            self.dy = 0;
        }
        if (self.rect.y<self.parent.size[1]-self.rect.h && !dcol){
            self.gravity = 0.4;
        }else{
            self.gravity = 0;
        }
    }
});

var Block = Class([ImageSprite],{
    iname:'block'
});

var Game = Class([],{
    __init__:function(self,screen,realsize,size){
        self.viewport = screen || document.body;
        self.screen = self.viewport.appendChild(cE("div"));
        self.screen.className = 'screen';
        var size = size||[200,200];
        self.viewsize = size;
        self.viewport.style.width = size[0]+"px";
        self.viewport.style.height = size[1]+"px";
        self.setsize(realsize || [200,200]);
        self.objects = [];
        self.screenpos = [0,0];
        self.running = false;
        self.following = null;
    },
    setsize:function(self,size){
        self.screen.style.width = size[0]+"px";
        self.screen.style.height = size[1]+"px";
        self.size = size;
    },
    pass:function(self,fn){
        for (var i=0;i<self.objects.length;i++){
            self.objects[i][fn].apply(null,Array.prototype.slice.call(arguments,2));
        }
    },
    step:function(self){
        self.pass('step');
        self.dofollow();
        self.pass('draw');
        if (!self.running)clearInterval(self._loop);
    },
    event:function(self,e){
        self.pass('event',e);
    },
    dofollow:function(self){
        if (self.following){
            var [x,y] = self.screenpos;
            var rct = self.following.rect;
            if (rct.x<x+40)
                x = rct.x-40;
            if (rct.x+rct.w>x+self.viewsize[0]-40)
                x = rct.x+rct.w-self.viewsize[0]+40;
            if (rct.y<y+40)
                y = rct.y-40;
            if (rct.y+rct.h>y+self.viewsize[1]-40)
                y = rct.y+rct.h-self.viewsize[1]+40;
            if (x<0)x=0;
            if (x>self.size[0]-self.viewsize[0]) x=self.size[0]-self.viewsize[0];
            if (y<0)y=0;
            if (y>self.size[1]-self.viewsize[1]) y=self.size[1]-self.viewsize[1];
            self.screenpos = [x,y];
            self.screen.style.left = -x+"px";
            self.screen.style.top = -y+"px";
        }
    },
    register:function(self){
        self.screen.addEventListener('click',self.event,true);
        self.screen.addEventListener('mousedown',self.event,true);
        self.screen.addEventListener('mouseup',self.event,true);
        self.screen.addEventListener('mousemove',self.event,true);
        document.addEventListener('keydown',self.event,true);
        document.addEventListener('keyup',self.event,true);
    },
    loop:function(self){
        self.running = true;
        self.register();
        setInterval(self.step,20);
    }
});

window.onload = function(){
    load_images(images,load);
}
var gm;


function load(){
    sendRequest("board.brd",_load);
}

function _load(x){
    var objects = {'face':Man,'block':Block};
    gm = Game($('screen'),[400,200]);
    
    /*var m = Man(gm,[90,0]);
    gm.objects.push(m);
    gm.following = m;*/
    /**gm.objects.push(Block(gm,[0,180],[400,20]));
    gm.objects.push(Block(gm,[0,160],[40,20]));
    gm.objects.push(Block(gm,[80,140],[40,40]));
    gm.objects.push(Block(gm,[260,120],[20,60]));
    gm.objects.push(Block(gm,[220,160],[40,20]));
    gm.objects.push(Block(gm,[100,80],[60,20]));**/
    
    
    var objs = eval(x.responseText);
    for (var i=0;i<objs.length;i++){
        if (objs[i][0]=='face'){
            var m = objects[objs[i][0]](gm,objs[i][1],objs[i][2]);
            gm.following = m;
            gm.objects.push(m);
        }else
            gm.objects.push(objects[objs[i][0]](gm,objs[i][1],objs[i][2]));
    }
    
    
    
    
    gm.loop();
}