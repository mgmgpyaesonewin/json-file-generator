import { NextResponse } from 'next/server';

interface ConfigRequest {
  templateFile: string;
  deviceSettingsOfBottomInfoLine1: string;
  deviceSettingsOfBottomInfoLine2: string;
  deviceSettingsOfEnableUserManagement: boolean;
  linkPOSConfigOfToggle: 'on' | 'off';
  appThemeOfTransLogging: 'on' | 'off';
}

export async function POST(request: Request) {
  try {
    const reqBody: ConfigRequest = await request.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/evp_store/${reqBody.templateFile}`);
    console.log('res', res);
    if (!res.ok) {
      console.error('Fetch failed:', res.status, res.statusText);
      throw new Error(`Failed to fetch config file: ${res.status} ${res.statusText}`);
    }

    const config = await res.json();

    // Update config with new values from the request body
    if (config.deviceSettings) {
      config.deviceSettings.bottomInfoLine1 = `รับความช่วยเหลือใช้งาน TID ${reqBody.deviceSettingsOfBottomInfoLine1}`;
      config.deviceSettings.bottomInfoLine2 = `กรุณาติดต่อที่เบอร์โทร ${reqBody.deviceSettingsOfBottomInfoLine2}`;
      config.deviceSettings.enableUserManagement = Boolean(reqBody.deviceSettingsOfEnableUserManagement);
    }

    if (config.linkPOSConfig) {
      config.linkPOSConfig.toggle = reqBody.linkPOSConfigOfToggle;
    }

    if (config.appTheme) {
      config.appTheme.transLogging = reqBody.appThemeOfTransLogging;
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
