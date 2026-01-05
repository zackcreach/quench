# Global ARGs for multi-stage build
ARG ELIXIR_VERSION=1.17.3
ARG OTP_VERSION=27.1.2
ARG DEBIAN_VERSION=bullseye-20241111-slim
ARG BUILDER_IMAGE="hexpm/elixir:${ELIXIR_VERSION}-erlang-${OTP_VERSION}-debian-${DEBIAN_VERSION}"
ARG RUNNER_IMAGE="debian:${DEBIAN_VERSION}"

# Stage 1: Build the React Native/Expo web export
FROM node:20-slim AS frontend_builder

WORKDIR /app

# Copy package files from assets/
COPY assets/package.json assets/package-lock.json ./
RUN npm ci

# Copy source files from assets/
COPY assets/App.tsx assets/app.json assets/babel.config.js assets/tsconfig.json ./
COPY assets/src ./src
COPY assets/images ./images

# Build web export
RUN npx expo export --platform web --output-dir dist

# Stage 2: Build the Elixir release
FROM ${BUILDER_IMAGE} AS builder

RUN apt-get update -y && apt-get install -y build-essential git \
    && apt-get clean && rm -f /var/lib/apt/lists/*_*

WORKDIR /app

RUN mix local.hex --force && \
    mix local.rebar --force

ENV MIX_ENV="prod"

# Install mix dependencies
COPY mix.exs mix.lock ./
RUN mix deps.get --only $MIX_ENV
RUN mkdir config

# Copy compile-time config files
COPY config/config.exs config/${MIX_ENV}.exs config/
RUN mix deps.compile

COPY priv priv

# Copy the web export from frontend builder
COPY --from=frontend_builder /app/dist/ priv/static/

COPY lib lib

RUN mix compile

COPY config/runtime.exs config/
COPY rel rel

RUN mix release

# Stage 3: Production runner
FROM ${RUNNER_IMAGE}

RUN apt-get update -y && \
  apt-get install -y libstdc++6 openssl libncurses5 locales ca-certificates curl \
  && apt-get clean && rm -f /var/lib/apt/lists/*_*

RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

WORKDIR "/app"
RUN chown nobody /app

ENV MIX_ENV="prod"

COPY --from=builder --chown=nobody:root /app/_build/${MIX_ENV}/rel/quench ./

USER nobody

CMD ["/app/bin/quench", "start"]
