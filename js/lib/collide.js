/************
//import math

'''
line2line proof{

y=mx+b
y-y1 = m(x-x1)
y-y1 = ((y2-y1)/(x2-x1))(x-x1)
m1 = ((y2-y1)/(x2-x1))
y = ((y2-y1)/(x2-x1))(x-x1)+y1

y-b1 = ((b2-b1)/(a2-a1))(x-a1)
m2 = ((b2-b1)/(a2-a1))
y = ((b2-b1)/(a2-a1))(x-a1)+b1
y = m2(x-a1)+b1

## eliminate the "y"
((y2-y1)/(x2-x1))(*x*-x1)+y1 = ((b2-b1)/(a2-a1))(*x*-a1)+b1
((y2-y1)/(x2-x1))(*x*-x1)-((b2-b1)/(a2-a1))(*x*-a1)  =  b1-y1

m1(*x*-x1)+y1 = m2(*x*-a1)+b1
m1(*x*-x1)-m2(*x*-a1)  =  b1-y1
m1x-m1x1-m2x+m2a1 = b1-y1
m1x - m2x = b1-y1+m1x1-m2a1
x(m1-m2) = b1-y1+m1x1-m2a1

#final equation
x = (b1-y1+m1x1-m2a1)/(m1-m2)
# got x, plug into first equ
y = m1(x-x1)+y1

'''
***************/

function rect2point([x,y,w,h],[x1,y1]){
    if (w<0){
        x+=w;
        w*=-1;
    }
    if (h<0){
        y+=h;
        h*=-1;
    }
    return (x<x1 && x1<x+w) && (y<y1 && y1<y+h);
}

function line2point([x1,y1],[x2,y2],[x,y]){
    var m = (y2-y1)/(x2-x1);
    // y - y1 = m(x-x1)
    var online =  y - y1 == m*(x-x1)
    return online && rect2point([x1,y1,x2-x1,y2-y1],[x,y])
}
function line2line([x1,y1],[x2,y2],[a1,b1],[a2,b2]){
    if (x2==x1){
        var x=x1
        var m1 = (b2-b1)/float(a2-a1);
    }
    else if (a2==a1){
        var x=a1;
        m1 = (y2-y1)/float(x2-x1);
    }else{
        m1 = (y2-y1)/float(x2-x1);
        m2 = (b2-b1)/float(a2-a1);
        if (m1==m2){ return false; }
        var x = (m1*x1-m2*a1+b1-y1)/(m1-m2);
    }
    var y = m1*(x-x1)+y1
    // assert y == m2*(x-a1)+b1
    return (rect2point([x1,y1,x2-x1,y2-y1],[x,y]) && rect2point([a1,b1,a2-a1,b2-b1],[x,y])) && [x,y];
}
function rect2line(rect,p1,p2){
    return poly2line(_rect2pts(rect),p1,p2);
}
function rect2rect(rect1,rect2){
    return poly2poly(_rect2pts(rect1),_rect2pts(rect2));
}
function _rect2pts([x,y,w,h]){
    return [[x,y],[x,y+h],[x+w,y+h],[x+w,y]];
}
function poly2line(pts,p1,p2){
    for (var i=0;i<pts.length;i++){
        pt1 = pts[i];
        pt2 = pts[i-1];
        if line2line(pt1,pt2,p1,p2){
            return true;
        }
    }
    return false;
}
function poly2poly(pts1,pts2){
    for (var i=0;i<pts.length;i++){
        pt1 = pts[i];
        pt2 = pts[i-1];
        if poly2line(pts2,pt1,pt2)
            return true
    }
    return false
}
function dist([x1,y1],[x2,y2]){
    return Math.sqrt((x2-x1)**2+(y2-y1)**2);
}
function dist_to_line([a,b],[x1,y1],[x2,y2]){
    if (x2==x1)
        return abs(x1-a);
    var m1 = (y2-y1)/float(x2-x1);
    var m2 = -1/m1;
    var x = (m1*x1-m2*a+b-y1)/(m1-m2);
    var y = m1*(x-x1)+y1;
    return [dist([a,b],[x,y]),[x,y]];
}
function circle2circle([p,r],[c2,r2]){
    return dist(c,c2)<=r+r2;
}
function circle2point([p,r],p2){
    return dist(p,p2)<=r;
}
function circle2line([c,r],p1,p2){
    var [d,pos] = dist_to_line(c,p1,p2);
    if (d>r)
        return false;
    if line2point(p1,p2,pos)
        return true;
    return circle2point([c,r],p1) || circle2point([c,r],p2);
}