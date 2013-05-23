#! /usr/local/bin/python
#
from html2 import *
import os,base64,sys

class Store:
    def __init__(self,base):
        self.base=base

    def check(self,name):
        dr=os.path.join(self.base,name)
        if os.path.isdir(dr):
            if len(os.listdir(dr))==0:
                return 0
            return 1
        return 0
    def clean(self,data):
        data=data.replace("<comma>",",")
        data=data.replace("<semicolon>",";").replace(' ','+')
        return data
    def put(self,name,data,num):
        try:
         if type(num)!=type("d"):
            num=num[-1]
         dr=os.path.join(self.base,name)
         data=self.clean(data).split(",",1)[1]
         if not os.path.isdir(dr):
            os.mkdir(dr)
         open(os.path.join(dr,"img%d.png"%int(num)),'w').write(base64.b64decode(data))
        except Exception,e:
            print "Error:",e
            print name,num,dr
    def delete(self,name):
        dr=os.path.join(self.base,name)
        if os.path.isdir(dr):
            remove(dr)
    def convert(self,name):
        dr=os.path.join(self.base,name)
        gif=os.path.join(dr,"gif")
        if os.path.isdir(gif):
            print "removing gif"
            remove(gif)
        os.mkdir(gif)
        
        for fil in os.listdir(dr):
            if fil.split(".")[-1]=="dat":
                data=self.clean(open(os.path.join(dr,fil)).read()).split(",",1)[1]
                data=base64.b64decode(data)
                open(os.path.join(gif,fil.split('.')[0]+'.gif'),'w').write(data)
    def show(self,name,num):
        dr=os.path.join(self.base,name)
        data=self.clean(open(os.path.join(dr,"img%0.2d.dat"%int(num))).read()).split(",",1)[1]
        data=base64.b64decode(data)
        sys.stdout.write(data)


def remove(dr):
    try:
        for e in os.listdir(dr):
            fil=os.path.join(dr,e)
            if os.path.isdir(fil):
                remove(fil)
            else:
                os.remove(fil)
        os.rmdir(dr)
    except Exception,e:
        raise

store=Store("data")

def exit():
    start("no command")
    sys.exit()

def process(form):
    command=form.has_key('command') and form.getvalue("command") or exit()
    if not form.has_key("name"):
        return 1
    name=form.getvalue("name")
    if type(name)!=type("d"):
        name=name[0]
    if command=="check":
        start("Online Editor",clear=1)
        print store.check(name)
    elif command=="clear":
        start("Online Editor",clear=1)
        store.delete(name)
    elif command=="save":
        start("Online Editor",clear=1)
        if not (form.has_key("data") and form.has_key("num")):
            return 1
        store.put(name,form.getvalue("data"),form.getvalue("num"))
    elif command=="convert":
        start("Online Editor",clear=1)
        store.convert(name)
    elif command=="show":
        print "Content-type: image/png\n"
        if not  form.has_key("num"):
            return 1
        store.show(name,form["num"].value)
    else:
        return 1

if __name__=="__main__":
    try:
        res=process(form)
        if res==1:
            start("Store.py",clear=1)
            print "ERROR"
    except Exception,e:
        start("Store.py",clear=1)
        print "Error",e