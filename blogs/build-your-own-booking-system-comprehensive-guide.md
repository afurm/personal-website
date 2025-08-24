---
title: "How I Built My Own Meeting Booking System: From Expensive SaaS to Custom Google Calendar Integration"
description: "My journey building a custom booking system with Next.js, React, and Google Calendar API. No more subscription fees - complete control over scheduling, timezone handling, and user experience."
date: "2025-08-24"
tags: ["Booking System", "Google Calendar", "Next.js", "React", "Timezone Handling", "Custom Development"]
slug: "build-your-own-booking-system-comprehensive-guide"
---

After getting tired of paying $15-30/month for booking systems like Calendly and Acuity, I decided to build my own. What started as a weekend project turned into a sophisticated booking system with Google Calendar integration, smart timezone handling, and a beautiful user interface. Here's the complete story of how I built it, the challenges I faced, and the code that powers my personal meeting scheduler.

---

## The Problem: Booking Systems Are Expensive

As a freelance developer, I needed a simple way for clients to book consultation calls. The popular solutions were charging way too much:

- **Calendly**: $8-16/month per user  
- **Acuity Scheduling**: $14-50/month
- **Square Appointments**: $29-69/month

For a few meetings per month, these prices felt ridiculous. Plus, I wanted more control over the user experience and data. That's when I decided to build my own.

## What I Built

My custom booking system includes:
- **Google Calendar Integration**: Automatic event creation and conflict detection
- **Smart Timezone Handling**: Displays times in user's local timezone while keeping my Ukraine timezone as the base
- **Meeting Types**: Different durations for consultations, project discussions, and technical reviews
- **Real-time Availability**: Checks Google Calendar in real-time to prevent double-bookings
- **Telegram Notifications**: Instant notifications when someone books a meeting
- **Beautiful UI**: Modern React interface with animations and responsive design

---

## The Tech Stack I Chose

After evaluating different options, I settled on:

- **Frontend**: Next.js 14 with React and TypeScript
- **Styling**: Tailwind CSS with custom animations  
- **Calendar**: Google Calendar API with service account authentication
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Telegram Bot API for instant alerts
- **Deployment**: Vercel for seamless Next.js hosting

This stack gave me server-side rendering, type safety, and easy deployment while keeping costs minimal.

---

## The Architecture: Keep It Simple

Instead of over-engineering, I chose a simple but effective architecture:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Client  │───▶│  Next.js API     │───▶│ Google Calendar │
│   (booking-form)│    │  (/api/book)     │    │      API        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  Telegram Bot    │
                       │  (notifications) │
                       └──────────────────┘
```

**No database needed!** Google Calendar becomes my database, storing all booking information and handling conflicts automatically.

---

## Challenge #1: Timezone Hell

The biggest challenge was handling timezones correctly. I live in Ukraine, but clients book from all over the world. Here's what I learned:

### The Problem
- Display times in the client's local timezone for convenience
- Always book in Ukraine timezone (my working hours)
- Prevent confusion and missed meetings
- Handle edge cases like daylight saving time

### The Solution
I created a comprehensive timezone utility:

```typescript
// Always work with Ukraine timezone as the base
export const UKRAINE_TIMEZONE = 'Europe/Kyiv';

// Convert Ukraine time to client's local time for display
export const convertUkraineTimeToUserLocal = (
  ukraineTimeStr: string, 
  userTimezone: string, 
  dateStr: string
): string => {
  // Create Ukraine datetime string
  const ukraineTimeString = `${dateStr}T${ukraineTimeStr}:00`;
  
  // Convert from Ukraine timezone to UTC
  const utcDateTime = fromZonedTime(ukraineTimeString, UKRAINE_TIMEZONE);
  
  // Format in user's timezone for display
  return formatInTimeZone(utcDateTime, userTimezone, 'h:mm a');
};
```

The key insight: **Always store times in the host's timezone, but display them in the user's timezone.**

---

## Challenge #2: Google Calendar Service Account Setup

Getting Google Calendar API working properly took longer than expected. Here's the setup:

### 1. Create Google Cloud Project
```bash
# Enable Calendar API
gcloud services enable calendar-json.googleapis.com

# Create service account
gcloud iam service-accounts create booking-system
```

### 2. Share Your Calendar
The tricky part: you must share your Google Calendar with the service account email:
- Go to Google Calendar settings
- Find the service account email (looks like `booking-system@project.iam.gserviceaccount.com`)
- Share your calendar with "Make changes to events" permission

### 3. Environment Variables
```bash
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_PRIVATE_KEY_ID=key-id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
GOOGLE_CLIENT_EMAIL=booking-system@project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=client-id
```

The private key formatting was crucial - make sure to preserve the `\n` characters!

---

## The API Route: Where the Magic Happens

The core of my system is a single Next.js API route at `/api/book`. Here's how it works:

### 1. Input Validation and Race Condition Prevention
```typescript
export async function POST(request: NextRequest) {
  const body: BookingRequest = await request.json();
  
  // Validate required fields
  if (!body.name || !body.email || !body.selectedDate || !body.selectedTime) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Prevent bookings too close to current time
  if (isBookingTooSoon(body.selectedDate, body.selectedTime)) {
    return NextResponse.json(
      { error: 'Booking must be at least 2 hours in advance' }, 
      { status: 400 }
    );
  }
  
  // Check for double bookings right before creating event
  const hasConflict = await checkCalendarConflicts(body.selectedDate, body.selectedTime);
  if (hasConflict) {
    return NextResponse.json(
      { error: 'This time slot has already been booked.' }, 
      { status: 409 }
    );
  }
}
```

### 2. Google Calendar Integration
```typescript
// Create service account authentication
const auth = new google.auth.GoogleAuth({
  credentials: {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
  },
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

const calendar = google.calendar({ version: 'v3', auth });

// Create calendar event with proper timezone handling
const { startDateTime, endDateTime } = createCalendarEventTimes(
  body.selectedDate,
  body.selectedTime,
  body.duration
);

const event = {
  summary: `${MEETING_TYPE_LABELS[body.meetingType]} - ${body.name}`,
  description: `Meeting with ${body.name} (${body.email})`,
  start: {
    dateTime: startDateTime.toISOString(),
    timeZone: UKRAINE_TIMEZONE,
  },
  end: {
    dateTime: endDateTime.toISOString(),
    timeZone: UKRAINE_TIMEZONE,
  },
  reminders: {
    useDefault: false,
    overrides: [
      { method: 'email', minutes: 24 * 60 },
      { method: 'popup', minutes: 30 },
    ],
  },
};

await calendar.events.insert({
  calendarId: 'your-email@gmail.com',
  requestBody: event,
});
```

### 3. Instant Telegram Notifications
```typescript
// Send notification to my Telegram
const telegramMessage = `
🗓️ NEW BOOKING
📋 ${MEETING_TYPE_LABELS[body.meetingType]}
📅 ${ukraineDate.toLocaleDateString()}
🕒 ${ukraineDate.toLocaleTimeString()} Ukraine Time
👤 ${body.name}
📧 ${body.email}
`;

await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chat_id: TELEGRAM_CHAT_ID,
    text: telegramMessage,
  }),
});
```

This gives me instant notifications on my phone whenever someone books a meeting.

---

## The Frontend: Beautiful and Functional

The React frontend handles three main states: date selection, time selection, and form submission.

### Meeting Type Selection
```typescript
const MEETING_TYPES = [
  { value: 'consultation', label: 'Initial Consultation (30 min)', duration: 30 },
  { value: 'project-discussion', label: 'Project Discussion (60 min)', duration: 60 },
  { value: 'technical-review', label: 'Technical Review (45 min)', duration: 45 },
];
```

### Smart Time Display
The trickiest part was showing times correctly:

```typescript
// Generate slots in Ukraine time (my working hours 9 AM - 9 PM)
for (let hour = 9; hour < 21; hour++) {
  for (let minute = 0; minute < 60; minute += 30) {
    const ukraineTimeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    // Convert to user's local time for display
    const userLocalTime = convertUkraineTimeToUserLocal(ukraineTimeStr, userTimezone, dateStr);
    
    slots.push({
      time: ukraineTimeStr, // Keep original for backend
      displayTime: userLocalTime // Show user's local time
    });
  }
}
```

### Real-time Availability Checking
When a user selects a date, the frontend calls the API to get real availability:

```typescript
const handleDateSelect = async (date: Date) => {
  setIsCheckingAvailability(true);
  
  try {
    const response = await fetch(`/api/book?date=${dateString}`);
    const data = await response.json();
    setAvailableSlots(data.timeSlots);
  } catch (error) {
    // Fallback to default slots if API fails
    generateDefaultSlots();
  }
};
```

This prevents showing slots that are already booked.

---

## Challenges I Faced and How I Solved Them

### Problem 1: Race Conditions
Two people could book the same time slot simultaneously. 

**Solution**: Check availability right before creating the calendar event:
```typescript
// Check for conflicts with a fresh API call
const availabilityCheck = await calendar.events.list({
  calendarId: 'your-email@gmail.com',
  timeMin: startOfDay.toISOString(),
  timeMax: endOfDay.toISOString(),
});

const hasConflict = availabilityCheck.data.items.some(event => {
  // Check if requested time overlaps with existing event
  return (startDateTime < eventEnd && endDateTime > eventStart);
});

if (hasConflict) {
  return NextResponse.json(
    { error: 'Time slot already booked' }, 
    { status: 409 }
  );
}
```

### Problem 2: Timezone Edge Cases
Users in different timezones seeing different available times.

**Solution**: Always generate slots based on my timezone (Ukraine), then convert for display:
```typescript
// Times shown: "2:00 PM (6:00 PM Ukraine)"
<div>
  {userLocalTime}
  <div className="text-xs opacity-75">
    ({convertToAMPM(slot.time)} Ukraine)
  </div>
</div>
```

### Problem 3: Mobile Experience
Needed the booking form to work perfectly on mobile devices.

**Solution**: Progressive form reveal and touch-friendly design:
```tsx
{/* Only show contact fields after time is selected */}
{selectedDate && selectedTime && (
  <div className="grid md:grid-cols-2 gap-6">
    {/* Name and email inputs */}
  </div>
)}
```

---

## The Results: Better Than Expected

After building my own booking system, here's what I gained:

### Cost Savings
- **Before**: $20-30/month for Calendly Pro
- **After**: $0/month (just hosting costs ~$0 on Vercel)
- **Annual savings**: $240-360

### Better User Experience
- Faster loading (optimized for my use case)
- Perfect mobile experience
- Custom branding that matches my website
- Smart timezone handling that actually works

### Complete Control
- Can add features anytime (like different meeting types)
- Full access to booking data
- Custom analytics and tracking
- Integration with my existing tools

### The Numbers
Since launching 6 months ago:
- **50+ meetings booked** without any issues
- **Zero double bookings** thanks to race condition handling
- **100% mobile friendly** - many clients book from phones
- **Instant notifications** - I respond to bookings within minutes

## What I'd Do Differently

If I were starting over:

1. **Start simpler**: My first version had too many features. The core booking flow is what matters.
2. **Test timezones early**: Spend more time testing with people in different timezones.
3. **Add analytics sooner**: I wish I tracked conversion rates from the beginning.
4. **Consider SMS notifications**: Telegram is great, but SMS might be more reliable.

## Future Plans: NPM Package

I'm now working on packaging this into a reusable NPM module. The plan:

```bash
npm install @andriifurmanets/booking-system
```

Key features for the package:
- Drop-in React components
- Multiple calendar providers (not just Google)
- Customizable themes and styling
- Built-in timezone handling
- TypeScript support

The goal is to help other developers avoid the subscription trap while getting a better booking experience than the commercial alternatives.

---

## Frequently Asked Questions

### How long did it take to build this booking system?
About 2 weeks of focused development. The first weekend was spent setting up Google Calendar integration, and the second week was spent on the frontend and edge cases.

### What's the total cost to run this system?
Essentially free! Vercel hosting is free for my traffic level, Google Calendar API is free up to generous limits, and Telegram Bot API is completely free.

### How do you handle no-shows or cancellations?
Currently manual - clients email me to reschedule. For the NPM package, I plan to add a cancellation link in confirmation emails that automatically removes the calendar event.

### What about payment integration?
I don't collect payments through the booking system. I handle payments separately after the consultation. For others, integrating Stripe would be straightforward.

### Can this scale to multiple team members?
The current version is designed for single-person use. For teams, you'd need to add user authentication and calendar selection. This is planned for the NPM package version.

### How do you prevent spam bookings?
I use basic email validation and require a 2-hour advance booking. For higher-volume use cases, you might want to add CAPTCHA or require phone verification.

### Would you recommend building your own vs using existing solutions?
If you're a developer and want complete control, absolutely! The time investment pays off quickly in cost savings and customization freedom. For non-technical users, existing solutions might be simpler.