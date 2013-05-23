function findall(what,reg){
    var a=[];
    function add(x){a.push(x)}
    what.replace(reg,add);
    return a;
}
function ePos(e){
    if (e.pageX)return [e.pageX,e.pageY];
    return [e.clientX + document.body.scrollLeft - document.body.clientLeft,
        e.clientY + document.body.scrollTop  - document.body.clientTop]
}
function max(x){
    var e=0;
    for (var i=0;i<x.length;i++){
        if (parseInt(a[i])>e) e=parseInt(a[i]);
    }
    return e;
}
function ints(x){
    var m=[]
    for (var i=0;i<x.length;i++){
        m.push(parseInt(x[i]));
    }
    return m;
}

function ints2(x){
    var m=[]
    for (var i=0;i<x.length;i++){
        m.push(parseInt( parseInt(x[i])*(100/maxy) ) );
    }
    return m;
}

// xmldata is the datas

function loadFont(font,func){
  return sendRequest(font,
      function(x){func(_load(x.responseText.replace(/\n/g," ")))},
      null);
}

function loadSync(font){
  return _load(sendSync(font));
}

function _load(xmldata){
  xmldata = xmldata.replace(/\n/g," ");
  var ascent = parseInt( xmldata.match("<font-face.+?ascent=\"(.+?)\".+?>").slice(-1)[0] );
  
  var glyphs = findall( xmldata, new RegExp("\<glyph [^\>]+","g") );
  var letters = {};

  for (var i=0;i<glyphs.length;i++){
    var uni = glyphs[i].match(/unicode="([^"]+)"/).slice(-1)[0];
    var hor = glyphs[i].match(/horiz-adv-x="([^"]+)"/).slice(-1)[0];
    var name = glyphs[i].match(/glyph-name="([^"]+)"/).slice(-1)[0];
    try{
    var data = glyphs[i].match(/ d="([^"]+)"/).slice(-1)[0];
    var mx = findall(data, /([\d\-]+) ([\d\-]+)/g);
    var maxx = 0;
    var maxy = 0;
    for (var ia=0;ia<mx.length;ia++){
        var [x,y] = mx[ia].split(" ");
        if (parseInt(x)>maxx)maxx=parseInt(x);
        if (parseInt(y)>maxy)maxy=parseInt(y);
    }
    var them = findall(data,/[A-Z][\d\- ]+/g)
    for (var e=0;e<them.length;e++){
        var cur = ints(them[e].slice(1).split(' '));
        cur.type = them[e][0];
        them[e] = cur;
    }
    }catch(e){
    them = [];
    maxx=0;
    maxy=0;
    }
    letters.ascent = ascent;
    letters[uni] = {hor:hor,maxx:maxx,maxy:maxy,name:name,data:them,ascent:ascent};
    
  }
  letters.raw = xmldata;
  return letters;
}

function resize(size,what){
    var a=[];
    for (var i=0;i<what.length;i++){
        a.push(what[i]*size);
    }
    return a;
}

function draw_points(ctx,size,letter,x,y){
    ctx.save();
    ctx.translate(x,y);
    ctx.beginPath();
    for (var er=0;er<letter.data.length;er++){
        var cur = resize(size/letter.ascent, letter.data[er]);
    //    console.log(letter.data[er].type,cur)
        var type = letter.data[er].type;
        if (type=="M"){
            ctx.moveTo(cur[0],size-cur[1]);
        }
        else if (type=="Q"){
            ctx.quadraticCurveTo(cur[0],size-cur[1],cur[2],size-cur[3]);
        }
        else if (type=="L"){
            ctx.lineTo(cur[0],size-cur[1]);
        }
        else if (type=="V"){
            ctx.lineTo(pcur.slice(-2)[0],size-cur[0]);
        }
        else if (type=="H"){
            ctx.lineTo(cur[0],size-pcur.slice(-1)[0]);
        }else {}//console.log(letter.data[er].type);}
        var pcur=cur;
    }
    ctx.fill();
    ctx.fillStyle="red";
    
    var points = [];
    
    for (var er=0;er<letter.data.length;er++){
        var cur = resize(size/letter.ascent, letter.data[er]);
        var type = letter.data[er].type;
        if (type=="M"){
            ctx.fillRect(cur[0]-2,size-cur[1]-2,4,4);points.push([cur[0],size-cur[1]])
        }
        else if (type=="Q"){
            ctx.fillRect(cur[0]-2,size-cur[1]-2,4,4);ctx.fillRect(cur[2]-2,size-cur[3]-2,4,4);
            points.push([cur[0],size-cur[1]]);points.push([cur[2],size-cur[3]])
        }
        else if (type=="L"){
            ctx.fillRect(cur[0]-2,size-cur[1]-2,4,4);
            points.push([cur[0],size-cur[1]]);
        }
        else if (type=="V"){
            ctx.fillRect(pcur.slice(-2)[0]-2,size-cur[0]-2,4,4);
            points.push([pcur.slice(-2)[0],size-cur[0]]);
        }
        else if (type=="H"){
            ctx.fillRect(cur[0]-2,size-pcur.slice(-1)[0]-2,4,4);
            points.push([cur[0],size-pcur.slice(-1)[0]])
        }else {console.log(letter.data[er].type);}
        var pcur=cur;
    }
    ctx.canvas.addEventListener("mousemove",function(e){
        var pos=ePos(e);pos[0]-=x;pos[1]-=y;
        for (var i=0;i<points.length;i++){
            if (points[i][0]-5<pos[0] && pos[0]<points[i][0]+5){
                if (points[i][1]-5<pos[1] && pos[1]<points[i][1]+5){
                    console.log(points[i]);
                }
            }
        }
    },false);
    ctx.restore();
}

function draw_letter(ctx, size, letter, x, y){
    ctx.save();
    ctx.translate(x,y);
    ctx.beginPath();
    for (var er=0;er<letter.data.length;er++){
        var cur = resize(size/letter.ascent, letter.data[er]);
    //    console.log(letter.data[er].type,cur)
        var type = letter.data[er].type;
        if (type=="M"){
            ctx.moveTo(cur[0],size-cur[1]);
        }
        else if (type=="Q"){//console.log(cur,letter.data[er].type)
            ctx.quadraticCurveTo(cur[0],size-cur[1],cur[2],size-cur[3]);
        }
        else if (type=="T"){//console.log(cur,letter.data[er].type)
            ref = pcur.slice(-4,2);
            start = pcur.slice(-2);
        //    console.log(pcur,ref,start)
            by = [start[0]+(start[0]-ref[0]),start[1]+(start[1]-ref[1])];
        //    console.log(by)
        //    console.log(by[0],size-by[1],cur[0],size-cur[1]);
            ctx.quadraticCurveTo(by[0],size-by[1],cur[0],size-cur[1]);
        }
        else if (type=="L"){
            ctx.lineTo(cur[0],size-cur[1]);
        }
        else if (type=="V"){
            ctx.lineTo(pcur.slice(-2)[0],size-cur[0]);
        }
        else if (type=="H"){
            ctx.lineTo(cur[0],size-pcur.slice(-1)[0]);
        }else {console.log(letter.data[er].type);}
        var pcur=cur;
    }
    ctx.fill();
    ctx.restore();
}

function draw_center(ctx, font, sz, text, x, y){
    var size = string_size(font,sz,text);
    draw_string(ctx, font, sz, text, x-size[0]/2, y-size[1]/2);
}

function draw_string(ctx, font, size, text, x, y){
    var h = 0;
    for (var i=0;i<text.length;i++){
        var let = font[text[i]];
        draw_letter(ctx,size,let,x+h,y);
        h+=let.hor*(size/let.ascent);
    }
}

function string_size(font, size, text){
    var v = 0;
    var h = 0;
    for (var i=0;i<text.length;i++){
        var let = font[text[i]];
        h+=let.hor*(size/let.ascent);
    }
    return [h,size]
}
