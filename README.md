# 🍎 Food Tracker - React Native

A mobile app for tracking food expiry dates and reducing household waste.  
Designed to help you manage your kitchen more efficiently and never let food go to waste again.

## 📋 Project Status

**Active and under development** 🚧

✅ Core functionality is implemented and working  
🎨 UI/UX redesign in progress - the app works but needs visual polish  
🔧 Backend migration planned - currently using Appwrite, will create custom backend later

---

## ✨ Features

### Current Features

- 📦 **Household Management** – Create and manage shared households. Invite family members or roommates to collaborate on tracking food items together
- 🗂️ **Food Spaces** – Organize items by storage location (Fridge, Freezer, Pantry, etc.)
- ⏰ **Expiry Tracking** – Add items with expiry dates and monitor when they're about to expire
- 🔔 **Push Notifications** – Get timely reminders before food expires (iOS via APNs)
- 📸 **Barcode Scanner** – Scan product barcodes to automatically populate item names using OpenFoodFacts API
- 🔍 **OCR Date Recognition** – Use your camera to scan and automatically recognize expiry dates printed on packages
- 🔐 **User Authentication** – Secure email/password authentication with Appwrite
- ✏️ **Item Management** – Add, edit, and delete food items with intuitive swipe gestures
- 📱 **Cross-Platform** – Built with React Native for both iOS and Android

---

## 🛠️ Tech Stack

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

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS: Xcode and CocoaPods
- Android: Android Studio

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tattietech/food-tracker-react-native.git
   cd food-tracker-react-native
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup** (macOS only)
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Configure Appwrite**
   - Update the configuration in `lib/appwrite.ts` with your Appwrite credentials
   - Set up your Appwrite instance with the required collections and authentication

5. **Run the app**
   ```bash
   # Development mode
   npm start

   # iOS
   npm run ios

   # Android
   npm run android
   ```

---

## 📱 App Structure

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

## 🎯 Roadmap

- [ ] Complete UI/UX redesign for better visual appeal
- [ ] Develop custom backend to replace Appwrite
- [ ] Add recipe suggestions based on expiring items
- [ ] Implement shopping list feature
- [ ] Add statistics and waste reduction metrics
- [ ] Support for dark mode
- [ ] Android push notification support
- [ ] Multi-language support

---

## 🤝 Contributing

This is a personal project currently under active development. Contributions, issues, and feature requests are welcome!

---

## 📄 License

This project is for personal/educational use.

---

## 👤 Author

**tattietech**

- GitHub: [@tattietech](https://github.com/tattietech)

---

## 🙏 Acknowledgments

- [Appwrite](https://appwrite.io/) - Backend as a Service
- [OpenFoodFacts](https://world.openfoodfacts.org/) - Product database API
- [Expo](https://expo.dev/) - React Native framework 
