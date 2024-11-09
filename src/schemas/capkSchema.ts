import {z} from "zod";

const capkSchema = z.object({
    name: z.string(),
    rID: z.string(),
    keyID: z.number(),
    hashInd: z.number(),
    arithInd: z.number(),
    modul: z.string(),
    exponent: z.string(),
    expDate: z.string(),
    checkSum: z.string(),
});

export default capkSchema;