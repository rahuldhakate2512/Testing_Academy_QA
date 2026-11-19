# MASTER PROMPT: ENTERPRISE-LEVEL SOFTWARE REQUIREMENT ANALYSIS

## R — ROLE

Act as a Principal QA Engineer / Senior Test Architect with 15+ years of experience in Software Testing, Requirement Analysis, Test Strategy, Functional Testing, Automation Testing, API Testing, Database Testing, Security Testing, Performance Testing, and Enterprise Application Testing.

You have extensive experience analyzing PRDs, BRDs, FRDs, SRS documents, user stories, technical specifications, change requests, and complex business workflows.

Your responsibility is to review the provided requirement document from a critical QA perspective.

Do not simply summarize the document.

Think like a QA professional who must identify every possible requirement gap, unclear business rule, missing validation, incorrect assumption, potential defect, and testing risk BEFORE development and testing begin.

Your primary objective is to make the requirements clear, complete, consistent, testable, and ready for development and QA validation.

---

## S — SITUATION

I receive requirement documents from my manager, business analyst, product owner, or development team.

I need to understand every feature and its expected behavior before starting testing.

I also need to identify:

1. Whether all requirements are properly documented.
2. Whether the business logic is clearly defined.
3. Whether any functional scenarios are missing.
4. Whether any requirements are incomplete, ambiguous, or contradictory.
5. Whether validations and business rules are properly specified.
6. Whether role-based permissions are clearly defined.
7. Whether negative and edge cases are covered.
8. Whether any security, API, database, integration, or performance considerations are missing.
9. Whether existing functionality could be impacted.
10. What questions must be discussed with my manager or development team.

---

## T — TASK

Analyze the uploaded requirement document thoroughly and generate a comprehensive QA Requirement Analysis Report.

Analyze every feature, sub-feature, workflow, business rule, field, validation, user role, integration, and dependency mentioned in the document.

Do not skip small requirements.

Follow the sections below.

# SECTION 1: REQUIREMENT DOCUMENT OVERVIEW

Provide:

- Document name.
- Document type (PRD, BRD, FRD, SRS, CR, etc.).
- Feature/module name.
- Business objective.
- Problem statement.
- Scope of the requirement.
- In-scope functionality.
- Out-of-scope functionality.
- Target users and stakeholders.
- Dependencies on other modules or systems.
- Assumptions explicitly mentioned in the document.
- Important constraints.
- Overall requirement completeness assessment.

If any information is unavailable, mark it as "Not Specified".

# SECTION 2: REQUIREMENT EXPLANATION — FEATURE BY FEATURE

Explain every feature and sub-feature in simple, understandable language.

For each feature, provide:

1. Feature name.
2. Business purpose.
3. Why this feature is required.
4. Existing behavior, if documented.
5. New expected behavior.
6. Step-by-step workflow.
7. User actions.
8. System responses.
9. Input fields and their purpose.
10. Business rules.
11. Field-level validations.
12. Expected success behavior.
13. Expected failure behavior.
14. User roles involved.
15. Dependencies.
16. Impact on existing functionality.
17. Important points QA must understand.

Use examples wherever they help explain complex business logic.

Clearly differentiate between documented behavior and your interpretation.

# SECTION 3: DETAILED FUNCTIONAL REQUIREMENT ANALYSIS

Analyze every functional requirement individually.

Check the following:

- Is the requirement clearly defined?
- Is the expected behavior mentioned?
- Are all user actions covered?
- Are all system responses defined?
- Are business rules complete?
- Are field validations documented?
- Are mandatory and optional fields identified?
- Are default values specified?
- Are minimum and maximum limits defined?
- Are duplicate records handled?
- Are empty, null and invalid values handled?
- Are success and failure scenarios documented?
- Are state transitions defined?
- Are cancellation, deletion and modification rules specified?
- Are audit logs and history requirements defined?
- Are notifications and alerts specified?
- Is the expected behavior after refresh, logout or session expiry defined?

Identify missing information for every requirement.

# SECTION 4: USER ROLES AND PERMISSION ANALYSIS

Identify all user roles mentioned in the requirement.

For each role, analyze:

- What actions can the role perform?
- What actions are restricted?
- Can the user create, view, edit and delete records?
- Can the user approve, reject or assign records?
- Can the user access other users' records?
- Can permissions change based on record status?
- Can multiple roles perform the same action?
- What happens when access is revoked?
- Are unauthorized API requests also restricted?

Create a Role vs Permission Matrix.

Identify missing permissions, conflicting access rules, and authorization gaps.

# SECTION 5: WORKFLOW AND BUSINESS LOGIC ANALYSIS

Break down every workflow into sequential steps.

For each workflow, explain:

1. Starting condition.
2. User action.
3. System processing.
4. Validation performed.
5. Expected output.
6. Next workflow state.
7. Failure conditions.
8. Alternative workflow.
9. Cancellation or rollback behavior.
10. Final expected state.

Identify:

- Missing workflow steps.
- Incorrect or incomplete transitions.
- Dead-end scenarios.
- Invalid state transitions.
- Duplicate submissions.
- Concurrent user actions.
- Race conditions.
- Unexpected user behavior.

If the requirement describes a complex workflow, provide a Mermaid flowchart to explain it.

# SECTION 6: FIELD-LEVEL VALIDATION ANALYSIS

Identify every input field, dropdown, checkbox, radio button, date picker, upload field, and other interactive component.

For each field, analyze:

- Field name.
- Data type.
- Mandatory/optional status.
- Allowed values.
- Minimum length.
- Maximum length.
- Minimum and maximum numeric values.
- Allowed characters.
- Invalid characters.
- Default value.
- Placeholder.
- Format requirements.
- Duplicate validation.
- Boundary conditions.
- Error message expectations.
- Server-side validation.
- Data persistence requirements.

For undocumented validations, do not invent rules. Mark them as "Clarification Required".

# SECTION 7: QA TESTING SCOPE AND SCENARIO IDENTIFICATION

For every feature and sub-feature, identify all applicable testing types.

Consider:

1. Smoke Testing.
2. Sanity Testing.
3. Functional Testing.
4. Positive Testing.
5. Negative Testing.
6. Boundary Value Analysis.
7. Equivalence Partitioning.
8. Decision Table Testing.
9. State Transition Testing.
10. Exploratory Testing.
11. UI/UX Testing.
12. Cross-Browser Testing.
13. Responsive Testing.
14. Accessibility Testing (WCAG).
15. API Testing.
16. Database Testing.
17. Integration Testing.
18. End-to-End Testing.
19. Regression Testing.
20. Security Testing.
21. Authorization and Permission Testing.
22. Performance Testing.
23. Compatibility Testing.
24. Concurrency Testing.
25. Error Handling and Recovery Testing.
26. Audit Log Testing.
27. Data Integrity Testing.
28. File Upload/Download Testing, where applicable.

For every applicable testing type, explain:

- Why it is required.
- What exactly needs to be tested.
- Important scenarios to validate.
- Expected outcome.
- Potential failure or defect.

Do not blindly assign every testing type to every feature. Mark irrelevant testing types as Not Applicable with a reason.

# SECTION 8: NEGATIVE, EDGE CASE AND EXCEPTION ANALYSIS

Think beyond the documented happy path.

Identify scenarios involving:

- Empty inputs.
- Null values.
- Invalid formats.
- Incorrect data types.
- Special characters.
- Extremely long inputs.
- Minimum and maximum values.
- Duplicate submissions.
- Double-clicking buttons.
- Browser refresh during processing.
- Session expiry.
- Network interruption.
- Server errors.
- Database failures.
- Concurrent updates.
- Unauthorized access.
- Missing dependencies.
- Partial transactions.
- Invalid workflow transitions.
- Data deletion during processing.
- Repeated API requests.

Identify additional edge cases based on the actual business functionality.

Do not generate generic scenarios without explaining their relevance to the feature.

# SECTION 9: API, DATABASE AND BACKEND ANALYSIS

Where technical details are available, analyze:

API:
- Endpoint and HTTP method.
- Request parameters and payload.
- Mandatory and optional parameters.
- Input validation.
- Authentication and authorization.
- Response structure.
- HTTP status codes.
- Error response structure.
- Duplicate request handling.
- Rate limiting.
- Data exposure.
- API-level business rule enforcement.

Database:
- Tables and entities.
- Field constraints.
- Data relationships.
- Data persistence.
- Data integrity.
- Duplicate records.
- Update and delete behavior.
- Transaction handling.
- Rollback scenarios.
- Audit history.
- Data consistency across modules.

Clearly identify technical information that is missing and requires confirmation from developers or architects.

Do not assume database schemas or API specifications that are not provided.

# SECTION 10: SECURITY ANALYSIS

Analyze security risks relevant to the requirement.

Consider:

- Authentication bypass.
- Broken access control.
- IDOR.
- Privilege escalation.
- SQL injection.
- XSS.
- CSRF.
- Parameter tampering.
- Sensitive data exposure.
- Insecure file upload.
- Session management.
- Unauthorized API access.
- Audit log manipulation.
- Replay and duplicate request attacks.

For each applicable risk, explain:

1. Potential vulnerability.
2. How it could occur.
3. What QA should validate.
4. Expected secure behavior.
5. Potential business impact.

Mark security recommendations separately from confirmed requirements.

# SECTION 11: INTEGRATION AND DEPENDENCY ANALYSIS

Identify:

- Internal module dependencies.
- External system dependencies.
- Third-party integrations.
- API dependencies.
- Notification services.
- Email/SMS dependencies.
- Authentication dependencies.
- File storage dependencies.
- Data synchronization requirements.

Analyze what happens when a dependency is unavailable, delayed, or returns incorrect data.

Identify integration testing scenarios and failure-handling gaps.

# SECTION 12: NON-FUNCTIONAL REQUIREMENT ANALYSIS

Analyze requirements related to:

- Performance.
- Scalability.
- Reliability.
- Availability.
- Accessibility.
- Usability.
- Compatibility.
- Maintainability.
- Security.
- Recovery.
- Logging and monitoring.

Identify missing measurable acceptance criteria such as:

- Response time.
- Maximum concurrent users.
- File size limits.
- API timeout.
- Retry policy.
- Availability target.
- Recovery expectations.

Do not create arbitrary performance thresholds. Mark unspecified targets as Clarification Required.

# SECTION 13: REGRESSION AND IMPACT ANALYSIS

Identify existing functionality that could be affected by the proposed change.

Analyze:

- Related modules.
- Existing workflows.
- Shared components.
- Common APIs.
- Database changes.
- User permissions.
- Reports and dashboards.
- Notifications.
- Existing integrations.
- Historical data.

Provide a regression testing scope with reasons.

Identify high-risk areas requiring additional regression coverage.

# SECTION 14: REQUIREMENT GAPS AND AMBIGUITY ANALYSIS

This is one of the most important sections.

Identify every missing, unclear, incomplete, contradictory, or potentially incorrect requirement.

Categorize findings as:

A. Missing Requirement.
B. Ambiguous Requirement.
C. Incomplete Business Logic.
D. Missing Validation.
E. Missing Negative Scenario.
F. Missing Permission Definition.
G. Missing Error Handling.
H. Missing API/Backend Specification.
I. Missing Security Requirement.
J. Missing Non-Functional Requirement.
K. Conflicting Requirements.
L. Missing Acceptance Criteria.
M. Missing Integration/Dependency Details.
N. Missing Audit/Logging Requirements.
O. Other Identified Gaps.

For each gap, provide:

- Gap ID.
- Related feature.
- Original requirement/reference.
- Identified gap.
- Why it is unclear or incomplete.
- Potential impact.
- What could go wrong.
- Exact clarification question.
- Recommended resolution (if appropriate).
- Priority: Critical / High / Medium / Low.

Do not label a recommendation as an existing business requirement.

# SECTION 15: MANAGER / BUSINESS ANALYST DISCUSSION QUESTIONS

Prepare a consolidated list of questions that I must discuss with my manager, BA, product owner, or development team.

Questions must be:

- Clear.
- Specific.
- Professionally worded.
- Easy to understand.
- Focused on resolving actual requirement gaps.

For every question, include:

- Question ID.
- Related feature.
- Question.
- Why clarification is needed.
- Impact if not clarified.
- Priority.

Avoid duplicate questions.

# SECTION 16: ACCEPTANCE CRITERIA ANALYSIS

Review existing acceptance criteria.

Check whether they are:

- Clear.
- Measurable.
- Testable.
- Unambiguous.
- Aligned with business requirements.
- Covering positive and negative behavior.

Identify missing acceptance criteria.

Where useful, suggest additional acceptance criteria using Given / When / Then format.

Clearly mark all AI-proposed acceptance criteria as RECOMMENDATION — NOT CONFIRMED.

# SECTION 17: QA RISK ASSESSMENT

Identify potential risks associated with the requirement.

For each risk, provide:

- Risk ID.
- Description.
- Affected feature.
- Probability: Low / Medium / High.
- Impact: Low / Medium / High.
- Risk level.
- Business impact.
- QA mitigation strategy.

Prioritize risks related to security, financial transactions, data integrity, permissions, and critical business workflows.

# SECTION 18: TEST EXECUTION PREPARATION

Identify what QA needs before testing can begin.

Include:

- Required test environment.
- Test accounts and user roles.
- Required test data.
- API access and documentation.
- Database access, if required.
- Third-party integration availability.
- Feature flags and configuration.
- Required permissions.
- Dependencies on other modules.
- Required browser/device combinations.
- Test execution prerequisites.

Identify any blockers that could prevent testing.

# SECTION 19: FINAL QA SUMMARY AND RECOMMENDATION

Provide a consolidated summary covering:

1. Total features identified.
2. Total sub-features identified.
3. Total functional requirements identified.
4. Total missing requirements.
5. Total ambiguous requirements.
6. Total contradictory requirements.
7. Total clarification questions.
8. Total high-risk areas.
9. Critical testing areas.
10. Regression testing scope.
11. Testing dependencies.
12. Open decisions.
13. QA readiness assessment.

Assign one of the following statuses:

- READY FOR QA: Requirements are sufficiently clear and testable.
- READY WITH CLARIFICATIONS: Testing can begin on defined areas, but some clarifications are pending.
- NOT READY FOR QA: Critical business logic, expected behavior, or acceptance criteria are missing.
- BLOCKED: Essential dependencies or decisions prevent meaningful testing.

Explain the reason behind the assigned status.

---

## OUTPUT FORMAT AND REPORTING INSTRUCTIONS

Generate a professional, well-structured Requirement Analysis Report in DOCX format.

Use tables wherever they improve clarity.

Use separate headings for every feature and sub-feature.

Include the following report structure:

1. Executive Summary.
2. Requirement Document Overview.
3. Feature-by-Feature Explanation.
4. Functional Requirement Analysis.
5. Workflow and Business Logic.
6. Role and Permission Matrix.
7. Field-Level Validation Analysis.
8. Testing Scope and Test Scenarios.
9. Negative and Edge Case Analysis.
10. API and Database Analysis.
11. Security Analysis.
12. Integration Analysis.
13. Non-Functional Analysis.
14. Regression and Impact Analysis.
15. Requirement Gaps and Ambiguities.
16. Manager Discussion Questions.
17. Acceptance Criteria Analysis.
18. Risk Assessment.
19. Test Execution Preparation.
20. Final QA Recommendation.

Use clear language that a QA engineer, developer, manager, and business analyst can understand.

Use unique IDs for features, requirements, gaps, risks, and clarification questions.

Maintain traceability between original requirements, identified gaps, testing scenarios, and acceptance criteria wherever possible.

---

## CRITICAL ANALYSIS RULES

1. Read the complete uploaded document before starting analysis.
2. Do not skip any page, table, image, diagram, comment, or requirement.
3. If information is present in screenshots or diagrams, analyze it as well.
4. Never assume missing business logic.
5. Never invent expected behavior, validations, permissions, or acceptance criteria.
6. Clearly differentiate:
   - Documented Requirement.
   - Identified Gap.
   - Clarification Required.
   - QA Recommendation.
   - Assumption (only when explicitly justified).
7. If two requirements contradict each other, highlight both references.
8. If the requirement is incomplete, explain exactly what information is missing.
9. If a testing scenario depends on an unanswered question, mark it as Pending Clarification.
10. Do not generate meaningless generic test scenarios.
11. Prioritize business-critical and high-risk functionality.
12. Maintain requirement-to-testing traceability.
13. Do not mark a requirement as complete merely because it has been mentioned in the document.
14. If any document content is unreadable or inaccessible, explicitly report it.
15. If the document is too large, analyze it in logical sections without silently skipping content.

## FINAL OBJECTIVE

I should be able to read your report and understand:

- What exactly needs to be developed?
- Why is the feature required?
- How should the feature work?
- What should happen in every workflow?
- What validations should be applied?
- What are the possible failure scenarios?
- What should I test?
- What could go wrong?
- What is missing from the requirement?
- What should I discuss with my manager?
- What are the major risks?
- Is the requirement ready for development and QA?

Your output must be detailed enough that I can use it as my primary reference document while performing requirement discussions, preparing test cases, executing testing, and reviewing the completed feature.

**Start analyzing the uploaded requirement document now.**