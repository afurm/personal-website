import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { fromZonedTime } from 'date-fns-tz';
import {
  UKRAINE_TIMEZONE,
  isBookingTooSoon,
  createCalendarEventTimes,
  validateTimezone
} from '@/lib/timezone';

// Interface for booking request
interface BookingRequest {
  name: string;
  email: string;
  selectedDate: string;
  selectedTime: string;
  meetingType: 'consultation' | 'project-discussion' | 'technical-review';
  message?: string;
  duration: number;
  requestTimestamp?: string;
}

// Meeting type labels
const MEETING_TYPE_LABELS = {
  'consultation': 'Initial Consultation',
  'project-discussion': 'Project Discussion', 
  'technical-review': 'Technical Review',
};

// Environment configuration
const SERVER_TIMEZONE = process.env.SERVER_TIMEZONE || 'UTC';



// Booking validation now handled by imported utilities from @/lib/timezone

export async function POST(request: NextRequest) {
  try {
    const body: BookingRequest = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.selectedDate || !body.selectedTime || !body.meetingType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate booking time is not too soon (2-hour minimum advance)
    if (isBookingTooSoon(body.selectedDate, body.selectedTime)) {
      return NextResponse.json(
        { error: 'Booking must be at least 2 hours in advance' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create service account authentication
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
      },
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
      ],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Create calendar event with proper timezone handling using utilities
    const { startDateTime, endDateTime, timezone } = createCalendarEventTimes(
      body.selectedDate,
      body.selectedTime,
      body.duration
    );

    // Race condition protection: Check if slot is still available right before booking
    try {
      // Create day boundaries in Ukraine timezone
      const dayStartUkraine = `${body.selectedDate}T00:00:00`;
      const dayEndUkraine = `${body.selectedDate}T23:59:59`;
      // Convert Ukraine time boundaries to UTC for Google Calendar API
      const startOfDay = fromZonedTime(dayStartUkraine, UKRAINE_TIMEZONE);
      const endOfDay = fromZonedTime(dayEndUkraine, UKRAINE_TIMEZONE);

      const availabilityCheck = await calendar.events.list({
        calendarId: 'furmanets.andriy@gmail.com',
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      const existingEvents = availabilityCheck.data.items || [];
      
      // Check for conflicts with the requested time slot
      const hasConflict = existingEvents.some((event: any) => {
        if (!event.start?.dateTime || !event.end?.dateTime) return false;
        
        const eventStart = new Date(event.start.dateTime);
        const eventEnd = new Date(event.end.dateTime);
        
        return (startDateTime < eventEnd && endDateTime > eventStart);
      });

      if (hasConflict) {
        return NextResponse.json(
          { error: 'This time slot has already been booked. Please select a different time.' },
          { status: 409 } // Conflict status code
        );
      }
    } catch (availabilityError) {
      console.error('Failed to check availability:', availabilityError);
      // Continue with booking attempt - availability check failure shouldn't block booking
    }

    // Create calendar event (without attendees to avoid permission issues)
    const event = {
      summary: `${MEETING_TYPE_LABELS[body.meetingType]} - ${body.name}`,
      description: `
Meeting Details:
• Type: ${MEETING_TYPE_LABELS[body.meetingType]}
• Duration: ${body.duration} minutes
• Client: ${body.name}
• Email: ${body.email}

${body.message ? `Client Message:\n"${body.message}"\n\n` : ''}---

Andrii Furmanets
Senior Full-Stack Developer
🌐 Website: andriifurmanets.com
💼 LinkedIn: linkedin.com/in/andrii-furmanets
📧 Email: furmanets.andriy@gmail.com

Professional meeting scheduled via online booking system.
      `.trim(),
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: timezone,
      },
      end: {
        dateTime: endDateTime.toISOString(), 
        timeZone: timezone,
      },
      // Note: Google Meet link will be manually created by you
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 24 hours before
          { method: 'popup', minutes: 30 }, // 30 minutes before
          { method: 'email', minutes: 60 }, // 1 hour before
        ],
      },
    };

    // Create the event in YOUR calendar (using your email as calendar ID)
    const response = await calendar.events.insert({
      calendarId: 'furmanets.andriy@gmail.com', // Your actual calendar
      requestBody: event,
    });

    if (response.status === 200 && response.data) {
      const meetLink = response.data.conferenceData?.entryPoints?.[0]?.uri || '';
      
      // Send notification via Telegram
      try {
        const telegramMessage = `
🗓️ NEW PROFESSIONAL BOOKING

📋 ${MEETING_TYPE_LABELS[body.meetingType]}
📅 ${startDateTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
🕒 ${startDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${endDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} (${body.duration}min)

👤 Client: ${body.name}
📧 Email: ${body.email}

${body.message ? `💬 Message: "${body.message}"\n\n` : ''}✅ Event created in Google Calendar
📝 Action needed:
• Add Google Meet link to event
• Add ${body.email} as attendee
• Send calendar invitation

🔗 Event ID: ${response.data.id}
        `.trim();

        // Send to your Telegram (using existing setup)
        if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
          await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: process.env.TELEGRAM_CHAT_ID,
              text: telegramMessage,
            }),
          });
        }
      } catch (emailError) {
        console.error('Failed to send notification:', emailError);
        // Don't fail the booking if notification fails
      }

      return NextResponse.json({
        success: true,
        eventId: response.data.id,
        message: 'Meeting scheduled successfully! I will send you a calendar invitation with Google Meet link shortly.',
      });
    } else {
      throw new Error('Failed to create calendar event');
    }

  } catch (error) {
    console.error('Booking API Error:', error);
    
    // Handle specific Google Calendar API errors
    if (error instanceof Error) {
      if (error.message.includes('insufficient permissions') || error.message.includes('access denied')) {
        return NextResponse.json(
          { error: 'Calendar access issue. Please contact support.' },
          { status: 403 }
        );
      } else if (error.message.includes('quota exceeded') || error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Service temporarily unavailable. Please try again in a few minutes.' },
          { status: 429 }
        );
      } else if (error.message.includes('network') || error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Connection timeout. Please check your internet connection and try again.' },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to schedule meeting. Please try again or contact support.',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      { status: 500 }
    );
  }
}

// GET method to check availability (optional)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    if (!date) {
      return NextResponse.json({ error: 'Date parameter required' }, { status: 400 });
    }

    // Create service account authentication
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
      },
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });

    const calendar = google.calendar({ version: 'v3', auth });
    
    // Create day boundaries in Ukraine timezone
    const dayStartUkraine = date + 'T00:00:00';
    const dayEndUkraine = date + 'T23:59:59';
    // Convert Ukraine time boundaries to UTC for Google Calendar API
    const startOfDay = fromZonedTime(dayStartUkraine, UKRAINE_TIMEZONE);
    const endOfDay = fromZonedTime(dayEndUkraine, UKRAINE_TIMEZONE);

    // Get existing events for the date from YOUR calendar
    const response = await calendar.events.list({
      calendarId: 'furmanets.andriy@gmail.com',
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const existingEvents = response.data.items || [];
    
    // Generate available time slots (9 AM to 9 PM Ukraine time, 30-minute intervals)
    // IMPORTANT: These are HOST'S comfort hours in Ukraine timezone
    // Frontend will convert these for client display but booking uses Ukraine time
    const timeSlots = [];
    for (let hour = 9; hour < 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        // Create slot time in Ukraine timezone and convert to UTC
        const slotUkraineTime = date + `T${time}:00`;
        const slotStart = fromZonedTime(slotUkraineTime, UKRAINE_TIMEZONE);
        const slotEnd = new Date(slotStart.getTime() + 30 * 60000);

        // Check if this time slot conflicts with existing events
        const isAvailable = !existingEvents.some((event: any) => {
          if (!event.start?.dateTime || !event.end?.dateTime) return false;
          
          const eventStart = new Date(event.start.dateTime);
          const eventEnd = new Date(event.end.dateTime);
          
          return (slotStart < eventEnd && slotEnd > eventStart);
        });

        // Only include slots that are not too soon to book
        if (!isBookingTooSoon(date, time)) {
          timeSlots.push({
            time,
            available: isAvailable,
          });
        }
      }
    }

    return NextResponse.json({ timeSlots });

  } catch (error) {
    console.error('Availability check error:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}