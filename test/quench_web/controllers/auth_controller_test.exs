defmodule QuenchWeb.AuthControllerTest do
  use QuenchWeb.ConnCase, async: true

  import Quench.AccountsFixtures

  test "returns an anonymous session and authenticates valid credentials", %{conn: conn} do
    user = user_fixture() |> set_password()

    conn = get(conn, ~p"/api/session")

    assert %{"authenticated" => false, "csrf_token" => csrf_token} = json_response(conn, 200)

    conn =
      conn
      |> recycle()
      |> put_req_header("x-csrf-token", csrf_token)
      |> post(~p"/api/login", %{user: %{email: user.email, password: valid_user_password()}})

    assert %{"authenticated" => true, "gardens" => [_garden]} = json_response(conn, 200)
  end

  test "rejects invalid credentials", %{conn: conn} do
    conn = get(conn, ~p"/api/session")
    assert %{"csrf_token" => csrf_token} = json_response(conn, 200)

    conn =
      conn
      |> recycle()
      |> put_req_header("x-csrf-token", csrf_token)
      |> post(~p"/api/login", %{user: %{email: "unknown@example.com", password: "incorrect"}})

    assert %{"error" => "invalid_credentials"} = json_response(conn, 401)
  end
end
