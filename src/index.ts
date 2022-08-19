import DragSource from './DragSource';
import DragTarget from './DragTarget';
import IframeBackend from './IframeBackend';

const dragsource = new DragSource(IframeBackend);
const dragtarget = new DragTarget(IframeBackend);

Array.from(document.querySelectorAll('.source')).forEach(el => {
    dragsource.register(el as HTMLElement);
});

Array.from(document.querySelectorAll('.target')).forEach(el => {
    dragtarget.register(el as HTMLElement);
});


function ghost(doc:Document,element: HTMLElement,left:number,top:number){
    const ghost = doc.createElement("div");
    ghost.style.position = "absolute";
    ghost.style.top = top + "px";
    ghost.style.left = left + "px";
    ghost.style.width = element.offsetWidth + "px";
    ghost.style.height = element.offsetHeight + "px";
    ghost.style.backgroundColor = "brown";
    return ghost;
}