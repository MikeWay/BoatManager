# BoatManager — Claude Code Guide

## Project Overview
Boat check-out/check-in management system for Exe Sailing Club.
- **Frontend**: Angular 20 (standalone components, Angular Material) at `src/app/`
- **Backend**: Express + TypeScript at `server/src/`, compiled to `server/dist/`
- **Database**: AWS DynamoDB (eu-west-1)
- **Built frontend**: served statically from `server/public/browser/`

## Build Commands

### From project root
```bash
npm run build              # Angular production build only
npm run build-all-prod     # Full production build (Angular + server)
npm run deploy             # Build and deploy to production
```

### Server only (from `server/`)
```bash
npm run build              # Dev TypeScript build
npm run build:prod         # Production TypeScript build
npm start                  # Run local server (http://localhost:3000)
```

### Testing
```bash
npm test                   # Angular unit tests (Karma/Jasmine)
npm run e2e                # Playwright E2E tests
npm run e2eui              # Playwright UI mode
cd server && npm test      # Server unit tests (Jest)
```

## Version System
- Pre-commit hook at `.githooks/pre-commit` auto-bumps version by 0.01 on every commit
- Updates 3 files: `server/src/version.ts`, `src/environments/environment.ts`, `src/environments/environment.development.ts`
- Angular app checks `/api/version` on startup (production only) and shows refresh banner on mismatch
- Git hooks setup: `git config core.hooksPath .githooks`

## Deployment
- **Production server**: `bitnami@ribmanager.exe-sailing-club.org` (AWS Lightsail, eu-west-2)
- **SSH key**: `~/.ssh/LightsailDefaultKey-eu-west-2.pem`
- **Deploy script**: `./deploy.sh` — stops service, pulls master, builds prod, restarts
- **Service name**: `boatmanager` (systemd)

## Configuration
- `server/config.json` — gitignored, see `server/config.json.example`
- Local SMTP env vars loaded by `server/set-smtp-env.sh`
- Key config fields: `checkout_reasons`, `checkin_reasons`, `weekly_report_recipients`, SMTP settings

## Architecture

### Angular Frontend
- **State machine**: `app.component.ts` — `pageTransitionsCheckIn` / `pageTransitionsCheckOut` maps drive navigation
- **Shared state**: `src/app/app-state.ts` (`AppState` class) via `StateService`
- **Auth**: JWT stored in-memory, attached via `auth.interceptor.ts`
- **API calls**: `server.service.ts`

### Check-Out Flow
```
boat-list → who-are-you → tell-us-why → check-out-complete
```

### Check-In Flow
```
confirm-check-in → check-in-complete                          (default)
confirm-check-in → who-are-you → checkin-reason → check-in-complete  (notTheOriginalUser)
confirm-check-in → report-problem → check-in-complete         (problemsWithBoat)
```

### Express Server
- **Routes**: `server/src/routes/routes.ts`
- **API handlers**: `server/src/api/server.ts`
- **Admin handlers**: `server/src/controllers/adminController.ts`
- **Data access**: `server/src/model/dao.ts` (DynamoDB)
- **Admin UI**: EJS templates in `server/views/`

## API Routes

### Public (no auth)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/version` | Returns `{ version: string }` |
| POST | `/api/login` | JWT login, returns token |

### JWT Auth Required (Bearer token)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/check-person` | Identify person by name initial + DOB |
| POST | `/api/check-out-boat` | Check out a boat |
| POST | `/api/check-in-boat` | Check in a boat |
| GET | `/api/available-boats` | List available boats |
| GET | `/api/checked-out-boats` | List checked-out boats |
| GET | `/api/defects-list` | List possible defect categories |
| GET | `/api/checkin-reasons` | List check-in reasons |

### Admin Routes (cookie JWT, `isAdmin: true`)
- `/admin` — dashboard
- `/admin/boatsWithIssues`, `/admin/boatsCheckedOut` — status views
- `/admin/defectsForBoat/:boatId` — boat defect history
- `/admin/engineHours*` — engine hours reports
- `/admin/weeklyReport` — trigger/submit weekly email report (scheduled Mon 07:00)
- `/admin/findMembers` — search members by surname
- `/admin/loadUsers`, `/admin/upload-users`, `/admin/trialUploadUsers` — member CSV import
- `/admin/checkInAll` — force check in all boats
- `/admin/developerOptions` — dev tools

## Data Models (`server/src/model/`)
- `Boat.ts` / `BoatManager.ts` — boat entity and CRUD
- `Person.ts` / `PersonManager.ts` — member entity and CRUD
- `AdminPerson.ts` / `AdminPersonManager.ts` — admin users
- `defect.ts` / `DefectManager.ts` — boat defects
- `log.ts` / `LogManager.ts` — checkout/checkin log entries
- `EngineHours.ts` / `EngineHoursManager.ts` — engine hour tracking
- `Config.ts` — config loader
- `dao.ts` — DynamoDB client singleton + token store

## E2E Tests
Playwright tests in `tests/` — require a running server at localhost:3000.
Run `npm start` in `server/` before running E2E tests.

## Workflow Notes
- Commit and push when asked; `./deploy.sh` deploys to production when asked
- Always run `npm run build-all-prod` before deploying to verify the build passes
- The pre-commit hook stages version files automatically — don't skip it
