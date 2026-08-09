{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    { nixpkgs, flake-utils, ... }:
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
      in
      {
        packages.default = beamPackages.mixRelease {
          pname = "quench";
          inherit src version mixFodDeps;
          preBuild = ''
            cp -r ${frontend}/* priv/static/
          '';
        };

        devShells.default = pkgs.mkShell {
          packages = [
            beamPackages.elixir
            pkgs.nodejs_24
            pkgs.postgresql_18
          ];
        };
      }
    );
}
