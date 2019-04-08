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