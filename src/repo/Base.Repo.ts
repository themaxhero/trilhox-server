import { Connection } from "typeorm";

export class BaseRepo {
    protected dbconn: Connection;
    constructor(dbconn: Connection){
        this.dbconn = dbconn;
    }
}
