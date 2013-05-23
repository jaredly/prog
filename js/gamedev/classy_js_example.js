
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
    bounce:function(self,angle){
        self.t = angle*2-self.t;
        self.d*=.75;
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
        self.v=v;
        self.gravity = Vector(0,0);
    },
    step:function(self){
        self.pos[0]+=self.v.x();
        self.pos[1]+=self.v.y();
        self.v = self.v.add(self.gravity)
    }
});

var Planet = Class([MovingSprite],{
    __init__:function(self,parent,pos,mass,color){
        MovingSprite.__init__(self,parent,pos,Vector(0,0));//Math.random()*Math.PI*2,Math.random()*2+2));
        self.mass = mass;
        self.color = color;
        self.lpos = pos.slice();
        self.tail = [pos.slice() for each(i in range(10))];
        //self.nb = nb;
        //self.gravity = Vector(Math.PI/2,.1);
    },
    draw:function(self,ctx){
        ctx.fillStyle = self.color;
        ctx.moveTo(self.pos[0],self.pos[1]);
        ctx.beginPath();
        ctx.arc(self.pos[0],self.pos[1],self.mass,0,Math.PI*2,true);
        ctx.fill();
        for (var i=0;i<self.tail.length;i++){
            ctx.fillStyle = self.color;
            ctx.moveTo(self.tail[i][0],self.tail[i][1]);
            ctx.beginPath();
            ctx.arc(self.tail[i][0],self.tail[i][1],self.mass*((i+.5)/self.tail.length),0,Math.PI*2,true);
            ctx.fill();
        }
        /*
        if (!self.nb)return;
        self.parent.ctx2.beginPath();
        //self.parent.ctx2.moveTo(self.lpos[0],self.lpos[1]);
        self.parent.ctx2.moveTo(self.nb.pos[0],self.nb.pos[1]);
        self.parent.ctx2.lineTo(self.pos[0],self.pos[1]);
        self.parent.ctx2.strokeStyle = self.color;
        self.parent.ctx2.stroke();*/
    },
    step:function(self){
        self.lpos=self.pos.slice();
        MovingSprite.step(self);
        if (self.pos[0]<self.mass){
            self.v.bounce(Math.PI/2);
            self.pos[0] = self.mass;
        }
        if (self.pos[0]>self.parent.size[0]-self.mass){
            self.v.bounce(Math.PI/2);
            self.pos[0] = self.parent.size[0]-self.mass;
        }
        if (self.pos[1]<self.mass){
            self.v.bounce(0);
            self.pos[1] = self.mass;
        }
        if (self.pos[1]>self.parent.size[1]-self.mass){
            self.v.bounce(0);
            self.pos[1] = self.parent.size[1]-self.mass;
        }
        self.parent.objects.forEach(function(x){
            if (x==self)return;
            var nv = Vector.frompos(x.pos[0]-self.pos[0],x.pos[1]-self.pos[1]);
            if (nv.d<self.mass+x.mass){
                /*nv.d = self.mass+x.mass - nv.d;
                self.pos[0]-=nv.x();
                self.pos[1]-=nv.y();
                self.v.bounce(nv.t+Math.PI/2);
                x.v.bounce(nv.t+Math.PI/2);*/
                return;
            }
            nv.d = 10*self.mass*x.mass/(nv.d*nv.d);
            self.v = self.v.add(nv);
        });
        for (var i=0;i<self.tail.length-1;i++){
            self.tail[i][0] += (self.tail[i+1][0]-self.tail[i][0])*.3;
            self.tail[i][1] += (self.tail[i+1][1]-self.tail[i][1])*.3;
        }
        self.tail[i][0] += (self.pos[0]-self.tail[i][0])*.3;
        self.tail[i][1] += (self.pos[1]-self.tail[i][1])*.3;
        //self.parent.running=false;
    }
});

var Game = Class([],{
    __init__:function(self,scr,size){
        self.scr = scr;
        self.scr.width=size[0];
        self.scr.height=size[1];
        self.ctx = self.scr.getContext('2d');
        self.size = size
        self.objects = [];
        self.running = false;
        self.ebuf = [];
    },
    pass:function(self,what,args){
        self.objects.forEach(function(x){x[what].apply(null,args);})
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
        self.ctx.clearRect(0,0,self.size[0],self.size[1]);
        self.pass('draw',[self.ctx]);
    },
    loop:function(self){
        if (!self.running)return;
        self.events();
        self.step();
        self.draw();
        setTimeout(self.loop,1000/40);
    },
    play:function(self){
        self.running = true;
        self.loop();
    }
});

var GravGame = Class([Game],{
    __init__:function(self,scr,scr2,size){
        Game.__init__(self,scr,size);
        self.scr2 = scr2;
        self.scr2.width=size[0];
        self.scr2.height=size[1];
        self.ctx2=scr2.getContext('2d');
    }
});
