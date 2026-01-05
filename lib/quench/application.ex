defmodule Quench.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      QuenchWeb.Telemetry,
      Quench.Repo,
      {DNSCluster, query: Application.get_env(:quench, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: Quench.PubSub},
      # Start a worker by calling: Quench.Worker.start_link(arg)
      # {Quench.Worker, arg},
      # Start to serve requests, typically the last entry
      QuenchWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Quench.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    QuenchWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
