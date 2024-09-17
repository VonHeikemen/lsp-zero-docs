# Deprecated functions 

## set_preferences(*opts*)

This function allows you to override any configuration created by a preset.

::: info

You can configure lsp-zero's settings using [.preset()](./lua-api#preset-opts)

:::

## setup_nvim_cmp(*opts*)

Is used to modify the default settings for nvim-cmp.

`{opts}` supports the following properties:

* `completion`: Configures the behavior of the completion menu. You can find more details about its properties if you start typing the command `:help cmp-config.completion`.

* `sources`: List of configurations for "data sources". See `:help cmp-config.sources` to know more.

* `documentation`: Modifies the look of the documentation window. You can find more details about its properties if you start typing the command `:help cmp-config.window`.

* `preselect`: Sometimes the first item in the completion menu is preselected. Disable this behaviour by setting this to `cmp.PreselectMode.None`.

* `formatting`: Modifies the look of the completion menu. You can find more details about its properties if you start typing the command `:help cmp-config.formatting`.

* `mapping`: Sets the keybindings. See `:help cmp-mapping`.

* `select_behavior`: Configure behavior when navigating between items in the completion menu. It can be set to the values `'insert'` or `'select'`. With the value 'select' nothing happens when you move between items. With the value 'insert' it'll put the text from the selection in the buffer. Is worth mention these values are available as "types" in the `cmp` module: `require('cmp').SelectBehavior`.

What to do instead of using `.setup_nvim_cmp()`?

::: info

If you really need to customize nvim-cmp I suggest you use the [minimal](./lua-api#minimal) preset and setup everything directly using the `cmp` module.

:::

## nvim_workspace(*opts*)

Configures the language server for lua with options specifically tailored for Neovim.

`{opts}` supports the following properties:

* `root_dir`: a function that determines the working directory of the language server.

* `library`: a list of paths that the server should analyze.

By default only the runtime files of neovim and `vim.fn.stdpath('config')` will be included. To add the path to every plugin you'll need to do this.

```lua
lsp.nvim_workspace({
  library = vim.api.nvim_get_runtime_file('', true)
})
```

::: info

It is recommended that you use `lspconfig` to setup `lua_ls`, and use [.nvim_lua_ls()](./lua-api#nvim-lua-ls-opts) to get the data that you need.

```lua{7}
local lsp = require('lsp-zero').preset({})

lsp.on_attach(function(client, bufnr)
  lsp.default_keymaps({buffer = bufnr})
end)

require('lspconfig').lua_ls.setup(lsp.nvim_lua_ls())

lsp.setup()
```

:::

## defaults.diagnostics(*opts*)

Returns the configuration for diagnostics. If you provide the `{opts}` table it'll merge it with the defaults, this way you can extend or change the values easily.

## defaults.cmp_sources()

Returns the list of "sources" used in nvim-cmp.

## defaults.cmp_mappings(*opts*)

Returns a table with the default keybindings for nvim-cmp. If you provide the `{opts}` table it'll merge it with the defaults, this way you can extend or change the values easily.

## defaults.cmp_config(*opts*)

Returns the entire configuration table for nvim-cmp. If you provide the `{opts}` table it'll merge it with the defaults, this way you can extend or change the values easily.

## defaults.nvim_workspace(*opts*)

Returns the neovim specific settings for `lua_ls` language server.
