#!/usr/bin/env node

/**
 * Test script to verify timezone conversion functionality
 * Run this both locally and on Vercel to compare results
 */

const { formatInTimeZone, fromZonedTime, toZonedTime } = require('date-fns-tz');

const UKRAINE_TIMEZONE = 'Europe/Kyiv';

console.log('===========================================');
console.log('TIMEZONE CONVERSION TEST SUITE');
console.log('===========================================\n');

// Display environment info
console.log('ENVIRONMENT INFO:');
console.log('- Current System Time:', new Date().toString());
console.log('- Current UTC Time:', new Date().toISOString());
console.log('- System Timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
console.log('- Process TZ:', process.env.TZ || 'not set');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('\n');

// Test Case 1: Ukraine 9:00 AM should be consistent across environments
console.log('TEST 1: Ukraine 9:00 AM Booking');
console.log('---------------------------------');
const ukraineTime = '2025-08-25T09:00:00';
const utcFromUkraine = fromZonedTime(ukraineTime, UKRAINE_TIMEZONE);
console.log('Ukraine Time Input:', ukraineTime);
console.log('Converted to UTC:', utcFromUkraine.toISOString());
console.log('Expected UTC (summer):', '2025-08-25T06:00:00.000Z');
console.log('\n');

// Test Case 2: Convert to different client timezones
console.log('TEST 2: Display in Different Client Timezones');
console.log('----------------------------------------------');
const clientTimezones = [
  'America/New_York',
  'America/Los_Angeles', 
  'Europe/London',
  'Asia/Tokyo',
  'Australia/Sydney'
];

clientTimezones.forEach(tz => {
  try {
    const formatted = formatInTimeZone(utcFromUkraine, tz, 'yyyy-MM-dd HH:mm:ss zzz');
    console.log(`${tz}: ${formatted}`);
  } catch (error) {
    console.log(`${tz}: Error - ${error.message}`);
  }
});
console.log('\n');

// Test Case 3: Booking validation (2-hour minimum advance)
console.log('TEST 3: Booking Validation (2-hour advance)');
console.log('-------------------------------------------');
const now = new Date();
const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

// Create a booking time that's 1 hour from now (should be rejected)
const oneHourFromNow = new Date(now.getTime() + 1 * 60 * 60 * 1000);
const ukraineOneHour = toZonedTime(oneHourFromNow, UKRAINE_TIMEZONE);
const ukraineTimeStr = ukraineOneHour.toISOString().slice(0, 19);

console.log('Current Time:', now.toISOString());
console.log('Minimum Booking Time (2h advance):', twoHoursFromNow.toISOString());
console.log('Test Booking (1h advance):', oneHourFromNow.toISOString());
console.log('Should be rejected:', oneHourFromNow < twoHoursFromNow);
console.log('\n');

// Test Case 4: Day boundaries in Ukraine timezone
console.log('TEST 4: Day Boundaries (Ukraine Timezone)');
console.log('-----------------------------------------');
const testDate = '2025-08-25';
const dayStartUkraine = `${testDate}T00:00:00`;
const dayEndUkraine = `${testDate}T23:59:59`;

const startUTC = fromZonedTime(dayStartUkraine, UKRAINE_TIMEZONE);
const endUTC = fromZonedTime(dayEndUkraine, UKRAINE_TIMEZONE);

console.log('Ukraine Day Start:', dayStartUkraine);
console.log('UTC Day Start:', startUTC.toISOString());
console.log('Ukraine Day End:', dayEndUkraine);
console.log('UTC Day End:', endUTC.toISOString());
console.log('\n');

// Test Case 5: Round-trip conversion
console.log('TEST 5: Round-trip Conversion Test');
console.log('----------------------------------');
const originalUkraineTime = '2025-08-25T15:30:00';
const toUTC = fromZonedTime(originalUkraineTime, UKRAINE_TIMEZONE);
const backToUkraine = formatInTimeZone(toUTC, UKRAINE_TIMEZONE, 'yyyy-MM-dd\'T\'HH:mm:ss');

console.log('Original Ukraine Time:', originalUkraineTime);
console.log('Converted to UTC:', toUTC.toISOString());
console.log('Back to Ukraine Time:', backToUkraine);
console.log('Round-trip successful:', originalUkraineTime === backToUkraine);
console.log('\n');

console.log('===========================================');
console.log('TEST SUITE COMPLETED');
console.log('===========================================');
console.log('\nIMPORTANT: Run this script both locally and on Vercel');
console.log('to ensure consistent results across environments.');
