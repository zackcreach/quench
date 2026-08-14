defmodule QuenchWeb.AuthControllerTest do
  use QuenchWeb.ConnCase, async: true

  alias Quench.Accounts

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

  test "rejects API authentication without a CSRF token", %{conn: conn} do
    user = user_fixture() |> set_password()

    conn =
      post(conn, ~p"/api/login", %{user: %{email: user.email, password: valid_user_password()}})

    assert %{"error" => "csrf_token_invalid"} = json_response(conn, 403)
  end

  test "preserves an API session in the browser cookie", %{conn: conn} do
    user = user_fixture() |> set_password()
    {conn, _csrf_token} = log_in_api_user(conn, user)

    conn = conn |> recycle() |> get(~p"/api/session")

    assert %{"authenticated" => true, "user" => %{"id" => user_id}} = json_response(conn, 200)
    assert user.id == user_id
  end

  test "invalidates the API session on logout", %{conn: conn} do
    user = user_fixture() |> set_password()
    {conn, csrf_token} = log_in_api_user(conn, user)
    user_token = get_session(conn, :user_token)

    conn =
      conn
      |> recycle()
      |> put_req_header("x-csrf-token", csrf_token)
      |> delete(~p"/api/session")

    assert response(conn, 204)
    refute Accounts.get_user_by_session_token(user_token)

    conn = conn |> recycle() |> get(~p"/api/session")

    assert %{"authenticated" => false} = json_response(conn, 200)
  end

  test "does not authenticate expired API sessions", %{conn: conn} do
    user = user_fixture()
    user_token = Accounts.generate_user_session_token(user)
    offset_user_token(user_token, -15, :day)

    conn =
      conn
      |> init_test_session(%{})
      |> put_session(:user_token, user_token)
      |> get(~p"/api/session")

    assert %{"authenticated" => false} = json_response(conn, 200)
  end

  defp log_in_api_user(conn, user) do
    conn = get(conn, ~p"/api/session")
    assert %{"csrf_token" => csrf_token} = json_response(conn, 200)

    conn =
      conn
      |> recycle()
      |> put_req_header("x-csrf-token", csrf_token)
      |> post(~p"/api/login", %{user: %{email: user.email, password: valid_user_password()}})

    assert %{"authenticated" => true, "csrf_token" => new_csrf_token} = json_response(conn, 200)

    {conn, new_csrf_token}
  end
end
