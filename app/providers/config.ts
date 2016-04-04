const CONFIG_PREFIX = "config-";

export class Config {
    
    static hasItem(key:string) : boolean {
        let item = window.localStorage.getItem(CONFIG_PREFIX + key);
        return item === null ? false : true;
    }

    static getItem(key:string) : string {
        return window.localStorage.getItem(CONFIG_PREFIX + key);
    }

    static setItem(key:string,value:string) : void {
        window.localStorage.setItem(CONFIG_PREFIX + key,value);
    }

    static setJson(key:string,value:any) : void {
        window.localStorage.setItem(CONFIG_PREFIX + key,JSON.stringify(value));
    }

    static getJson(key:string) : any {
        return JSON.parse(window.localStorage.getItem(CONFIG_PREFIX + key));
    }
    
}