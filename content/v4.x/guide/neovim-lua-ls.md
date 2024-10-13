---
prev: false
next: false
---

# Configure lua language server for Neovim

There are two ways you can do this:

## Project specific config (recommended)

We can create a file called `.luarc.json` file in Neovim's config folder and add the following config.

```json
{
  "runtime.version": "LuaJIT",
  "runtime.path": [
    "lua/?.lua",
    "lua/?/init.lua"
  ],
  "diagnostics.globals": ["vim"],
  "workspace.checkThirdParty": false,
  "workspace.library": [
    "$VIMRUNTIME"
  ]
}
```

## Lua config

You can use the function [lsp-zero.nvim_lua_settings()](../reference/lua-api#nvim-lua-settings-client-opts) to get a basic config for `lua_ls`.

So, if there isn't any local config file (`.luarc.json`) in the current root directory then we can apply the Neovim specific settings to the language server.

```lua
local lsp_zero = require('lsp-zero')

require('lspconfig').lua_ls.setup({
  on_init = function(client)
    lsp_zero.nvim_lua_settings(client, {})
  end,
})
```

If you used `mason-lspconfig.nvim` to setup your language servers, add `lua_ls` to your handlers config.

```lua
local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  -- see :help lsp-zero-keybindings
  -- to learn the available actions
  lsp_zero.default_keymaps({buffer = bufnr})
end)

require('mason').setup({})
require('mason-lspconfig').setup({
  handlers = {
    function(server_name)
      require('lspconfig')[server_name].setup({})
    end,
    lua_ls = function()
      require('lspconfig').lua_ls.setup({
        on_init = function(client)
          lsp_zero.nvim_lua_settings(client, {})
        end,
      })
    end,
  },
})
```

