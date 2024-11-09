import { NextResponse } from 'next/server';

interface Issuer {
    name: string;
    nonEmvTranRequirePIN: boolean;
    adjustPercent: number;
    isAllowManualPan: boolean;
    panMaskPattern: string;
    bindToAcquirer: string;
    smallAmtLimit: number;
    isEnableOffline: boolean;
    isEnableAdjust: boolean;
    isEnableRefund: boolean;
    isAllowCheckExpiry: boolean;
    isEnablePreAuth: boolean;
}

interface ConfigRequest {
    templateFile: string;
    translationOfLabelHeaderLine1En: string;
    translationOfLabelHeaderLine1Th: string;
    translationOfLabelHeaderLine2En: string;
    translationOfLabelHeaderLine2Th: string;
    translationOfLabelHeaderLine3En: string;
    translationOfLabelHeaderLine3Th: string;
    issuer: Array<Issuer>;
}

export async function POST(request: Request) {
    try {
        const reqBody: ConfigRequest = await request.json();

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/ttb_config/${reqBody.templateFile}`);
        console.log('Fetch response:', res.status, res.statusText);
        if (!res.ok) {
            console.error('Fetch failed:', res.status, res.statusText);
            throw new Error(`Failed to fetch config file: ${res.status} ${res.statusText}`);
        }

        const config = await res.json();

        // Update config with new values from the request body
        if (config.configuration.translation) {
            config.configuration.translation.labelHeaderLine1.en = reqBody.translationOfLabelHeaderLine1En;
            config.configuration.translation.labelHeaderLine1.th = reqBody.translationOfLabelHeaderLine1Th;
            config.configuration.translation.labelHeaderLine2.en = reqBody.translationOfLabelHeaderLine2En;
            config.configuration.translation.labelHeaderLine2.th = reqBody.translationOfLabelHeaderLine2Th;
            config.configuration.translation.labelHeaderLine3.en = reqBody.translationOfLabelHeaderLine3En;
            config.configuration.translation.labelHeaderLine3.th = reqBody.translationOfLabelHeaderLine3Th;

            config.configuration.issuer = reqBody.issuer;
        }

        // Return the updated config for preview, without writing it to the file
        return NextResponse.json({ updatedConfig: config });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: 'Error generating config preview',
            error: error
        }, { status: 500 });
    }
}
