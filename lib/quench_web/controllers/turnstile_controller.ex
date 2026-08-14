defmodule QuenchWeb.TurnstileController do
  use QuenchWeb, :controller

  def show(conn, _params) do
    site_key = Application.get_env(:quench, :turnstile, [])[:site_key]

    html(conn, """
    <!doctype html><html><head><script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script></head><body><div class="cf-turnstile" data-sitekey="#{site_key}" data-callback="turnstileComplete"></div><script>function turnstileComplete(token){window.parent.postMessage({type:"quench-turnstile",token:token},window.location.origin)}</script></body></html>
    """)
  end
end
