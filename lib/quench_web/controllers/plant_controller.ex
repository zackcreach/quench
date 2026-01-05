defmodule QuenchWeb.PlantController do
  use QuenchWeb, :controller

  alias Quench.Plants
  alias Quench.Plants.Plant

  action_fallback QuenchWeb.FallbackController

  def index(conn, _params) do
    plants = Plants.list_plants()
    render(conn, :index, plants: plants)
  end

  def create(conn, %{"plant" => plant_params}) do
    with {:ok, %Plant{} = plant} <- Plants.create_plant(plant_params) do
      conn
      |> put_status(:created)
      |> render(:show, plant: plant)
    end
  end

  def show(conn, %{"id" => id}) do
    plant = Plants.get_plant!(id)
    render(conn, :show, plant: plant)
  end

  def update(conn, %{"id" => id, "plant" => plant_params}) do
    plant = Plants.get_plant!(id)

    with {:ok, %Plant{} = plant} <- Plants.update_plant(plant, plant_params) do
      render(conn, :show, plant: plant)
    end
  end

  def delete(conn, %{"id" => id}) do
    plant = Plants.get_plant!(id)

    with {:ok, %Plant{}} <- Plants.delete_plant(plant) do
      send_resp(conn, :no_content, "")
    end
  end

  def water(conn, %{"id" => id}) do
    plant = Plants.get_plant!(id)

    with {:ok, %Plant{} = plant} <- Plants.water_plant(plant) do
      render(conn, :show, plant: plant)
    end
  end
end
