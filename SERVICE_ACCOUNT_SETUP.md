# Google Service Account Setup for Booking System

## Overview
The booking system now uses server-side authentication with Google Service Account instead of OAuth. This means:
- ✅ **Clients don't need Google accounts** - they just fill out the form
- ✅ **No authentication popup** - seamless user experience  
- ✅ **Automatic Google Meet creation** - with calendar invitations for both you and client
- ✅ **Real-time availability checking** - checks your actual calendar

## Step 1: Create Google Service Account

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 2. Select Your Project
Make sure you're in the `andriifurmanets` project

### 3. Create Service Account
1. Navigate to **IAM & Admin** → **Service Accounts**
2. Click **"Create Service Account"**
3. Fill in details:
   - **Service account name**: `booking-system`
   - **Service account ID**: `booking-system` (auto-generated)
   - **Description**: `Service account for website booking system`
4. Click **"Create and Continue"**

### 4. Skip Role Assignment
- Click **"Continue"** (no roles needed for calendar access)
- Click **"Done"**

### 5. Create and Download Key
1. Click on your newly created service account
2. Go to the **"Keys"** tab
3. Click **"Add Key"** → **"Create new key"**
4. Select **JSON** format
5. Click **"Create"** - this downloads the key file

## Step 2: Extract Credentials from JSON Key

Open the downloaded JSON file. It will look like this:

```json
{
  "type": "service_account",
  "project_id": "andriifurmanets",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "booking-system@andriifurmanets.iam.gserviceaccount.com",
  "client_id": "123456789...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/booking-system%40andriifurmanets.iam.gserviceaccount.com"
}
```

## Step 3: Update Environment Variables

Copy the values from your JSON key and update `.env.local`:

```env
# Google Service Account (Server-side authentication)
GOOGLE_PROJECT_ID=andriifurmanets
GOOGLE_PRIVATE_KEY_ID=your_private_key_id_from_json
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_FULL_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=booking-system@andriifurmanets.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your_client_id_from_json
```

**Important Notes:**
- Keep the quotes around `GOOGLE_PRIVATE_KEY`
- Include the full private key with `\n` characters
- The client email will be like `booking-system@andriifurmanets.iam.gserviceaccount.com`

## Step 4: Share Calendar with Service Account

### Why This is Needed
The service account needs permission to access your Google Calendar.

### How to Share:
1. Open **Google Calendar** (calendar.google.com)
2. Find your primary calendar on the left sidebar
3. Click the **3 dots** next to your calendar → **"Settings and sharing"**
4. Scroll to **"Share with specific people"**
5. Click **"Add people"**
6. Enter the service account email: `booking-system@andriifurmanets.iam.gserviceaccount.com`
7. Set permission to **"Make changes to events"**
8. Click **"Send"**

## Step 5: Test the Setup

### 1. Start Development Server
```bash
npm run dev
```

### 2. Visit Booking Page
Go to: http://localhost:3000/book

### 3. Test Booking Flow
1. **Select meeting type** (consultation, project discussion, or technical review)
2. **Pick a date** (excludes weekends)
3. **Choose time slot** - should show "Checking availability..." and then real availability
4. **Fill contact info** (name, email, optional message)
5. **Submit** - should create calendar event with Google Meet link

### 4. Verify Success
- Check your Google Calendar - event should appear
- Check client email - should receive calendar invitation
- Event should have Google Meet link automatically

## Troubleshooting

### Common Issues:

**1. "Failed to schedule meeting"**
- Check all environment variables are set correctly
- Ensure private key includes full `-----BEGIN/END-----` markers
- Verify service account email is correct

**2. "Calendar access denied"**
- Make sure you shared your calendar with the service account email
- Check permission is set to "Make changes to events"

**3. "Invalid private key"**
- Ensure private key is properly escaped with `\n` characters
- Keep quotes around the entire private key value

**4. No availability data**
- Service account needs calendar read permissions
- Calendar must be shared with service account

### Debug Steps:
1. Check server logs in development mode
2. Verify environment variables are loaded: `console.log(process.env.GOOGLE_CLIENT_EMAIL)`
3. Test API endpoint directly: `GET /api/book?date=2024-01-15`

## Security Notes

- ✅ **Service account keys are secure** - stored server-side only
- ✅ **No client-side authentication** - users never see credentials
- ✅ **Minimal permissions** - service account only has calendar access
- ⚠️ **Never commit the JSON key file** to version control
- ⚠️ **Store private key securely** in environment variables only

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. **Add environment variables** to your hosting platform
2. **Use the same service account** - no additional setup needed
3. **Verify calendar is still shared** with service account
4. **Test booking flow** on production domain

---

## Quick Setup Checklist

- [ ] Create service account in Google Cloud Console
- [ ] Download JSON key file
- [ ] Extract credentials to `.env.local`
- [ ] Share Google Calendar with service account email
- [ ] Test booking flow at http://localhost:3000/book
- [ ] Verify calendar event creation and invitations

Once completed, your booking system will work seamlessly without any user authentication! 🎉