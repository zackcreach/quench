defmodule QuenchWeb.AuthController do
  use QuenchWeb, :controller

  alias Quench.Accounts
  alias Quench.Gardens
  alias Quench.Turnstile
  alias QuenchWeb.UserAuth

  action_fallback QuenchWeb.FallbackController

  def session(conn, _params) do
    case get_in(conn.assigns, [:current_scope, Access.key(:user)]) do
      nil ->
        json(conn, %{authenticated: false, csrf_token: get_csrf_token()})

      user ->
        json(conn, %{
          authenticated: true,
          csrf_token: get_csrf_token(),
          user: user_json(user),
          gardens: garden_json(Gardens.list_gardens(user))
        })
    end
  end

  def register(conn, %{"user" => user_params, "turnstile_token" => turnstile_token}) do
    with :ok <- Turnstile.verify(turnstile_token),
         {:ok, user} <- Accounts.register_user_with_password(user_params) do
      conn = UserAuth.log_in_api_user(conn, user)

      json(conn, %{
        authenticated: true,
        csrf_token: get_csrf_token(),
        user: user_json(user),
        gardens: garden_json(Gardens.list_gardens(user))
      })
    else
      {:error, :verification_failed} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: "verification_failed"})

      {:error, changeset} ->
        QuenchWeb.FallbackController.call(conn, {:error, changeset})
    end
  end

  defp user_json(user), do: %{id: user.id, email: user.email}

  defp garden_json(gardens), do: Enum.map(gardens, &%{id: &1.id, name: &1.name})
end
