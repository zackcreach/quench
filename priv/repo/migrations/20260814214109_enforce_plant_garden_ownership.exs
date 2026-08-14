defmodule Quench.Repo.Migrations.EnforcePlantGardenOwnership do
  use Ecto.Migration

  def up do
    drop constraint(:plants, "plants_garden_id_fkey")

    alter table(:plants) do
      modify :garden_id, references(:gardens, type: :text, on_delete: :restrict), null: false
    end
  end

  def down do
    drop constraint(:plants, "plants_garden_id_fkey")

    alter table(:plants) do
      modify :garden_id, references(:gardens, type: :text, on_delete: :nilify_all), null: true
    end
  end
end
