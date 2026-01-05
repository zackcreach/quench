defmodule Quench.Repo.Migrations.CreatePlants do
  use Ecto.Migration

  def change do
    create table(:plants) do
      add :name, :string, null: false
      add :watering_interval_days, :integer, null: false
      add :last_watered_at, :utc_datetime
      add :order, :integer, default: 0

      timestamps()
    end
  end
end
