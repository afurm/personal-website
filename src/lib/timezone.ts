import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz';
import { addHours, isBefore } from 'date-fns';

// Ukraine timezone handling with modern identifier support
export const getUkraineTimezone = (): string => {
  try {
    // Test if Europe/Kyiv is supported (modern identifier)
    Intl.DateTimeFormat(undefined, { timeZone: 'Europe/Kyiv' });
    return 'Europe/Kyiv';
  } catch {
    // Fallback to Europe/Kiev for older systems
    return 'Europe/Kiev';
  }
};

export const UKRAINE_TIMEZONE = getUkraineTimezone();

// Normalize Ukraine timezone for compatibility
export const normalizeUkraineTimezone = (timezone: string): string => {
  if (timezone === 'Europe/Kiev') {
    return 'Europe/Kyiv';
  }
  return timezone;
};

// Convert client booking time to Ukraine timezone for storage
export const convertToUkraineTime = (clientTime: string, clientTimezone: string): Date => {
  // Convert client time (in client's timezone) to UTC
  const utcTime = fromZonedTime(clientTime, clientTimezone);
  // Then convert UTC to Ukraine timezone
  return toZonedTime(utcTime, UKRAINE_TIMEZONE);
};

// Convert Ukraine timezone to client timezone for display
export const convertToClientTime = (ukraineTime: Date, clientTimezone: string): string => {
  // The ukraineTime is already a Date object, we need to treat it as being in Ukraine timezone
  // and convert it to client timezone for display
  return formatInTimeZone(ukraineTime, clientTimezone, 'yyyy-MM-dd HH:mm:ss zzz');
};

// Convert Ukraine time string to user's local timezone for display
export const convertUkraineTimeToUserLocal = (
  ukraineTimeStr: string, 
  userTimezone: string, 
  dateStr: string
): string => {
  try {
    // Create Ukraine datetime string
    const ukraineTimeString = `${dateStr}T${ukraineTimeStr}:00`;
    
    // Convert from Ukraine timezone to UTC
    const utcDateTime = fromZonedTime(ukraineTimeString, UKRAINE_TIMEZONE);
    
    // Format the UTC time in user's timezone
    const userLocalTime = formatInTimeZone(utcDateTime, userTimezone, 'h:mm a');
    

    
    return userLocalTime;
  } catch (error) {
    console.error('Timezone conversion error:', error);
    // Fallback to AM/PM format if conversion fails
    const [hours, minutes] = ukraineTimeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  }
};

// Convert time to AM/PM format
export const convertToAMPM = (timeStr: string): string => {
  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
};

// Check if booking is too close to current time (minimum 2 hours advance)
export const isBookingTooSoon = (dateStr: string, timeStr: string): boolean => {
  try {
    // Create Ukraine datetime string
    const ukraineTimeString = `${dateStr}T${timeStr}:00`;
    
    // Convert Ukraine time to UTC for comparison
    const utcDateTime = fromZonedTime(ukraineTimeString, UKRAINE_TIMEZONE);
    
    // Get current UTC time and add 2-hour buffer
    const now = new Date();
    const minimumAdvanceTime = addHours(now, 2);
    
    const result = isBefore(utcDateTime, minimumAdvanceTime);
    

    
    return result;
  } catch (error) {
    console.error('Error checking booking time:', error);
    // Fallback to simple comparison if timezone conversion fails
    const bookingDateTime = new Date(`${dateStr}T${timeStr}:00`);
    const minimumAdvanceTime = addHours(new Date(), 2);
    return isBefore(bookingDateTime, minimumAdvanceTime);
  }
};

// Validate timezone
export const validateTimezone = (timezone: string): boolean => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch (error) {
    return false;
  }
};

// Timezone detection class with fallbacks
export class TimezoneDetector {
  static detect(): string {
    const methods = [
      () => this.getFromBrowser(),
      () => 'UTC' // Ultimate fallback
    ];
    
    for (const method of methods) {
      const timezone = method();
      if (timezone && this.validate(timezone)) {
        return timezone;
      }
    }
    return 'UTC';
  }
  
  static getFromBrowser(): string | null {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
      return null;
    }
  }
  
  static validate(timezone: string): boolean {
    return validateTimezone(timezone);
  }
}

// Format booking time with proper timezone context
export const formatBookingTime = (
  ukraineTime: Date | string, 
  clientTimezone: string
): string => {
  try {
    const timeToFormat = typeof ukraineTime === 'string' 
      ? new Date(ukraineTime) 
      : ukraineTime;
    
    // Convert from Ukraine timezone to UTC, then format in client's timezone
    const utcTime = fromZonedTime(timeToFormat, UKRAINE_TIMEZONE);
    return formatInTimeZone(utcTime, clientTimezone, 'MMM d, yyyy HH:mm zzz');
  } catch (error) {
    console.error('Error formatting booking time:', error);
    return typeof ukraineTime === 'string' ? ukraineTime : ukraineTime.toISOString();
  }
};

// Create calendar event times with proper timezone
export const createCalendarEventTimes = (
  selectedDate: string,
  selectedTime: string,
  duration: number
) => {
  try {
    // Create Ukraine datetime string
    const ukraineTimeString = `${selectedDate}T${selectedTime}:00`;
    
    // Convert Ukraine time to UTC for storage in Google Calendar
    const startDateTime = fromZonedTime(ukraineTimeString, UKRAINE_TIMEZONE);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60000);
    

    
    return {
      startDateTime,
      endDateTime,
      timezone: UKRAINE_TIMEZONE
    };
  } catch (error) {
    console.error('Error creating calendar event times:', error);
    throw new Error('Invalid date/time format');
  }
};