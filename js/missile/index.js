
function Missile(parent,pos,to){
    var that = Moveable(parent,pos.slice());
    that.type = "Missile";
    that.to = to;
    that.spos = pos.slice();
    that.v.t = that.angle_to(to);
    that.v.m = 5;
    that.step = function(){
        that.update_pos();
        if (that.pos[0]-3<that.to[0] && that.to[0]<that.pos[0]+3 && that.pos[1]-3<that.to[1] && that.to[1]<that.pos[1]+3){
            that.remove();
            parent.add_explosion(that.to);
        }
    }
    that.remove = function(){
        remove(parent.objects,that);
        remove(parent.missiles,that);
    }
    that.draw = function(ctx){
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(that.spos[0],that.spos[1]);
        ctx.lineTo(that.pos[0],that.pos[1]);
        ctx.stroke();
    }
    return that;
}

function Incoming(parent){
    var pos = [int(random(parent.size[0])),0];
    var that = Moveable(parent,pos.slice());
    that.type = "Incoming";
    var to = [random(parent.size[0]),parent.size[1]];
    that.v = Vector( that.angle_to(to), random(.5)+.2 );
    that.spos = pos.slice();
    that.step = function(){
        that.update_pos();
        for each(e in parent.explosions){
            if (that.dist_to(e.pos)<=e.size){
                that.remove()
                parent.add_explosion(that.pos);
            }
        }
        for each(s in parent.stations.stations){
            if (that.dist_to(s.pos)<=15){
                that.remove()
                s.kill()
                parent.add_explosion(that.pos);
            }
        }
        if (that.pos[1]>parent.size[1]){
            that.remove();
        }
    }
    that.remove = function(){
        remove(parent.objects,that);
        remove(parent.incomings,that);
    }
    that.draw = function(ctx){
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(that.spos[0],that.spos[1]);
        ctx.lineTo(that.pos[0],that.pos[1]);
        ctx.stroke();
    }
    return that;
}

function Explosion(parent,pos){
    var that = Moveable(parent,pos);
    that.type = "Explosion";
    that.size = 0;
    that.max_size = 20;
    that.step = function(){
        that.size+=1;
        if (that.size>that.max_size)that.remove();
    }
    that.draw = function(ctx){
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(that.pos[0],that.pos[1],that.size,0,Math.PI*2,true);
        ctx.fill();
    }
    that.remove = function(){
        remove(parent.objects,that);
        remove(parent.explosions,that);
    }
    return that;
}

function polygon(ctx,pts){
    if (!pts || pts.length<2)return;
    ctx.moveTo(pts[0][0],pts[0][1]);
    [ctx.lineTo(x,y) for each([x,y] in pts.slice(1))];
}
function morph_poly(pts,pos,ang){
    function arm(ar,m){for (var i=0,r=[];i<m;i++){r.push(ar);}return r;}
    return map(function(x){return rot_around(x,pos,ang);},  map(function(x){return map(sum,x);}, map(zip,zip([pts,arm(pos,pts.length)]))))
}
function Station(parent,pos,ammo){
    var that = Sprite(parent,pos);
    that.z = 10;
    that.t = -Math.PI/2;
    that.ammo = ammo;
    that.ammotxt = myfont.render(""+ammo,15,"black");
    that.alive = true;
    var pts = [[0,-5],[20,-5],[20,5],[0,5]];
    that.cannon = 1;
    that.step = function(){
    
    }
    that.reload = function(){
        if (!that.alive)return;
        that.ammo = 10;
        that.ammotxt = myfont.render(""+that.ammo,15,"black");
    }
    that.kill = function(){
        that.alive = false;
        that.ammo = 0;
        that.ammotxt = myfont.render("0",15,"black");
    }
    that.fire = function(to){
        that.ammo-=1;
        that.ammotxt = myfont.render(""+that.ammo,15,"black");
        parent.add_missile(rot_around([that.pos[0]+20,that.pos[1]],that.pos,that.t),to);
    }
    that.draw = function(ctx){
        ctx.fillStyle = ["red","white"][0+that.alive];
        ctx.beginPath();
        ctx.arc(that.pos[0],that.pos[1],15,0,Math.PI*2,true);
        ctx.fill();
        if (that.alive){ctx.beginPath();
        polygon(ctx,morph_poly(pts,that.pos,that.t));
        ctx.fill();}
        ctx.drawImage(that.ammotxt,that.pos[0]-that.ammotxt.width/2,that.pos[1]-that.ammotxt.height/2-8);
    }
    that.event = function(e){
        if (e.type=="keydown"){
            //if (e.key==KEYS.space)that.cannon = [1,0][that.cannon];
            //else console.log(e.key)
        }
    }
    return that;
}

function StationMgr(parent,stations){
    var that = Sprite(parent,[0,0]);
    that.stations = stations;
    that.bgtxt = myfont.render("Missile Command",10,"red");
    that.ltxt = myfont.render("Level 1",60,"red");
    that.smltxt = myfont.render("Level 1",10,"red");
    that.follow = 1;
    that.z = 5;
    that.reload = function(){
        [s.reload() for each(s in that.stations)];
    }
    that.get_station = function(pos){
        var flt = pos[0]/150
        var which = int(flt);
        if (that.stations[which].ammo<=0){
            if (Math.round(flt)==which && which>0 && that.stations[which-1].ammo>0)
                which -= 1;
            else if (which<that.stations.length-1 && that.stations[which+1].ammo>0)
                which += 1;
            else if (which>1 && that.stations[which-2].ammo>0)
                which-=2;
            else if (which<that.stations.length-2 && that.stations[which+2].ammo>0)
                which += 2;
            else
                return false;
        }
        return which;
    }
    that.step = function(){
        var alive = false;
        for each(s in that.stations){
            if (s.alive)alive = true;
        }
        if (!alive && !parent.stopped){
            that.ltxt = myfont.render("Game Over",60,"red");
            parent.level = -1;
            parent.stopped = true;
            setTimeout(function(){parent.initialize();},4000);
            return;
        }
        var hasammo = false;
        for each(s in that.stations){
            if (s.ammo!=0)hasammo = true;
        }
        if (!hasammo && parent.missiles.length==0 && parent.get("Explosion").length==0){
            for each(i in parent.get("Incoming")){
                i.v.m = 5;
            }
        }
        if (parent.stopped===false && parent.wave_length==0 && parent.get("Incoming").length==0){
            parent.stopped = true;
            if (parent.level>=levels.length-1){
                that.ltxt = myfont.render("You Won!!",60,"red");
                return
            }
            setTimeout(parent.next_level,2000);
            that.ltxt = myfont.render("Level "+(parent.level+2),60,"red");
        }
    }
    that.event = function(e){if (parent.stopped)return;
        if (e.type=="mousedown"){
            var which = that.get_station(e.pos);
            if (which===false)return
            that.stations[which].fire(e.pos);
            that.stations[which].t = that.stations[which].angle_to(e.pos);
        }else if(e.type=="mousemove"){
            if (that.follow){
                for (var which=0;which<that.stations.length;which++)
                    that.stations[which].t = that.stations[which].angle_to(e.pos);
            }else{
                var which = that.get_station(e.pos);
                if (which===false)return;
                that.stations[which].t = that.stations[which].angle_to(e.pos);
            }
        }else if (e.type=="keydown" && e.key==KEYS.space)
            that.follow = [1,0][that.follow];
    }
    that.draw = function(ctx){
        if (parent.stopped)
            ctx.drawImage(that.ltxt,parent.size[0]/2-that.ltxt.width/2,parent.size[1]/2-that.ltxt.height/2);
        else{
            ctx.drawImage(that.bgtxt,parent.size[0]/2-that.bgtxt.width/2,parent.size[1]/2-that.bgtxt.height/2);
            myfont.draw(ctx,""+parent.wave_length,[0,0],10,"red");
        }
    }
    
    return that;
}

var myfont = canvastext.Font("../buttonr/fonts/bluebold.ttf.svg");
var levels = [[10,1500,0],
              [20,1000,0],
              [30,1500,0],
              [40,1000,0],
              [50,2000,0]];

function MissileCommand(node){
    var that = Game(node,[450,300]);
    that.fps = 40;
    that.bgc = "black";
    that.initialize = function(){
        that.missiles = [];
        that.incomings = [];
        that.explosions = [];
        that.objects = [];
        that.wave_length = 10;
        that.wave_speed = 1500;
        that.make_stations([[75,10],[225,10],[375,10]]);
        that.level = -1;
        that.stopped = true;
        //that._add_incoming();
        setTimeout(that.next_level,2000);
    }
    that.get = function(x){
        return that.objects.filter(function(a){return a.type==x;});
    }
    that.next_level = function(){
        that.level += 1;
        if (that.level>=levels.length)return;
        that.wave_length = levels[that.level][0];
        that.wave_speed = levels[that.level][1];
        that.stopped = false;
        that.stations.reload()
        that._add_incoming();
    }
    that.make_stations = function(sts){
        var stations = [];
        for each([x,ammo] in sts){
            var ns = Station(that,[x,that.size[1]],ammo)
            stations.push(ns);
            that.objects.push(ns);
        }
        that.stations = StationMgr(that,stations);
        that.objects.push(that.stations);
    }
    that.add_explosion = function(pos){
        var ne = Explosion(that,pos);
        that.explosions.push(ne);
        that.objects.push(ne);
    }
    that.add_missile = function(pos,to){
        var mi = Missile(that,pos,to)
        that.missiles.push(mi);
        that.objects.push(mi);
    }
    that.add_incoming = function(){
        var ni = Incoming(that);
        that.objects.push(ni);
        that.incomings.push(ni);
    }
    that._add_incoming = function(){
        if (that.wave_length<=0)return;
        that.add_incoming();
        that.wave_length-=1;
        setTimeout(that._add_incoming,random(that.wave_speed/2)+that.wave_speed/2);
    }
    return that;
}
var MC = MissileCommand($("canv"))
MC.run();