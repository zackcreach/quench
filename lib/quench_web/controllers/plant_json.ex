defmodule QuenchWeb.PlantJSON do
  alias Quench.Plants.Plant

  def index(%{plants: plants}) do
    %{data: for(plant <- plants, do: data(plant))}
  end

  def show(%{plant: plant}) do
    %{data: data(plant)}
  end

  defp data(%Plant{} = plant) do
    %{
      id: plant.id,
      name: plant.name,
      watering_interval_days: plant.watering_interval_days,
      last_watered_at: plant.last_watered_at,
      order: plant.order,
      inserted_at: plant.inserted_at,
      updated_at: plant.updated_at
    }
  end
end
