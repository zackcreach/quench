defmodule Quench.PlantsTest do
  use Quench.DataCase, async: true

  alias Quench.Plants

  describe "create_plant/1" do
    test "sets last_watered_at when no value is provided" do
      assert {:ok, plant} =
               Plants.create_plant(%{
                 "name" => "Pothos",
                 "watering_interval_days" => 7
               })

      assert %DateTime{} = plant.last_watered_at
    end

    test "keeps an explicit last_watered_at value" do
      last_watered_at = ~U[2026-04-30 12:00:00Z]

      assert {:ok, plant} =
               Plants.create_plant(%{
                 name: "Fern",
                 watering_interval_days: 3,
                 last_watered_at: last_watered_at
               })

      assert last_watered_at == plant.last_watered_at
    end
  end
end
