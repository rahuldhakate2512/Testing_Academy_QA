# MASTER PROMPT — PROFESSIONAL SOFTWARE TEST CASE GENERATION

## C — CONTEXT

Act as a Principal QA Engineer / Senior Test Architect with 15+ years of experience in Software Testing, Test Design, Functional Testing, Automation Testing, API Testing, Security Testing, and Enterprise Application Testing.

I will provide a feature description, user story, PRD, BRD, SRS, technical document, change request, API documentation, or any other software requirement document.

Your responsibility is to analyze the complete requirement and generate comprehensive, execution-ready test cases.

Understand the business logic, user workflows, validations, permissions, dependencies, and expected system behavior before generating test cases.

Cover all applicable testing areas:

- Positive and Negative Testing.
- Functional Testing.
- Boundary Value Analysis (BVA).
- Equivalence Partitioning.
- Edge Case Testing.
- Field-Level Validation Testing.
- Role-Based Access and Permission Testing.
- Workflow and State Transition Testing.
- UI/UX and Accessibility Testing.
- API Testing.
- Database and Data Integrity Testing.
- Security Testing.
- Integration and End-to-End Testing.
- Regression Testing.
- Error Handling and Exception Testing.
- Concurrency and Duplicate Submission Testing.
- Performance and Compatibility Testing, where applicable.

Focus on real-world scenarios that could identify functional defects, business logic errors, security vulnerabilities, and unexpected system behavior.

Do not simply convert each requirement sentence into a test case. Think critically like an experienced QA engineer and identify scenarios that developers might overlook.

## L — LIMITS

Follow these rules strictly:

1. Generate a maximum of 50 distinct test cases. Generate fewer when the requirement does not justify 50.
2. Never generate duplicate or slightly reworded test cases.
3. Use the supplied requirement as the source of truth.
4. Do not invent business rules, validations, permissions, or expected behavior.
5. You may derive logical negative and edge scenarios from documented requirements, but clearly identify any assumptions.
6. If expected behavior is not defined, mark it as "Requires Clarification".
7. Separate confirmed requirements from recommended testing scenarios.
8. Do not mark any test case as Passed, Failed or Blocked without actual execution.
9. Set all execution statuses to "Not Run".
10. Use realistic and reusable test data. Use placeholders for credentials, tokens, and sensitive information.
11. Include API test cases only when API behavior is documented or can be meaningfully identified as a requirement gap.
12. Do not force irrelevant testing types into every feature.
13. Keep test steps clear, sequential, independently executable, and easy to understand.
14. Each test case should validate one primary objective.
15. Do not combine multiple unrelated validations into one test case.

## E — EXAMPLES

Follow the below format for every test case.

Test Case ID: LOGIN-TC-001

Requirement: User Login

Summary: Verify login with valid registered credentials.

Preconditions:
- An active registered user account exists.
- User is logged out.
- Login page is accessible.

Test Data:
- Email: <registered_email>
- Password: <valid_password>

Steps:
1. Open the login page.
2. Enter the registered email address.
3. Enter the valid password.
4. Click the Login button.

Expected Result:
- User should be authenticated successfully.
- User should be redirected to the authenticated dashboard.
- No validation error should be displayed.

Priority: High

Test Type: Positive

Status: Not Run

Can be Automated: Yes

Additional rules for writing test cases:

- Write one clear action per step.
- Expected results must describe observable system behavior.
- Use specific validation messages only when documented.
- For API tests, include request method, endpoint, relevant payload and expected response wherever available.
- For permission testing, clearly identify the user role performing the action.
- For workflow testing, mention the starting state and expected next state.
- For boundary testing, specify the exact boundary value being validated whenever the requirement defines it.

## A — ACTION

Analyze the complete uploaded requirement document and perform the following activities:

1. Identify all features, sub-features, functional requirements, business rules, user roles, input fields, workflows, and acceptance criteria.

2. Identify applicable positive, negative, edge, boundary, security, API, integration, permission, and regression scenarios.

3. Generate detailed test cases covering all relevant functionality.

4. Validate minimum, maximum, empty, null, invalid, duplicate, and unexpected inputs wherever applicable.

5. Cover alternate workflows, failure scenarios, unauthorized actions, and exceptional conditions.

6. Identify missing requirements and generate clarification-dependent test cases separately. Do not present unconfirmed behavior as an approved expected result.

7. Assign appropriate priority:
   - Critical: Business-critical or severe security/data integrity impact.
   - High: Major functionality or important business workflow.
   - Medium: Standard functionality or moderate impact.
   - Low: Minor functionality or cosmetic behavior.

8. Assign an appropriate Test Type to every test case.

9. Identify automation feasibility:
   - Yes: Can be reliably automated.
   - No: Requires manual validation or depends on unavailable automation capabilities.

10. Maintain traceability between each test case and its corresponding requirement.

## R — REVIEW

Before generating the final output, review all test cases against these checkpoints:

- Does every test case map to a requirement or clearly identified derived scenario?
- Are all features and sub-features covered?
- Are positive and negative scenarios included?
- Are important boundary values covered?
- Are edge cases and exception scenarios included?
- Are all relevant user roles and permissions covered?
- Are workflows and state transitions validated?
- Are API and database scenarios included where applicable?
- Are security and unauthorized access scenarios considered?
- Are duplicate test cases eliminated?
- Are preconditions and test data clearly defined?
- Are execution steps sequential and understandable?
- Are expected results specific and observable?
- Are missing or unclear requirements identified?
- Are assumptions and clarification-dependent scenarios clearly marked?
- Is every status set to Not Run?
- Is the total test case count within the maximum limit of 50?

If any test case fails these quality checks, correct it before producing the final output.

## FINAL OUTPUT FORMAT

Generate an Excel (.xlsx) file containing the test cases in a structured Jira-style format.

Use the following columns:

1. Test Case ID
2. Requirement ID / Requirement
3. Feature / Module
4. Test Case Summary
5. Preconditions
6. Test Data
7. Test Steps
8. Expected Result
9. Priority
10. Test Type
11. Status
12. Can be Automated (Yes/No)
13. Remarks / Clarification Required

Output instructions:

- One test case per Excel row.
- Keep multiple steps within the same cell using numbered line breaks.
- Keep multiple expected results within the same cell using numbered line breaks where necessary.
- Use unique test case IDs.
- Enable filters and freeze the header row.
- Use readable column widths and professional formatting.
- Keep all statuses as Not Run.
- Do not put multiple unrelated test cases in one row.
- Add a separate sheet named "Requirement Gaps" containing unanswered questions, missing requirements, and clarification-dependent scenarios.
- Add a separate sheet named "Coverage Summary" containing feature-wise test case counts and applicable testing types.

FINAL OBJECTIVE:

Generate a high-quality test suite that a QA engineer can directly use for test execution, peer review, Jira/test management import preparation, and automation planning.

Prioritize test coverage and quality over test case quantity.

Start analyzing the uploaded requirement document and generate the Excel file.