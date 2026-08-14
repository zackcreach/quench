defmodule QuenchWeb.PlantController do
  use QuenchWeb, :controller

  alias Quench.Plants
  alias Quench.Plants.Plant

  action_fallback QuenchWeb.FallbackController

  def index(conn, %{"garden_id" => garden_id}) do
    with {:ok, garden} <- fetch_garden(conn, garden_id) do
      render(conn, :index, plants: Plants.list_plants(garden))
    end
  end

  def create(conn, %{"garden_id" => garden_id, "plant" => plant_params}) do
    with {:ok, garden} <- fetch_garden(conn, garden_id),
         {:ok, %Plant{} = plant} <- Plants.create_plant(garden, plant_params) do
      conn
      |> put_status(:created)
      |> render(:show, plant: plant)
    end
  end

  def show(conn, %{"garden_id" => garden_id, "id" => id}) do
    with {:ok, garden} <- fetch_garden(conn, garden_id),
         %Plant{} = plant <- Plants.get_plant(garden, id) do
      render(conn, :show, plant: plant)
    else
      nil -> QuenchWeb.FallbackController.call(conn, {:error, :not_found})
    end
  end

  def update(conn, %{"garden_id" => garden_id, "id" => id, "plant" => plant_params}) do
    with {:ok, garden} <- fetch_garden(conn, garden_id),
         %Plant{} = plant <- Plants.get_plant(garden, id),
         {:ok, %Plant{} = plant} <- Plants.update_plant(plant, plant_params) do
      render(conn, :show, plant: plant)
    else
      nil -> QuenchWeb.FallbackController.call(conn, {:error, :not_found})
    end
  end

  def delete(conn, %{"garden_id" => garden_id, "id" => id}) do
    with {:ok, garden} <- fetch_garden(conn, garden_id),
         %Plant{} = plant <- Plants.get_plant(garden, id),
         {:ok, %Plant{}} <- Plants.delete_plant(plant) do
      send_resp(conn, :no_content, "")
    else
      nil -> QuenchWeb.FallbackController.call(conn, {:error, :not_found})
    end
  end

  def water(conn, %{"garden_id" => garden_id, "id" => id}) do
    with {:ok, garden} <- fetch_garden(conn, garden_id),
         %Plant{} = plant <- Plants.get_plant(garden, id),
         {:ok, %Plant{} = plant} <- Plants.water_plant(plant) do
      render(conn, :show, plant: plant)
    else
      nil -> QuenchWeb.FallbackController.call(conn, {:error, :not_found})
    end
  end

  defp fetch_garden(conn, garden_id),
    do: Quench.Gardens.fetch_garden(conn.assigns.current_scope.user, garden_id)
end
