defmodule Quench.Plants do
  import Ecto.Query
  alias Quench.Repo
  alias Quench.Plants.Plant

  def list_plants(garden) do
    Repo.all(from plant in Plant, where: plant.garden_id == ^garden.id)
  end

  def create_plant(garden, attrs) do
    %Plant{garden_id: garden.id}
    |> Plant.changeset(put_initial_last_watered_at(attrs))
    |> Repo.insert()
  end

  def get_plant(garden, id) do
    Repo.one(from plant in Plant, where: plant.id == ^id and plant.garden_id == ^garden.id)
  end

  def update_plant(%Plant{} = plant, attrs) do
    plant
    |> Plant.changeset(attrs)
    |> Repo.update()
  end

  def delete_plant(%Plant{} = plant) do
    Repo.delete(plant)
  end

  def water_plant(%Plant{} = plant) do
    plant
    |> Plant.changeset(%{last_watered_at: DateTime.utc_now()})
    |> Repo.update()
  end

  defp put_initial_last_watered_at(%{"last_watered_at" => nil} = attrs) do
    %{attrs | "last_watered_at" => DateTime.utc_now()}
  end

  defp put_initial_last_watered_at(%{"last_watered_at" => _last_watered_at} = attrs) do
    attrs
  end

  defp put_initial_last_watered_at(%{last_watered_at: nil} = attrs) do
    %{attrs | last_watered_at: DateTime.utc_now()}
  end

  defp put_initial_last_watered_at(%{last_watered_at: _last_watered_at} = attrs) do
    attrs
  end

  defp put_initial_last_watered_at(attrs) do
    put_initial_last_watered_at(attrs, Map.keys(attrs))
  end

  defp put_initial_last_watered_at(attrs, [key | _keys]) when is_binary(key) do
    Map.put(attrs, "last_watered_at", DateTime.utc_now())
  end

  defp put_initial_last_watered_at(attrs, _keys) do
    Map.put(attrs, :last_watered_at, DateTime.utc_now())
  end
end
