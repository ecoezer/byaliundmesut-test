# Email Notification Setup Instructions

## Supabase Environment Variables Configuration

Follow these steps to configure the email notification system:

### 1. Access Supabase Dashboard
1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project (the one used for byAliundMesut)

### 2. Navigate to Edge Functions Settings
1. In the left sidebar, click on **"Edge Functions"**
2. Click on **"Settings"** or look for **"Environment Variables"** section
3. You should see a section for managing environment variables

### 3. Add Environment Variables

Add these two environment variables:

#### Variable 1: RESEND_API_KEY
- **Key**: `RESEND_API_KEY`
- **Value**: `re_xxxxxxxxxx` (your actual Resend API key from Step 2)
- **Description**: API key for Resend email service

#### Variable 2: RESTAURANT_EMAIL
- **Key**: `RESTAURANT_EMAIL`
- **Value**: `your-restaurant-email@domain.com` (replace with your actual email)
- **Description**: Email address where order notifications will be sent

### 4. Save and Deploy
1. Click **"Save"** or **"Update"** after adding both variables
2. The Edge Function will automatically use these variables
3. No redeployment needed - changes take effect immediately

### 5. Test the System
1. Place a test order through your website
2. Check if you receive the email notification
3. Verify the email contains all order details correctly

## Recommended Email Addresses

Use one of these email formats:
- `orders@byaliundmesut.de` (if you own the domain)
- `info@byaliundmesut.de`
- Your personal email: `your-name@gmail.com`
- Business email: `restaurant@your-domain.com`

## Troubleshooting

If emails aren't being sent:
1. Check that both environment variables are set correctly
2. Verify your Resend API key is valid
3. Check Resend dashboard for any error logs
4. Ensure the restaurant email address is valid

## Email Features

Once configured, you'll receive:
- ✅ Professional HTML formatted emails
- ✅ Complete order details with item numbers
- ✅ Customer contact information
- ✅ Delivery/pickup preferences
- ✅ Order totals and pricing
- ✅ Timestamp of when order was placed
- ✅ Mobile-responsive email design

The email system works alongside WhatsApp - customers still get redirected to WhatsApp, but you also get an email copy for your records.