import { z } from 'zod';

const issuerSchema = z.object({
    name: z.string().min(3, {
        message: 'Name must be at least 3 characters long',
    }),
    nonEmvTranRequirePIN: z.boolean(),
    adjustPercent: z.preprocess((val: unknown) => parseInt(val as string, 10), z.number().optional()),
    isAllowManualPan: z.boolean(),
    panMaskPattern: z.string().min(3, {
        message: 'Pan Mask Pattern must be at least 3 characters long',
    }),
    bindToAcquirer: z.string().min(3, {
        message: 'Bind to Acquirer must be at least 3 characters long',
    }),
    smallAmtLimit: z.preprocess((val: unknown) => parseInt(val as string, 10), z.number().optional()),
    isEnableOffline: z.boolean(),
    isEnableAdjust: z.boolean(),
    isEnableRefund: z.boolean(),
    isAllowCheckExpiry: z.boolean(),
    isEnablePreAuth: z.boolean(),
});

export default issuerSchema;