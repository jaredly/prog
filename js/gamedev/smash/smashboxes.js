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
    this.objects=Array()
    this.remove=remove
    this.step=step

    function remove(what){
        if (this.objects.indexOf(what)!=-1){
            this.objects.splice(this.objects.indexOf(what),1)
        }
    }
    function step(){
        for (i in this.objects){i.step()}
    }

}
