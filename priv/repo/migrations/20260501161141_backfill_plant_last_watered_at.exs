defmodule Quench.Repo.Migrations.BackfillPlantLastWateredAt do
  use Ecto.Migration

  def change do
    execute(
      "UPDATE plants SET last_watered_at = COALESCE(updated_at, inserted_at, NOW()) WHERE last_watered_at IS NULL",
      ""
    )
  end
end
