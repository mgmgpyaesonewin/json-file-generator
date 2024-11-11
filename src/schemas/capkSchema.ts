import {z} from "zod";

const capkSchema = z.object({
    name: z.string(),
    rID: z.string(),
    keyID: z.preprocess((val: unknown) => parseInt(val as string, 10), z.number().optional()),
    hashInd: z.preprocess((val: unknown) => parseInt(val as string, 10), z.number().optional()),
    arithInd: z.preprocess((val: unknown) => parseInt(val as string, 10), z.number().optional()),
    module: z.string(),
    exponent: z.string(),
    expDate: z.string(),
    checkSum: z.string(),
});

export default capkSchema;