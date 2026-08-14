{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    deploy-rs.url = "github:serokell/deploy-rs";
    deploy-rs.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      deploy-rs,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
        beamPackages = pkgs.beamMinimal27Packages.extend (
          _final: previous: {
            elixir = previous.elixir_1_19;
          }
        );
        version = "0.1.0";
        src = ./.;
        frontend = pkgs.buildNpmPackage {
          pname = "quench-frontend";
          inherit version;
          src = ./assets;
          npmDepsHash = "sha256-Y5HY/+LXQPJGqq6NzaBJs/bqoxmc4XKvbaSg6qrqVcs=";
          npmBuildScript = "web:export";
          npmFlags = [ "--ignore-scripts" ];
          preBuild = ''
            npm pkg set scripts.web:export="expo export --platform web --output-dir dist"
          '';
          installPhase = ''
            runHook preInstall
            cp -r dist $out
            runHook postInstall
          '';
        };
        mixFodDeps = beamPackages.fetchMixDeps {
          pname = "quench-mix-deps";
          inherit src version;
          hash = "sha256-aJf3FANT+J7Frd1uw7BgXoLzh8wSATTU1hp88hBVElw=";
        };
        devPostgres = pkgs.writeShellApplication {
          name = "dev-postgres";
          runtimeInputs = [ pkgs.postgresql_18 ];
          text = ''
            root_dir="''${DEV_POSTGRES_ROOT_DIR:-$PWD/.direnv/postgresql-18}"
            data_dir="$root_dir/data"
            socket_dir="$root_dir/socket"

            case "''${1:-}" in
              start)
                mkdir -p "$data_dir" "$socket_dir"
                chmod 700 "$data_dir" "$socket_dir"
                if [[ ! -s "$data_dir/PG_VERSION" ]]; then
                  initdb --pgdata="$data_dir" --username=postgres --auth=trust
                fi
                if pg_ctl --pgdata="$data_dir" status >/dev/null 2>&1; then
                  echo "PostgreSQL is already running"
                else
                  pg_ctl --pgdata="$data_dir" --log="$data_dir/postgresql.log" \
                    --options="-c listen_addresses= -c unix_socket_directories='$socket_dir'" start
                fi
                ;;
              stop)
                pg_ctl --pgdata="$data_dir" stop
                ;;
              status)
                pg_ctl --pgdata="$data_dir" status
                ;;
              *)
                echo "Usage: dev-postgres start|stop|status" >&2
                exit 2
                ;;
            esac
          '';
        };
      in
      {
        packages.default = beamPackages.mixRelease {
          pname = "quench";
          inherit src version mixFodDeps;
          preBuild = ''
            cp -r ${frontend}/* priv/static/
          '';
          postInstall = ''
            mkdir -p $out/share/prominent-tools
            printf '%s\n' '${self.rev or self.dirtyRev or "0000000000000000000000000000000000000000"}' > $out/share/prominent-tools/revision
          '';
        };

        packages.deploy-rs = deploy-rs.packages.${system}.default;

        devShells.default = pkgs.mkShell {
          packages = [
            beamPackages.elixir
            pkgs.nodejs_24
            pkgs.postgresql_18
            devPostgres
          ];

          shellHook = ''
            if [[ -z "''${DATABASE_URL:-}" && -z "''${DATABASE_SOCKET_DIR:-}" ]]; then
              export DEV_POSTGRES_ROOT_DIR="$PWD/.direnv/postgresql-18"
              export DATABASE_SOCKET_DIR="$DEV_POSTGRES_ROOT_DIR/socket"
              export DATABASE_USERNAME="postgres"
              export PGHOST="$DATABASE_SOCKET_DIR"
              export PGUSER="$DATABASE_USERNAME"
              dev-postgres start
            fi
          '';
        };
      }
    )
    // {
      deploy.nodes.symphony = {
        hostname = "127.0.0.1";
        sshUser = "prominent-deploy";
        sshOpts = [
          "-o"
          "StrictHostKeyChecking=accept-new"
          "-o"
          "IdentitiesOnly=yes"
          "-i"
          "/var/lib/prominent-deploy/.ssh/prominent-deploy"
        ];
        remoteBuild = false;
        profiles.quench = {
          user = "prominent-deploy";
          profilePath = "/nix/var/nix/profiles/per-user/prominent-deploy/quench";
          path = deploy-rs.lib.x86_64-linux.activate.custom self.packages.x86_64-linux.default "sudo /run/current-system/sw/bin/prominent-tools-activate quench";
        };
      };

      checks.x86_64-linux = deploy-rs.lib.x86_64-linux.deployChecks self.deploy;
    };
}
