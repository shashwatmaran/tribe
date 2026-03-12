# Frontend API Integration - Setup Guide

## Overview

The frontend has been updated to integrate with your Spring Boot backend API. This guide explains the new structure and how to configure and use it.

---

## Architecture Changes

### 1. **API Layer** (`src/lib/api.ts`)

A centralized API client that handles:
- Request/response serialization
- Authentication headers (Bearer tokens)
- Error handling with custom `APIError` class
- Request parameters and query strings

**Usage:**
```typescript
import { groupAPI, memberAPI, invoiceAPI, chargeAPI } from "@/lib/api";

// Make API calls
const group = await groupAPI.getById("group-123");
const members = await memberAPI.getByGroupId("group-123");
```

### 2. **Type Definitions** (`src/types/api.ts`)

Comprehensive TypeScript interfaces for all API responses and requests:
- `Group`, `Member`, `Invoice`, `Charge` (domain entities)
- `CreateGroupRequest`, `AddMemberRequest` (request DTOs)
- `InvoiceStatus`, `ChargeStatus`, `PaymentStatus` (enums)

### 3. **React Query Hooks** (`src/hooks/api.ts`)

Custom hooks for data fetching with automatic caching and invalidation:

```typescript
// Fetch data
const { data, isLoading, error } = useGroup(groupId);
const { data: members } = useGroupMembers(groupId);
const { data: invoices } = useInvoices(groupId);

// Mutations
const createGroup = useCreateGroup();
const addMember = useAddMember(groupId);
const retryCharge = useRetryCharge(groupId);

// Combined queries
const { group, members, charges, isLoading } = useGroupWithMembers(groupId);
```

### 4. **Error Boundary** (`src/components/ErrorBoundary.tsx`)

Application-level error boundary that catches React errors and displays a graceful fallback UI.

---

## Configuration

### Environment Variables

Create a `.env.local` file in the `frontend` directory:

```bash
# Required
VITE_API_URL=http://localhost:8080

# Optional: For authentication
# VITE_AUTH_TOKEN=your_jwt_token
```

The API client will automatically:
1. Use the `VITE_API_URL` to build request URLs
2. Add `Authorization: Bearer {token}` header if a token is in localStorage
3. Handle CORS (ensure your backend allows frontend origin)

---

## Updated Components

### GroupDashboard (`src/pages/GroupDashboard.tsx`)

**Changes:**
- ✅ Replaced hardcoded members array with `useGroupWithMembers()` hook
- ✅ Fetches real member data from `GET /api/groups/{groupId}/members`
- ✅ Maps member charges to payment status (PAID/FAILED/DUE)
- ✅ Added loading and error states with UI feedback
- ✅ Handles empty member list gracefully

**API Calls:**
- `GET /api/groups/{groupId}` - Fetch group details
- `GET /api/groups/{groupId}/members` - Fetch members
- `GET /api/groups/{groupId}/charges` - Fetch payment statuses

### BillingHistory (`src/pages/BillingHistory.tsx`)

**Changes:**
- ✅ Replaced hardcoded invoices with `useInvoices()` hook
- ✅ Fetches real invoice data from `GET /api/groups/{groupId}/invoices`
- ✅ Implements retry payment functionality via `useRetryCharge()`
- ✅ Formats currency and dates properly
- ✅ Added loading, error, and empty states
- ✅ Shows retry button for failed invoices with pending indicators

**API Calls:**
- `GET /api/groups/{groupId}/invoices` - Fetch invoices
- `POST /api/charges/{chargeId}/retry` - Retry failed payment

### Join (`src/pages/Join.tsx`)

**Changes:**
- ✅ Fetches actual group data from invite code
- ✅ Calculates member share amount from group data
- ✅ Email input to capture user email before joining
- ✅ Calls `POST /api/groups/{groupId}/members` to join group
- ✅ Added error handling and loading states
- ✅ Redirects to setup-payment after joining

**API Calls:**
- `GET /api/groups/{groupId}` - Fetch group details
- `POST /api/groups/{groupId}/members` - Add member to group

### BillingStatusContext (`src/context/BillingStatusContext.tsx`)

**Changes:**
- ✅ Now fetches real group and charge data via hooks
- ✅ Dynamically determines billing status from charges
- ✅ Calculates share amount from group total and member count
- ✅ Accepts `groupId` prop from PortalLayout
- ✅ Provides `isLoading` state for loading indicators

**Requires:**
- Pass `groupId` to `BillingStatusProvider` component

---

## Backend API Requirements

Your Spring Boot backend needs to implement these endpoints:

### Groups
- `GET /api/groups` - List all groups
- `GET /api/groups/{id}` - Get group by ID
- `POST /api/groups` - Create new group
- `POST /api/groups/{groupId}/invoices` - Generate invoice

### Members
- `GET /api/groups/{groupId}/members` - List members in a group
- `POST /api/groups/{groupId}/members` - Add member to group
- `DELETE /api/groups/{groupId}/members/{memberId}` - Remove member

### Invoices
- `GET /api/groups/{groupId}/invoices` - List invoices (supports pagination)
- `GET /api/groups/{groupId}/invoices/{id}` - Get invoice details
- `GET /api/groups/{groupId}/invoices/{id}/pdf` - Download invoice PDF

### Charges
- `GET /api/groups/{groupId}/charges` - List charges for a group
- `POST /api/charges/{chargeId}/retry` - Retry failed charge

---

## Data Flow Example

### User joins a group via invite link:

```
1. User clicks invite link: /join/:inviteCode

2. Join page fetches group data:
   GET /api/groups/{groupId}
   
3. User enters email and clicks "Join group"
   POST /api/groups/{groupId}/members { email: "user@email.com" }
   
4. On success, redirect to: /setup-payment

5. In PortalLayout, BillingStatusProvider fetches:
   GET /api/groups/{groupId}
   GET /api/groups/{groupId}/charges
   
6. BillingStatusContext calculates status and provides to all children
   
7. ObligationCard displays share amount and next billing date
```

---

## Error Handling

### API Layer (`src/lib/api.ts`)

```typescript
try {
  const data = await groupAPI.getById(id);
} catch (error) {
  if (error instanceof APIError) {
    console.log(`Error ${error.status}: ${error.message}`);
  }
}
```

### Component Level

All hooks return `error` that can be checked:

```typescript
const { data, error, isLoading } = useGroup(id);

if (error) {
  return <ErrorMessage error={error} />;
}
```

### Application Level

Wrap your app with `ErrorBoundary` in `main.tsx`:

```typescript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## Next Steps

### 1. **Start Backend Server**
```bash
cd backend
./gradlew bootRun
```

### 2. **Configure Frontend Environment**
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local to match your backend URL
```

### 3. **Start Frontend Dev Server**
```bash
npm run dev
```

### 4. **Test the Integration**
- Go to `http://localhost:5173` (or configured dev server)
- Check Network tab in browser DevTools to see API calls
- Verify responses match the TypeScript types

### 5. **Implement Missing Endpoints**

The following features still need backend endpoints or frontend implementation:

- ✅ Group dashboard with member statuses
- ✅ Billing history with invoice list and retry
- ✅ Join group flow
- ❌ Payment setup (SetupPayment page - needs Stripe/payment integration)
- ❌ Action required page (needs backend logic)
- ❌ Processing page with webhooks
- ❌ Authentication (login/signup)
- ❌ Invoice PDF download
- ❌ Real-time payment updates (WebSockets)

---

## Debugging Tips

### Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Make an action (join group, retry payment, etc.)
4. Look for API request and response
5. Verify status code and response body

### Enable API Logging
Update `src/lib/api.ts` to log requests:

```typescript
console.log(`→ ${method} ${finalUrl}`);
const response = await fetch(...);
console.log(`← ${response.status}`, response);
```

### React Query DevTools
Install and use React Query DevTools for debugging cache:

```bash
npm install @tanstack/react-query-devtools
```

```typescript
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// In App.tsx
<QueryClientProvider client={queryClient}>
  <ReactQueryDevtools />
  {/* ... */}
</QueryClientProvider>
```

---

## Common Issues

### 1. **CORS Error**
**Problem:** `No 'Access-Control-Allow-Origin' header`

**Solution:** Add CORS configuration to Spring Boot:
```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("*"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### 2. **404 Not Found**
**Problem:** API endpoints return 404

**Solution:** 
- Verify backend is running on the correct port
- Check `VITE_API_URL` is correct
- Verify endpoint paths match in backend

### 3. **Empty Data**
**Problem:** Components show no data even though API returns 200

**Solution:**
- Check backend response shape matches TypeScript types
- Use React Query DevTools to inspect cached data
- Check Network tab to see actual API response

---

## Performance Tips

### 1. **Query Stale Times**
Adjust how long data is cached before refetch:

```typescript
// Current: 5 minutes for groups
staleTime: 5 * 60 * 1000,

// For real-time data (payments), use shorter time:
staleTime: 30 * 1000, // 30 seconds
```

### 2. **Pagination**
For large invoice lists, implement pagination:

```typescript
const { data: invoices } = useInvoices(groupId, {
  page: 0,
  size: 10,
});
```

### 3. **Lazy Loading**
Don't load all member charges at once:

```typescript
// Only load charges for visible members
const visibleMembers = [...].slice(0, 10);
```

---

## Summary

Your frontend is now fully integrated with the API! The architecture is:

```
Components (GroupDashboard, BillingHistory, etc.)
    ↓ (use hooks)
React Query Hooks (useGroup, useInvoices, etc.)
    ↓ (call)
API Client (api.ts)
    ↓ (fetch)
Backend API (Spring Boot)
```

All data flows are properly typed, cached, and error-handled. Happy coding!
