var smashboxes=null;
var game=null;
document.onload=load;
var running=1;

function load(){
    smashboxes=$("smashboxes");
    game=new Game();
    document.onkeypress=function(evt){
        key=evt.charCode || evt.keyCode
        if (key==32){
        }
        if (key==37){//left
            game.passon('kleft')
        }
        else if (key==38){//up
            game.passon('kup')
        }
        else if (key==39){//right
            game.passon('kright')
        }
    }

    document.onkeyrelease=function(evt){
        key=evt.charCode || evt.keyCode;
        if (key==37){//left
            game.passon('kleftu');
        }
        else if (key==38){//up
        }
        else if (key==39){//right
            game.passon('krightu');
        }

    }
    document.onkeyup=document.onkeyrelease
    run()
}

function $(e){return document.getElementById(e);}

function mousecoords(e) {
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
    return Array(posx,posy)
}


function Game(){
    this.running=1;
    this.step=step;
    this.remove=remove;
    this.passon=passon;
    this.objects=Array(new Player("Me","red"), new Player("CP","blue",1));

    function step(){
        for (var i=0;i<this.objects.length;i++){
            this.objects[i].step()
        }
    }
    function remove(what){
        if (this.objects.indexOf(what)!=-1){
            this.objects.splice(this.objects.indexOf(what),1)
        }
    }
    function passon(fname){
        for (var i=0;i<this.objects.length;i++){
            if (!this.objects[i].ai){
                this.objects[i][fname]()
            }
        }
    }
}

function Player(name,color,ai){
    this.ai=ai || 0;
    this.color=color;
    this.name=name;
    this.object=document.createElement("div");
    smashboxes.appendChild(this.object);
    this.object.className="player";
    this.object.style.backgroundColor=color;
    this.top=0;
    this.left=0;
    this.dx=0;
    this.dy=0;
    this.hp=0;
    this.gravity=0.5;
    this.props=makeProps(this.object,name);
    this.log=log;
    this.step=step;
    this.update=update;
    this.facing=0;
    this.kleft=kleft;
    this.kright=kright;
    this.kup=kup;
    this.kleftu=kleftu;
    this.krightu=krightu;
    this.log();

    function log(){
        this.props.hp.innerHTML=this.hp;
    }
    function update(){
        fp=findPos(smashboxes)
        this.object.style.left=this.left+fp[0];
        this.object.style.top=this.top+fp[1];
    }
    function step(){
        this.left+=this.dx;
        this.dy+=this.gravity;
        this.top+=this.dy;
        if (this.top>=smashboxes.offsetHeight-this.object.offsetHeight){
            this.gravity=0;
            this.top=smashboxes.offsetHeight-this.object.offsetHeight;
            this.dy=0;
        }
        else{this.gravity=0.5;}
        if (this.left<0){this.left=0;}
        if (this.left>smashboxes.offsetWidth-this.object.offsetWidth){
            this.left=smashboxes.offsetWidth-this.object.offsetWidth;
        }
        this.update();
    }
    function hit(num,who){
        this.hp+=num;
        if (this.hp>200){
            game.remove(this)
            who.frag()
        }
    }
    function kleft(){
        this.dx=-5;
        this.facing=0;
    }
    function kright(){
        this.dx=5;
        this.facing=1;
    }
    function kup(){
        if (!this.gravity){
            this.dy=-7;
        }
    }
    function kdown(){
        
    }
    function kspace(){}
    function kleftu(){
        this.dx=0;
    }
    function krightu(){
        this.dx=0;
    }
}

function makeProps(who,name){
    var dcs=document.createElement("div")
    dcs.className="properties"
    $("properties").appendChild(dcs)
    var d2=dcs.appendChild(document.createElement("span"))
    d2.appendChild(document.createTextNode(name))
    d2.style.fontWeight="bold"
    dcs.hp=dcs.appendChild(document.createElement("div"))
    dcs.hp.className="hp"
    return dcs;
}

function run(){
    game.step();
    if (running){setTimeout(run,10)}
}

function findPos(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		curleft = obj.offsetLeft
		curtop = obj.offsetTop
		while (obj = obj.offsetParent) {
			curleft += obj.offsetLeft
			curtop += obj.offsetTop
		}
	}
	return Array(curleft,curtop);
}