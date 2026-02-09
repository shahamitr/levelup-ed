# API Quota Issue - Troubleshooting Guide

## Current Problem
Your API key `AIzaSyBG61jY8vRg3jK2ECnMfi0wuUxdEzNvZh0` is showing:
```
Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests
Limit: 0
```

This means the API key has **zero quota** allocated for free tier requests.

## Why This Happens
1. **New API Key**: The key might not have free tier enabled
2. **Quota Exhausted**: You may have exceeded daily/monthly limits
3. **Billing Required**: The project might require billing to be enabled
4. **Regional Restrictions**: The API might not be available in your region

## Solution Steps

### Option 1: Generate a Fresh API Key (Recommended)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Select "Create API key in new project" (or use existing)
5. Copy the new key
6. Replace in `backend/.env`: `GEMINI_API_KEY="your-new-key"`

### Option 2: Check Quota Limits
1. Visit [Google Cloud Console](https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas)
2. Select your project
3. Look for "Generative Language API" quotas
4. Check if free tier is enabled:
   - `generate_content_free_tier_requests` should be > 0
   - Typical free tier: 15 requests/minute, 1,500 requests/day

### Option 3: Enable Billing (If Free Tier Exhausted)
1. Go to [Google Cloud Billing](https://console.cloud.google.com/billing)
2. Enable billing for your project
3. This gives you access to paid tier with higher limits
4. **Note**: You'll be charged for usage beyond free tier

### Option 4: Use Alternative Free Models
Some models have better free tier availability:
- `gemini-1.5-flash-8b` (ultra-light, better quota)
- `gemini-pro` (legacy, might have quota)
- `gemini-flash-latest` (latest flash version)

## Current Configuration
```env
GEMINI_API_KEY="AIzaSyBG61jY8vRg3jK2ECnMfi0wuUxdEzNvZh0"
GEMINI_MODEL="gemini-1.5-pro"
```

## Testing Your API Key
Run this command to test:
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY"
```

## Free Tier Limits (as of Feb 2026)
- **Requests**: 15 per minute, 1,500 per day
- **Input Tokens**: 1 million per day
- **Output Tokens**: 32,000 per day

## What to Do Now
1. **Get a new API key** from Google AI Studio
2. Update `backend/.env` with the new key
3. Restart the backend: The server will auto-reload
4. Test in the app

## Alternative: Use Mock API (For Development)
If you can't get quota working, I can set up a mock AI service that returns sample responses for testing the UI.
