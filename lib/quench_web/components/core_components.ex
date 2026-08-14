defmodule QuenchWeb.CoreComponents do
  use Phoenix.Component

  attr :field, Phoenix.HTML.FormField, required: true
  attr :type, :string, default: "text"
  attr :label, :string, default: nil
  attr :autocomplete, :string, default: nil
  attr :readonly, :boolean, default: false
  attr :required, :boolean, default: false
  attr :phx_mounted, :any, default: nil
  attr :rest, :global

  def input(assigns) do
    assigns = assign_new(assigns, :name, fn -> assigns.field.name end)
    assigns = assign_new(assigns, :value, fn -> assigns.field.value end)

    ~H"""
    <div>
      <label :if={@label} for={@field.id} class="mb-1 block text-sm font-medium text-slate-700">{@label}</label>
      <input id={@field.id} name={@name} value={@value} type={@type} autocomplete={@autocomplete} readonly={@readonly} required={@required} phx-mounted={@phx_mounted} class="block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" {@rest} />
      <p :for={{message, _opts} <- @field.errors} class="mt-1 text-sm text-red-600">{translate_error(message)}</p>
    </div>
    """
  end

  attr :rest, :global
  attr :name, :string, default: nil
  attr :value, :string, default: nil
  attr :variant, :string, default: nil
  slot :inner_block, required: true

  def button(assigns) do
    ~H"""
    <button class="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50" {@rest}>{render_slot(@inner_block)}</button>
    """
  end

  attr :name, :string, required: true
  attr :class, :string, default: nil

  def icon(assigns) do
    ~H"""
    <span class={@class} aria-hidden="true">•</span>
    """
  end

  slot :inner_block, required: true
  slot :subtitle

  def header(assigns) do
    ~H"""
    <header class="space-y-2">
      <h1 class="text-2xl font-bold text-slate-950">{render_slot(@inner_block)}</h1>
      <p :if={@subtitle != []} class="text-sm text-slate-600">{render_slot(@subtitle)}</p>
    </header>
    """
  end

  defp translate_error({message, _opts}), do: message
  defp translate_error(message), do: message
end
