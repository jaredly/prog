function Surface(id,size){
    var that = document.getElementById(id);
    var ctx = that._ctx = that.getContext('2d');
    that.size = size;
    that.setAttribute('width',size[0]);
    that.setAttribute('height',size[1]);
    that.setSize = function(size){
        that.size=size;
        that.setAttribute('width',size[0]);
        that.setAttribute('height',size[1]);
    }
    that.fill = function(color){
        ctx.fillStyle = rgb2c(color);
        ctx.fillRect(0,0,that.size[0],that.size[1]);
    }
    that.blit = function(src,[x,y]){
        ctx.drawImage(src,x,y);
    }
    return that;
}

var int = parseInt;

function rgb2c([r,g,b]){
    return 'rgb('+parseInt(r)+','+parseInt(g)+','+parseInt(b)+')';
}

var pygame = {
    _screen:Surface('pygame.js',[200,200]),
    _buff:Surface('double',[200,200]),
    _events:[],
    _cpos:[0,0],
    double_buff:true,
    display:{
        set_mode:function(size){
            if (size!=pygame._screen.size){
                pygame._screen.setSize(size);
                if (pygame.double_buff)
                    pygame._buff.setSize(size);
            }
            pygame.register(pygame._screen);
            if (pygame.double_buff)
                return pygame._buff;
            else
                return pygame._screen
        },
        flip:function(){
            if (pygame.double_buff){
                pygame._screen.fill([255,255,255]);
                pygame._screen._ctx.drawImage(pygame._buff,0,0);
            }
        }
    },
    draw:{
        line:function(scr,color,p1,p2,w){
            scr._ctx.strokeStyle = rgb2c(color);
            scr._ctx.lineWidth = w||1;
            scr._ctx.beginPath()
            scr._ctx.lineTo(int(p1[0]),int(p1[1]));
            scr._ctx.lineTo(int(p2[0]),int(p2[1]));
            scr._ctx.stroke();
        },
        rect:function(scr,color,[x,y,w,h]){
            scr._ctx.fillStyle = rgb2c(color);
            scr._ctx.strokeStyle = 'red';
            scr._ctx.fillRect(x,y,w,h);
        },
        circle:function(scr,color,pos,radius,width){
            scr._ctx.fillStyle = rgb2c(color);
            scr._ctx.strokeStyle = rgb2c(color);
            scr._ctx.lineWidth = width||0;
            scr._ctx.beginPath();
            scr._ctx.arc(pos[0],pos[1],radius,0,Math.PI*2,true);
            if (width)scr._ctx.stroke();
            else scr._ctx.fill();
        }
    },
    event:{
        get:function(){
            var tmp = pygame._events;
            pygame._events = [];
            return tmp;
        }
    },
    register:function(canv){
        var cpos = findPos(canv);
        var addt=function(e){e.preventDefault();pygame._events.push(e);return false;};
        var addm=function(e){
            //e.preventDefault();
            var ne = {'type':e.type,
                      'pos' :mousePos(e,cpos),
                      'button':mouseButton(e)}
            pygame._events.push(ne);
            return false;
        }
        canv.addEventListener('mouseup',addm,false);
        canv.addEventListener('mousedown',addm,false);
        document.addEventListener('mousemove',addm,false);
        document.addEventListener('keydown',addt,false);
        document.addEventListener('keyup',addt,false);
    }
}

function mousePos(e,cpos) {
	var posx = 0;
	var posy = 0;
	if (!e) var e = window.event;
	if (e.pageX || e.pageY) 	{
		posx = e.pageX;
		posy = e.pageY;
	}
	else if (e.clientX || e.clientY) 	{
		posx = e.clientX + document.body.scrollLeft
			+ document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop;
	}
	return [posx-cpos[0],posy-cpos[0]]
}

function mouseButton(e) {
	var rightclick;
	if (!e) var e = window.event;
	if (e.which) rightclick = (e.which == 3);
	else if (e.button) rightclick = (e.button == 2);
	return !rightclick
}

function GameBase(size,fps){
    var that = {};
    that.fps = fps||40;
    that.objects = [];
    that.bgc=[255,255,255];
    that.screen = pygame.display.set_mode(size || [400,400]);
    that.step = function(){
        for (var i=0;i<that.objects.length;i++){
            that.objects[i].step();
        }
    }
    that.draw = function(){
        for (var i=0;i<that.objects.length;i++){
            that.objects[i].draw(that.screen);
        }
    }
    that.event = function(){
        for each(e in pygame.event.get()){
            for (var i=0;i<that.objects.length;i++){
                that.objects[i].event(e);
            }
        }
    }
    that.loop = function(){
        that.running = true;
        var meta = function(){
            if (!that.running){clearInterval(tmr);return;}
            if (that.bgc)
                that.screen.fill(that.bgc)
            that.step();
            that.event();
            that.draw();
            pygame.display.flip();
        }
        var tmr = setInterval(meta,1000/that.fps);
    }
    return that;
}

function Game(size,fps){
    var that = GameBase(size,fps);
    that.get_collisions = function(which){
        var all = [];
        for (var i=0;i<that.objects.length;i++){
            var o = that.objects[i];
            if (which===o)continue;
            if (which.rect.colliderect(o.rect))
                all.push(o);
        }
        return all;
    }
    return that;
}
