import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

// Interface for booking request
interface BookingRequest {
  name: string;
  email: string;
  selectedDate: string;
  selectedTime: string;
  meetingType: 'consultation' | 'project-discussion' | 'technical-review';
  message?: string;
  duration: number;
}

// Meeting type labels
const MEETING_TYPE_LABELS = {
  'consultation': 'Initial Consultation',
  'project-discussion': 'Project Discussion', 
  'technical-review': 'Technical Review',
};

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

    // Create service account authentication
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      },
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
      ],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Create date/time objects
    const startDateTime = new Date(`${body.selectedDate}T${body.selectedTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + body.duration * 60000);

    // Create calendar event (without attendees to avoid permission issues)
    const event = {
      summary: `${MEETING_TYPE_LABELS[body.meetingType]} with ${body.name}`,
      description: `
📅 Meeting Details:
• Type: ${MEETING_TYPE_LABELS[body.meetingType]}
• Duration: ${body.duration} minutes
• Client: ${body.name}
• Email: ${body.email}

${body.message ? `📝 Additional Message:\n${body.message}\n\n` : ''}

📞 Contact Information:
• Client Email: ${body.email}
• Meeting scheduled through andriifurmanets.com

🤝 Next Steps:
1. You'll receive this calendar event
2. Client will be sent a manual invitation
3. Google Meet link will be included

---
Looking forward to our conversation!

Best regards,
Andrii Furmanets
Senior Full-Stack Developer
      `.trim(),
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Europe/Kiev',
      },
      end: {
        dateTime: endDateTime.toISOString(), 
        timeZone: 'Europe/Kiev',
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
      resource: event,
    });

    if (response.status === 200 && response.data) {
      const meetLink = response.data.conferenceData?.entryPoints?.[0]?.uri || '';
      
      // Send email notification to client via your existing Telegram bot (since it's already set up)
      try {
        const telegramMessage = `
🗓️ NEW BOOKING REQUEST

📋 Meeting Details:
• Type: ${MEETING_TYPE_LABELS[body.meetingType]}
• Date: ${startDateTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
• Time: ${startDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
• Duration: ${body.duration} minutes

👤 Client Information:
• Name: ${body.name}
• Email: ${body.email}

${body.message ? `💬 Message:\n${body.message}\n\n` : ''}

⚡ Action Required: 
1. Check your Google Calendar - event has been created
2. Create Google Meet link manually
3. Send calendar invitation to ${body.email} with the Meet link
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
    
    return NextResponse.json(
      { 
        error: 'Failed to schedule meeting. Please try again or contact support.',
        details: error instanceof Error ? error.message : 'Unknown error'
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
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      },
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });

    const calendar = google.calendar({ version: 'v3', auth });
    
    const startOfDay = new Date(date + 'T00:00:00');
    const endOfDay = new Date(date + 'T23:59:59');

    // Get existing events for the date from YOUR calendar
    const response = await calendar.events.list({
      calendarId: 'furmanets.andriy@gmail.com',
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const existingEvents = response.data.items || [];
    
    // Generate available time slots (9 AM to 5 PM, 30-minute intervals)
    const timeSlots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const slotStart = new Date(date + `T${time}:00`);
        const slotEnd = new Date(slotStart.getTime() + 30 * 60000);

        // Check if this time slot conflicts with existing events
        const isAvailable = !existingEvents.some((event: any) => {
          if (!event.start?.dateTime || !event.end?.dateTime) return false;
          
          const eventStart = new Date(event.start.dateTime);
          const eventEnd = new Date(event.end.dateTime);
          
          return (slotStart < eventEnd && slotEnd > eventStart);
        });

        timeSlots.push({
          time,
          available: isAvailable,
        });
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