defmodule Quench.Repo.Migrations.AddGardensAndScopePlants do
  use Ecto.Migration

  def change do
    create table(:gardens, primary_key: false) do
      add :id, :text, primary_key: true
      add :name, :text, null: false
      add :owner_id, references(:users, type: :text, on_delete: :delete_all), null: false
      timestamps(type: :utc_datetime)
    end

    create table(:garden_memberships, primary_key: false) do
      add :id, :text, primary_key: true
      add :garden_id, references(:gardens, type: :text, on_delete: :delete_all), null: false
      add :user_id, references(:users, type: :text, on_delete: :delete_all), null: false
      add :role, :text, null: false
      timestamps(type: :utc_datetime)
    end

    create unique_index(:garden_memberships, [:garden_id, :user_id])
    create index(:garden_memberships, [:user_id])

    alter table(:plants) do
      add :garden_id, references(:gardens, type: :text, on_delete: :nilify_all)
    end

    create index(:plants, [:garden_id])
  end
end
