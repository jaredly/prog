#! /usr/bin/python

print "Content-type: text/html\n"

import os
import cgi
import cgitb;cgitb.enable()
form=cgi.FieldStorage()

command = "java -jar batik-ttf2svg.jar %s -id svgfont -o outfile.svg"

if form.has_key("file"):

    file=form["file"]
    open( os.path.basename(file.filename) ,"w").write(file.file.read())


    filen = os.path.basename(file.filename)
    res = os.popen3(command%(filen),"r")
    print filen,res[1].read(),res[2].read()
else:
    print """<form id="upload" style="margin:0;" method="POST" enctype="multipart/form-data">
    <input type="file" name="file" id="file">
    <input type="submit" value="Upload">
</form>"""