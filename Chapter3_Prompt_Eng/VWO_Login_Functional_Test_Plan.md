# Test Plan: VWO Login Module

**Test Plan ID:** TP-VWO-LOGIN-001  
**Title:** Functional Test Plan for the VWO Login Page  
**Application:** https://app.vwo.com/  
**Prepared for:** Functional login review  
**Status:** Draft — pending clarification and approval

## 1. Test Plan

### Objective

Verify that the VWO login module allows registered users to access the authenticated dashboard with valid credentials and prevents access with invalid or incomplete credentials.

### Scope

#### In Scope

- Valid registered-user login.
- Invalid credentials.
- Mandatory email and password fields.
- Display of the approved invalid-login error message.
- Navigation to the authenticated dashboard after successful login.
- UI behavior and field validation for the login form.
- Positive, negative, and supported boundary scenarios.

#### Out of Scope

- Registration and account creation.
- Password reset and account recovery.
- Password complexity or password-expiry rules.
- Account lockout and repeated-login throttling.
- Session timeout and session persistence.
- OAuth, SSO, MFA, CAPTCHA, and social login, unless separately required.
- API, performance, security, penetration, and accessibility testing, unless separate test cycles are approved.

### Test Environments

| Item | Requirement / Recommendation |
|---|---|
| Application | `https://app.vwo.com/` |
| Browser | Recommendation: latest stable Chrome, Edge, and Firefox |
| Operating system | Recommendation: supported Windows and macOS desktop environments |
| Network | Stable internet connection with access to VWO |
| Account type | Registered test account with approved valid credentials |
| Test data | Credentials stored and used only through approved test-data practices |

### Defect Reporting Procedure

- Log defects in the approved defect-management tool.
- Include title, URL, environment, browser, preconditions, steps, observed result, expected result, severity, and evidence.
- Defects related to ambiguous behavior must also record whether clarification is needed.
- Re-test fixed defects and perform a focused regression of login and dashboard access.

## 2. Test Strategy

Testing will combine manual exploratory and scripted functional testing. Start with positive login and mandatory-field checks, then test invalid credentials and edge values supported by the approved requirements. Dashboard access will be verified after successful login.

The test approach is black-box, UI-level testing. Boundary testing will be limited to observable input boundaries and will not assume undocumented password length or complexity rules.

| Test Type | Coverage |
|---|---|
| Positive | Valid registered-user login and dashboard access |
| Negative | Invalid email/password and incomplete credentials |
| Boundary | Long email/address inputs and whitespace, where technically observable |
| UI/Usability | Field presence, labels, submit control, error display, navigation |
| Regression | Login page, authenticated dashboard, and logout entry if available |

## 3. Test Schedule

| Phase | Recommended Timing | Output |
|---|---|---|
| Requirement and data preparation | Before execution | Approved scope, test account, and open questions resolved |
| Environment verification | Before execution | Login page and test account confirmed |
| Test execution | After entry criteria are met | Execution results and defects |
| Retest and regression | After fixes | Closed or accepted defect status |
| Test closure | After exit criteria are assessed | Summary, evidence, and approvals |

## 4. Test Deliverables

- Approved functional test plan.
- Test scenarios and detailed test cases.
- Test execution evidence.
- Defect log and retest evidence.
- Test summary report.
- Traceability from approved requirements to test cases.

## 5. Entry and Exit Criteria

### Entry Criteria

- Login requirements approved.
- `https://app.vwo.com/` is available.
- Browser and test environment are prepared.
- Valid registered test account is available.
- The invalid-login message is confirmed with the product owner if it is subject to localization or UI changes.

### Exit Criteria

- All planned in-scope test cases have executed.
- No open critical or high-severity defects remain.
- Medium and low defects have documented disposition.
- Positive login and dashboard access are verified.
- Invalid credential and mandatory-field behavior is verified.
- Test evidence and defect status are reviewed.

> Entry and exit criteria are recommendations because no formal project thresholds were supplied.

## 6. Test Execution

### Execution Entry Criteria

- Test environment and test data are ready.
- The build or deployment under test is identified.
- Test cases are reviewed and approved.

### Execution Exit Criteria

- Execution status is recorded for every test case.
- Defects are linked to failed cases.
- Required re-tests are complete.
- Remaining risks and open questions are documented.

## 7. Test Closure

### Closure Entry Criteria

- Execution and defect data are complete.
- Exit criteria have been evaluated.
- Stakeholder concerns are recorded.

### Closure Exit Criteria

- Test summary report is produced.
- Open questions and accepted risks are communicated.
- Test evidence is archived.
- Formal approval is obtained from the designated reviewer.

## 8. Tools

| Purpose | Recommendation |
|---|---|
| Test case and execution management | Existing project test-management tool |
| Defect tracking | Existing approved defect-management tool |
| Evidence capture | Screenshot or screen-recording tool |
| Browser debugging | Browser developer tools |
| Reporting | Test summary report and defect export |

## 9. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Requirements are incomplete or ambiguous | Mark unspecified behavior as “Requires clarification”; obtain stakeholder decision before execution or as a scoped question |
| Invalid-login message text changes by environment | Capture the exact approved text in test data and verify environment parity |
| Shared test accounts are modified or locked | Use dedicated or approved test accounts and reset test data after the run |
| Browser differences affect layout or behavior | Run the representative browser matrix recommended for the project |
| Network restrictions block access | Confirm connectivity and allowlist requirements before testing |
| Credentials are exposed in evidence or source files | Use approved credential storage and redact secrets in screenshots |

## 10. Approvals

| Role | Name | Decision / Date |
|---|---|---|
| QA Reviewer |  |  |
| Product Owner / Business |  |  |
| Development Owner |  |  |

## Test Scenarios

| ID | Scenario | Test Type | Preconditions / Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| LGN-001 | Valid registered email and password | Positive | Open login page; enter approved valid registered email and password; submit | User is authenticated and the authenticated dashboard opens | Critical |
| LGN-002 | Invalid password | Negative | Open login page; enter registered email and an invalid password; submit | Login is denied and the approved error message is shown: “Your email, password, IP address or location did not match” | Critical |
| LGN-003 | Invalid email | Negative | Enter an unregistered or invalid email and a valid-format password; submit | Login is denied and the approved error message is shown | Critical |
| LGN-004 | Both credentials invalid | Negative | Enter invalid email and password; submit | Login is denied and the approved error message is shown | High |
| LGN-005 | Empty email | Negative | Leave email empty; enter password; submit | Email is identified as mandatory; login is denied | High |
| LGN-006 | Empty password | Negative | Enter email; leave password empty; submit | Password is identified as mandatory; login is denied | High |
| LGN-007 | Both fields empty | Negative | Leave email and password empty; submit | Email and password are identified as mandatory; login is denied | High |
| LGN-008 | Whitespace-only email | Boundary / Negative | Enter whitespace in email field; enter password; submit | Login is denied; behavior for trimming whitespace Requires clarification | Medium |
| LGN-009 | Whitespace-only password | Boundary / Negative | Enter email; enter whitespace in password field; submit | Login is denied; password format rules and trimming behavior Requires clarification | Medium |
| LGN-010 | Email field input length | Boundary | Enter an unusually long email value; submit | A valid long input must not bypass login; maximum-length behavior Requires clarification | Medium |
| LGN-011 | Password field input length | Boundary | Enter an unusually long password value; submit | Behavior and maximum length Require clarification; login must remain controlled | Medium |
| LGN-012 | Invalid email format | Negative | Enter `not-an-email`; enter password; submit | Login is denied; exact format validation message Requires clarification | High |
| LGN-013 | Valid email with masked password | UI | Enter valid email and password; inspect password display | Password should not display in readable text; masking behavior Requires clarification if the system implementation differs | Medium |
| LGN-014 | Successful login navigation | Positive | Complete LGN-001; inspect resulting page | Authenticated dashboard opens and login form is no longer the active page | Critical |
| LGN-015 | Direct repeated submit | Negative / Regression | Submit valid credentials more than once through available UI controls | Exactly one login/session effect; duplicate behavior Requires clarification | Medium |
| LGN-016 | Invalid then valid credentials | Regression | Submit invalid credentials, correct the values, and submit again | Failed attempt clears or permits corrected valid login; session state behavior Requires clarification | High |

## Environment and Test Data

| Data Item | Requirement |
|---|---|
| Valid registered email | Approved test account, not a personal or production account |
| Valid password | Managed through approved secret storage; not stored in this plan |
| Invalid email | Clearly non-registered test value |
| Invalid password | Clearly incorrect value |
| Empty values | Null or empty field values |
| Whitespace values | Single spaces or leading/trailing whitespace |
| Long values | Representative values larger than ordinary use; exact limits not assumed |

## Open Questions

| ID | Question | Why It Is Needed |
|---|---|---|
| OQ-001 | Should whitespace around email or password be trimmed or rejected? | The supplied requirements do not define normalization behavior |
| OQ-002 | Are email format validation rules and messages defined separately? | Only mandatory email and password behavior is supplied |
| OQ-003 | What password length or complexity rules apply? | These rules must not be inferred |
| OQ-004 | What session timeout or persistence behavior is required after login? | No session requirements were supplied |
| OQ-005 | Is the invalid-login error text identical across browsers and environments? | Consistent expected text needs confirmation |
| OQ-006 | What severity and SLA apply to failed login or dashboard-access defects? | Exit criteria require severity disposition |
| OQ-007 | What browser and operating-system matrix is approved? | Environment coverage is currently a recommendation |
| OQ-008 | What repeated-login, lockout, throttling, or CAPTCHA behavior applies? | These behaviors are outside the supplied requirements |
