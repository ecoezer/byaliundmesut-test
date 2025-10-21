# byAliundMesut 🚕

A modern food delivery website for byAliundMesut with WhatsApp ordering integration.

## Features

- 📱 Responsive design optimized for mobile and desktop
- 🍕 Complete menu with pizzas, döner, burgers, pasta, and more
- 🛒 Shopping cart with item customization
- 📞 WhatsApp integration for order placement
- ⏰ Real-time opening hours display
- 🚚 Delivery zone management with minimum order requirements
- 🎨 Modern UI with smooth animations
- 🔔 Custom notification sounds for order monitoring
- 📊 Admin dashboard for order management
- 📈 Analytics dashboard with order insights

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Analytics**: Firebase Analytics
- **Icons**: Lucide React

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd byaliundmesut
npm install
```

### 2. Firebase Configuration

Create a `.env` file in the project root with your Firebase credentials:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Firebase Setup

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Firebase Storage
4. Enable Firebase Analytics (optional)
5. Get your configuration from Project Settings → General → Your apps → Web app
6. Add the configuration values to your `.env` file

### 4. Firebase Storage CORS Configuration

To enable sound file uploads from your domain, you need to configure CORS for Firebase Storage:

#### Step 1: Access Google Cloud Console
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Select your Firebase project from the project dropdown (top-left)
3. Click the Cloud Shell icon (>_) in the top-right corner
4. Wait for Cloud Shell to initialize

#### Step 2: Upload and Apply CORS Configuration
1. In Cloud Shell, click "Upload file" or the three-dot menu
2. Upload the `cors.json` file from your project root
3. Run the following command:
```bash
gsutil cors set cors.json gs://YOUR_PROJECT_ID.firebasestorage.app
```
4. Replace `YOUR_PROJECT_ID` with your actual Firebase project ID
5. Wait for the confirmation message

#### Alternative: Using Local gcloud CLI
If you have gcloud CLI installed locally:
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gsutil cors set cors.json gs://YOUR_PROJECT_ID.firebasestorage.app
```

### 5. Firebase Storage Security Rules

Configure storage rules in Firebase Console:

1. Go to Firebase Console → Storage → Rules
2. Replace the existing rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /notification-sounds/{fileName} {
      allow read: if true;
      allow write: if request.resource.size < 1 * 1024 * 1024
                   && request.resource.contentType.matches('audio/.*');
    }
  }
}
```

3. Click "Publish" to apply the rules

### 6. Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 7. Production Build

```bash
npm run build
npm run preview
```

## Menu Management

The menu is defined in `src/data/menuItems.ts` and includes:

- **Spezialitäten**: Döner dishes and specialties
- **Pizza**: Various sizes with customizable toppings
- **Hamburger**: Different patty sizes and toppings
- **Pasta & Al Forno**: Pasta dishes with sauce selection
- **Schnitzel**: Schnitzel variations with sides
- **Finger Food**: Snacks and sides
- **Salate**: Salads with dressing options
- **Desserts**: Sweet treats
- **Getränke**: Beverages with size options
- **Dips**: Various sauces and dips

## Admin Features

### Admin Dashboard
- View all orders in real-time
- Filter orders by status
- Update order status
- View customer details

### Order Monitor
- Real-time order notifications
- Custom notification sounds
- Auto-refresh functionality
- Sound upload for custom alerts

### Analytics Dashboard
- Daily order statistics
- Revenue tracking
- Popular items analysis
- Time-based insights

## Delivery Zones

The application supports multiple delivery zones with individual:
- Minimum order requirements
- Delivery fees
- Zone-specific validation

## Opening Hours

- **Monday, Wednesday, Thursday**: 12:00 - 21:30
- **Friday, Saturday, Sunday & Holidays**: 12:00 - 21:30
- **Tuesday**: Closed (Ruhetag)

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Sound Upload Issues

If you're experiencing issues uploading custom notification sounds:

1. Verify CORS is configured correctly in Google Cloud Console
2. Check Firebase Storage Rules are properly set
3. Ensure the file is in WAV format and under 1MB
4. Check browser console for specific error messages

### Firebase Connection Issues

If Firebase is not connecting:

1. Verify all environment variables are set correctly in `.env`
2. Check that Firebase project is active and billing is enabled
3. Ensure Firestore and Storage are enabled in Firebase Console
4. Check browser console for specific Firebase errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software for by Ali und Mesut.
