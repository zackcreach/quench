defmodule QuenchWeb.HealthController do
  use QuenchWeb, :controller

  def index(conn, _params) do
    case Ecto.Adapters.SQL.query(Quench.Repo, "SELECT 1") do
      {:ok, _result} ->
        json(conn, %{status: "ok"})

      {:error, _reason} ->
        conn
        |> put_status(:service_unavailable)
        |> json(%{status: "error"})
    end
  end
end
