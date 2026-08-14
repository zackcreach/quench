defmodule QuenchWeb.Router do
  use QuenchWeb, :router

  import QuenchWeb.UserAuth
  import Phoenix.LiveView.Router

  alias QuenchWeb.Plugs.RequireAuthenticatedApi

  pipeline :api do
    plug :accepts, ["json"]
    plug :fetch_session
    plug :protect_from_forgery
    plug :fetch_current_scope_for_user
  end

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :fetch_current_scope_for_user
  end

  scope "/api", QuenchWeb do
    pipe_through :api

    get "/session", AuthController, :session
    post "/register", AuthController, :register
    post "/login", AuthController, :login
    delete "/session", AuthController, :delete

    scope "/gardens/:garden_id" do
      pipe_through RequireAuthenticatedApi

      resources "/plants", PlantController, except: [:new, :edit]
      post "/plants/:id/water", PlantController, :water
    end
  end

  scope "/auth", QuenchWeb do
    pipe_through :browser

    get "/turnstile", TurnstileController, :show
  end

  scope "/", QuenchWeb do
    pipe_through :api

    get "/health", HealthController, :index
  end

  if Application.compile_env(:quench, :dev_routes) do
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through [:fetch_session, :protect_from_forgery]

      live_dashboard "/dashboard", metrics: QuenchWeb.Telemetry
    end
  end

  ## Authentication routes

  scope "/", QuenchWeb do
    pipe_through [:browser, :require_authenticated_user]

    live_session :require_authenticated_user,
      on_mount: [{QuenchWeb.UserAuth, :require_authenticated}] do
      live "/users/settings", UserLive.Settings, :edit
      live "/users/settings/confirm-email/:token", UserLive.Settings, :confirm_email
    end

    post "/users/update-password", UserSessionController, :update_password
  end

  scope "/", QuenchWeb do
    pipe_through [:browser]

    if Mix.env() == :test do
      live_session :current_user,
        on_mount: [{QuenchWeb.UserAuth, :mount_current_scope}] do
        live "/users/register", UserLive.Registration, :new
        live "/users/log-in", UserLive.Login, :new
        live "/users/log-in/:token", UserLive.Confirmation, :new
      end
    else
      get "/users/log-in", PageController, :index

      live_session :current_user,
        on_mount: [{QuenchWeb.UserAuth, :mount_current_scope}] do
        live "/users/register", UserLive.Registration, :new
        live "/users/log-in/:token", UserLive.Confirmation, :new
      end
    end

    post "/users/log-in", UserSessionController, :create
    delete "/users/log-out", UserSessionController, :delete
  end

  scope "/", QuenchWeb do
    pipe_through :browser

    get "/*path", PageController, :index
  end
end
