#!/usr/bin/env python
import sys;sys.stderr = sys.stdout
'''
image_stream = new GIFEncoder    (
                            URL or Binary data    'Sources'
                            int                    'Delay times'
                            int                    'Animation loops'
                            int                    'Disposal'
                            int                    'Transparent red, green, blue colors'
                            int                    'Source type'
                        ); '''

class GIFEncoder:
    ver = "GIFEncoder V2.05"
    
    def __init__(self, srcs, dly, loop=0, dis=2, color = None, mode='url'):
        self.gif = "GIF89a"
        self.buf = []
        self.img = -1
        self.loop = loop
        self.dis = dis
        if color is not None:
            self.color = color[0] | (color[1] << 8) | (color[2] << 16)
        else:
            self.color = -1
        for src in srcs:
            if mode=="url":
                self.buf.append(open(src).read())
            else:
                self.buf.append(src)
            data = self.buf[-1]
            
            if data[:6] not in ('GIF87a','GIF89a'):
                raise Exception("Not a gif file")
            j = ( 13 + 3 * ( 2 << ( ord ( data[10] ) & 0x07 ) ) )
            k = True
            while k:
                if data[j] == '!':
                    if data[j+3:j+3+8] == 'NETSCAPE':
                        raise Exception("GIF is already animated")
                elif data[j] == ';':
                    k = False
                j+=1
        self.AddHeader()
        for i in range(len(self.buf)):
            self.AddFrames(i,5)#dly[i]
        self.AddFooter()
    def AddHeader(self):
        first = self.buf[0]
        if ord ( first[10] ) & 0x80:
            cmap = 3 * ( 2 << ( ord ( first[10] ) & 0x07 ) )+13
            self.gif += first[6:cmap]
            self.gif += "!\377\13NETSCAPE2.0\3\1" + self.Word ( self.loop ) + "\0"
    def AddFrames(self,i,d):
        #print 'start',len(self.gif)
        cur = self.buf[i]
        fir = self.buf[0]
        lord = 2 << ( ord ( cur[10] ) & 0x07 )
        gord = 2 << ( ord ( fir[10] ) & 0x07 )
        lstr = 13 + 3 * ( lord );
        lend = len(cur) - lstr - 1
        ltmp = cur[lstr:lstr+lend]
        glen = gord
        llen = lord
        grgb = fir[13:13+3*gord]
        lrgb = cur[13:13+3*lord]
        lext = "!\xF9\x04" + chr(( self.dis << 2 ) + 0 ) + chr ( ( d >> 0 ) & 0xFF ) + chr ( ( d >> 8 ) & 0xFF ) + "\0\0"
        if self.color > -1 and (ord(cur[10]) & 0x80):
            for j in range(lord):
                if (ord(lrgb[3*j+0]) == ((self.color >> 16) & 0xFF) and
                    ord(lrgb[3*j+1]) == ((self.color >> 8) & 0xFF) and
                    ord(lrgb[3*j+2]) == ((self.color >> 0) & 0xFF)):
                    lext = "!\xF9\x04" + chr ( ( self.dis << 2 ) + 1 ) + chr ( ( d >> 0 ) & 0xFF ) + chr ( ( d >> 8 ) & 0xFF ) + chr ( j ) + "\0"
                    break
        if ltmp[0]=="!":
            limg = ltmp[8:8+10]
            ltmp = ltmp[18:]
        elif ltmp[0]==",":
            limg = ltmp[:10]
            ltmp = ltmp[10:]
        if ( ord ( cur[10] ) & 0x80 and self.img > -1 ):
            if glen == llen:
                if self.BlockCompare(grgb,lrgb,glen):
                    self.gif += lext + limg + ltmp
                else:
                    byte  = ord(limg[9])
                    byte |= 0x80
                    byte &= 0xFB
                    byte |= ord ( cur[10] ) & 0x07
                    limg = limg[:9] + chr(byte) + limg[10:]
                    self.gif += lext + limg + lrgb + ltmp
            else:
                byte  = ord(limg[9])
                byte |= 0x80
                byte &= 0xFB
                byte |= ord ( fir[10] ) & 0x07
                limg = limg[:9] + chr(byte) + limg[10:]
                self.gif += lext + limg + lrgb + ltmp
        else:
            self.gif += lext + limg + ltmp
        self.img = 1
    def AddFooter(self):
        self.gif += ';'
    def BlockCompare(self,gbloc,lbloc,ln):
        return gbloc==lbloc
        '''for i in range(ln):
            if (gbloc[3*i+0]!=lbloc[3*i+0] or 
                gbloc[3*i+1]!=lbloc[3*i+1] or 
                gbloc[3*i+2]!=lbloc[3*i+2]):
                return False
        return True'''
    def Word(self,i):
        return ( chr ( i & 0xFF ) + chr ( ( i >> 8 ) & 0xFF ) )
    def GetAnimation(self):
        return self.gif

import os
import sys
print "Content-type:image/gif\n"

imz = []
dlz = []
i = 0
while os.path.isfile("%d.gif"%i):
    imz.append("%d.gif"%i)
    dlz.append(10)
    i+=1
g = GIFEncoder(imz,dlz,0,2,(255,255,255),"url")
open("pyres.gif","wb").write(g.gif)
print g.gif



