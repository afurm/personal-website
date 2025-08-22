import { NextRequest, NextResponse } from 'next/server';
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';
import { UKRAINE_TIMEZONE } from '@/lib/timezone';

export async function GET(request: NextRequest) {
  const now = new Date();
  
  // Test Ukraine 9:00 AM conversion
  const testUkraineTime = '2025-08-25T09:00:00';
  const testUTC = fromZonedTime(testUkraineTime, UKRAINE_TIMEZONE);
  
  // Get client timezone from header if available
  const clientTimezone = request.headers.get('x-vercel-ip-timezone') || 'UTC';
  
  // Format current time in different timezones
  const timezones = ['UTC', 'Europe/Kyiv', 'America/New_York', clientTimezone];
  const formattedTimes: Record<string, string> = {};
  
  timezones.forEach(tz => {
    try {
      formattedTimes[tz] = formatInTimeZone(now, tz, 'yyyy-MM-dd HH:mm:ss zzz');
    } catch (error) {
      formattedTimes[tz] = 'Error';
    }
  });
  
  return NextResponse.json({
    environment: {
      nodeEnv: process.env.NODE_ENV,
      processTimezone: process.env.TZ || 'not set',
      serverTimezone: process.env.SERVER_TIMEZONE || 'not set',
      systemTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      vercelRegion: process.env.VERCEL_REGION || 'not set',
    },
    currentTime: {
      iso: now.toISOString(),
      unix: now.getTime(),
      string: now.toString(),
      locale: now.toLocaleString(),
    },
    detectedClient: {
      timezone: clientTimezone,
      ip: request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for'),
      country: request.headers.get('x-vercel-ip-country'),
      city: request.headers.get('x-vercel-ip-city'),
    },
    formattedTimes,
    conversionTest: {
      ukraineInput: testUkraineTime,
      convertedUTC: testUTC.toISOString(),
      expectedUTC: '2025-08-25T06:00:00.000Z',
      isCorrect: testUTC.toISOString() === '2025-08-25T06:00:00.000Z',
    },
    ukraineTimezoneConfig: UKRAINE_TIMEZONE,
  }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    }
  });
}
