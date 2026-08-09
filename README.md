# Quench

Plant watering tracker with Phoenix API backend and React Native/Expo frontend.

## Quick Start

### Development

**Backend (Phoenix):**
```bash
nix develop
mix setup
iex -S mix phx.server
```

The Nix development shell provides the pinned Erlang, Elixir, Node, and PostgreSQL client tooling on Linux and Darwin. A PostgreSQL server must be running locally.

Without Nix, use [`flake.nix`](flake.nix) as the source of truth for tool versions and install matching Erlang, Elixir, Node, and PostgreSQL tooling with mise, asdf, or equivalent tooling before running `mix setup`.

**Frontend (Expo):**
```bash
cd assets
npm install
npm run web        # Start at http://localhost:8081
```

### Production

Quench is built as a Nix Mix release and managed by `quench-native.service` on Symphony.

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
│  (NixOS service)    │
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
└── flake.nix               # Native release package
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

# Production release
nix build                     # Build the immutable release
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

Push the application commit, then deploy its pinned input from `/etc/nixos`:

```bash
nix flake update quench
nix build .#nixosConfigurations.symphony.config.system.build.toplevel
sudo nixos-rebuild switch --flake .#symphony
systemctl status quench-native
curl --fail https://quench.prominent.tools/api/plants
```

Migrations run through `quench-native-migrate.service`. PostgreSQL 18.4 is managed by NixOS and backed up to Biltmore by `postgresqlBackup-quench_prod.timer`.

## License

Private
