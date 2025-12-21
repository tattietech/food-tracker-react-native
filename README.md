# Food Tracker - React Native

A mobile app for tracking food expiry dates and reducing household waste.

## Project Status

**Active and under development**

Core functionality is implemented and working  
UI/UX redesign in progress - the app works but needs visual polish  
Backend migration planned - currently using Appwrite, will create custom backend later

---

### Current Features

- **Household Management** – Create and manage shared households. Invite family members or roommates to collaborate on tracking food items together
-  **Food Spaces** – Organize items by storage location (Fridge, Freezer, Pantry, etc.)
-  **Expiry Tracking** – Add items with expiry dates and monitor when they're about to expire
-  **Push Notifications** – Get timely reminders before food expires (iOS via APNs)
-  **Barcode Scanner** – Scan product barcodes to automatically populate item names using OpenFoodFacts API
-  **OCR Date Recognition** – Use your camera to scan and automatically recognize expiry dates printed on packages
-  **User Authentication** – Secure email/password authentication with Appwrite
-  **Item Management** – Add, edit, and delete food items with intuitive swipe gestures
-  **Cross-Platform** – Built with React Native for both iOS and Android

---

## Tech Stack

### Frontend
- **React Native** with Expo SDK ~51.0
- **Expo Router** for file-based navigation
- **TypeScript** for type safety
- **NativeWind** (Tailwind CSS) for styling
- **Context API** (GlobalProvider) for state management
- Custom hooks (`useAppwrite`) for data fetching

### Backend
- **Appwrite** (https://appwrite.io/) - Currently used for:
  - Database (Collections for Users, Items, Households, Food Spaces)
  - Authentication (Email/Password)
  - Push Notifications
  - Serverless Functions

  _Note: Planning to migrate to a custom backend solution in the future_

### Key Libraries & Tools
- **react-native-vision-camera** - Camera functionality
- **react-native-vision-camera-text-recognition** - OCR for expiry dates
- **react-native-gesture-handler** & **react-native-reanimated** - Smooth animations and gestures
- **react-native-toast-message** - User feedback notifications
- **react-native-vector-icons** - Icon library
- **OpenFoodFacts API** - Product information from barcodes

---

## App Structure

```
app/
├── (auth)/          # Authentication screens (sign-in, sign-up)
├── (tabs)/          # Main app tabs (home, add, settings)
├── (settings)/      # Settings screens
└── _layout.tsx      # Root layout

components/          # Reusable UI components
├── ItemForm.tsx     # Form for adding/editing items
├── Scanner.tsx      # Camera scanner with OCR
├── BarCodeScanner.tsx  # Barcode scanning
└── ...

lib/
├── appwrite.ts      # Appwrite SDK setup and API calls
├── useAppwrite.ts   # Custom hook for Appwrite queries
└── ...

interfaces/          # TypeScript interfaces
context/             # React Context providers
```

---

## Roadmap

- [ ] Complete UI/UX redesign for better visual appeal - **In progress**
- [ ] Develop custom backend to replace Appwrite
- [ ] Add recipe suggestions based on expiring items
- [ ] Implement shopping list feature
- [ ] Add statistics and waste reduction metrics
- [ ] Support for dark mode - **In progress**
- [ ] Android push notification support
- [ ] Multi-language support

---

## Author

**tattietech**

- GitHub: [@tattietech](https://github.com/tattietech)
