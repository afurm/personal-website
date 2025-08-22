'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, addDays, isSameDay, isAfter, startOfDay, addHours, isBefore } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { trackBusiness } from '@/lib/analytics';
import { haptics } from '@/lib/haptics';
import { 
  generateAvailableDates,
  type TimeSlot
} from '@/lib/calendar';

const bookingFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  selectedDate: z.string().min(1, { message: 'Please select a date for your meeting.' }),
  selectedTime: z.string().min(1, { message: 'Please select a time slot for your meeting.' }),
  meetingType: z.enum(['consultation', 'project-discussion', 'technical-review'], {
    required_error: 'Please select a meeting type.',
    invalid_type_error: 'Please select a valid meeting type.',
  }),
  message: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const MEETING_TYPES = [
  { value: 'consultation', label: 'Initial Consultation (30 min)', duration: 30 },
  { value: 'project-discussion', label: 'Project Discussion (60 min)', duration: 60 },
  { value: 'technical-review', label: 'Technical Review (45 min)', duration: 45 },
];

const TIME_SLOTS: TimeSlot[] = [
  { time: '09:00', available: true },
  { time: '09:30', available: true },
  { time: '10:00', available: true },
  { time: '10:30', available: true },
  { time: '11:00', available: true },
  { time: '11:30', available: true },
  { time: '12:00', available: true },
  { time: '12:30', available: true },
  { time: '14:00', available: true },
  { time: '14:30', available: true },
  { time: '15:00', available: true },
  { time: '15:30', available: true },
  { time: '16:00', available: true },
  { time: '16:30', available: true },
  { time: '17:00', available: true },
  { time: '17:30', available: true },
  { time: '18:00', available: true },
  { time: '18:30', available: true },
  { time: '19:00', available: true },
  { time: '19:30', available: true },
  { time: '20:00', available: true },
  { time: '20:30', available: true },
];

export default function BookingForm() {
  const shouldReduceMotion = useReducedMotion();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [userTimezone, setUserTimezone] = useState<string>('');
  const [ukraineTimezone] = useState('Europe/Kiev');

  // Track booking form view and detect timezone
  useEffect(() => {
    trackBusiness.contactFormView();
    // Detect user's timezone
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(detectedTimezone);
    
    // Debug timezone information - will show in browser console
    console.log('🕒 TIMEZONE DEBUG - Client Side:', {
      detectedUserTimezone: detectedTimezone,
      ukraineTimezone,
      browserTime: new Date().toISOString(),
      browserLocalTime: new Date().toLocaleString(),
      browserTimezoneOffset: new Date().getTimezoneOffset()
    });
    
    // Generate time slots converted to user's timezone
    generateLocalTimeSlots(detectedTimezone);
  }, []);

  // Convert Ukraine time to user's local time - CORRECTED approach
  const convertUkraineTimeToLocal = (ukraineTimeStr: string, userTz: string, dateStr: string) => {
    try {
      // CORRECT approach: Use formatInTimeZone to handle the timezone conversion properly
      // Step 1: Create a date that we'll treat as being IN Ukraine timezone
      const ukraineTimeString = `${dateStr}T${ukraineTimeStr}:00`;
      
      // Step 2: Create a date object (this will be interpreted in local system timezone)
      const naiveDate = new Date(ukraineTimeString);
      
      // Step 3: This approach won't work - formatInTimeZone doesn't take source timezone
      // const userLocalTime = formatInTimeZone(naiveDate, userTz, 'h:mm a');
      
      // Alternative method: Use the proper timezone offset
      // Ukraine is UTC+3 in summer (August), so we need to subtract 3 hours to get UTC
      const ukraineOffset = 3 * 60; // 3 hours in minutes
      const utcTime = new Date(naiveDate.getTime() - (ukraineOffset * 60 * 1000));
      const properUserTime = formatInTimeZone(utcTime, userTz, 'h:mm a');
      
      // Debug logging for timezone conversion - ALWAYS log for Vercel debugging
      console.log('🔄 TIMEZONE CONVERSION DEBUG (FIXED):', {
        input: ukraineTimeStr,
        dateStr,
        ukraineTimeString,
        naiveDate: naiveDate.toISOString(),
        utcTime: utcTime.toISOString(),
        properUserTime,
        ukraineOffset: `UTC+${ukraineOffset/60}`,
        userTz,
        ukraineTimezone,
        environment: process.env.NODE_ENV || 'unknown'
      });
      
      // Return the properly converted time
      return properUserTime;
    } catch (error) {
      console.error('Timezone conversion error:', error);
      // Fallback to original time if conversion fails - convert to AM/PM
      const [hours, minutes] = ukraineTimeStr.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    }
  };

  // Convert Ukraine time to AM/PM format
  const convertToAMPM = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Check if booking is too close to current time (minimum 2 hours advance) - CORRECTED
  const isBookingTooSoon = (dateStr: string, timeStr: string) => {
    try {
      // Use same corrected logic as conversion function
      const ukraineTimeString = `${dateStr}T${timeStr}:00`;
      const naiveDate = new Date(ukraineTimeString);
      
      // Ukraine is UTC+3 in summer (August), so subtract 3 hours to get UTC
      const ukraineOffset = 3 * 60; // 3 hours in minutes
      const ukraineDateTime = new Date(naiveDate.getTime() - (ukraineOffset * 60 * 1000));
      
      // Get current time and convert to Ukraine time for comparison
      const now = new Date();
      const currentTimeInUkraine = formatInTimeZone(now, ukraineTimezone, "yyyy-MM-dd'T'HH:mm:ss");
      const currentUkraineDate = new Date(currentTimeInUkraine + '+03:00'); // Parse as Ukraine time
      const minimumAdvanceTime = addHours(currentUkraineDate, 2);
      
      const result = isBefore(ukraineDateTime, minimumAdvanceTime);
      
      // Debug logging - ALWAYS log for Vercel debugging
      console.log('⏰ BOOKING TIME VALIDATION DEBUG (FIXED):', {
        dateStr, timeStr,
        ukraineTimeString,
        naiveDate: naiveDate.toISOString(),
        ukraineDateTime: ukraineDateTime.toISOString(),
        currentTimeInUkraine,
        currentUkraineDate: currentUkraineDate.toISOString(),
        minimumAdvanceTime: minimumAdvanceTime.toISOString(),
        result,
        environment: process.env.NODE_ENV || 'unknown'
      });
      
      return result;
    } catch (error) {
      console.error('Error checking booking time:', error);
      // Fallback to simple comparison if timezone conversion fails
      const bookingDateTime = new Date(`${dateStr}T${timeStr}:00`);
      const minimumAdvanceTime = addHours(new Date(), 2);
      return isBefore(bookingDateTime, minimumAdvanceTime);
    }
  };

  // Generate time slots converted to user's timezone with buffer time
  // IMPORTANT: Always generates slots within HOST'S comfort hours (9 AM - 9 PM Ukraine time)
  // but displays them in client's local timezone for convenience
  const generateLocalTimeSlots = (userTz: string, dateStr?: string) => {
    const slots: TimeSlot[] = [];
    
    // Use provided date or current date
    const targetDateStr = dateStr || format(new Date(), 'yyyy-MM-dd');
    
    // Generate slots from 9 AM to 9 PM UKRAINE TIME (host's comfort hours)
    // These times ensure meetings are always during convenient hours for the host
    for (let hour = 9; hour < 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const ukraineTimeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Check if this slot is too soon to book (2-hour minimum advance)
        const isTooSoon = isBookingTooSoon(targetDateStr, ukraineTimeStr);
        
        // Skip slots that are too soon for same-day bookings
        if (isTooSoon) continue;
        
        // Convert Ukraine time to client's local time for display purposes only
        const userLocalTime = convertUkraineTimeToLocal(ukraineTimeStr, userTz, targetDateStr);
        
        slots.push({
          time: ukraineTimeStr, // ALWAYS keep original Ukraine time for backend booking
          available: true,
          displayTime: userLocalTime // Show user's local time for their convenience
        });
        
        // Debug logging for slot generation - Show first few slots always
        if (slots.length <= 3) {
          console.log('⚙️ SLOT GENERATION DEBUG:', {
            slotNumber: slots.length,
            ukraineTimeStr,
            userLocalTime,
            targetDateStr,
            userTz,
            environment: process.env.NODE_ENV || 'unknown'
          });
        }
      }
    }
    
    setAvailableSlots(slots);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      meetingType: 'consultation', // Set default meeting type
    },
  });

  const watchedMeetingType = watch('meetingType');

  const availableDates = generateAvailableDates(14);

  // Handle date selection
  const handleDateSelect = async (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    setSelectedDate(dateString);
    setValue('selectedDate', dateString);
    setSelectedTime('');
    setValue('selectedTime', '');
    
    // Check availability via API
    setIsCheckingAvailability(true);
    try {
      const response = await fetch(`/api/book?date=${dateString}`);
      if (response.ok) {
        const data = await response.json();
        // Convert API response times to user's timezone and filter out slots that are too soon
        const convertedSlots = data.timeSlots
          .filter((slot: TimeSlot) => !isBookingTooSoon(dateString, slot.time))
          .map((slot: TimeSlot) => ({
            ...slot,
            displayTime: userTimezone ? convertUkraineTimeToLocal(slot.time, userTimezone, dateString) : slot.time
          }));
        setAvailableSlots(convertedSlots);
      } else {
        // Fallback to local time slots if API fails
        console.warn('Failed to check availability, using default slots');
        generateLocalTimeSlots(userTimezone, dateString);
      }
    } catch (error) {
      console.error('Failed to check availability:', error);
      // Fallback to local time slots if API fails
      generateLocalTimeSlots(userTimezone, dateString);
    } finally {
      setIsCheckingAvailability(false);
    }
    
    haptics.light();
  };

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setValue('selectedTime', time);
    haptics.light();
  };

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    setError(null);

    // Additional validation to ensure all required fields are filled
    if (!data.meetingType || !data.selectedDate || !data.selectedTime) {
      setError('Please complete all required fields before submitting.');
      setIsSubmitting(false);
      return;
    }

    // Check if selected slot is still too soon (race condition protection)
    if (isBookingTooSoon(data.selectedDate, data.selectedTime)) {
      setError('This time slot is too soon. Please select a time at least 2 hours in advance.');
      setIsSubmitting(false);
      return;
    }

    try {
      const meetingType = MEETING_TYPES.find(type => type.value === data.meetingType);
      const bookingData = {
        ...data,
        duration: meetingType?.duration || 30,
        // Add timestamp for server-side race condition detection
        requestTimestamp: new Date().toISOString(),
      };

      // Submit booking via API
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific error types with user-friendly messages
        if (response.status === 409) {
          setError('Sorry, this time slot was just booked by someone else. Please select a different time.');
        } else if (response.status === 403) {
          setError('There seems to be a calendar access issue. Please try again or contact support.');
        } else if (response.status === 429) {
          setError('Too many booking requests. Please wait a moment and try again.');
        } else {
          setError(result.error || 'Failed to schedule meeting. Please try again or contact support.');
        }
        setIsSubmitting(false);
        return;
      }

      setIsSubmitted(true);
      haptics.success();
      trackBusiness.contactFormSubmit();
      reset();
      setSelectedDate('');
      setSelectedTime('');
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Booking creation failed:', err);
      
      // Handle network and other errors with user-friendly messages
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          setError('Network connection issue. Please check your internet connection and try again.');
        } else if (err.message.includes('timeout')) {
          setError('Request timed out. Please try again.');
        } else {
          setError('Something went wrong. Please try again or contact support if the problem persists.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      
      haptics.error();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass-card rounded-3xl p-8 shadow-glass-lg">
        {isSubmitted ? (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={shouldReduceMotion ? {} : { type: "spring", stiffness: 300, damping: 30 }}
            className="text-center space-y-6"
          >
            <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-green-600 dark:text-green-500">
                Meeting Scheduled Successfully!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                Your meeting has been added to both our calendars. You'll receive a calendar invitation shortly 
                with the meeting details and any relevant information.
              </p>
            </div>
            
            <motion.button
              onClick={() => {
                setIsSubmitted(false);
                reset();
                haptics.light();
              }}
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              className="glass-button inline-flex h-12 items-center justify-center rounded-2xl bg-black dark:bg-white px-8 text-sm font-semibold text-white dark:text-black shadow-glass transition-all duration-300 hover:shadow-glass-lg"
            >
              Schedule Another Meeting
            </motion.button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Meeting Type Selection */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                Select Meeting Type
              </label>
              <div className="grid gap-3">
                {MEETING_TYPES.map((type) => {
                  const isSelected = watchedMeetingType === type.value;
                  return (
                    <label
                      key={type.value}
                      className={`relative flex items-center space-x-3 rounded-xl border p-4 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 dark:bg-primary/10'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        {...register('meetingType')}
                        value={type.value}
                        className="h-4 w-4 text-primary focus:ring-primary"
                      />
                      <div className="flex-1">
                        <div className={`font-medium ${
                          isSelected ? 'text-primary' : 'text-gray-900 dark:text-white'
                        }`}>
                          {type.label}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
              {errors.meetingType && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.meetingType.message}
                </p>
              )}
            </div>

            {/* Date Selection */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                Select Date
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {availableDates.map((date) => {
                  const dateString = format(date, 'yyyy-MM-dd');
                  const isSelected = selectedDate === dateString;
                  
                  return (
                    <motion.button
                      key={dateString}
                      type="button"
                      onClick={() => handleDateSelect(date)}
                      whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                      className={`p-3 rounded-xl text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-primary text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div>{format(date, 'EEE')}</div>
                      <div className="text-xs opacity-75">{format(date, 'MMM d')}</div>
                    </motion.button>
                  );
                })}
              </div>
              {errors.selectedDate && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.selectedDate.message}
                </p>
              )}
            </div>

            {/* Timezone Debug Info */}
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                🔍 Debug: Timezone Information
              </h3>
              <div className="text-xs space-y-1 text-blue-700 dark:text-blue-300">
                <div><strong>Your Timezone:</strong> {userTimezone || 'Detecting...'}</div>
                <div><strong>Host Timezone:</strong> {ukraineTimezone}</div>
                <div><strong>Current Time:</strong> {new Date().toLocaleString()}</div>
                <div><strong>Current UTC:</strong> {new Date().toISOString()}</div>
                <div><strong>Browser Offset:</strong> {new Date().getTimezoneOffset()} minutes</div>
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  Select Time
                  {userTimezone && (
                    <span className="ml-2 text-xs text-gray-500">
                      (Times shown in your local timezone: {userTimezone.split('/').pop()})
                    </span>
                  )}
                  {isCheckingAvailability && (
                    <span className="ml-2 text-xs text-gray-500">Checking availability...</span>
                  )}
                </label>
                {isCheckingAvailability ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No time slots available for this date. 
                      {selectedDate === format(new Date(), 'yyyy-MM-dd') 
                        ? ' Try selecting a future date or a time at least 2 hours from now.'
                        : ' Please try a different date.'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedTime === slot.time;
                    const isAvailable = slot.available;
                    
                    return (
                      <motion.button
                        key={slot.time}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => handleTimeSelect(slot.time)}
                        whileHover={shouldReduceMotion || !isAvailable ? {} : { scale: 1.05 }}
                        whileTap={shouldReduceMotion || !isAvailable ? {} : { scale: 0.95 }}
                        className={`p-3 rounded-xl text-sm font-medium transition-all ${
                          !isAvailable
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                            : isSelected
                            ? 'bg-primary text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <div className="text-center">
                          <div>{slot.displayTime || convertToAMPM(slot.time)}</div>
                          {slot.displayTime && (
                            <div className="text-xs opacity-75">
                              ({convertToAMPM(slot.time)} Ukraine)
                            </div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                  </div>
                )}
                {errors.selectedTime && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.selectedTime.message}
                  </p>
                )}
              </div>
            )}

            {/* Contact Information */}
            {selectedDate && selectedTime && watchedMeetingType && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative group">
                  <input
                    id="name"
                    {...register('name')}
                    className="peer w-full h-14 px-4 pt-6 pb-2 text-sm glass border-2 border-transparent focus:border-primary focus:outline-none transition-all duration-200 placeholder-transparent hover:border-white/20 dark:hover:border-white/10 rounded-2xl"
                    placeholder="Your name"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-4 top-4 text-sm text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-primary"
                  >
                    Full Name
                  </label>
                  {errors.name && (
                    <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="relative group">
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="peer w-full h-14 px-4 pt-6 pb-2 text-sm glass border-2 border-transparent focus:border-primary focus:outline-none transition-all duration-200 placeholder-transparent hover:border-white/20 dark:hover:border-white/10 rounded-2xl"
                    placeholder="Your email"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-4 top-4 text-sm text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-primary"
                  >
                    Email Address
                  </label>
                  {errors.email && (
                    <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Optional Message */}
            {selectedDate && selectedTime && watchedMeetingType && (
              <div className="relative group">
                <textarea
                  id="message"
                  {...register('message')}
                  className="peer w-full min-h-[100px] px-4 pt-8 pb-4 text-sm glass border-2 border-transparent focus:border-primary focus:outline-none transition-all duration-200 placeholder-transparent hover:border-white/20 dark:hover:border-white/10 resize-none rounded-2xl"
                  placeholder="Additional message"
                />
                <label
                  htmlFor="message"
                  className="absolute left-4 top-4 text-sm text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-primary"
                >
                  Additional Message (Optional)
                </label>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-red-500"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            {selectedDate && selectedTime && watchedMeetingType && (
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                className="glass-button group relative inline-flex h-14 w-full items-center justify-center rounded-2xl bg-black dark:bg-white px-8 text-sm font-semibold text-white dark:text-black shadow-glass transition-all duration-300 hover:shadow-glass-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Scheduling Meeting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Schedule Meeting
                    </>
                  )}
                </span>
              </motion.button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}