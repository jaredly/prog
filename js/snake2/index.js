
var Cow = Class([ImageSprite],{
    __init__:function(self,parent,pos){
        ImageSprite.__init__(self,parent,pos,"cow4.png");
        self.v = Vector(0,.1);
        self.mass = 20;
    },
    step:function(self){
        //self.loopPos();
        self.limitPos();
        var dv = Vector.frompos(self.parent.snake.pos[0]-self.pos[0],self.parent.snake.pos[1]-self.pos[1]);
        if (dv.d<150){
            dv.d = -(150-dv.d)/100;
            self.v.addip(dv);
        }else{
            self.v.d *= .95;
        }
        if (self.v.d>3){
            self.v.d = 3;
        }
        ImageSprite.step(self);
    },
    draw:function(self,ctx){
        self.drawAt(ctx,[0,0]);
        //var off = self.offside(self.pos,32);
        //self.drawLoop(ctx,off);
    },
    drawAt:function(self,ctx,pos){
        var opos = self.pos.slice();
        self.pos[0]+=pos[0];
        self.pos[1]+=pos[1];
        ctx.translate(self.pos[0],self.pos[1]);
        ctx.rotate(self.v.t+Math.PI/2);
        self.pos = [0,0];
        ImageSprite.draw(self,ctx);
        ctx.rotate(-self.v.t-Math.PI/2);
        ctx.translate(-opos[0]-pos[0],-opos[1]-pos[1]);
        self.pos = opos;
    }
});

var GravGame = Class([Game],{
    __init__:function(self,scr){
        Game.__init__(self,scr);
        /*self.makeCow();
        self.makeCow();
        self.makeCow();
        self.makeCow();*/
    },
    setup:function(self){
        self.objects = [];
        self.snake = Snake(self,[100,100], 'hsl(100,50%,50%)', 'hsl(100,100%,20%)');
        self.objects.push(self.snake);
        self.makeCow();
    },
    makeCow:function(self){
        if (!self.running)return;
        self.objects.push(Cow(self,self.rpos()));
        setTimeout(self.makeCow,3000 + Math.random()*3000);
    },
    rpos:function(self){
        for (var o=0;o<100;o++){
            var pos = rpos(self.size);
            var bad = false;
            for (var i=0;i<self.objects.length;i++){
                if (dst(pos,self.objects[i].pos)<50){
                    bad = true;
                    break;
                }
            }
            if (bad)continue;
            break;
        }
        return pos;
    }
});

function rcolor(){
    var bc = parseInt(Math.random()*360);
    return 'hsl('+bc+',50%,50%)';
    return 'rgb('+parseInt(Math.random()*255)+','+parseInt(Math.random()*255)+','+parseInt(Math.random()*255)+')';
}
function rpos(p){
    return [Math.random()*p[0],Math.random()*p[1]];
}

window.onload = function(){

window.gm = GravGame($('screen'),[500,500]);

//var bc = parseInt(Math.random()*360);
//gm.objects.push(Snake(gm, rpos(), 'hsl('+bc+',50%,50%)'));


gm.play();

};