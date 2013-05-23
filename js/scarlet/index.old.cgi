#!/usr/bin/env python

import re,sys,cgi
import cgitb;cgitb.enable()
print "Content-type: text/html\n"

form = cgi.FieldStorage()

text = open("scarlet.txt").read().split("THE TOWN PUMP.")[-1].split("*** END OF THIS PROJECT GUTENBERG EBOOK THE SCARLET LETTER ***")[0]

print """
<html><head><title>Scarlet Letter Search</title></head><body>
<style>
span {
    font-weight: bold;
    font-size: 1.1em;
    color: black;
    background-color: #ccc; 
}
h2 {
    text-align:center;
}
div.searchform {
    background-color:#BBFFAA;
    border:2px solid green;
    padding:15px;
    position:absolute;
    right:0px;
    top:0px;
}
form {
    margin: 0px;
}
</style>
<h1>Search the Scarlet Letter</h1>
<div class="searchform">
<form method="GET">
Search For: <input name="s" value="%s"> <input type="checkbox" name="whole" value="1"> Whole word
<input type="submit" value="Search">
</form>
</div>
<br>"""%(form.has_key("s") and form["s"].value or "")



chpages = 35,37,45,53,59,67,76,82,90,99,107,113,122,129,134,140,146,154,159,165,174,182,191,199,203



trans = {"I":1,"V":5,"X":10}

def roman(text):
    alls = [trans[x] for x in text]
    num = 0
    level = -1
    i = -1
    while i<len(alls)-1:
        i+=1
        item = alls[i]
        if level==-1 or item<level:
            level = item
        if i<len(alls)-1 and alls[i+1]>item:
            num += alls[i+1]-item
            i+=1
        else:
            num += item
    return num



chapnames = re.findall( "[VIX]+\. +[A-Z \-]+", text )

chaps = []
for chap in chapnames:
    num,txt = chap.split(". ")
    chaps.append( str(roman(num))+" "+txt.title() )

chapters = re.split( "[VIX]+\. +[A-Z \-]+", text )
scarlet = zip(chaps,chapters[1:])

if form.has_key("s"):term=form["s"].value.strip().lower()
else: sys.exit()

if form.has_key("whole"):
    wterm = "\W"+term+"\W"
else: wterm=term


## old " .{0,500}"+term+".{0,500} "  "\r\n\r\n.+?"+term+".+?\r\n\r\n"
## at = int(chapter.find(item)/float(len(chapter))*100)

for i,(name, chapter) in enumerate(scarlet):
    finds = re.findall("(?<=\r\n\r\n).+?"+wterm+".+?(?=\r\n\r\n)",chapter,re.S|re.I)
    
    for item in finds:
        item = [ax for ax in item.split("\r\n\r\n") if ax.strip()][-1]
        pars = chapter[:chapter.find(item)].split("\r\n\r\n")
        at = len(pars)-1#;print at
        if at==1:
            nd="<sup>st</sup>"
        elif at==2:
            nd="<sup>nd</sup>"
        elif at==3:
            nd="<sup>rd</sup>"
        else:
            nd="<sup>th</sup>"
    #    item = pars[-1];
        
        pageat = int(chapter.find(item)/float(len(chapter)) * (chpages[i+1] - chpages[i]) + chpages[i])
        
        item = item.replace("\r\n\r\n","<br>")
        item = item.replace(term,"<span>"+term+"</span>")
        item = item.replace(term.capitalize(),"<span>"+term.capitalize()+"</span>")
        item = item.replace(term.upper(),"<span>"+term.upper()+"</span>")
        
#        item = re.sub(term,"<span>"+term+"</span>",item,re.I|re.S|re.M)
        print "<br><br><br><b>%s%s</b> paragraph in chapter <b>%s</b> (around page %s)<br><br>"%(at, nd, name, pageat),item

print "</body></html>"