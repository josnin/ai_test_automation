# RoboGenius AI — Frontend

RoboGenius AI is a lightweight UI that lets users create automated test cases, group them into test suites, and assemble full end-to-end test flows — all powered by AI-generated test steps from uploaded screenshots and instructions.

---

## Features

### 1. Test Pages

A **Test Page** represents a single screen or state of the application.

Users can:
- Add a new Test Page.
- Upload a screenshot (PNG/JPG).
- Add instructions or expected behavior.
- Generate Robot Framework test steps using AI.
- Review & edit generated steps in the UI.

### 2. Test Suites

A **Test Suite** is a collection of Test Pages.

Users can:
- Create a new suite.
- Add or remove Test Pages from a suite.
- Define a Base URL for the entire suite.

### 3. End-to-End Flows

An **E2E Flow** combines multiple Test Suites into a full test scenario.

Users can:
- Create a new E2E flow.
- Attach one or more Test Suites.
- Reorder suites to define the execution sequence.
- Configure delays and retries between suite executions.
