#! /usr/bin/env python
#
import os,base64,sys
import cgi;
import cgitb;cgitb.enable()

form = cgi.FieldStorage()

print "Content-type:text/html\n"

def clean(data):
    data=data.replace("<comma>",",")
    data=data.replace("<semicolon>",";").replace(' ','+')
    return data
def put(data,num):
    data=clean(data).split(",",1)[1]
    open(num,'w').write(base64.b64decode(data))
print base64,dir(base64)
put(form.getvalue("data"),form.getvalue("name"))