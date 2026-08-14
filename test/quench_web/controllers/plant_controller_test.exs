defmodule QuenchWeb.PlantControllerTest do
  use QuenchWeb.ConnCase, async: true

  alias Quench.{Gardens, Plants}

  import Quench.AccountsFixtures

  test "requires authentication for nested plant routes", %{conn: conn} do
    garden = default_garden(user_fixture())

    conn = get(conn, ~p"/api/gardens/#{garden.id}/plants")

    assert %{"error" => "authentication_required"} = json_response(conn, 401)
  end

  test "lists only plants in the authenticated user's garden", %{conn: conn} do
    user = user_fixture()
    garden = default_garden(user)
    other_garden = default_garden(user_fixture())

    assert {:ok, plant} = Plants.create_plant(garden, plant_attributes("Pothos"))
    assert {:ok, _plant} = Plants.create_plant(other_garden, plant_attributes("Fern"))

    conn =
      conn
      |> log_in_user(user)
      |> get(~p"/api/gardens/#{garden.id}/plants")

    plant_id = plant.id

    assert %{"data" => [%{"id" => ^plant_id, "name" => "Pothos"}]} = json_response(conn, 200)
  end

  test "does not disclose another user's garden", %{conn: conn} do
    user = user_fixture()
    other_garden = default_garden(user_fixture())

    conn =
      conn
      |> log_in_user(user)
      |> get(~p"/api/gardens/#{other_garden.id}/plants")

    assert %{"errors" => %{"detail" => "Not Found"}} = json_response(conn, 404)
  end

  test "does not disclose another garden's plant through an authorized garden", %{conn: conn} do
    user = user_fixture()
    garden = default_garden(user)
    other_garden = default_garden(user_fixture())

    assert {:ok, plant} = Plants.create_plant(other_garden, plant_attributes("Fern"))

    conn =
      conn
      |> log_in_user(user)
      |> get(~p"/api/gardens/#{garden.id}/plants/#{plant.id}")

    assert %{"errors" => %{"detail" => "Not Found"}} = json_response(conn, 404)
  end

  defp default_garden(user) do
    assert [garden] = Gardens.list_gardens(user)
    garden
  end

  defp plant_attributes(name) do
    %{name: name, watering_interval_days: 7}
  end
end
