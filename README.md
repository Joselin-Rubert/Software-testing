# AutoCare Vehicle Service Booking System

## Project introduction
AutoCare is a real-time, browser-based vehicle service booking system built with HTML5, CSS3, and vanilla JavaScript. It gives customers a simple way to manage vehicles and schedule workshop appointments, while an operations team can monitor and update the booking queue.

## Problem statement
Manual booking through phone calls, spreadsheets, or messaging makes appointment details easy to lose, creates duplicate work, and gives customers poor visibility into status. Workshop staff also need a single view of demand and current workload.

## Objectives
- Provide customer registration and login.
- Store customer vehicles and service appointments in localStorage.
- Validate every important form field before saving data.
- Provide booking history and status visibility.
- Give administrators searchable, filterable booking operations.
- Demonstrate modular development and CI/CD with Jenkins.

## Proposed solution
The app uses separate pages for the customer overview, appointment flow, and admin operations. Shared domain modules implement authentication, vehicle management, booking rules, validation, and analytics. Browser localStorage acts as the lightweight data layer for a college demonstration; a production version can replace these modules with API calls without redesigning the UI.

## Modules and modular architecture
| Module | Responsibility |
| --- | --- |
| Customer | Registration, login, session, logout |
| Vehicle | Add and retrieve customer vehicles |
| Validation | Email, password, vehicle number, date, and service rules |
| Booking | Create appointments and update status |
| Analytics | Status totals and service breakdown calculations |
| App UI | Customer overview and history rendering |
| Booking UI | Service selection and appointment form |
| Admin UI | Search, filter, status update, and statistics rendering |

Each module has one primary responsibility and exposes small functions. The UI modules import these functions rather than duplicating business rules. This makes individual modules easier to test, replace, and maintain.

## User workflow
1. Open `index.html` and create an account.
2. Add a vehicle such as `KA01AB1234` and its model.
3. Open Book service, choose the vehicle and service, then select a future date and time.
4. Confirm the appointment and review its Pending status on the overview page.
5. Open Admin to search bookings and change status to Confirmed, Completed, or Cancelled.

## Automated testing
The test runner is dependency-free Node JavaScript. Run:

```bash
npm test
```

It checks registration, login, vehicle number, service selection, date validation, invalid submissions, booking creation, status update, and end-to-end customer/vehicle flows. It writes a visual report to `reports/test-report.html` with passed and failed cases.

## Test case table
| Test case | Expected result |
| --- | --- |
| Complete registration | Accepted |
| Malformed registration email | Rejected |
| Empty login form | Rejected |
| Valid vehicle number | Accepted |
| Invalid vehicle number | Rejected |
| Known service selection | Returns service |
| Past appointment date | Rejected |
| Invalid booking submission | Field errors returned |
| New booking | Stored as Pending |
| Status update | Changes to Confirmed |
| Registration followed by login | Successful session |

## Jenkins CI/CD workflow
The `Jenkinsfile` implements:

`GitHub push -> Jenkins webhook -> Checkout -> Build -> Test -> Report Generation -> Deployment`

- **Checkout:** Jenkins retrieves the latest source using `checkout scm`.
- **Build:** Node syntax checks verify each JavaScript module.
- **Test:** `npm test` executes the automated cases.
- **Report Generation:** Jenkins publishes and archives `reports/test-report.html`.
- **Deployment:** After successful testing, the static site is copied to the Jenkins `deployment` directory and archived as a build artifact.

To enable automatic runs, create a Pipeline job from SCM, connect the GitHub repository, enable the GitHub hook trigger, and configure a GitHub webhook pointing to `https://YOUR-JENKINS-URL/github-webhook/`. The Jenkins agent needs Node.js and the HTML Publisher plugin.

## Deployment process
For a local demonstration, serve the project directory with any static server or open `index.html` directly. For Jenkins deployment, the pipeline creates a `deployment` directory containing HTML, CSS, and JavaScript assets. This directory can be copied to Apache, Nginx, GitHub Pages, or an object-storage static website.

## Benefits of Jenkins
- Automatically checks every push.
- Prevents deployment when tests fail.
- Keeps an auditable HTML report for each build.
- Produces repeatable deployment artifacts.
- Connects GitHub integration, quality checks, and delivery in one workflow.

## Benefits of a modular framework
- Changes stay limited to the responsible module.
- Business rules can be tested without a browser.
- Multiple developers can work on separate modules.
- Modules can later be connected to a real backend API.
- Clear interfaces reduce duplication and regression risk.

## Running locally
No framework or package installation is required. Open `index.html` in a browser, or run a static server from the project root. For tests, use Node.js 18+ and run `npm test`.

## Conclusion
AutoCare demonstrates a complete real-time software project at practical-project scale. It combines a professional responsive UI, modular JavaScript architecture, local data handling, automated tests with an HTML report, and a Jenkins pipeline that connects source integration through deployment.
