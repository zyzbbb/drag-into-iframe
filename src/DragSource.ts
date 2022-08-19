import type {IframeBackend} from "./IframeBackend";

export default class DragSource{
    backend: IframeBackend;
    
    constructor(backend:IframeBackend){
        this.backend = backend;
    }
    register(element: HTMLElement){
        const id = this.backend.registerSource(element);
        if(id !== -1){
            element.addEventListener("mousedown", drag(id,element,this.backend));
        }
    }
}

const horizontal = document.createElement("div");
const vertical = document.createElement("div");
horizontal.style.position = "absolute";
horizontal.style.left = "0px";
horizontal.style.width = "100%";
horizontal.style.height = "1px";
horizontal.style.borderTop = "1px dashed #dddddd";
vertical.style.position = "absolute";
vertical.style.top = "0px";
vertical.style.width = "1px";
vertical.style.height = "100%";
vertical.style.borderLeft = "1px dashed #dddddd";
document.body.append(horizontal);
document.body.append(vertical);


function drag(id:number,element:HTMLElement,backend:IframeBackend){

    return function(event: DragEvent){

        event.preventDefault();
        const style = document.defaultView.getComputedStyle(element);
        console.log(style.marginLeft);
        const rect = element.getBoundingClientRect();
        const shiftX = event.clientX - rect.left;
        const shiftY = event.clientY - rect.top;

        const cloneEle = element.cloneNode(false) as HTMLElement;
        const text = document.createElement("span");
        horizontal.style.top = rect.top + "px";
        vertical.style.left = rect.left + "px";
        cloneEle.style.position = "absolute";
        cloneEle.style.left = rect.left + "px";
        cloneEle.style.top = rect.top + "px";
        cloneEle.style.margin = "0px";
        text.style.position = "absolute";
        text.style.left = rect.left + "px";
        text.style.top = rect.top + "px";
        text.style.color = "#FFFFFF";
        document.body.append(cloneEle);
        document.body.append(text);

        backend.postMessage({
            type:"dragstart",
            targetId: id,
            clientX:shiftX,
            clientY:shiftY
        });

        function drag(e:MouseEvent){
           const x = e.clientX - shiftX;
           const y = e.clientY - shiftY; 
           backend.postMessage({
             type:"drag",
             targetId: id,
             clientX:x,
             clientY:y
           });
           cloneEle.style.left = x + "px";
           cloneEle.style.top = y + "px";

           horizontal.style.top = y + "px";
           vertical.style.left = x + "px";

           text.style.left = x + "px";
           text.style.top = y + "px";
           text.innerHTML = `(${x},${y})`;

        }

        function drop(e:MouseEvent){
           backend.postMessage({
                type:"drop",
                targetId: id,
                clientX:e.clientX - shiftX,
                clientY:e.clientY - shiftY
           });
           document.removeEventListener("mousemove",drag);
           cloneEle.removeEventListener("mouseup",drop);
           document.body.removeChild(cloneEle);
        }

        document.addEventListener("mousemove",drag);
        cloneEle.addEventListener("mouseup",drop);
    }
}