defmodule Quench.Turnstile do
  @moduledoc false

  require Logger

  @verify_url "https://challenges.cloudflare.com/turnstile/v0/siteverify"

  def verify(token) do
    config = Application.get_env(:quench, :turnstile, [])

    if config[:enabled], do: verify_token(token, config), else: :ok
  end

  defp verify_token(token, _config) when token in [nil, ""], do: {:error, :verification_failed}

  defp verify_token(token, config) do
    options =
      [url: @verify_url, form: [secret: config[:secret_key], response: token]]
      |> Keyword.merge(config[:request_options] || [])

    case Req.post(options) do
      {:ok, %{status: 200, body: %{"success" => true}}} ->
        :ok

      {:ok, _response} ->
        {:error, :verification_failed}

      {:error, error} ->
        Logger.warning("Turnstile verification request failed: #{inspect(error)}")
        {:error, :verification_failed}
    end
  end
end
