function Guy(x,y,parent){
    var that = Sprite("face.png",x,y,parent);
    that.gravity = .2;
    that.drag = .1;
    that.keydown = {
        "UP":function(e){
            if (!that.gravity){
                that.dy = -10;
            }else if (that.x<=0){
                that.dy = -7;
                that.dx = 10;
            }else if (that.x >= parent.width()-that.width()){
                that.dy = -7;
                that.dx = -10;
            }
        },
        "DOWN":function(e){
           // that.y += 3;
        },
        "LEFT":function(e){
            that.x -= 3;
            if (that.dx<0)that.dx =0;
        },
        "RIGHT":function(e){
            that.x += 3;
            if (that.dx>0)that.dx =0;
        }
    }
    that.step = function(){
        if (that.y>=parent.height()-that.height()){
            if (that.gravity){
                that.dy = 0;
                that.y = parent.height()-that.height()
                that.gravity=0;
            }
        }else{
            that.gravity=.2;
        }
        if (that.x<0){that.x=0}
        else if(that.x>=parent.width()-that.width()){
            that.x = parent.width()-that.width()
        }
    }
}
var game = null;
function start(){

    game = Game();

    var guy = Guy(20,20,game)
    game.loop();
}