'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, addDays, isSameDay, isAfter, startOfDay } from 'date-fns';
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
  selectedDate: z.string().min(1, { message: 'Please select a date.' }),
  selectedTime: z.string().min(1, { message: 'Please select a time slot.' }),
  meetingType: z.enum(['consultation', 'project-discussion', 'technical-review'], {
    required_error: 'Please select a meeting type.',
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
];

export default function BookingForm() {
  const shouldReduceMotion = useReducedMotion();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>(TIME_SLOTS);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  // Track booking form view
  useEffect(() => {
    trackBusiness.contactFormView();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
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
        setAvailableSlots(data.timeSlots);
      } else {
        // Fallback to default slots if API fails
        console.warn('Failed to check availability, using default slots');
        setAvailableSlots(TIME_SLOTS);
      }
    } catch (error) {
      console.error('Failed to check availability:', error);
      // Fallback to default slots if API fails
      setAvailableSlots(TIME_SLOTS);
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

    try {
      const meetingType = MEETING_TYPES.find(type => type.value === data.meetingType);
      const bookingData = {
        ...data,
        duration: meetingType?.duration || 30,
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
        throw new Error(result.error || 'Failed to schedule meeting');
      }

      setIsSubmitted(true);
      haptics.success();
      trackBusiness.contactFormSubmit();
      reset();
      setSelectedDate('');
      setSelectedTime('');
    } catch (err) {
      console.error('Booking creation failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to create booking. Please try again later.');
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
                {MEETING_TYPES.map((type) => (
                  <label
                    key={type.value}
                    className="relative flex items-center space-x-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <input
                      type="radio"
                      {...register('meetingType')}
                      value={type.value}
                      className="h-4 w-4 text-primary focus:ring-primary"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {type.label}
                      </div>
                    </div>
                  </label>
                ))}
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

            {/* Time Selection */}
            {selectedDate && (
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  Select Time (UTC+2)
                  {isCheckingAvailability && (
                    <span className="ml-2 text-xs text-gray-500">Checking availability...</span>
                  )}
                </label>
                {isCheckingAvailability ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
                        {slot.time}
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
            {selectedDate && selectedTime && (
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
            {selectedDate && selectedTime && (
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
            {selectedDate && selectedTime && (
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