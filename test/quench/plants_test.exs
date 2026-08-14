defmodule Quench.PlantsTest do
  use Quench.DataCase, async: true

  alias Quench.Plants.Plant
  alias Quench.{Gardens, Plants}
  alias Quench.AccountsFixtures

  describe "create_plant/2" do
    test "sets last_watered_at when no value is provided" do
      garden = default_garden()

      assert {:ok, plant} =
               Plants.create_plant(garden, %{
                 "name" => "Pothos",
                 "watering_interval_days" => 7
               })

      assert garden.id == plant.garden_id
      assert %DateTime{} = plant.last_watered_at
    end

    test "keeps an explicit last_watered_at value" do
      garden = default_garden()
      last_watered_at = ~U[2026-04-30 12:00:00Z]

      assert {:ok, plant} =
               Plants.create_plant(garden, %{
                 name: "Fern",
                 watering_interval_days: 3,
                 last_watered_at: last_watered_at
               })

      assert last_watered_at == plant.last_watered_at
    end
  end

  test "requires garden ownership" do
    changeset =
      Plant.changeset(%Plant{}, %{
        name: "Monstera",
        watering_interval_days: 7
      })

    assert %{garden_id: ["can't be blank"]} = errors_on(changeset)
  end

  defp default_garden do
    user = AccountsFixtures.user_fixture()
    assert [garden] = Gardens.list_gardens(user)
    garden
  end
end
