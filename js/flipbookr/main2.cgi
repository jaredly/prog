#!/usr/bin/env python

print "Content-type:text/html\n"
import cgi
import sys;sys.stderr=sys.stdout
import base64
import os
sys.path.append('/home1/marketr5/lib/python2.4/site-packages')
## os.mkdir("imgs");
from PIL import Image,gifmaker,ImageDraw

from giffmer import AnimatedGif
from StringIO import StringIO
'''sequence = []

for i in range(100):
    im = <generate image i>
    sequence.append(im)

fp = open("out.gif", "wb")
gifmaker.makedelta(fp, sequence)
fp.close()'''

form = cgi.FieldStorage()
print "zzz",form.keys()

from PIL.GifImagePlugin import getheader, getdata


def saveme(filen,imgs):
    fp = open(filen,"wb")
    f = imgs[0]
    map(fp.write,getheader(f) + getdata(f))
    [map(fp.write,getdata(im)) for im in imgs]
    fp.close()


if form.has_key("save"):
    
    seq = []
    gif = AnimatedGif(trans=(255,255,255))
    for n,i in enumerate(form["img"]):
        print n,"img"
        try:typ,src = i.value.split(",",1)
        except:continue
        typ = typ.split(";")[0].split('/')[1]
        source = base64.b64decode(src.replace(" ","+"))
        
        open("tmp.%s"%(typ),"w").write(source)
        im = Image.open("tmp.%s"%(typ))
        
        back = Image.new("RGBA",(300,300))
        dr = ImageDraw.Draw(back)
        dr.rectangle([0,0,300,300],fill=(255,255,255))
        back.paste(im,None,im)
        back = back.convert("L")
        back.save("%d.gif"%n,"GIF")
        gif.addFrame("%d.gif"%n,10)
        #im = im.convert("l")
        #seq.append(back)
    gif.save("animate.gif")
    
    
    ##saveme("animate.gif",seq)
else:print "nodice"
print 'gn'