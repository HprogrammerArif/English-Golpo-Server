# Complete Guide — Running, Using, and Implementing English Golpo

This guide walks you through starting the services, testing the APIs, and connecting the React Native frontend to your new NestJS backend.

---

## 1. How to Run the Project

### A. The Backend (NestJS + PostgreSQL + Redis)
The backend is currently **running** in the background of your IDE. In the future, you can control the services using these commands:

1. **Start the Database and Redis (Docker)**
   Run this from the `backend-en-golpo-nest/` folder to spin up PostgreSQL (running on port `5433` to prevent conflicts) and Redis:
   ```bash
   docker-compose up -d
   ```

2. **Run Migrations & Seed Data**
   If you reset the database or make schema changes:
   ```bash
   # Run migrations
   npx prisma migrate dev --name init
   # Seed database with sample stories and admin user
   npx ts-node prisma/seed.ts
   ```

3. **Start the NestJS API Server**
   Start in watch mode (auto-reloads on file edits):
   ```bash
   npm run start:dev
   ```
   *Your server will run at: `http://localhost:3000/api`*

---

### B. The Frontend (React Native + Expo)
To run the Expo app on your phone or emulator:

1. **Install Dependencies**
   Navigate to the `frontend-en-golpo-reactnative/` directory and install the packages:
   ```bash
   cd ../frontend-en-golpo-reactnative
   npm install
   ```

2. **Configure environment (.env)**
   We created a `.env` file for you in the frontend. Depending on where you test:
   * **iOS Simulator**: Keep `EXPO_PUBLIC_API_URL=http://localhost:3000`
   * **Android Emulator**: Change it to `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000`
   * **Physical Phone (Expo Go)**: Find your computer's local IP address (e.g. `192.168.1.100`) and set `EXPO_PUBLIC_API_URL=http://192.168.1.100:3000`

3. **Start the Expo Dev Server**
   ```bash
   npm run start
   ```
   *Press `i` for iOS Simulator, `a` for Android Emulator, or scan the QR code using your phone's camera (iOS) or Expo Go App (Android).*

---

## 2. How to Use & Test the API (Swagger UI)

Because the NestJS server is running in the background, you can test the APIs immediately in your browser:

1. Open your browser and navigate to: **`http://localhost:3000/api/docs`**
2. You will see the **Swagger UI** containing all available endpoints categorized by domain.

### Step-by-Step Test Walkthrough

#### Step A: Register & Login (Auth)
1. In Swagger, find the `POST /api/auth/login/phone` endpoint.
2. Click **Try it out** and enter a mock phone number (e.g. `"+8801712345678"`). Click **Execute**.
3. It will generate a mock OTP token. Since we enabled `OTP_MOCK_ENABLED=true` in `.env`, the verification code is **`1234`**.
4. Go to `POST /api/auth/login/phone/verify` endpoint. Click **Try it out** and send:
   ```json
   {
     "phone": "+8801712345678",
     "code": "1234"
   }
   ```
5. Click **Execute**. The backend will return a JWT `access_token` and user details.
6. Copy the value of the `access_token` (do not copy the quotes).
7. Scroll to the top of Swagger, click the green **Authorize** button, paste your token, and click **Authorize**. You are now authenticated!

#### Step B: Fetch Stories
1. Find `GET /api/stories` (under `stories`).
2. Click **Try it out** and click **Execute**.
3. You will see the 5 seeded stories (e.g. *The Red Hen*, *Job Interview in English*, *IELTS Academic Writing Task 2*) with their title translations, illustrated placeholder URLs, levels, and learning path values.

---

## 3. How to Implement and Connect the Frontend

The frontend uses **Redux Toolkit Query (RTK Query)** to handle data fetching. Here is how you can connect your screens to the new backend endpoints.

### Step A: Define the API Endpoints in Redux
In `frontend-en-golpo-reactnative/redux/api/baseApi.ts`, we can inject endpoints using `baseApi.injectEndpoints`.

For example, to implement the **Story API**, create a new file `redux/api/storyApi.ts`:
```typescript
import { baseApi } from "./baseApi";

export const storyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStories: builder.query<any[], { path?: string; level?: number }>({
      query: (params) => ({
        url: "/stories",
        params,
      }),
    }),
    getStoryById: builder.query<any, string>({
      query: (id) => `/stories/${id}`,
    }),
  }),
});

export const { useGetStoriesQuery, useGetStoryByIdQuery } = storyApi;
```

### Step B: Wire the React Native Component
Now, open the **Explore Tab** (`src/app/(app)/(tabs)/explore.tsx`) and use the generated hook:

```tsx
import React from 'react';
import { View, Text, FlatList, ActivityIndicator, Image } from 'react-native';
import { useGetStoriesQuery } from '../../../../redux/api/storyApi';

export default function ExploreScreen() {
  const { data: stories, error, isLoading } = useGetStoriesQuery({});

  if (isLoading) return <ActivityIndicator size="large" className="mt-10" />;
  if (error) return <Text className="text-red-500 text-center mt-10">Failed to load stories</Text>;

  return (
    <FlatList
      data={stories}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View className="p-4 bg-white m-2 rounded-xl shadow">
          <Image source={{ uri: item.illustrationUrl }} className="w-full h-40 rounded-lg" />
          <Text className="text-lg font-bold mt-2">{item.title} ({item.titleBn})</Text>
          <Text className="text-gray-500">{item.description}</Text>
        </View>
      )}
    />
  );
}
```
Using this approach, you can wire up the Home Tab (XP, Streaks), Quiz screens, and Profile stats easily using the structured APIs!
