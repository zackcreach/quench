import Config

database_config =
  case {System.get_env("DATABASE_URL"), System.get_env("DATABASE_SOCKET_DIR")} do
    {database_url, _socket_dir} when database_url not in [nil, ""] -> [url: database_url]
    {_database_url, socket_dir} when socket_dir not in [nil, ""] -> [socket_dir: socket_dir, username: System.get_env("DATABASE_USERNAME") || "postgres", database: System.get_env("DATABASE_NAME") || "quench_test#{System.get_env("MIX_TEST_PARTITION")}"]
    _external_database -> [username: "postgres", password: "postgres", hostname: "localhost", database: "quench_test#{System.get_env("MIX_TEST_PARTITION")}"]
  end

config :quench, Quench.Repo,
  database_config ++ [pool: Ecto.Adapters.SQL.Sandbox, pool_size: System.schedulers_online() * 2]

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :quench, QuenchWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "h6NHQukfZnO/CYGVCbEdHt1wW9QVCUoTulDiDi5QjuiQVu/RPg8Lcr5HyJ/kjGgb",
  server: false

# Print only warnings and errors during test
config :logger, level: :warning

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime

# Sort query params output of verified routes for robust url comparisons
config :phoenix,
  sort_verified_routes_query_params: true
