function c(x,y,r){
    ctx.moveTo(x,y);
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    cctx.fill();
}

function range(s,e){
    var r=[];
    if (typeof(e)=='undefined'){e=s;s=0;}
    for (var i=s;i<e;i++)r.push(i);
    return r;
}

var Vector = Class([],{
    __init__:function(self,t,d){
        self.t=t||0;
        self.d=d||0;
    },
    frompos:function(x,y){
        var t = Math.atan2(y,x);
        var d = Math.sqrt(x*x+y*y);
        return Vector(t,d);
    },
    x:function(self){
        return Math.cos(self.t)*self.d;
    },
    y:function(self){
        return Math.sin(self.t)*self.d;
    },
    add:function(self,other){
        return Vector.frompos(self.x()+other.x(),self.y()+other.y());
    },
    addip:function(self,other){
        var nv = Vector.frompos(self.x()+other.x(),self.y()+other.y());
        self.d = nv.d;
        self.t = nv.t;
    },
    addpos:function(self,pos){
        var nv = Vector.frompos(self.x()+pos[0],self.y()+pos[1]);
        self.d = nv.d;
        self.t = nv.t;
    },
    bounce:function(self,angle){
        self.t = angle*2-self.t;
        self.d*=.75;
    },
    limit_speed:function(self,x){
        if (self.d>x){
            self.d = x;
        }
    }
});

var Sprite = Class([],{
    __init__:function(self,parent,pos){
        self.parent = parent;
        self.pos = pos;
    },
    draw:function(self,ctx){},
    event:function(self,e){},
    step:function(self){}
});

var MovingSprite = Class([Sprite],{
    __init__:function(self,parent,pos,v){
        Sprite.__init__(self,parent,pos);
        if (!v) v = Vector(0,0);
        self.v=v;
        self.gravity = Vector(0,0);
    },
    offside:function(self,pos,margin){
        var ret = [];
        var margin = margin||0;
        if (pos[0]<margin){
            ret.push('w');
        }
        if (pos[0]>self.parent.size[0]-margin){
            ret.push('e');
        }
        if (pos[1]<margin){
            ret.push('n');
        }
        if (pos[1]>self.parent.size[1]-margin){
            ret.push('s');
        }
        return ret;
    },
    step:function(self){
        self.pos[0]+=self.v.x();
        self.pos[1]+=self.v.y();
        self.v = self.v.add(self.gravity)
    },
    drawLoop:function(self,ctx,off){
        var dirs = {'w':[1,0],'e':[-1,0],'n':[0,1],'s':[0,-1]};
        for (var i=0;i<off.length;i++){
            var pos = [dirs[off[i]][0]*self.parent.size[0], dirs[off[i]][1]*self.parent.size[1]];
            self.drawAt(ctx,pos);
        }
    },
    loopPos:function(self,margin){
        var margin = margin||0;
        if (self.pos[0]<margin){
            self.move([self.parent.size[0],0])
        }
        if (self.pos[0]>self.parent.size[0]-margin){
            self.move([-self.parent.size[0],0])
        }
        if (self.pos[1]<margin){
            self.move([0,self.parent.size[1]])
        }
        if (self.pos[1]>self.parent.size[1]-margin){
            self.move([0,-self.parent.size[1]])
        }
    },
    limitPos:function(self,margin){
        var margin = margin||0;
        if (self.pos[0]<margin){
            self.pos[0]=margin;
        }
        if (self.pos[0]>self.parent.size[0]-margin){
            self.pos[0] = self.parent.size[0]-margin;
        }
        if (self.pos[1]<margin){
            self.pos[1] = margin;
        }
        if (self.pos[1]>self.parent.size[1]-margin){
            self.pos[1] = self.parent.size[1]-margin;
        }
    },
    move:function(self,pos){
        self.pos[0]+=pos[0];
        self.pos[1]+=pos[1];
    }
});

var ImageSprite = Class([MovingSprite],{
    _cache : {},
    __init__:function(self,parent,pos,image){
        MovingSprite.__init__(self,parent,pos);
        if (!ImageSprite._cache[image]){
            var img = ImageSprite._cache[image] = new Image();
            img.onload = function(){
               img.loaded = true;
            }
            img.loaded = false;
            img.src = image;
        }
        self.image = image;
    },
    draw:function(self,ctx){
        var img = ImageSprite._cache[self.image]
        if (img.loaded)
            ctx.drawImage(img,self.pos[0]-img.width/2,self.pos[1]-img.height/2);
    },
    step:function(self){
        MovingSprite.step(self);
    }
});

var Game = Class([],{
    __init__:function(self,scr,size){
        self.scr = scr;
        if (!size){
            size = self.calcSize();
        }
        self.scr.width=size[0];
        self.scr.height=size[1];
        self.ctx = self.scr.getContext('2d');
        self.size = size
        self.objects = [];
        self.running = false;
        self.ebuf = [];
        self._keys = {};
        self.register_events();
    },
    calcSize:function(self){
        var w = self.scr.offsetWidth;
        var h = self.scr.offsetHeight;
        return [w,h];
    },
    pass:function(self,what,args){
        if (what=='draw'){
            for (var i=self.objects.length-1;i>-1;i--){
                self.objects[i][what].apply(null,args);
            }
        }else{
            self.objects.forEach(function(x){x[what].apply(null,args);});
        }
    },
    register_events:function(self){
        window.onkeydown = function(e){
            self._keys[e.keyCode] = true;
            if (e.keyCode==8 || e.keyCode==13){
                self.running = false;
            }
            self.event(e);
        };
        window.onkeyup = function(e){
            self._keys[e.keyCode] = false;
            self.event(e);
        };
    },
    add:function(self,o){
        self.objects.push(o);
    },
    remove:function(self,o){
       if (self.objects.indexOf(o)!==-1){
           self.objects.splice(self.objects.indexOf(o),1);
       }
    },
    addEvent:function(self,e){
        self.ebuf.push(e);
        //console.log(e);
    },
    event:function(self,e){
        self.pass('event',[e]);
    },
    events:function(self){
        self.ebuf.forEach(self.event);
        self.ebuf = [];
    },
    step:function(self){
        self.pass('step');
    },
    draw:function(self){
        
        /*var a = .15;
        var c = [250,250];
        var rp = (Math.PI - 2*a)/4;
        var r = Math.sqrt(250*250+250*250);
        
        self.ctx.translate(Math.cos(rp)*a*r,-Math.sin(rp)*a*r);
        self.ctx.rotate(a);
        
        var shrink = -10;//ss.get('shrink');
        self.ctx.globalCompositeOperation='copy';
        self.ctx.drawImage(self.scr,0,0,500,500,shrink,shrink,500-2*shrink,500-2*shrink);
        self.ctx.globalCompositeOperation='source-over';
        self.ctx.setTransform(1, 0, 0, 1, 0,0);
        */
        
        
        /*
        //self.ctx.globalAlpha = .1;
        self.ctx.fillStyle='white';
        self.ctx.fillRect(0,0,self.size[0],self.size[1]);
        self.ctx.globalAlpha = 1;
        */
        
        self.ctx.clearRect(0,0,self.size[0],self.size[1]);
        
        self.pass('draw',[self.ctx]);
    },
    loop:function(self){
        if (!self.running)return;
        var s = new Date().getTime();
        self.events();
        self.step();
        self.draw();
        var df = new Date().getTime()-s;
        setTimeout(self.loop,1000/40-df);
        /*if (df>1000/40){
            console.log('lag',df);
            debugger;
        }*/
    },
    setup:function(){},
    play:function(self){
        self.running = true;
        self.setup();
        self.loop();
    }
});