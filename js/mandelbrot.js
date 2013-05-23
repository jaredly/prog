canv=document.getElementById("canv")
ctx=canv.getContext('2d')
function Mandelbrot()
{
    var Width = 400;
    var Height = 400;
    var Iters = 20;
    var Zoom = "4";

    for(y=0; y<=Height; ++y)
    {   var Im = -1.5+3*y/Height;
        for(x=0; x<=Width; ++x)
        { var Re = -2+3*x/Width;
            var Zr = Re;
            var Zi = Im;
            var n = 0;
            for(; n<=Iters; n++)
            {   var Zr2 = Zr*Zr;
                var Zi2 = Zi*Zi;
                if(Zr2+Zi2 > 4) break;
                Zi = 2*Zr*Zi+Im; Zr = Zr2-Zi2+Re;
            }
            if(n>Iters) n=0;
            var c1 = (n<Iters/2 ? Math.round(255*2*n/Iters) : 255);
            var c2 = (n>=Iters/2 ? Math.round(255*2*(n-Iters/2)/Iters) : 0);
            var num1 = (c1<10 ? "0" : "")+Number(c1).toString(16);
            var num2 = (c2<10 ? "0" : "")+Number(c2).toString(16);
            ctx.fillStyle="#"+num1+num2+"00"
            ctx.fillRect(x,y,1,1);
         /*   document.write("<td bgcolor=\""+num1+num2);
            document.writeln("00\"><img src=\"p.gif\" border=0 width="+Zoom+" height="+Zoom+"></td>");*/
        }
    }
}
Mandelbrot()