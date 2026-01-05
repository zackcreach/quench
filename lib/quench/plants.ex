defmodule Quench.Plants do
  alias Quench.Repo
  alias Quench.Plants.Plant

  def list_plants do
    Repo.all(Plant)
  end

  def get_plant!(id) do
    Repo.get!(Plant, id)
  end

  def get_plant(id) do
    Repo.get(Plant, id)
  end

  def create_plant(attrs \\ %{}) do
    %Plant{}
    |> Plant.changeset(attrs)
    |> Repo.insert()
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
end
