defmodule Quench.Gardens.GardenMembership do
  use Quench.Schema, prefix: "garden_membership"

  import Ecto.Changeset

  schema "garden_memberships" do
    field :role, Ecto.Enum, values: [:owner, :editor]
    belongs_to :garden, Quench.Gardens.Garden
    belongs_to :user, Quench.Accounts.User

    timestamps()
  end

  def changeset(membership, attrs) do
    membership
    |> cast(attrs, [:role])
    |> validate_required([:role])
  end
end
