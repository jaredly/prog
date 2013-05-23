#!/usr/bin/env python
import cgi
import sys
from urllib import urlopen as upen
form = cgi.FieldStorage()
if form.has_key('url'):
    print 'Content-type:image/gif\n'
    sys.stdout.write(upen(form['url'].value).read())
else:
    print 'Content-type:text/html\n'
    print 'hi';