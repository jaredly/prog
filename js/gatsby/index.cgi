#!/usr/bin/python
print 'Content-type:text/html\n'

import cgi,cgitb,os,sys,re
cgitb.enable()

def load_chapter(chap):
    return open('chapter%s.txt'%chap).read()

def load_chapters():
    d=[]
    for i in range(1,10):
        d.append([i,load_chapter(i)])
    return d

def print_entry(at,chap,pageat,item):
    if at==1:nd="<sup>st</sup>"
    elif at==2:nd="<sup>nd</sup>"
    elif at==3:nd="<sup>rd</sup>"
    else:nd="<sup>th</sup>"
    
    return "<br><br><br><b>%s%s</b> paragraph in chapter <b>%s</b> (around page %s)<br><br>\n"%(at, nd, chap, pageat)+item

form = cgi.FieldStorage()


print """
<html><head><title>Great Gatsby Search</title></head><body>
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
<h1>Search the Great Gatsby</h1>
<div class="searchform">
<form method="GET">
Search For: <input name="s" value="%s"> <input type="checkbox" name="whole" value="1"> Whole word
<input type="submit" value="Search">
</form>
</div>
<br>"""%(form.has_key("s") and form["s"].value or "")

pages = [1, 23, 39, 61, 81, 97, 113, 147, 163, 180 ] ## None ## [3, 16, 26, 39, 52, 62, 93, 103]

retr = ""
num = 0

if form.has_key('s'):
    term = form['s'].value.strip()
    iterm=term
    if form.has_key('whole'):
        term='(?<=\W)'+term+'(?=\W)'
    
    for chapter,text in load_chapters():
        for i,body in enumerate(text.split('\n')):
            all = re.search(term,body,re.I|re.S)
            
            if pages:
                pchap = pages[chapter-1]
                #print text.find(body),len(text)
                
                pat = int(round(float(pages[chapter]-pchap)* (text.find(body)/float(len(text)))+pchap))
            else:
                pat = ""
            rgx = re.compile(term,re.I)
            bdy = rgx.sub(lambda x:'<span>'+x.group()+'</span>', body)+'<br><br>'
            ## bdy = re.sub(term, lambda x:'<span>'+x.group()+'</span>', body)+'<br><br>'
            if all:
                ## print (text.find(body)/float(len(text))),float(pages[chapter]-pchap)
                ## print float(pages[chapter]-pchap)*(text.find(body)/float(len(text)))+pchap
                retr += print_entry(i,chapter,pat,bdy)
                num+=1
    print "<h3>Found %d results for %s</h3>"%(num,iterm)
    print retr