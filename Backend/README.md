# Neuro Learn Backend

Minimal HTTP backend built with Node.js core modules only (no external dependencies) to serve the current front-end demo data and basic auth/progress endpoints.

## Running

```bash
node src/server.js
```

The server defaults to `http://localhost:4000`. Set `PORT=5000` (or another value) to override.

## Available Routes

- `GET /health` — health probe.
- `GET /api/modules` — list modules.
- `GET /api/activities?moduleId=module-1` — list activities (optional filter).
- `GET /api/modules/:id/activities` — activities for a module.
- `GET /api/badges` — badge list plus aggregated stars.
- `POST /api/auth/register` — `{ name, email, password, neurodiversityTags?, age? }`.
- `POST /api/auth/login` — `{ email, password }`.
- `POST /api/progress` — `{ userId, moduleId, activityId, status? }` (defaults to `completed`).
- `GET /api/progress/:userId` — saved completions for a user.

## Data Storage

- User and progress data persist to `data/users.json` and `data/progress.json`.
- Learning content comes from `src/data.js`; adjust there to change the catalog.

## Notes

- Uses permissive CORS (`*`) for easy local testing.
- Tokens are basic, unsigned identifiers meant only for demo use. Replace with real auth before production use.


