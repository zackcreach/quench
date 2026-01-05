defmodule Quench.Repo do
  use Ecto.Repo,
    otp_app: :quench,
    adapter: Ecto.Adapters.Postgres
end
