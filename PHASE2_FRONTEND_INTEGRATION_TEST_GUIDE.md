# Phase 2 Frontend-Backend Integration Test Guide

This guide verifies that the frontend is integrated with the backend and real data flow works.

## 1. Prerequisites

- Docker Desktop is running.
- PostgreSQL and Redis are reachable.
- Backend builds successfully.
- Node dependencies are installed in the frontend.

## 2. Start Services

Run these in separate terminals.

### 2.1 Start infrastructure

```powershell
cd c:\projects\tribe\docker
docker-compose up -d
```

### 2.2 Start backend

```powershell
cd c:\projects\tribe\backend
.\gradlew.bat bootRun
```

Backend should be available at:
- http://localhost:9000

### 2.3 Start frontend

```powershell
cd c:\projects\tribe\frontend
npm run dev
```

Frontend should be available at:
- http://localhost:8081

## 3. Configure Frontend API URL

If you do not already have a frontend env file, create one:

```powershell
cd c:\projects\tribe\frontend
Copy-Item .env.example .env
```

Expected value:

```env
VITE_API_URL=http://localhost:9000
```

## 4. Seed Real Test Data via API

Run in PowerShell:

```powershell
$groupBody = @{
  platformGroupId = "netflix-family"
  totalAmount = 149900
  memberCount = 4
  currency = "USD"
} | ConvertTo-Json

$group = Invoke-RestMethod -Method Post -Uri "http://localhost:9000/api/groups" -ContentType "application/json" -Body $groupBody
$group | ConvertTo-Json -Depth 5
```

Save the group id:

```powershell
$groupId = $group.id
$groupId
```

Add members:

```powershell
$member1 = @{ email = "alice@example.com" } | ConvertTo-Json
$member2 = @{ email = "bob@example.com" } | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:9000/api/groups/$groupId/members" -ContentType "application/json" -Body $member1
Invoke-RestMethod -Method Post -Uri "http://localhost:9000/api/groups/$groupId/members" -ContentType "application/json" -Body $member2
```

Generate invoice:

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:9000/api/groups/$groupId/invoices"
```

Verify invoices and charges:

```powershell
$invoices = Invoke-RestMethod -Method Get -Uri "http://localhost:9000/api/groups/$groupId/invoices"
$invoices | ConvertTo-Json -Depth 5

$charges = Invoke-RestMethod -Method Get -Uri "http://localhost:9000/api/groups/$groupId/charges"
$charges | ConvertTo-Json -Depth 5
```

## 5. Validate Frontend Flows

Important: current Join route uses the route param as group id for lookup.

Open these pages in browser:

- Join page: `http://localhost:8081/join/<groupId>`
- Group dashboard: `http://localhost:8081/group/<groupId>`
- Billing history: `http://localhost:8081/group/<groupId>/billing`

Replace `<groupId>` with the actual UUID from API response.

### 5.1 Join flow checks

- Group information loads from backend.
- Enter email and click Join group.
- Member should be created in backend.

### 5.2 Dashboard checks

- Members list loads.
- No hardcoded data appears.
- Group name and amounts are based on backend values.

### 5.3 Billing history checks

- Invoice rows load from backend.
- Status badges match backend statuses.
- Retry button appears only when a failed charge exists for that invoice.

## 6. Smoke Test Endpoints Checklist

All should return successful responses:

- `POST /api/groups`
- `GET /api/groups/{groupId}`
- `GET /api/groups`
- `POST /api/groups/{groupId}/members`
- `GET /api/groups/{groupId}/members`
- `DELETE /api/groups/{groupId}/members/{memberId}`
- `POST /api/groups/{groupId}/invoices`
- `GET /api/groups/{groupId}/invoices`
- `GET /api/groups/{groupId}/invoices/{invoiceId}`
- `GET /api/groups/{groupId}/invoices/{invoiceId}/charges`
- `GET /api/groups/{groupId}/charges`
- `POST /api/charges/{chargeId}/retry`

## 7. Expected Current Limitations

- Invite code is currently treated as group UUID in the Join route.
- PDF invoice download endpoint is not implemented yet.
- Auth and ownership checks are not yet enabled.

## 8. Troubleshooting

### Frontend shows network errors

- Ensure backend is running on port 9000.
- Ensure frontend uses `VITE_API_URL=http://localhost:9000`.
- Restart `npm run dev` after env changes.

### Backend fails to start

- Ensure Docker Desktop is running.
- Ensure Postgres and Redis are up in docker-compose.
- Re-check backend logs for datasource connection errors.

### Join page says group not found

- Use a valid UUID group id in `/join/<groupId>`.
- Verify group exists using `GET /api/groups/{groupId}`.
