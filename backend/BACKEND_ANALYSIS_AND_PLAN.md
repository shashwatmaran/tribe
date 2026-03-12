# TRIBE Backend Analysis & Completion Plan

## 🎯 What is Tribe? (Project Understanding)

**Tribe** is a **shared subscription management & group billing platform**. 

### The Problem It Solves
When a group shares a subscription (Netflix at $23.99/month for 4 people), someone has to:
- Calculate splits ($6 each)
- Track who paid and who didn't
- Handle payment failures
- Send reminders
- Manage refunds/adjustments

**Tribe automates all of this.**

### How It Works
```
1. Group Administrator creates Netflix group (4 members, $23.99/month)
2. Members join via invite link
3. Each month, system creates invoice ($6 per member)
4. Members pay their share via payment processor
5. Failed payments trigger automatic retry flows
6. Admin gets visibility into payment status
```

### Users & Roles
- **Group Admin** - Creates group, manages members, views billing dashboard
- **Group Member** - Pays their share, views payment status, joins groups
- **System** - Generates invoices, processes payments, sends reminders

---

## 📊 Current Backend Analysis

### What's Built ✅

**Controllers (2):**
- `GroupController` - Create, list, get groups + generate invoice
- `MemberController` - Add members to group

**Services (3):**
- `GroupService` - Group creation & retrieval
- `MemberService` - Add member with validation
- `BillingService` - Invoice generation & charge splitting

**Database Schema:**
```
groups
├── id (UUID)
├── platformGroupId (e.g., "grp_netflix_family")
├── totalAmount (in paise: 2399 = $23.99)
├── memberCount (max count)
├── currency (USD, INR)
├── status (ACTIVE/INACTIVE)
└── createdAt

members
├── id (UUID)
├── groupId (FK)
├── email
├── status (ACTIVE/FAILED)
└── joinedAt

invoices
├── id (UUID)
├── groupId (FK)
├── totalAmount
├── billingDate
├── status (PENDING/PAID/FAILED)
└── createdAt

charges
├── id (UUID)
├── invoiceId (FK)
├── memberId (FK)
├── amount (member's share)
├── status (PENDING/PAID/FAILED)
└── createdAt
```

**Repositories:**
- GroupRepository + custom methods
- MemberRepository + findByGroupId()
- InvoiceRepository + findByGroupId()
- ChargeRepository + findByInvoiceId()

**Infrastructure:**
- PostgreSQL database ✅
- Redis configured but unused ⚠️
- Quartz scheduler configured but unused ⚠️
- Spring Boot 4.0.3 + Java 21 ✅

---

## ❌ What's Missing (Gap Analysis)

### 1. Missing Endpoints
Your frontend expects these, but they don't exist:

```
❌ GET /api/groups/{groupId}/members           (frontend calls this)
❌ DELETE /api/groups/{groupId}/members/{id}   (remove member)
❌ GET /api/groups/{groupId}/invoices          (list invoices)
❌ GET /api/groups/{groupId}/invoices/{id}     (invoice details)
❌ GET /api/groups/{groupId}/charges           (list charges by group)
❌ POST /api/charges/{chargeId}/retry          (retry payment)
❌ GET /api/groups/{groupId}/invoices/{id}/pdf (download invoice)
```

**Impact:** Frontend will fail with 404 errors when trying to fetch member lists, invoices, etc.

### 2. Missing Core Features
- ❌ **CORS Configuration** - Frontend blocked from calling backend
- ❌ **Error Handling** - No exception handlers, cryptic error messages
- ❌ **Response DTOs** - Controllers return entities directly (exposes internals)
- ❌ **Validation** - Limited input validation
- ❌ **Authentication** - No JWT, OAuth, or user management
- ❌ **Authorization** - No access control (anyone can do anything)
- ❌ **PDF Generation** - No invoice PDFs

### 3. Business Logic Gaps
- ❌ **Automatic Invoice Scheduling** - No monthly invoice generation
- ❌ **Payment Processing** - No Stripe/Razorpay integration
- ❌ **Payment Webhooks** - No webhook handlers for payment updates
- ❌ **Status Reconciliation** - Can't update invoice status when payment received
- ❌ **Retry Logic** - Can't manually retry failed payments
- ❌ **Notifications** - No email reminders for pending payments

### 4. Code Quality Issues
- ⚠️ **MemberService has compilation errors** - Missing imports for GroupRepository, List
- ⚠️ **String status values** - Using "PENDING" strings instead of Enums
- ⚠️ **No custom exceptions** - Using generic RuntimeException
- ⚠️ **No logging** - Hard to debug
- ⚠️ **No tests** - No unit or integration tests

---

## 🚀 Complete Implementation Plan (11 Phases)

### Phase 1: Fix Bugs & Code Foundation (2-3 hours)
**Goal:** Make backend compile and run, establish patterns

**Tasks:**
1. ✅ Fix MemberService compilation errors (missing imports)
2. ✅ Create custom exception classes
3. ✅ Create error response DTOs
4. ✅ Create global exception handler
5. ✅ Use Enums for all status fields
6. ✅ Test existing endpoints work

**Deliverables:**
```
src/main/java/com/tribe/backend/
├── exception/
│   ├── ResourceNotFoundException.java
│   ├── ValidationException.java
│   ├── GlobalExceptionHandler.java
│   └── ApiErrorResponse.java
├── dto/response/
│   └── ApiResponse.java
```

**Estimated:** ~200 lines of code

---

### Phase 2: CORS & Security Foundation (1 hour)
**Goal:** Allow frontend to communicate with backend

**Tasks:**
1. ✅ Add CORS configuration
2. ✅ Set up security filter chain
3. ✅ Add HTTPS headers

**Deliverables:**
```
src/main/java/com/tribe/backend/config/
├── CorsConfig.java           (allow localhost:5173)
└── SecurityConfig.java       (WebSecurityConfigurerAdapter)
```

**Estimated:** ~100 lines of code

**Frontend Unblock:** Yes! After this, frontend can talk to backend.

---

### Phase 3: Complete All API Endpoints (4-5 hours)
**Goal:** Implement 7 missing endpoints

**Tasks:**
1. ✅ GET /api/groups/{groupId}/members
2. ✅ DELETE /api/groups/{groupId}/members/{memberId}
3. ✅ GET /api/groups/{groupId}/invoices
4. ✅ GET /api/groups/{groupId}/invoices/{id}
5. ✅ GET /api/groups/{groupId}/charges
6. ✅ POST /api/charges/{chargeId}/retry
7. ✅ Add pagination support

**Files to Create/Modify:**
```
src/main/java/com/tribe/backend/
├── controller/
│   ├── GroupController.java        (expand with member endpoints)
│   ├── InvoiceController.java      (new)
│   └── ChargeController.java       (new)
├── service/
│   ├── InvoiceService.java         (new)
│   └── ChargeService.java          (new)
└── dto/response/
    ├── GroupDetailsResponse.java   (with members list)
    ├── InvoiceDetailsResponse.java (with charges list)
    ├── InvoiceResponse.java
    └── ChargeResponse.java
```

**Key Implementation Details:**

```java
// Example: GET /api/groups/{groupId}/members
@RestController
@RequestMapping("/api/groups")
public class GroupController {
    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<MemberResponse>> getGroupMembers(
        @PathVariable UUID groupId
    ) {
        List<Member> members = memberService.getGroupMembers(groupId);
        List<MemberResponse> response = members.stream()
            .map(m -> new MemberResponse(m))
            .toList();
        return ResponseEntity.ok(response);
    }
}
```

**Estimated:** ~600 lines of code

**Frontend Unblock:** Yes! GroupDashboard, BillingHistory will show real data.

---

### Phase 4: Response DTOs & Mappers (2 hours)
**Goal:** Consistent, clean API responses

**Tasks:**
1. ✅ Create response DTO for each entity
2. ✅ Map entities to DTOs in controllers
3. ✅ Add nested object support
4. ✅ Use ModelMapper or MapStruct

**Create:**
```
src/main/java/com/tribe/backend/
├── dto/response/
│   ├── GroupResponse.java
│   ├── MemberResponse.java
│   ├── InvoiceResponse.java
│   ├── ChargeResponse.java
│   └── PageResponse.java           (for pagination)
└── mapper/
    └── DtoMapper.java              (helper class)
```

**Example Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "platformGroupId": "grp_netflix_family",
  "totalAmount": 2399,
  "currency": "USD",
  "status": "ACTIVE",
  "memberCount": 4,
  "createdAt": "2026-03-12T10:00:00Z"
}
```

**Estimated:** ~300 lines of code

---

### Phase 5: Advanced Business Logic (3 hours)
**Goal:** Implement complex validation and business rules

**Tasks:**
1. ✅ Email uniqueness per group validator
2. ✅ Member limit validation
3. ✅ Invoice status validation
4. ✅ Charge retry validation (only FAILED charges)
5. ✅ Partial refund logic
6. ✅ Transaction management (@Transactional)

**Create:**
```
src/main/java/com/tribe/backend/
├── validator/
│   ├── MemberValidator.java
│   ├── InvoiceValidator.java
│   └── ChargeValidator.java
└── service/
    └── ChargeService.java          (update for retry logic)
```

**Key Rules:**
```java
// Only retry if previous charge failed
if (!charge.getStatus().equals(ChargeStatus.FAILED)) {
    throw new ValidationException("Only failed charges can be retried");
}

// Email must be unique per group
if (memberService.emailExistsInGroup(groupId, email)) {
    throw new ValidationException("Email already in group");
}

// Can't exceed member limit
if (members.size() >= group.getMemberCount()) {
    throw new ValidationException("Group member limit reached");
}
```

**Estimated:** ~400 lines of code

---

### Phase 6: Scheduled Jobs (Quartz) (2-3 hours)
**Goal:** Automated invoice generation and reminders

**Tasks:**
1. ✅ Configure Quartz scheduler
2. ✅ Create job: GenerateMonthlyInvoices (runs on 1st of month)
3. ✅ Create job: SendPaymentReminders (runs daily, sends reminder)
4. ✅ Create job: RetryFailedPayments (runs every 3 days)
5. ✅ Store job history in database

**Create:**
```
src/main/java/com/tribe/backend/
├── config/
│   └── QuartzConfig.java
├── scheduler/
│   ├── InvoiceGenerationJob.java
│   ├── PaymentReminderJob.java
│   ├── PaymentRetryJob.java
│   └── AbstractScheduledJob.java
└── entity/
    └── JobHistory.java             (track execution)
```

**Example Job:**
```java
@Component
public class InvoiceGenerationJob implements Job {
    @Override
    public void execute(JobExecutionContext context) 
            throws JobExecutionException {
        List<Group> activeGroups = groupService.getAllActive();
        for (Group group : activeGroups) {
            billingService.generateInvoice(group.getId());
        }
    }
}
```

**Configuration:**
```
Trigger: "0 0 1 * * ?" (1st day of month at midnight)
Job frequency: Monthly
Retry on failure: Yes
```

**Estimated:** ~350 lines of code

---

### Phase 7: Caching Layer (Redis) (2 hours)
**Goal:** Improve performance with caching

**Tasks:**
1. ✅ Configure Spring Cache with Redis
2. ✅ Cache group queries (@Cacheable)
3. ✅ Cache member lists
4. ✅ Clear cache on writes (@CacheEvict)
5. ✅ Add cache metrics endpoint

**Create:**
```
src/main/java/com/tribe/backend/
├── config/
│   └── CacheConfig.java
└── service/
    └── CacheService.java
```

**Example:**
```java
@Service
public class GroupService {
    @Cacheable(value = "groups", key = "#id")
    public Group getGroup(UUID id) {
        return groupRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Group not found"));
    }
    
    @CacheEvict(value = "groups", key = "#group.id")
    public void updateGroup(Group group) {
        groupRepository.save(group);
    }
}
```

**Benefits:**
- 90% reduction in DB queries for frequently accessed groups
- Sub-millisecond response times

**Estimated:** ~200 lines of code

---

### Phase 8: PDF Invoice Generation (2-3 hours)
**Goal:** Generate downloadable invoices as PDFs

**Tasks:**
1. ✅ Add PDF library (iText 7 or Apache PDFBox)
2. ✅ Create invoice template (HTML or Thymeleaf)
3. ✅ Implement PDF generation service
4. ✅ Endpoint: GET /api/groups/{gId}/invoices/{iId}/pdf
5. ✅ Email PDF to members

**Create:**
```
src/main/java/com/tribe/backend/
├── service/
│   └── PdfGenerationService.java
├── template/
│   └── invoice-template.html       (Thymeleaf)
└── resource/
    └── invoice-template.css        (styling)
```

**Example PDF Content:**
```
INVOICE #INV-2026-001
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Group:       Family Netflix Plan
Amount:      $6.00
Date:        March 1, 2026
Due:         March 15, 2026
Status:      PENDING

Generated: Tribe Billing System
```

**Estimated:** ~300 lines of code

---

### Phase 9: JWT Authentication (3-4 hours)
**Goal:** Secure API with JWT tokens

**Tasks:**
1. ✅ Create User entity
2. ✅ Create JWT token provider
3. ✅ Create JWT authentication filter
4. ✅ Add login/signup endpoints
5. ✅ Add @PreAuthorize to endpoints
6. ✅ Password encryption (BCrypt)

**Create:**
```
src/main/java/com/tribe/backend/
├── entity/
│   └── User.java                   (email, password, roles)
├── dto/
│   ├── LoginRequest.java
│   ├── SignupRequest.java
│   └── LoginResponse.java          (token, user info)
├── controller/
│   └── AuthController.java         (POST /auth/login, /auth/signup)
├── service/
│   ├── AuthService.java
│   └── UserService.java
├── security/
│   ├── JwtTokenProvider.java       (generate, validate token)
│   ├── JwtAuthenticationFilter.java (intercept requests)
│   └── CustomUserDetailsService.java
└── config/
    └── SecurityConfig.java         (update)
```

**Endpoints:**
```
POST /api/auth/signup
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
→ Response: { token, userId, email }

POST /api/auth/login
{
  "email": "user@example.com",
  "password": "securePassword123"
}
→ Response: { token, userId, expiresIn }
```

**Protected Endpoints:**
```java
@GetMapping("/{groupId}")
@PreAuthorize("hasRole('USER')")
public ResponseEntity<GroupResponse> getGroup(@PathVariable UUID groupId) {
    // Only authenticated users
}
```

**Estimated:** ~500 lines of code

**Frontend Impact:** Need to add login page, store token in localStorage, send

 with each request (already done in api.ts!)

---

### Phase 10: Payment Integration (Stripe) (4-5 hours)
**Goal:** Actually process payments

**Tasks:**
1. ✅ Add Stripe/Razorpay SDK
2. ✅ Create payment intent
3. ✅ Implement webhook handler
4. ✅ Update charge status on payment
5. ✅ Handle payment failures
6. ✅ Support retry payments

**Create:**
```
src/main/java/com/tribe/backend/
├── service/
│   ├── PaymentService.java         (orchestrates)
│   └── StripePaymentProvider.java  (Stripe implementation)
├── controller/
│   └── WebhookController.java      (receive Stripe events)
├── entity/
│   ├── PaymentIntent.java          (tracks payment requests)
│   └── PaymentMethod.java          (saved cards)
├── dto/
│   ├── PaymentIntentRequest.java
│   ├── PaymentWebhookEvent.java
│   └── PaymentResponse.java
└── config/
    └── StripeConfig.java           (API key)
```

**Flow:**
```
1. Member clicks "Pay" for charge
2. Frontend calls: POST /api/charges/{id}/pay
3. Backend creates Stripe PaymentIntent
4. Returns clientSecret to frontend
5. Frontend shows Stripe card element
6. Member enters card details and pays
7. Stripe sends webhook: charge.succeeded
8. Backend updates charge status: PAID
9. Frontend gets real-time notification
10. Invoice status updates to PAID
```

**Webhook Handler:**
```java
@PostMapping("/webhook")
public ResponseEntity<String> handleStripeWebhook(
    @RequestBody String payload,
    @RequestHeader("Stripe-Signature") String signature
) {
    Event event = Webhook.constructEvent(payload, signature, endpointSecret);
    
    switch(event.getType()) {
        case "charge.succeeded":
            Charge charge = (Charge) event.getDataObjectDeserializer()
                .getObject();
            updateChargeStatus(charge.getId(), ChargeStatus.PAID);
            break;
        case "charge.failed":
            // Handle failure
            break;
    }
    
    return ResponseEntity.ok("Received");
}
```

**Estimated:** ~600 lines of code

**Frontend Impact:** SetupPayment page will work with real Stripe integration!

---

### Phase 11: Testing & Documentation (3-4 hours)
**Goal:** Ensure reliability and maintainability

**Tasks:**
1. ✅ Write unit tests for services (70%+ coverage)
2. ✅ Write integration tests for controllers
3. ✅ Add Swagger/OpenAPI documentation
4. ✅ Create comprehensive README
5. ✅ Add environment configuration guide
6. ✅ Add logging throughout

**Create:**
```
src/test/java/com/tribe/backend/
├── service/
│   ├── GroupServiceTest.java
│   ├── MemberServiceTest.java
│   ├── BillingServiceTest.java
│   └── PaymentServiceTest.java
├── controller/
│   ├── GroupControllerTest.java
│   ├── MemberControllerTest.java
│   └── AuthControllerTest.java
└── integration/
    └── ApiIntegrationTest.java

src/main/resources/
├── README.md                       (setup guide)
├── DEPLOYMENT.md                   (production guide)
├── springdoc-openapi (Swagger)
└── application-dev.yml             (dev config)
```

**Test Example:**
```java
@SpringBootTest
class GroupServiceTest {
    @Test
    void testCreateGroup_Success() {
        CreateGroupRequest request = new CreateGroupRequest();
        request.setPlatformGroupId("grp_test");
        request.setTotalAmount(2399);
        request.setMemberCount(4);
        request.setCurrency("USD");
        
        Group created = groupService.createGroup(request);
        
        assertNotNull(created.getId());
        assertEquals("grp_test", created.getPlatformGroupId());
    }
    
    @Test
    void testCreateGroup_InvalidAmount() {
        CreateGroupRequest request = new CreateGroupRequest();
        request.setTotalAmount(0);  // Invalid
        
        assertThrows(ValidationException.class, 
            () -> groupService.createGroup(request));
    }
}
```

**Swagger Endpoint:**
```
GET http://localhost:8080/swagger-ui.html
← Interactive API documentation
```

**Estimated:** ~400 lines of code + documentation

---

## 📈 Implementation Timeline

### MVP Release (1-2 weeks)
**Phases 1-4 (9-11 hours of work)**
- All endpoints working
- Frontend receives real data
- Basic error handling
- Can demonstrate full user flow

### Phase 1 Release (Ready for frontend dev)
**Just Phases 1-3 (5-6 hours)**
- Frontend can call backend
- See real member lists, invoices
- Basic functionality complete

### Production Ready (3-4 weeks)
**All 11 phases complete**
- Automated invoicing
- Real payment processing
- Authentication secure
- High performance with caching
- Fully documented

---

## 🎯 Priority & Dependency Map

```
Phase 1 (Bugs) ← Foundation
    ↓
Phase 2 (CORS) ← Frontend unblock
    ↓
Phase 3 (Endpoints) ← MVP functionality  ← MUST HAVE
    ↓
Phase 4 (DTOs) ← Clean responses
    ↓
Phase 5 (Business Logic) ← Correctness
    ↓
Parallel:
├─ Phase 6 (Scheduling)
├─ Phase 7 (Caching)
├─ Phase 8 (PDF)
├─ Phase 9 (Auth)
└─ Phase 10 (Payment)
    ↓
Phase 11 (Tests & Docs)
```

**Critical Path:** Phases 1-3 (must do first)
**Nice to Have:** Phases 6-7 (performance)
**Must Have for Production:** Phases 9-10 (security & money)

---

## 🔥 Quick Start to MVP (Do This First)

```bash
# 1. Clone and setup
cd backend
./gradlew clean build

# 2. Start Docker services
docker-compose up -d

# 3. Run application
./gradlew bootRun

# 4. Test basic endpoint
curl http://localhost:8080/api/groups

# 5. Implement Phase 1 (1-2 hours)
# - Fix MemberService compilation errors
# - Add exception handlers
# - Test all endpoints compile

# 6. Implement Phase 2 (30 min)
# - Add CORS configuration
# - Frontend should be able to call backend

# 7. Implement Phase 3 (4-5 hours)
# - Add all missing endpoints
# - Frontend dashboard should show real data

# 8. Test from frontend
cd ../frontend
npm run dev
# Visit http://localhost:5173/group/test-group-id
# Should see real member list, invoices
```

---

## ✅ Success Metrics

When complete, you'll have:
- ✅ 7+ working API endpoints
- ✅ Real data flowing to frontend
- ✅ Automated invoice generation
- ✅ Secure payment processing
- ✅ JWT authentication
- ✅ PDF invoices
- ✅ Comprehensive logging
- ✅ 70%+ test coverage
- ✅ Complete API documentation

---

## 💡 Pro Tips

1. **Always test after each phase** - Prevents cascading failures
2. **Use Postman/Insomnia** - Test endpoints independently from frontend
3. **Check logs** - Enable debug logging in application.yml
4. **Version control** - Commit after each phase completes
5. **Use DTOs everywhere** - Never expose @Entity to clients
6. **Validate inputs** - Never trust frontend data
7. **Document as you go** - Will thank yourself later

---

## 📞 Next Steps

**Choose one:**

1. **Want to code immediately?** → Go to Phase 1, I'll provide exact code
2. **Want more details?** → Ask about specific phase
3. **Want me to code it?** → Tell me which phases you want
4. **Have questions?** → Ask anything about architecture

What would you like to do?
