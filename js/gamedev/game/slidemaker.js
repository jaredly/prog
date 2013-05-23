

var Thing = Class([],{
    __init__:function(self,parent,[name,src,size],[x,y]){
        var cont = parent.screen.appendChild(cE("div"));
        cont.className = "container";
        self.img = cont.appendChild(cE("div"));
        self.img.style.backgroundImage = 'url('+src+')';
        self.img.style.left = x+"px";
        self.img.style.top = y+"px";
        self.img.style.width = size[0]+"px";
        self.img.style.height = size[1]+"px";
        self.size = size;
        self.img.addEventListener("mousedown",self.mousedown,false);
        self.img.addEventListener("mousemove",self.mousemove,false);
        self.img.addEventListener("mouseover",self.mouseover,false);
        self.img.addEventListener("mouseout",self.mouseout,false);
        self.parent = parent;
        self.pos = [x,y];
        self.name = name;
    },
    data:function(self){
        return [self.name,self.pos,self.size];
    },
    mousedown:function(self,e){
        if (mouseButton(e)!=3)return;
        self.remove();
        self.parent.screen.removeChild(self.img.parentNode);
    },
    mousemove:function(self,e){
        if (self.parent.mbut!=3)return;
        self.remove();
        self.parent.screen.removeChild(self.img.parentNode);
    },
    mouseover:function(self,e){
        self.img.style.border='2px solid red';
    },
    mouseout:function(self,e){
        self.img.style.border='';
    },
    remove:function(self){
        for (var i=0;i<self.parent.objects.length;i++){
            if (self.pos[0]==self.parent.objects[i].pos[0] && self.pos[1]==self.parent.objects[i].pos[1]){
                return self.parent.objects.splice(i,1);
            }
        }
        throw "self notfound";
    }
});

var Sizer = Class([],{
    __init__:function(self,parent){
        var cont = parent.screen.appendChild(cE("div"));
        cont.className = "container";
        self.img = cont.appendChild(cE("div"));
        self.parent = parent;
        self.name = name;
    },
    setPos:function(self,[x,y]){
        self.img.style.left = x+"px";
        self.img.style.top = y+"px";
        self.pos = [x,y];
    },
    getPos:function(self){
        var [x,y] = self.pos;
        if (self.size[0]<=0)x+=self.size[0]-20;
        if (self.size[1]<=0)y+=self.size[1]-20;
        return [x,y];
    },
    getSize:function(self){
        var [w,h] = self.size;
        if (w<=0)w=-w+40;
        if (h<=0)h=-h+40;
        return [w,h];
    },
    setStyle:function(self,[name,src,size]){
        self.setSize(size);
        self.img.style.backgroundImage = 'url('+src+')';
    },
    setSize:function(self,size){
        self.img.style.display="";
        if (size[0]<=0){
            self.img.style.left = self.pos[0]+size[0]-20+"px";
            self.img.style.width = -size[0]+40+"px";
        }else{
            self.img.style.left = self.pos[0]+"px";
            self.img.style.width = size[0]+"px";
        }
        if (size[1]<=0){
            self.img.style.top = self.pos[1]+size[1]-20+"px";
            self.img.style.height = -size[1]+40+"px";
        }else{
            self.img.style.top = self.pos[1]+"px";
            self.img.style.height = size[1]+"px";
        }
        self.size = size;
    },
    mmove:function(self,[x,y]){
        var [a,b] = self.pos;
        self.setSize([(x-a)+20,(y-b)+20]);
    },
    hide:function(self){
        self.img.style.display="none";
    }
});

var Creator = Class([],{
    __init__:function(self,tb,screen,size){
        self.screen = screen || document.body;
        self.toolbar = tb;
        size = size || [200,200]
        self.size = size;
        self.screen.style.width = size[0]+"px";
        self.screen.style.height = size[1]+"px";
        self.objects = [];
        self.sizer = Sizer(self);
        self.types = [];
        self.register();
        self.mbut = 0;
        self.spos = findPos(self.screen);
    },
    addType:function(self,name,src,size,sizeable){
        self.types[name] = [name,src,size||[20,20],sizeable||false];
        var img = self.toolbar.appendChild(new Image());
        img.src = src;
        img.onclick = function(){
            self.current = self.types[name];
        };
        self.current = self.types[name];
        self.spos = findPos(self.screen);
    },
    epos:function(self,e){
        var [x,y] = mousePos(e,self.spos);
        x=int(x/20)*20;
        y=int(y/20)*20;
        return [x,y];
    },
    event:function(self,e){
    },
    addObject:function(self,pos,size){
        for (var i=0;i<self.objects.length;i++){
            if (pos[0]==self.objects[i].pos[0] && pos[1]==self.objects[i].pos[1])return;
        }
        var [name,src,osize] = self.current;
        size = size||osize;
        self.objects.push(Thing(self,[name,src,size],pos));
    },
    mdown:function(self,e){
        self.mbut = mouseButton(e);
        if (self.mbut!=1)return;
        self.mpos = self.epos(e);
        if (self.current[3]){
            self.sizer.setPos(self.mpos);
            self.sizer.setStyle(self.current);
        }
    },
    mup:function(self,e){
        var pos = self.epos(e);
        if (self.mpos){
            if (self.current[3]){
                self.addObject(self.sizer.getPos(),self.sizer.getSize());
                self.sizer.hide();
            }else
                self.addObject(pos);
        }
        self.mpos = null;
        self.mbut = null;
    },
    mmove:function(self,e){
        var pos = self.epos(e);
        if (self.mbut==1){
            if (self.current[3])
                self.sizer.mmove(pos);
            else
                self.addObject(pos);
        }
    },
    click:function(self,e){
        /*if (mouseButton(e)!=1)return;
        var [x,y] = self.epos(e);
        self.objects.push(Thing(self,self.current,[x,y]));*/
    },
    register:function(self){
        self.screen.addEventListener('click',self.event,false);
        self.screen.addEventListener('mousedown',self.mdown,false);
        self.screen.addEventListener('mouseup',self.mup,false);
        self.screen.addEventListener('mousemove',self.mmove,false);
        document.addEventListener('keydown',self.event,true);
        document.addEventListener('keyup',self.event,true);
        document.addEventListener('contextmenu',function(e){e.preventDefault();return false;},true);
        document.oncontextmenu = function(e){
            e.preventDefault();
            return false;
        }
    },
    save:function(self){
        var ret = [];
        for (var i=0;i<self.objects.length;i++){
            ret.push(self.objects[i].data());
        }
        return ret;
    }
});


function rm(ar,x){
    for (var i=0;i<ar.length;i++){
        if (ar[i][0]==x){
            return ar.splice(i,1);
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



var images = [['apple','apple.gif'],['block','block.png'],['face','face.png'],['teleport','teleport.png']];
images.loaded = {};

window.onload = function(){
    load_images(images,load);
}
var c;

function load(){
    c = Creator($('toolbar'),$('screen'),[6000,200]);
    c.addType('face','face.png',[20,20],false);
    c.addType('block','block.png',[20,20],true);
}