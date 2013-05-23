import pygame,sys
from pygame.locals import *

events = {
    KEYDOWN:"keydown",
    KEYUP:"keyup",
    MOUSEBUTTONDOWN:"mousedown",
    MOUSEBUTTONUP:"mouseup",
    MOUSEMOTION:"mousemove"
    }

def load_image(filen):
    return pygame.image.load(filen).convert()

keys = {}
for i in dir():
    if i.startswith('K_'):
        keys[globals()[i]] = i[2:].lower()

print keys
def _class(dct):
    class Temp:
        def __init__(self,args):
            self.image = load_image(dct["image"])
            self.solid = dct["solid"]
            self.visible = dct["visible"]
            self.events = dct["events"]
            self.x,self.y = args['pos']
            self.dx = 0
            self.dy = 0
            self.name = args.has_key('name') and args['name'] or None

        def event(self,e):
            
            if e.type==KEYDOWN:
                if keys.has_key(e.key) and "keydown-"+keys[e.key] in self.events:
                    self.execute( self.events["keydown-"+keys[e.key]], e=e)
            elif e.type==KEYUP:
                if keys.has_key(e.key) and "keyup-"+keys[e.key] in self.events:
                    self.execute( self.events["keyup-"+keys[e.key]], e=e)
            elif e.type in events and events[e.type] in self.events:
                self.execute( self.events[events[e.type]], e=e )

        def execute(self,actions,**arg):
            arg["self"]=self
            arg["mousepos"]=pygame.mouse.get_pos()
            rect = self.image.get_rect()
            self.size=[rect.width,rect.height]
            for i in actions:
                a = Action(i)
                code = compile(a.code,"action","exec")
                eval( code, arg )

        def step(self):
            self.x+=self.dx
            self.y+=self.dy
            if self.events.has_key("step"):
                self.execute( self.events['step'] )

        def draw(self,scr):
            if self.events.has_key("draw"):
                self.execute( self.events['step'],srceen=scr )
            else:
                scr.blit(self.image, [self.x,self.y])
    return Temp

class Action:
    def __init__(self,lst):
        getattr(self,lst[0])(*lst[1:])

    def moveTo(self,x,y,rel=0):
        self.x=x
        self.y=y
        if rel:
            self.code = "self.x+=%s;self.y+=%s"%(x,y)
        else:
            self.code = "self.x=%s;self.y=%s"%(x,y)
        ##self.code = 'print "hi"\n'

    def set(self,name,what,rel=0):
        if rel:
            self.code = "self.%s+=%s"%(name,what)
        else:
            self.code = "self.%s=%s"%(name,what)

    def code(self,code):
        self.code=code

    def setX(self,x,rel=0):
        self.set('x',x,rel)

    def setY(self,y,rel=0):
        self.set('y',y,rel)

    def setDx(self,dx,rel=0):
        self.set('dx',dx,rel)

    def setDy(self,dy,rel=0):
        self.set('dy',dy,rel)
        

class Main:
    def __init__(self,dct):
        self.screen = pygame.display.set_mode((dct['width'],dct['height']))
        self.dct = dct
        self.classes = {}
        for a,b in dct["objects"].items():
            self.classes[a] = _class(b)
        self.objects = [self.create_object(obj) for obj in dct["instances"]]
        self.clock = pygame.time.Clock()
        self.loop()

    def create_object(self,dct):
        if dct["type"] not in self.classes:
            raise ClassNotDefinedError,"Class %s is not defined"%dct["type"]
        return self.classes[dct["type"]](dct)

    def send(self,name,*a,**b):
        [getattr(o,name)(*a,**b) for o in self.objects]

    def event(self):
        for e in pygame.event.get():
            if e.type==QUIT:
                sys.exit()
            else:
                self.send('event',e)

    def step(self):
        self.send('step')

    def draw(self):
        self.send('draw',self.screen)

    def loop(self):
        while 1:
            self.screen.fill(self.dct['bgcolor'])
            self.event()
            self.step()
            self.draw()
            pygame.display.flip()
            self.clock.tick(self.dct["fps"])



if __name__=="__main__":
    if len(sys.argv)==2:
        data = eval( open(sys.argv[1]).read() )
        Main(data)
    else:
        print """To use the Pygme engine, run with a filename:
python Pygme.py example.pyg"""
