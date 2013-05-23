/*
SVGElement.prototype.selected=0;
SVGElement.prototype.moving=0;
SVGElement.prototype.init=function(){
    this.get=this.getAttribute;
    this.addEventListener('mousedown',mousedown,false);
    this.addEventListener('mouseup',mouseup,false);
    this.addEventListener('mousemove',mousemove,false);
    this.mousemove=mousemove
    this.move=move

    // make sel boxes
    if (this.tagName=='circle'){
        b1=movebox(this.cx.baseVal.value-this.r.baseVal.value,this.cy.baseVal.value);
        b1.addEventListener('mousemove',function(e){
            if (this.moving){
                [x,y]=mousePos(e);
                this.parent.r.baseVal=this.parent.cx.baseVal.value-x
            }
        },false);
    }
}
function move(bx,by){
    if (this.tagName=='circle' || this.tagName=='ellipse'){
        this.cx.baseVal.value=this.cx.baseVal.value+bx
        this.cy.baseVal.value=this.cy.baseVal.value+by
    }
    else if (this.tagName=='rect'){
        this.x.baseVal.value=this.x.baseVal.value+bx
        this.y.baseVal.value=this.y.baseVal.value+by
    }
    else if (tagName=='line'){
        this.x1.baseVal.value=this.x1.baseVal.value+bx
        this.y1.baseVal.value=this.y1.baseVal.value+by
        this.x2.baseVal.value=this.x2.baseVal.value+bx
        this.y2.baseVal.value=this.y2.baseVal.value+by
    }
}
function mousedown(e){
    this.selected=1;
    this.moving=[1,mousePos(e)];
}
function mouseup(e){
    this.moving=0;
}
function mousemove(e){
    [x,y]=mousePos(e)
    if (this.moving){
        if (this.moving[0]==1){
            this.move(x-this.moving[1][0],y-this.moving[1][1]);
            this.moving[1]=[x,y]
        }
    }
}
*/
