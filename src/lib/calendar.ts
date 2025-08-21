import { google } from 'googleapis';

// Google Calendar configuration
const CALENDAR_ID = 'primary'; // Use primary calendar or specific calendar ID
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

// Google Calendar scopes
const CALENDAR_SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly'
];

export interface BookingData {
  name: string;
  email: string;
  selectedDate: string;
  selectedTime: string;
  meetingType: 'consultation' | 'project-discussion' | 'technical-review';
  message?: string;
  duration: number;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

// Initialize Google Auth client
let gapi: any;
let auth2: any;

export const initGoogleAPI = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Google API can only be initialized in browser environment'));
      return;
    }

    // Load Google API script if not already loaded
    if (!window.gapi) {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => loadGoogleAPI(resolve, reject);
      script.onerror = () => reject(new Error('Failed to load Google API script'));
      document.head.appendChild(script);
    } else {
      loadGoogleAPI(resolve, reject);
    }
  });
};

const loadGoogleAPI = (resolve: () => void, reject: (error: Error) => void) => {
  gapi = window.gapi;
  
  gapi.load('client:auth2', async () => {
    try {
      await gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: CALENDAR_SCOPES.join(' ')
      });

      auth2 = gapi.auth2.getAuthInstance();
      resolve();
    } catch (error) {
      reject(error instanceof Error ? error : new Error('Failed to initialize Google API'));
    }
  });
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined' || !auth2) return false;
  return auth2.isSignedIn.get();
};

// Sign in user
export const signIn = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !auth2) {
    throw new Error('Google API not initialized');
  }

  try {
    const user = await auth2.signIn();
    return user.isSignedIn();
  } catch (error) {
    console.error('Sign in failed:', error);
    return false;
  }
};

// Sign out user
export const signOut = async (): Promise<void> => {
  if (typeof window === 'undefined' || !auth2) return;
  
  try {
    await auth2.signOut();
  } catch (error) {
    console.error('Sign out failed:', error);
  }
};

// Get available time slots for a specific date
export const getAvailableSlots = async (date: string): Promise<TimeSlot[]> => {
  if (!isAuthenticated()) {
    throw new Error('User not authenticated');
  }

  try {
    const startOfDay = new Date(date + 'T00:00:00');
    const endOfDay = new Date(date + 'T23:59:59');

    const response = await gapi.client.calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const existingEvents = response.result.items || [];
    
    // Generate all possible time slots (9 AM to 5 PM, 30-minute intervals)
    const timeSlots: TimeSlot[] = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const slotStart = new Date(date + `T${time}:00`);
        const slotEnd = new Date(slotStart.getTime() + 30 * 60000); // 30 minutes later

        // Check if this time slot conflicts with existing events
        const isAvailable = !existingEvents.some((event: any) => {
          const eventStart = new Date(event.start.dateTime || event.start.date);
          const eventEnd = new Date(event.end.dateTime || event.end.date);
          
          return (slotStart < eventEnd && slotEnd > eventStart);
        });

        timeSlots.push({
          time,
          available: isAvailable,
        });
      }
    }

    return timeSlots;
  } catch (error) {
    console.error('Failed to get available slots:', error);
    throw new Error('Failed to check availability');
  }
};

// Create a calendar event
export const createCalendarEvent = async (bookingData: BookingData): Promise<string> => {
  if (!isAuthenticated()) {
    throw new Error('User not authenticated');
  }

  try {
    const startDateTime = new Date(`${bookingData.selectedDate}T${bookingData.selectedTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + bookingData.duration * 60000);

    const meetingTypes = {
      'consultation': 'Initial Consultation',
      'project-discussion': 'Project Discussion',
      'technical-review': 'Technical Review',
    };

    const event = {
      summary: `${meetingTypes[bookingData.meetingType]} with ${bookingData.name}`,
      description: `
Meeting Type: ${meetingTypes[bookingData.meetingType]}
Client: ${bookingData.name}
Email: ${bookingData.email}
Duration: ${bookingData.duration} minutes

${bookingData.message ? `Additional Message:\n${bookingData.message}` : ''}

This meeting was booked through the website booking system.
      `.trim(),
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Europe/Kiev', // Update to your timezone
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Europe/Kiev', // Update to your timezone
      },
      attendees: [
        {
          email: bookingData.email,
          displayName: bookingData.name,
        },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 24 hours before
          { method: 'popup', minutes: 30 }, // 30 minutes before
        ],
      },
      conferenceData: {
        createRequest: {
          requestId: `meeting-${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    };

    const response = await gapi.client.calendar.events.insert({
      calendarId: CALENDAR_ID,
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all', // Send invitations to all attendees
    });

    return response.result.id;
  } catch (error) {
    console.error('Failed to create calendar event:', error);
    throw new Error('Failed to schedule meeting');
  }
};

// Get user's calendar info (for verification)
export const getUserCalendarInfo = async () => {
  if (!isAuthenticated()) {
    throw new Error('User not authenticated');
  }

  try {
    const response = await gapi.client.calendar.calendarList.list();
    return response.result.items;
  } catch (error) {
    console.error('Failed to get calendar info:', error);
    throw new Error('Failed to get calendar information');
  }
};

// Helper function to format date for display
export const formatDateTime = (dateString: string, timeString: string): string => {
  const date = new Date(`${dateString}T${timeString}:00`);
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

// Generate available dates (excluding weekends and past dates)
export const generateAvailableDates = (daysAhead: number = 14): Date[] => {
  const dates = [];
  let currentDate = new Date();
  let daysAdded = 0;
  let totalDays = 0;
  
  while (daysAdded < daysAhead && totalDays < 30) { // Safety limit
    const nextDate = new Date();
    nextDate.setDate(currentDate.getDate() + totalDays + 1);
    const dayOfWeek = nextDate.getDay();
    
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      dates.push(nextDate);
      daysAdded++;
    }
    totalDays++;
  }
  
  return dates;
};

// Type declarations for window.gapi
declare global {
  interface Window {
    gapi: any;
  }
}