#!/usr/bin/env python
import sys;sys.stderr = sys.stdout


class AnimatedGif:
    def __init__(self,loops=0, disposal=2, trans=-1, delay=10):
        self.loops = loops
        self.disposal = disposal
        self.img = -1
        if type(trans) in (tuple,list):
            trans = trans[0] | (trans[1] << 8) | (trans[2] << 16)
        self.color = trans
        self.delay = delay ## remove?
        self.first = None
        self.data = "GIF89a"
    
    def setTrans(self,r,g,b):
        self.color = r | (g << 8) | (b << 16)
    
    def addFrame(self,source,delay=None):
        if type(source)==str:
            source = open(source,"rb")
        data = source.read()
        
        if delay is None:d=self.delay
        else:d=delay
        
        if self.first is None:
            self.first = data
            self._set_header()
        
        lord = 2 << ( ord ( data[10] ) & 0x07 )
        gord = 2 << ( ord ( self.first[10] ) & 0x07 )
        lstr = 13 + 3 * ( lord );
        lend = len(data) - lstr - 1
        ltmp = data[lstr:lstr+lend]
        glen = gord
        llen = lord
        grgb = self.first[13:13+3*gord]
        lrgb = data[13:13+3*lord]
        lext = "!\xF9\x04" + chr(( self.disposal << 2 ) + 0 ) + chr ( ( d >> 0 ) & 0xFF ) + chr ( ( d >> 8 ) & 0xFF ) + "\0\0"
        if self.color > -1 and (ord(data[10]) & 0x80):
            for j in range(lord):
                if (ord(lrgb[3*j+0]) == ((self.color >> 16) & 0xFF) and
                    ord(lrgb[3*j+1]) == ((self.color >> 8) & 0xFF) and
                    ord(lrgb[3*j+2]) == ((self.color >> 0) & 0xFF)):
                    lext = "!\xF9\x04" + chr ( ( self.disposal << 2 ) + 1 ) + chr ( ( d >> 0 ) & 0xFF ) + chr ( ( d >> 8 ) & 0xFF ) + chr ( j ) + "\0"
                    break
        if ltmp[0]=="!":
            limg = ltmp[8:8+10]
            ltmp = ltmp[18:]
        elif ltmp[0]==",":
            limg = ltmp[:10]
            ltmp = ltmp[10:]
        if ( ord ( data[10] ) & 0x80 and self.img > -1 ):
            if glen == llen:
                if grgb == lrgb:
                    self.data += lext + limg + ltmp
                else:
                    byte  = ord(limg[9])
                    byte |= 0x80
                    byte &= 0xFB
                    byte |= ord ( data[10] ) & 0x07
                    limg = limg[:9] + chr(byte) + limg[10:]
                    self.data += lext + limg + lrgb + ltmp
            else:
                byte  = ord(limg[9])
                byte |= 0x80
                byte &= 0xFB
                byte |= ord ( self.first[10] ) & 0x07
                limg = limg[:9] + chr(byte) + limg[10:]
                self.data += lext + limg + lrgb + ltmp
        else:
            self.data += lext + limg + ltmp
        self.img = 1
    
    def save(self,filen):
        if type(filen)==str:filen = open(filen,"wb")
        filen.write(self.data+";")
    
    def getData(self):
        return self.data + ";"
    
    def _validate(self,data):
        if not data[:6] in ('GIF87a','GIF89a'):
            raise Exception("Not a gif file")
        if "NETSCAPE" in data:
            raise Exception("No Animated GIFs")
    
    def _set_header(self):
        if ord ( self.first[10] ) & 0x80:
            cmap = 3 * ( 2 << ( ord ( self.first[10] ) & 0x07 ) ) + 13
            self.data += self.first[6:cmap]
            self.data += "!\377\13NETSCAPE2.0\3\1" + self._gifword(self.loops) + "\0"

    def _gifword(self,i):
        return ( chr ( i & 0xFF ) + chr ( ( i >> 8 ) & 0xFF ) )
if __name__=="__main__":
    import os
    import sys
    print "Content-type:image/gif\n"
    
    gif = AnimatedGif(trans=(0,0,0),loops=3)
    
    i = 0
    while os.path.isfile("%d.gif"%i):
        gif.addFrame("%d.gif"%i,10)
        i+=1
    
    print gif.getData()


