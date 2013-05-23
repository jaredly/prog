
function int(x){return parseInt(x);}

function random(x){return Math.random()*x;}

function randc(){return 'rgb('+int(random(256))+','+int(random(256))+','+int(random(256))+')';}

function array(x){
    for (var i=0,that=[];i<x.length;i++)that.push(x[i]);
    return that;
}

function remove(node){node.parentNode.removeChild(node);}

function reverse(x){
    var a=[];
    for (var i=x.length/2;i>0;i--){
        a.push(x[i*2-2]);
        a.push(x[i*2-1]);
    }
    return a;
}

function dst(a,b,c,d){
    if (typeof(c)=='undefined'){
        if (a.length){
            c=b[0];d=b[1];
            b=a[1];a=a[0];
        }else{
            c=0;d=0;
        }
    }
    return Math.sqrt((a-c)*(a-c)+(b-d)*(b-d));
}

function angle_to(p1, p2){
    return Math.atan2(p2[1]-p1[1],p2[0]-p1[0]);
}

function pointoverline(p,p1,p2){
    var pc = pline2point(p1,p2,p);
    return rot_around(p,pc,Math.PI);
}

/*
x1,y1,x2,y2 = line
m = (y2-y1)/(x2-x1)
y = m(x-x1)+y1
y = mx - x1m + y1
mx - y + (y1 - x1m) = 0

ax+by+c = 0

a = m
b = -1
c = (y1-x1m)

x3,y3 = point

d = Math.abs(a*x3+b*y3+c)/Math.sqrt(a*a+b*b)

d = Math.abs(m*x3-y3+y1-x1*m)/Math.sqrt(m*m+1)

*/

/*
method #2

x1,y1,x2,y2 = line
m = (y2-y1)/(x2-x1)
y = m(x-x1)+y1

x3,y3 = point
m2 = -1/m
y = m2(x-x3)+y3

m(x-x1)+y1 = m2(x-x3)+y3
mx-x1m+y1 = m2x-x3m2+y3
mx - m2x = x1m - y1 - x3m2 + y3
x = (x1m - y1 - x3m2 + y3)/(m-m2)
y = m2(x-x3)+y3

pt = */

/*** proof ******************\


    y = m*(x-x1)+y1
    y = m2*(x-a)+b
    
    m*(x-x1)+y1 = m2*(x-a)+b
    
    m*(x-x1) - m2*(x-a) = b-y1
    mx-mx1 - (m2x - m2a) = b-y1
    
    mx - m2x - mx1 + m2a = b-y1
    x (m-m2) = b-y1 + mx1 - m2a
    x = (b-y1 + mx1 - m2a)/(m-m2)

\*****************************/

// find the distance of a line to a point
function line2point(p1,p2,p3){
    x1 = p1[0];y1 = p1[1];
    x2 = p2[0];y2 = p2[1];
    a = p3[0];b = p3[1];
    var m = (y2-y1)/(x2-x1);
    
    if (b == m*(a-x1) + y1) // yes, on the line
        return 0;
    
    var m2 = -1/m;
    
    var x = (b-y1 + m*x1 - m2*a)/(m-m2);
    var y = m*(x-x1) + y1;
    var d = dst(x,y,a,b);
    
    if (rect2point(x1,y1,x2-x1,y2-y1,[x,y]))
        return d;
    
    var d1 = dst(x1,y1,a,b);
    var d2 = dst(x2,y2,a,b);
    if (d1<d2) return d1;
    return d2;
}

// find the distance of a line to a point
function pline2point(p1,p2,p3){
    x1 = p1[0];y1 = p1[1];
    x2 = p2[0];y2 = p2[1];
    a = p3[0];b = p3[1];
    var m = (y2-y1)/(x2-x1);
    
    if (b == m*(a-x1) + y1) // yes, on the line
        return [a,b];
    
    var m2 = -1/m;
    
    var x = (b-y1 + m*x1 - m2*a)/(m-m2);
    var y = m*(x-x1) + y1;
    return [x,y];
}


function line2point_(x1,y1,x2,y2,p,ignore){
    var x3 = p[0], y3 = p[1];
    var m = (y2-y1)/(x2-x1);
    var d = Math.abs(m*x3-y3+y1-x1*m)/Math.sqrt(m*m+1);
    //console.log(d);
    var m2 = -1/m;
    var x4 = (x1*m - y1 - x3*m2 + y3)/(m-m2);
    var y4 = m2*(x4-x3)+y3;
    var colp = line2line([x1,y1],[x2,y2],[x3,y3],[x4,y4]);
    if (colp || ignore)
        return d;
    var d1 = dst(x1,y1,x3,y3);
    var d2 = dst(x2,y2,x3,y3);
    if (d1<d2)return d1;
    return d2;
}

function line2circle(p1,p2,c,r){
    return line2point(p1, p2, c)<=r;
}

function circle2point(p1,r,p2){
    return dst(p1[0], p1[1], p2[0], p2[1])<=r;
}
function circle2circle(p1,r,p2,s){
    return dst(p1[0], p1[1], p2[0], p2[1])<=r + s;
}

/*
y=mx+b
y = m1(x-x1)+y1
y = m2(x-a1)+b1
m1(x-x1)+y1 = m2(x-a1)+b1
m1x - m1x1 + y1 = m2x - m2a1 + b1
m1x - m2x = m1x1-y1-m2a1+b1
x(m1-m2) = m1*x1 - m2*a1 - y1 + b1
x = (m1*x1 - m2*a1 - y1 + b1)/(m1-m2)
*/

function rect2point(x,y,w,h,p1){
    if (w<0){
        x+=w;
        w*=-1;
    }
    if (h<0){
        y+=h;
        h*=-1;
    }
    return (x<=p1[0] && x1<=x+w) && (y<=p1[1] && y1<=y+h);
}

function roundTo(x,num){
    var by = Math.pow(10,num);
    return parseInt(x*by)/by;
}
function round(x){return roundTo(x,5);}

function line2line(p1,p2,p3,p4,ignore){
    x1=round(p1[0]);y1=round(p1[1]);x2=round(p2[0]);y2=round(p2[1]);
    a1=round(p3[0]);b1=round(p3[1]);a2=round(p4[0]);b2=round(p4[1]);
    var y=null;
    if (x1==x2){
        var x=x1;
        if (a1!=a2)
            var m1 = (b2-b1)/(a2-a1);
        else if (b1==b2)
            y=b1;
    }else if (a1==a2){
        var x=a1;
        if (x1!=x2)
            var m1 = (y2-y1)/(x2-x1);
        else if (y1==y2)
            y=y1;
    }else{
        var m1 = (y2-y1)/(x2-x1);
        var m2 = (b2-b1)/(a2-a1);
        if (m1==m2){
            if (rect2point(x1,y1,x2-x1,y2-y1,[a1,b1]))return [a1,b1];
            else if (rect2point(a1,b1,a2-a1,b2-b1,[x1,y1]))return [x1,y1];
            return false;
        }
        var x = (m1*x1 - m2*a1 - y1 + b1)/(m1-m2);
    }
    if (x1==x2 && a1==a2){//console.log('two paralell lines');
        if (x1!=a1)return false;
        if (b2<b1){var t=b1;b1=b2;b2=t;}
        if (y2<y1){var t=y1;y1=b2;y2=t;}
        if ((b2>=y2 && y2>=b1) || (b2>=y1 && y1>=b1))return true;
        return false;
    }
    if (y==null){
        if (x1==x2)
            var y = m1*(x-a1)+b1;
        else
            var y = m1*(x-x1)+y1;
    }
    // y should also be m2*(x-a1)+b1
    // collision point == (x,y)
    if (rect2point(x1,y1,x2-x1,y2-y1,[x,y]) && rect2point(a1,b1,a2-a1,b2-b1,[x,y]) || false){
        return [x,y];
    }
    return false;
}

function line2line(p1,p2,p3,p4){
  var b2 = p4[1];
  var a2 = p4[0];
  var b1 = p3[1];
  var a1 = p3[0];
  var y2 = p2[1];
  var x2 = p2[0];
  var y1 = p1[1];
  var x1 = p1[0];
  
  if(x1==x2){
    if (a1==a2){return x1==a1;}
    isX=x1;
    bM=(b2-b1)/(a2-a1);
    bB=b2-bM*a2;
    isY=bM*isX+bB;
  }
  else if(a1==a2){
    if (x1==x2){return x1==a1;}
    isX=a1;
    aM=(y2-y1)/(x2-x1);
    aB=y2-aM*x2;
    isY=aM*isX+aB;
  }
  else{
    aM=(y2-y1)/(x2-x1);
    bM=(b2-b1)/(a2-a1);
    aB=y2-aM*x2;
    bB=b2-bM*a1;
    isX=Math.max(((bB-aB)/(aM-bM)),0);
    isY=aM*isX+aB;
  }
    if (rect2point(x1,y1,x2-x1,y2-y1,[isX,isY]) && rect2point(a1,b1,a2-a1,b2-b1,[isX,isY]) || false){
        return [isX,isY];
    }
    return false;
}

function poly2line(pts,p1,p2){
    if (line2line(pts.slice(-1)[0],pts[0],p1,p2))return true;
    for (var i=1;i<pts.length;i++){
        if (line2line(pts[i-1],pts[i],p1,p2))return true;
    }
    return false;
}



function poly2poly(pts1,pts2){
    /*************work here ****************/
    if (poly2line(pts2,pts1.slice(-1)[0],pts1[0]))return true;
    for (var i=1;i<pts1.length;i++){
        if (poly2line(pts2,pts1[i-1],pts1[i]))return true;
    }
    return false;
}

function rot_around(p1,p2,r){ // rotate the first around the second; second==center
  var a = p2[0];
  var b = p2[1];
  var x = p1[0];
  var y = p1[1];
    var dx = x-a;
    var dy = y-b;
    var theta = Math.atan2(dy,dx);
    var d = dst(x,y,a,b);
    theta += r;
    return [a+Math.cos(theta)*d,b+Math.sin(theta)*d];
}

function arm(ar,m){for (var i=0,r=[];i<m;i++){r.push(ar);}return r;}

function morph_poly(pts,pos,ang){
    return map(function(x){return rot_around(x,pos,ang);},  map(function(x){return map(sum,x);}, map(zip,zip([pts,arm(pos,pts.length)]))))
}

function _rect2pts(x,y,w,h){
    return [[x-w/2,y-h/2],[x+w/2,y-h/2],[x+w/2,y+h/2],[x-w/2,y+h/2]];
}

function rot_rect(x,y,w,h,r){
    var pts = _rect2pts(x,y,w,h);
    var c = [x+w/2,y+h/2];
    for (var i=0;i<pts.length;i++){
        pts[i] = rot_around(pts[i],c,r);
    }
    return pts;
}
/***
function test_int(){return int('5')==5;}
function test_array(){return array([1,2,3,4])==[1,2,3,4];}
function test_reverse(){return reverse([1,2,3,4])==[4,3,2,1];}
function test_dst(){return dst(0,0,3,4)==5;}
function test_line2point(){return line2point(0,0,4,4,[2,2]) && line2point(0,0,-4,4,[-2,2])==0;}
function test_line2circle(){return line2circle([0,0],[4,4],[2,2],1);}

function test_all(){
    
}
***/
