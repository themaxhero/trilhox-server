import { Request, Response } from "express";

type payloadContent =
    string | number | boolean;

interface IRequestResponseKeeper {req?: Request; res?: Response; }

export const usernameValidator =
    (value: payloadContent, { req }: IRequestResponseKeeper) => {
        if (typeof(value) === "string"){
            return (!value.includes(";") || !value.includes("*"));
        }
        return true;
    };

export function uuidValidator(idCandidate: string){
    const p = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/ig;
    return p.test(idCandidate);
}
