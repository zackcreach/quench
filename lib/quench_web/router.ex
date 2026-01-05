defmodule QuenchWeb.Router do
  use QuenchWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :browser do
    plug :accepts, ["html"]
  end

  scope "/api", QuenchWeb do
    pipe_through :api

    resources "/plants", PlantController, except: [:new, :edit]
    post "/plants/:id/water", PlantController, :water
  end

  if Application.compile_env(:quench, :dev_routes) do
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through [:fetch_session, :protect_from_forgery]

      live_dashboard "/dashboard", metrics: QuenchWeb.Telemetry
    end
  end

  scope "/", QuenchWeb do
    pipe_through :browser

    get "/*path", PageController, :index
  end
end
