from urllib import urlopen as upen
import re
base = 'http://etext.library.adelaide.edu.au/f/fitzgerald/f_scott/gatsby/'

from htmlentitydefs import entitydefs,codepoint2name
print entitydefs,codepoint2name[8220]
fail
def conv(x):
    x=x.group();
    x=int(x[2:-1])
    return entitydefs[codepoint2name[x]]

html = upen(base).read()
all = re.findall('\<a href="chapter(\d+)\.html"\>Chapter',html)
print all
reg = '<div[^>]*>(.+?)</div>'
for i in all:
    text = upen(base+'chapter'+i+'.html').read()
    main = re.findall(reg,text,re.S)[1]
    main = re.sub('<.+?>','',main).replace('\n\n','<br><br>')
    main = main.replace('\n',' ').replace('<br><br>','\n')
    main = re.sub('&#\d+;',conv,main)


    open('../prog/gatsby/chapter%s.txt'%i,'w').write(main)
