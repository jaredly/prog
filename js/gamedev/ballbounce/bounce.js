
var Rect = Class([],{
    __init__:function(self){
        if (arguments.length==1)
            self.x=self.y=self.w=self.h=0;
        else if (arguments.length==2)
            [self.x,self.y,self.w,self.h] = arguments[1];
        else if (arguments.length==5)
            [self.x,self.y,self.w,self.h] = Array.prototype.slice.call(arguments,1);
        else console.error("Invalid Rect initialization",arguments);
    },
    center:function(self){
        return [self.x+self.w/2,self.y+self.h/2];
    },
    move:function(self,x,y){
        if (typeof(y)=='undefined'){
            if (x._class=Vector){
                self.x += x.x();
                self.y += x.y();
            }else{
                self.x += x[0];
                self.y += x[1];
            }
        }else{
            self.x+=x;
            self.y+=y;
        }
    }
});

var Vector = Class([],{
    __init__:function(self,t,m){
        if (typeof(m)=='undefined'){
            if (!t){
                self.theta = 0;
                self.mag = 0;
            }else if (t._class==Vector){
                self.theta = t.theta;
                self.mag = t.mag;
            }else{
                self.theta = t[0];
                self.mag = t[1];
            }
        }else{
            self.theta = t;
            self.mag = m;
        }
    },
    add:function(self,other){
        var x = self.x()+other.x();
        var y = self.y()+other.y();
        var d = Math.sqrt(x*x+y*y);
        return Vector(Math.atan2(y,x),d);
    },
    x:function(self){
        return Math.cos(self.theta)*self.mag;
    },
    y:function(self){
        return Math.sin(self.theta)*self.mag;
    },
    set_x:function(self,x){
        self.set(Vector.from_pos(x,self.y()));
    },
    set_y:function(self,y){
        self.set(Vector.from_pos(self.x(),y));
    },
    set:function(self,v){
        self.theta = v.theta;
        self.mag = v.mag;
    },
    bounce:function(self,wall,losses){
        self.theta += 2*(wall-self.theta);
        if (losses){
            self.mag*=losses;
            if (self.mag<.5)self.mag = 0;
        }
        /*if (losses){
            var o = self.part(wall);
            var t = self.part(wall+Math.PI/2);
            t *= losses;
            
            var nm = Math.sqrt(o*o+t*t);
            var nt = wall - Math.acos(o/nm);
            //var nt = (wall+Math.PI/2) - Math.asin(t/nm);
            
            self.theta = nt;
            self.mag = nm;
        }*/
    },
    part:function(self,ang){
        return self.mag * Math.cos(ang-self.theta);
    },
    from_pos:function(x,y,z){
        if (x._class==Vector){
            y=z;x=y;
        }
        if (typeof(y)=='undefined'){
            y=x[0];x=x[0];
        }
        return Vector(Math.atan2(y,x),Math.sqrt(x*x+y*y));
    }
});

var Sprite = Class([],{
    __init__:function(self,parent,pos){
        self.parent = parent;
        self.rect = Rect(pos[0],pos[1],0,0);
    },
    step:function(self){},
    event:function(self){},
    draw:function(self){}
});

var Movable = Class([Sprite],{
    __init__:function(self,parent,pos,v){
        Sprite.__init__(self,parent,pos);
        self.v = Vector(v);
        self.gravity = Vector(0,0);
    },
    step:function(self){
        self.v = self.v.add(self.gravity);
        self.rect.x += self.v.x();
        self.rect.y += self.v.y();
    }
});

var Game = Class([],{
    size:[200,200],
    fps:40,
    redraw:true,
    bgc:'lightgray',
    __init__:function(self,canvas){
        self.objects = [];
        self.running = false;
        self.canv = canvas;
        self.canv.width = self.size[0];
        self.canv.height = self.size[1];
        self.cpos = findPos(canvas);
        self.ctx = self.canv.getContext('2d');
        self.register();
    },
    register:function(self){
        self.canv.addEventListener("mousedown",self.event,true);
        document.addEventListener("mouseup",self.event,true);
        document.addEventListener("mousemove",self.event,true);
        document.addEventListener("keydown",self.event,true);
        document.addEventListener("keyup",self.event,true);
    },
    _pass:function(self,what,args){
        if (!args)args = [];
        for (var i=0;i<self.objects.length;i++){
            self.objects[i][what].apply(null,args);
        }
    },
    event:function(self,e){
        if (!e)return;
        e.pos = ePos(e,self.cpos);
        self._pass("event",[e]);
    },
    step:function(self){
        self._pass("step");
    },
    draw:function(self){
        if (self.redraw){ // that.ctx.clearRect(0,0,800,800);
            self.ctx.fillStyle = self.bgc;
            self.ctx.fillRect(0,0,self.size[0],self.size[1]);
        }
        self._pass("draw",[self.ctx]);
    },
    loop:function(self){
        self.running = true;
        var each = function(){
            if (!self.running)
                return
            self.event();
            self.step();
            self.draw();
            setTimeout(each,1000/self.fps);
        };
        each();
    }
});



var Ball = Class([Movable],{
    __init__:function(self,parent,pos,v,color,size){
        Movable.__init__(self,parent,pos,v);
        size = size || 10;
        self.size = size;
        self.color = color;
        self.rect = Rect(pos[0]-size,pos[1]-size,size*2,size*2);
        self.gravity = Vector(Math.PI/2,.5);
        self.hover = false;
        self.grabbed = false;
        self.mpos = [0,0];
    },
    draw:function(self,ctx){
        ctx.globalAlpha = 1;
        ctx.fillStyle = self.color;
        ctx.fillStyle = self.color;
        ctx.beginPath();
        var c = self.rect.center();
        //$('energy').innerHTML = c+':'+self.size;
        ctx.arc(c[0],c[1],self.size,0,Math.PI*2,true);
        ctx.fill();
        
        if (self.grabbed || circle2point(self.rect.center(),self.size,self.mpos)){
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'white';
            ctx.beginPath();
            ctx.arc(c[0],c[1],self.size,0,Math.PI*2,true);
            ctx.stroke();
        }
        if (self.grabbed){
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(c[0],c[1]);
            ctx.lineTo(self.mpos[0],self.mpos[1]);
            ctx.stroke();
        }
        if (self.parent.show_velocity)
            self.draw_arrow(ctx,self.rect.center(),self.v.theta,self.v.mag*4,'yellow');
        ctx.globalAlpha = 1;
    },
    draw_arrow:function(self,ctx,pos,dir,mag,color){
        var fpos = [pos[0]+Math.cos(dir)*mag,pos[1]+Math.sin(dir)*mag];
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(pos[0],pos[1]);
        ctx.lineTo(fpos[0],fpos[1]);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(fpos[0],fpos[1],2,0,Math.PI*2,true);
        ctx.fill();
    },
    handle_collisions:function(self){
        for (var i=0;i<self.parent.objects.length;i++){
            var o = self.parent.objects[i];
            if (self == o)continue;
            var c = self.rect.center();
            var oc = o.rect.center();
            if (circle2circle(c,self.size,oc,o.size)){
                var at = angle_to(c,oc);
                
                var ballcoeff = .7;
                
                var si = self.v.mag * Math.cos(self.v.theta - at);
                var oi = o.v.mag * Math.cos(o.v.theta - (at + Math.PI));
                var ti = (si+oi)*(.5+ballcoeff/2);
                
                o.v = o.v.add(Vector(at,ti));
                self.v = self.v.add(Vector(at+Math.PI,ti));
                
                /**
                if (si>0)o.v = no;
                if (oi>0)self.v = ns;
                var ba = at + Math.PI/2;
                self.v.bounce(ba);
                o.v.bounce(ba);
                **/
                
                var overlap = Math.abs(dst(c,oc)-(self.size+o.size));
                self.rect.move(Vector(at + Math.PI,overlap));
                o.rect.move(Vector(at,overlap));
            }
        }
    },
    step:function(self){
        if (self.grabbed){
            var c = self.rect.center();
            var nv = Vector.from_pos(self.mpos[0]-c[0],self.mpos[1]-c[1]);
            nv.mag /= 50;
            self.v = self.v.add(nv);
        }
        /******** predictive collision testing *********/
        self.handle_collisions();
        
        Movable.step(self);
        
        /********* check walls *********/
        wallcoeff = .9;
        if (self.rect.x<=0 || self.rect.x+self.rect.w>=self.parent.size[0])
            self.v.bounce(Math.PI/2,wallcoeff);
        if (self.rect.y<=0 || self.rect.y+self.rect.h>=self.parent.size[1])
            self.v.bounce(0,wallcoeff);
        if (self.rect.x<=0)self.rect.x*=-1;
        if (self.rect.x+self.rect.w>=self.parent.size[0])
            self.rect.x = (self.parent.size[0]-self.rect.w)*2-self.rect.x;
        if (self.rect.y<=0)self.rect.y*=-1;
        if (self.rect.y+self.rect.h>=self.parent.size[1])
            self.rect.y = (self.parent.size[1]-self.rect.h)*2-self.rect.y;
        if (self.v.mag>10)self.v.mag=10;
    },
    event:function(self,e){
        if (!e)return;
        if (e.type=='mousemove'){
            self.mpos = e.pos;
        }else if (e.type=='mousedown'){
            self.mpos = e.pos;
            if (circle2point(self.rect.center(),self.size,e.pos))
                self.grabbed = true;
        }else if (e.type=='mouseup'){
            self.mpos = e.pos;
            self.grabbed = false;
        }
    }
});

var BallGame = Class([Game],{
    __init__:function(self){
        Game.__init__(self,$('screen'));
        
        var np = function(){
            return [random(self.size[0]-20)+10,random(self.size[1]-20)+10];
        }
        var isopen = function(p){
            for (var i=0;i<self.objects.length;i++){
                if (circle2point(self.objects[i].rect.center(),self.objects[i].size,p))
                    return false;
            }
            return true;
        }
        for (var i=0;i<10;i++){
            var p = np();
            while (!isopen(p))
                p = np();
            self.objects.push(Ball(self,p,[random(Math.PI*2),random(10)],randc()));
        }
        
        self.show_velocity = false;
        self.ctx.globalAlpha = .5;
    },
    step:function(self){
        Game.step(self);
        var tot = 0;
        for (var i=0;i<self.objects.length;i++){
            tot += self.objects[i].v.mag;
        }
        //$('energy').innerHTML = 'Total Energy: '+tot;
    },
    event:function(self,e){
        if (!e)return;
        Game.event(self,e);
        if (e.type=='keydown' && e.keyCode=='13')
            self.show_velocity = !self.show_velocity;
    }
});

var bg = BallGame();
bg.loop();


