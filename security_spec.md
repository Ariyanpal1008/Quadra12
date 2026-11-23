# Quadra 12 Firestore Security Specification

## 1. Data Invariants

### Collection: `changeRequests/{requestId}`
- Every `changeRequests/{requestId}` document must have a valid `requestId` matching `^[a-zA-Z0-9_\-]+$` (`<= 128` chars).
- Writes require an authenticated Google user with `request.auth.token.email_verified == true`.
- `authorUid` must strictly equal `request.auth.uid` on create and remain immutable forever.
- New requests must start with `status == 'new'` and `creatorNote == ''`.
- Only the verified creator admin (`ariyanpal090@gmail.com` with `email_verified == true`) can transition `status` (`new` -> `planned` / `added`), edit `creatorNote`, or read/list requests authored by other users.
- Submitting users can read/list only their own requests (`resource.data.authorUid == request.auth.uid`) and can only edit `category`, `targetSection`, `title`, `details` while `status == 'new'` (terminal states `'planned'` and `'added'` are locked against author edits).
- `createdAt` is immutable and must equal `request.time` on creation; `updatedAt` must equal `request.time` on both creation and update.
- No PII (`email`, `phone`, `address`) is stored in `changeRequests`.

### Collection: `syncSessions/{syncCode}`
- Account-less anonymous cloud sync pairing backed by a strict 6-digit numeric capability code (`^[0-9]{6}$`, length 6).
- Document ID `syncCode` must strictly equal `incoming().syncCode`.
- `allow list` is strictly disabled (`if false`) so no client can enumerate or scrape other users' sync sessions.
- `allow get` requires knowing a valid 6-digit `syncCode`.
- All arrays (`completedChapterIds <= 60`, `watchedLectureIds <= 60`) and maps (`chapterTasks <= 60`, `bestScores <= 6`, `dailyChapterLog <= 400`) are strictly bounded in size to prevent resource exhaustion / Denial of Wallet.
- `createdAt` is immutable and validated against `request.time`; `updatedAt` must equal `request.time`.
- No PII (`email`, `name`, `phone`, `address`) is permitted in `syncSessions`.

## 2. Dirty Dozen Attack Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated Create (`changeRequests`):** `auth: null` -> create `/changeRequests/req_1`
2. **Unverified Email Create (`changeRequests`):** `auth: { uid: "u1", token: { email_verified: false } }` -> create `/changeRequests/req_1`
3. **UID Spoofing:** `auth: { uid: "u1", token: { email_verified: true } }`, payload `authorUid: "u2"`
4. **Privilege / Status Shortcutting on Create:** Authenticated user creates with `status: "added"` or non-empty `creatorNote`
5. **Shadow Field Injection:** Create payload in either collection includes extra ghost key `isAdminApproved: true` or `email: "leak@example.com"`
6. **Malicious Document ID Injection:** Create `/changeRequests/bad$id_too_long...` or `/syncSessions/abc` (non-6-digit code)
7. **Unbounded Payload / Denial of Wallet:** Create `syncSessions` with `completedChapterIds.size() > 60` or `details` > 1500 chars
8. **Fake Timestamp Injection:** Create with client timestamp `createdAt` != `request.time`
9. **Cross-User Read/List (`changeRequests`) & Enumeration (`syncSessions`):** `list(/syncSessions)` or unfiltered `list(/changeRequests)`
10. **Email Spoofing Admin Bypass:** `auth: { uid: "attacker", token: { email: "ariyanpal090@gmail.com", email_verified: false } }` attempts to list all or update `status`
11. **Sync Code Mismatch Attack:** Writing `/syncSessions/123456` with `incoming().syncCode == "999999"`
12. **Immutable Field Mutability Attack:** Updating `authorUid`, `syncCode`, or `createdAt` after creation
