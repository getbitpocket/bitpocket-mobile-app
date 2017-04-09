export interface PaymentRequestHandler {

    cancel() : void;

    on(event:string, handler: (data:any) => void) : PaymentRequestHandler;

    once(event:string, handler: (data:any) => void) : PaymentRequestHandler;

}