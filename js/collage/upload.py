#! /usr/bin/env python
#
print "Content-type: text/html\n"
import cgi
import cgitb;cgitb.enable();
import os, sys
form=cgi.FieldStorage()

def upload(form,file):
    if form.has_key(file):
        file=form[file]
    else:return
    if not file.file:
       return
    id=form.getvalue("id");
    try:os.mkdir("imgs/"+id)
    except:pass;
    open( "imgs/"+id+"/"+str(len(os.listdir("imgs")))+".jpg" ,"w").write(file.file.read())
    return True

if form.has_key("file"):
    if not upload(form,"file"):
        raise
else:
    print """<form method="POST" enctype="multipart/form-data">
    <input name="file" type="file">
    <input type="submit" value="Upload">
    </form>"""
