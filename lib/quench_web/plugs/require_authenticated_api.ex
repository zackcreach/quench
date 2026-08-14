defmodule QuenchWeb.Plugs.RequireAuthenticatedApi do
  import Plug.Conn

  def init(options), do: options

  def call(%{assigns: %{current_scope: %{user: user}}} = conn, _options) when not is_nil(user),
    do: conn

  def call(conn, _options) do
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(:unauthorized, ~s({"error":"authentication_required"}))
    |> halt()
  end
end
