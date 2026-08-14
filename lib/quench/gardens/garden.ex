defmodule Quench.Gardens.Garden do
  use Quench.Schema, prefix: "garden"

  import Ecto.Changeset

  schema "gardens" do
    field :name, :string
    belongs_to :owner, Quench.Accounts.User

    timestamps()
  end

  def changeset(garden, attrs) do
    garden
    |> cast(attrs, [:name])
    |> validate_required([:name])
  end
end
