export interface Account {
    _id?:string;
    name?:string;
    type:string;
    data:any;
    default?:boolean;
    index?:number;
    lastConfirmedIndex?:number;
}