var svgNamespace = 'http://www.w3.org/2000/svg';
function createSVG(thing){return document.createElementNS(svgNamespace, thing);}

function set(a,x,y){return a.setAttribute(x,y);}
function get(a,x){return a.getAttribute(x);}
function set_pos(node,x,y,rel){
    if (rel){
        x += node.x.baseVal.value;
        y += node.y.baseVal.value;
    }
    set(node,"x",x);
    set(node,"y",y);
}
function hide(what){set(what,'visibility','hidden');}
function show(what){set(what,'visibility','visible');}

/************ node z-index movement *************/

function MoveToTop( svgNode )
{
   svgNode.parentNode.appendChild( svgNode );
}
function MoveToBottom( svgNode )
{
   svgNode.parentNode.insertBefore( svgNode, svgNode.parentNode.firstChild );
}
function MoveDown( svgNode ){
    svgNode.parentNode.insertBefore(svgNode,svgNode.previousChild);
}
function MoveUp( svgNode ){
    svgNode.parentNode.insertBefore(svgNode,svgNode.nextChild.nextChild);
}
function zSwap(parent, elem1, elem2)
{
   var tmp = elem1.cloneNode( true );
   parent.replaceChild( tmp, elem2 );
   parent.replaceChild( elem2, elem1 );
}