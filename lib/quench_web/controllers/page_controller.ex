defmodule QuenchWeb.PageController do
  use QuenchWeb, :controller

  def index(conn, _params) do
    index_path = Application.app_dir(:quench, "priv/static/index.html")

    if File.exists?(index_path) do
      conn
      |> put_resp_content_type("text/html")
      |> send_file(200, index_path)
    else
      conn
      |> put_status(404)
      |> json(%{error: "App not built. Run: npx expo export --platform web"})
    end
  end
end
