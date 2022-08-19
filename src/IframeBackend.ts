
export interface IframeBackendEvent{
   type:string; 
   targetId:number; 
   clientX: number;
   clientY: number;
}

let sources:Element[] = [];

let targets:Element[] = [];

let frames:HTMLIFrameElement[] = [];

export interface IframeBackend{
    registerSource(element:Element):number;
    registerTarget(element:Element):number;
    getSource(id:number):Element;
    getTarget(id:number):Element;
    postMessage(event:IframeBackendEvent):void;
    dispatch(event:IframeBackendEvent):void;
    connect(iframe:HTMLIFrameElement):void;
}

function message(iframe:HTMLIFrameElement,backend:IframeBackend){
    const rect = iframe.getBoundingClientRect();
    const iframeDocument = iframe.contentDocument;
    return function(e: MessageEvent){
        const {type,targetId,clientX,clientY} = e.data;
        const overEle = iframeDocument.elementFromPoint(clientX - rect.left,clientY - rect.top) as HTMLElement;
        if(!overEle)return;
        switch(type){
            case "drag":
                break;
            case "drop":
                break;            
        }
    }
}

const backend:IframeBackend = {
    registerSource(element:Element){
        if(sources.some(item=>item===element)){
            return -1;
        }
        sources.push(element);
        return sources.length - 1;
    },
    registerTarget(element:Element){
        if(targets.some(item=>item===element)){
            return -1;
        }
        targets.push(element);
        return targets.length - 1;
    },
    getSource(id:number){
        return sources[id];
    },
    getTarget(id:number){
        return targets[id];
    },
    postMessage(event:IframeBackendEvent){
        frames.forEach(iframe=>{
           const iframeWindow = iframe.contentWindow;
           iframeWindow.postMessage(event,"*");
        });
    },
    dispatch(event:IframeBackendEvent){
        
    },
    connect(iframe:HTMLIFrameElement){
        const iframeWindow = iframe.contentWindow;
        iframeWindow.addEventListener("message",message(iframe,backend));
        frames.push(iframe);
    }
}

export default backend;