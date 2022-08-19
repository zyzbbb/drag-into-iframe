import type {IframeBackend} from "./IframeBackend";

export default class DragTarget{
    backend: IframeBackend;
    
    constructor(backend:IframeBackend){
        this.backend = backend;
    }

    register(element: HTMLElement){
        const id = this.backend.registerTarget(element);
        if(id !== -1){
            const iframe = element.firstElementChild as HTMLIFrameElement;
            if(iframe.tagName !== "IFRAME"){
                throw new Error(`${element.tagName} is not a iframe`);
            }
            this.backend.connect(iframe);
        }
    }
}