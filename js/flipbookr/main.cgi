#!/usr/bin/env python

print "Content-type:text/html\n"
import cgi
import sys;sys.stderr=sys.stdout
import base64
import os
sys.path.append('/home1/marketr5/lib/python2.4/site-packages')
## os.mkdir("imgs");
print "hi"
print "ho"
##from PIL import Image,gifmaker
print "hi"
'''sequence = []

for i in range(100):
    im = <generate image i>
    sequence.append(im)

fp = open("out.gif", "wb")
gifmaker.makedelta(fp, sequence)
fp.close()'''



form = cgi.FieldStorage()
if form.has_key("save"):
    
    seq = []
    for n,i in enumerate(form["img"]):
        print n,"img"
        try:typ,src = i.value.split(",",1)
        except:continue
        typ = typ.split(";")[0].split('/')[1]
        source = base64.b64decode(src.replace(" ","+"))
        
        #seq.append(Image.fromstring('RGBA',(300,300),source))
        
        open("tmp.%s"%(typ),"w").write(source)
        im = Image.open("tmp.%s"%(typ))
        im = im.convert("L")
        seq.append(im)
    fp = open("anim.gif","wb")
    gifmaker.makedelta(fp,seq)
    fp.close()
