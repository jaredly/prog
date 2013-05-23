var Snake = Class([MovingSprite],{
    __init__:function(self,parent,pos,color,lcolor){
        MovingSprite.__init__(self,parent,pos,Vector(Math.PI/2,0));
        self.color = color;
        self.lcolor = lcolor;
        self.lpos = pos.slice();
        self.mass = 10.0;
        self.tail = [[pos[0],pos[1]-i*10] for each(i in range(10))];
        self.calcTail();
    },
    calcTail:function(self){
        self.tailpts = [];
        var at = angle_to(self.pos,self.tail[self.tail.length-1])+Math.PI/2;
        self.tailpts.push([self.pos[0] + self.mass*Math.cos(at), self.pos[1] + self.mass*Math.sin(at)]);
        for (var i=self.tail.length-1;i>0;i--){
            var at = angle_to(self.tail[i],self.tail[i-1])+Math.PI/2;
            var w = self.mass*((i+.5)/self.tail.length);
            if (i<4){w = self.mass*((i+.5)/4);}
            else{w = self.mass*.9;}
            self.tailpts.push([self.tail[i][0] + w*Math.cos(at),self.tail[i][1] + w*Math.sin(at)]);
        }
        for (var i=0;i<self.tail.length-1;i++){
            var at = angle_to(self.tail[i],self.tail[i+1])+Math.PI/2;
            var w = self.mass*((i+.5)/self.tail.length);
            if (i<4){w = self.mass*((i+.5)/4);}
            else{w = self.mass*.9;}
            self.tailpts.push([self.tail[i][0] + w*Math.cos(at),self.tail[i][1] + w*Math.sin(at)]);
        }
        var at = angle_to(self.pos,self.tail[self.tail.length-1])-Math.PI/2;
        self.tailpts.push([self.pos[0] + self.mass*Math.cos(at),self.pos[1] + self.mass*Math.sin(at)]);
        // done!
        
        self.ltailpts = [];
        var at = angle_to(self.pos,self.tail[self.tail.length-1])+Math.PI/2;
        self.ltailpts.push([self.pos[0] + self.mass/4*Math.cos(at), self.pos[1] + self.mass/4*Math.sin(at)]);
        for (var i=self.tail.length-1;i>0;i--){
            var at = angle_to(self.tail[i],self.tail[i-1])+Math.PI/2;
            var w = self.mass/4*((i+.5)/self.tail.length);
            if (i<4){w = self.mass/4*((i+.5)/4);}
            else{w = self.mass/4*.9;}
            self.ltailpts.push([self.tail[i][0] + w*Math.cos(at),self.tail[i][1] + w*Math.sin(at)]);
        }
        for (var i=0;i<self.tail.length-1;i++){
            var at = angle_to(self.tail[i],self.tail[i+1])+Math.PI/2;
            var w = self.mass/4*((i+.5)/self.tail.length);
            if (i<4){w = self.mass/4*((i+.5)/4);}
            else{w = self.mass/4*.9;}
            self.ltailpts.push([self.tail[i][0] + w*Math.cos(at),self.tail[i][1] + w*Math.sin(at)]);
        }
        var at = angle_to(self.pos,self.tail[self.tail.length-1])-Math.PI/2;
        self.ltailpts.push([self.pos[0] + self.mass/4*Math.cos(at),self.pos[1] + self.mass/4*Math.sin(at)]);
    },
    draw:function(self,ctx){
        
        self.drawAt(ctx,[0,0]);
        
        var off = [];
        for (var i=0;i<self.tailpts.length;i++){
            var o = self.offside(self.tailpts[i]);
            for (var a=0;a<o.length;a++){
                if (off.indexOf(o[a])===-1){
                    off.push(o[a]);
                }
            }
        }
        self.drawLoop(ctx,off);
    },
    drawAt:function(self,ctx,pos){
        var [x,y] = pos;
        
        var pts = [[-5,-2],[-7,2],[-6,10],[-2,20],[2,20],[6,10],[7,2],[5,-2]];
        pts = morph_poly(pts,[0,0],self.v.t-Math.PI/2);
        
        ctx.fillStyle = self.color;
        
        ctx.beginPath();
        ctx.moveTo(pts[0][0]+self.pos[0]+x,pts[0][1]+self.pos[1]+y);
        for (var i=0;i<pts.length;i++){
            ctx.lineTo(pts[i][0]*(self.mass/5)+self.pos[0]+x,pts[i][1]*(self.mass/5)+self.pos[1]+y);
        }
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(self.pos[0]+x,self.pos[1]+y);
        for (var i=0;i<self.tailpts.length;i++){
            ctx.lineTo(self.tailpts[i][0]+x, self.tailpts[i][1]+y);
            // change this to be more smooth
        }
        ctx.fill();
        
        ctx.fillStyle = self.lcolor;
        ctx.beginPath();
        ctx.moveTo(self.pos[0]+x,self.pos[1]+y);
        for (var i=0;i<self.ltailpts.length;i++){
            ctx.lineTo(self.ltailpts[i][0]+x, self.ltailpts[i][1]+y);
            // change this to be more smooth
        }
        ctx.fill();
    },
    collidesWith:function(self,x){
        var dv = Vector.frompos(x.pos[0]-self.pos[0],x.pos[1]-self.pos[1]);
        if (dv.d < self.mass/5*20 + x.mass){
            return dv;
        }else{
            return false;
        }
    },
    move:function(self,pos){
        self.pos[0] += pos[0];
        self.pos[1] += pos[1];
        for (var i=0;i<self.tail.length;i++){
            self.tail[i][0] += pos[0];
            self.tail[i][1] += pos[1];
        }
    },
    step:function(self){
        self.lpos=self.pos.slice();
        MovingSprite.step(self);
        self.loopPos(0);
        
        self.parent.objects.forEach(function(x){
            if (x==self)return;
            var nv = Vector.frompos(x.pos[0]-self.pos[0],x.pos[1]-self.pos[1]);
            if (nv.d<20+x.mass){
                if (x._class == Cow){
                    self.parent.remove(x);
                    self.addSeg();
                }
            }
        });
        for (var i=0;i<self.tail.length-1;i++){
            var dp = Vector.frompos(self.tail[i+1][0]-self.tail[i][0], self.tail[i+1][1]-self.tail[i][1]);
            dp.d -= self.mass*2;
            self.tail[i][0] += dp.x();
            self.tail[i][1] += dp.y();
        }
        var dp = Vector.frompos(self.pos[0]-self.tail[i][0], self.pos[1]-self.tail[i][1]);
        dp.d -= self.mass;
        self.tail[i][0] += dp.x();
        self.tail[i][1] += dp.y();
        
        var sp = 1;
        if (self.parent._keys[37]){
            self.v.t -= Math.PI/(self.mass*3);
        }else if (self.parent._keys[39]){
            self.v.t += Math.PI/(self.mass*3);
        }
        
        self.v.d = self.mass/7*5;
        self.calcTail();
    },
    
    //stuff
    addSeg:function(self){
        self.tail.unshift([self.tail[0][0],self.tail[0][1]]);//.slice());
        //$('score').innerHTML = self.tail.length-10;
    }
});
