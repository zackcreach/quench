# Quench

Plant watering tracker with Phoenix API backend and React Native/Expo frontend.

## Quick Start

### Development

**Backend (Phoenix):**
```bash
mix setup          # Install deps, create DB, run migrations
mix phx.server     # Start at http://localhost:4000
```

**Frontend (Expo):**
```bash
cd assets
npm install
npm run web        # Start at http://localhost:8081
```

### Production

```bash
docker compose up -d
```

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Phoenix Server                    │
│                  (port 4001 prod)                   │
├─────────────────────┬───────────────────────────────┤
│   /api/*            │         /*                    │
│   REST API          │   Expo Web Build              │
│   (JSON)            │   (priv/static/)              │
└─────────────────────┴───────────────────────────────┘
          │
          ▼
┌─────────────────────┐
│    PostgreSQL       │
│    (Docker)         │
└─────────────────────┘
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/plants` | List all plants |
| POST | `/api/plants` | Create plant |
| GET | `/api/plants/:id` | Get plant |
| PUT | `/api/plants/:id` | Update plant |
| DELETE | `/api/plants/:id` | Delete plant |
| POST | `/api/plants/:id/water` | Mark as watered |

## Project Structure

```
quench/
├── mix.exs                 # Phoenix project
├── lib/
│   ├── quench/             # Business logic
│   │   ├── plants.ex       # Plants context
│   │   └── plants/
│   │       └── plant.ex    # Plant schema (UXID)
│   └── quench_web/         # Web layer
│       ├── router.ex
│       └── controllers/
├── priv/
│   └── static/             # Expo web build
├── assets/                 # React Native/Expo
│   ├── App.tsx
│   ├── package.json
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       │   └── api.ts      # API client
│       └── screens/
├── Dockerfile
└── docker-compose.yml
```

## Commands

```bash
# Phoenix
mix test                      # Run tests
mix test path/to/test.exs     # Single test file
mix precommit                 # Format, lint, test
mix ecto.gen.migration name   # New migration
mix phx.gen.secret            # Generate secret key

# Expo (from assets/)
npm run ios                   # iOS simulator
npm run android               # Android emulator
npm run web                   # Web browser

# Deployment
mix deploy                    # Auto-deploy if new commits
mix deploy --force            # Force deploy
```

## Configuration

### Environment Variables (Production)

```bash
SECRET_KEY_BASE=<mix phx.gen.secret>
DATABASE_URL=ecto://user:pass@host/quench_prod
PHX_HOST=your-domain.com
PORT=4001
```

### UXID

All schemas use prefixed UUIDs via UXID:

```elixir
use Quench.Schema, prefix: "plant"
# Generates IDs like: plant_01KE5VX9BZF4N9V6ED
```

## Deployment (NixOS/Symphony)

1. Add services to NixOS config:
   - `quench.nix` - Docker Compose service
   - `quench-deploy.nix` - Auto-deploy timer
   - `quench-backup.nix` - Database backup timer

2. Create env file:
   ```bash
   sudo mkdir -p /etc/quench
   sudo nano /etc/quench/env
   ```

3. Rebuild and start:
   ```bash
   sudo nixos-rebuild switch --flake .#symphony
   sudo systemctl start quench
   ```

## License

Private
