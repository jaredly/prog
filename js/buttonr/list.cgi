#! /usr/bin/python

import cgi,os
print "Content-type:text/plain\n"
print "["
for i in os.listdir("fonts"):
    print '"'+i+'",',
print "]"