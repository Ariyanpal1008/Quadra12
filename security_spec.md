# Quadra 12 Firestore Security Specification

## 1. Data Invariants
- Every `changeRequests/{requestId}` document must have a valid `requestId` matching `^[a-zA-Z0-9_\-]+$` (`<= 128` chars).
- Writes require an authenticated Google user with `request.auth.token.email_verified == true`.
- `authorUid` must strictly equal `request.auth.uid` on create and remain immutable forever.
- New requests must start with `status == 'new'` and `creatorNote == ''`.
- Only the verified creator admin (`ariyanpal090@gmail.com` with `email_verified == true`) can transition `status` (`new` -> `planned` / `added`), edit `creatorNote`, or read/list requests authored by other users.
- Submitting users can read/list only their own requests (`resource.data.authorUid == request.auth.uid`) and can only edit `category`, `targetSection`, `title`, `details` while `status == 'new'` (terminal states `'planned'` and `'added'` are locked against author edits).
- `createdAt` is immutable and must equal `request.time` on creation; `updatedAt` must equal `request.time` on both creation and update.
- No PII (`email`, `phone`, `address`) is stored in `changeRequests`.

## 2. Dirty Dozen Attack Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated Create:** `auth: null` -> create `/changeRequests/req_1`
2. **Unverified Email Create:** `auth: { uid: "u1", token: { email_verified: false } }` -> create `/changeRequests/req_1`
3. **UID Spoofing:** `auth: { uid: "u1", token: { email_verified: true } }`, payload `authorUid: "u2"`
4. **Privilege / Status Shortcutting on Create:** Authenticated user creates with `status: "added"` or non-empty `creatorNote`
5. **Shadow Field Injection:** Create payload includes extra ghost key `isAdminApproved: true`
6. **Malicious Document ID Injection:** Create `/changeRequests/bad$id_too_long...` (> 128 chars or invalid chars)
7. **Unbounded Payload / Denial of Wallet:** Create with `details` > 1500 chars or `title` > 120 chars
8. **Fake Timestamp Injection:** Create with client timestamp `createdAt` != `request.time`
9. **Cross-User Read/List:** User `u2` calls `get(/changeRequests/req_by_u1)` or unfiltered `list(/changeRequests)`
10. **Email Spoofing Admin Bypass:** `auth: { uid: "attacker", token: { email: "ariyanpal090@gmail.com", email_verified: false } }` attempts to list all or update `status`
11. **Author Tampering with Creator Fields / Terminal State:** Author `u1` updates `status` to `"planned"` or edits `details` after creator marked it `"planned"`
12. **Authoruid Mutability Attack:** Author `u1` attempts update changing `authorUid` or `createdAt`
