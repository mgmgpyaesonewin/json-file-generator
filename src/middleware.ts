import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    // Quick check for any Cognito auth cookie
    const hasCognitoCookie = request.cookies.getAll().some(cookie => 
        cookie.name.includes('CognitoIdentityServiceProvider') && 
        cookie.name.includes('accessToken')
    );

    if (!hasCognitoCookie) {
        const parsedURL = new URL(request.url);
        return NextResponse.redirect(new URL(`/login?origin=${parsedURL.pathname}`, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/payout/:path*"],
};