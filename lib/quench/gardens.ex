defmodule Quench.Gardens do
  import Ecto.Query

  alias Quench.Gardens.{Garden, GardenMembership}
  alias Quench.Repo

  def create_default_garden(user) do
    with {:ok, garden} <-
           Repo.insert(Garden.changeset(%Garden{owner_id: user.id}, %{name: "My Garden"})),
         {:ok, _membership} <- create_membership(garden, user, :owner) do
      {:ok, garden}
    end
  end

  def list_gardens(user) do
    Garden
    |> join(:inner, [garden], membership in GardenMembership,
      on: membership.garden_id == garden.id
    )
    |> where([_garden, membership], membership.user_id == ^user.id)
    |> order_by([garden], asc: garden.name)
    |> Repo.all()
  end

  def fetch_garden(user, garden_id) do
    Garden
    |> join(:inner, [garden], membership in GardenMembership,
      on: membership.garden_id == garden.id
    )
    |> where([garden, membership], garden.id == ^garden_id and membership.user_id == ^user.id)
    |> Repo.one()
    |> case do
      nil -> {:error, :not_found}
      garden -> {:ok, garden}
    end
  end

  def owner?(user, garden_id) do
    Repo.exists?(
      from membership in GardenMembership,
        where:
          membership.garden_id == ^garden_id and membership.user_id == ^user.id and
            membership.role == :owner
    )
  end

  defp create_membership(garden, user, role) do
    %GardenMembership{garden_id: garden.id, user_id: user.id}
    |> GardenMembership.changeset(%{role: role})
    |> Repo.insert()
  end
end
