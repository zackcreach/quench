defmodule Quench.Plants.Plant do
  use Quench.Schema, prefix: "plant"

  import Ecto.Changeset

  schema "plants" do
    field :name, :string
    field :watering_interval_days, :integer
    field :last_watered_at, :utc_datetime
    field :order, :integer, default: 0

    timestamps()
  end

  def changeset(plant, attrs) do
    plant
    |> cast(attrs, [:name, :watering_interval_days, :last_watered_at, :order])
    |> validate_required([:name, :watering_interval_days])
    |> validate_number(:watering_interval_days, greater_than: 0)
  end
end
