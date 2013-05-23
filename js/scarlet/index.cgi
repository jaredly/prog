#!/usr/bin/env python

import re,sys,cgi
print "Content-type: text/html\n"

form = cgi.FieldStorage()

text = open("scarlet.txt").read().split("THE TOWN PUMP.")[-1]

print """<style>
span {
    font-weight: bold;
    font-size: 1.1em;
    color: green;
}
h2 {
    text-align:center;
}
div.searchform {
    background-color:#BBFFAA;
    border:2px solid green;
    padding:15px;
    width:30%;
}
form {
    margin: 0px;
}
</style>
<h1>Scarlet Letter Search</h1>
<div class="searchform">
<form method="GET">
Search For: <input name="s"><br>
<input type="submit" value="Search">
</form>
</div>
<br>"""

chapnames = re.findall( "[VIX]+\. +[A-Z \-]+", text )
chapters = re.split( "[VIX]+\. +[A-Z \-]+", text )
scarlet = zip(chapnames,chapters)

if form.has_key("s"):term=form["s"].value
else: sys.exit()

for name, chapter in scarlet:
    finds = re.findall(" .{1,200}"+term+".{1,200} ",chapter,re.S)
    for item in finds:
        at = int(chapter.find(item)/float(len(chapter))*100)
        item = item.replace(term,"<span>"+term+"</span>")
    #    print at,name
        print ("<br><br><br><b>%s[<>]</b> of the way through chapter <b>%s</b><br><br>"% (at, name)).replace("[<>]","%"),item
        

