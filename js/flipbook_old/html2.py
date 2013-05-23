#! /usr/local/bin/python
#
import cgitb; cgitb.enable()
import Cookie,os,cgi
form=cgi.FieldStorage()
try:
    cookie = os.environ["HTTP_COOKIE"]
except KeyError:
    cookies = Cookie.SmartCookie()
else:
    cookies = Cookie.SmartCookie()
    try:
      cookies.load(os.environ["HTTP_COOKIE"])
    except:cookies["Load"]="failed"
def set_cookie(key,value):
    global cookies
    cookies[key]=value
    cookies[key]["path"]="/"

def start(title="Python Page",clear=0,style="", typ="text/html", filename="Report.html", scripts=[]):
    print "Content-Type: %s"%typ
    if cookies:print cookies.output()
    print "Content-Disposition: inline; filename=%s\n"%filename
    if not clear:
        print "<html><head><title>%s</title>"%title
        if style!="":print '<link rel="stylesheet" type="text/css" href="%s">'%style
        for script in scripts:
            print '<script type="text/javascript" src="%s"></script>'%script
        print "</head>"

if __name__=='__main__':
    start("HTML2",clear=1)