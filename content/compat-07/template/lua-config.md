---
prev: false
next: false
---

# Lua config

Here I will show you a full example configuration that you can use as your `init.lua`.

::: details Expand: what's an init.lua?

Before I tell you, consider following [this tutorial](../tutorial) instead of copy/pasting this example config.

`init.lua` is the configuration file Neovim looks for during the initialization process.

The location of this file depends on your operating system. If you want to know where it should be located, you can execute this command in your terminal.

```sh
nvim --headless -c 'echo stdpath("config") . "\n"' -c 'quit'
```

Note that Neovim will not create that folder (or the init.lua file) for you. You need to do that manually.

:::

After you install a language server with mason.nvim there is a good chance the server won't be able to initialize correctly the first time. Try to "refresh" the file with the command `:edit`, and if that doesn't work restart Neovim.

Make sure you download [vim-plug](https://github.com/junegunn/vim-plug) (the plugin manager) before you copy this code into your config.

```lua
local Plug = vim.fn['plug#']
vim.call('plug#begin')

Plug('neovim/nvim-lspconfig')
Plug('hrsh7th/cmp-nvim-lsp')
Plug('williamboman/mason.nvim')
Plug('williamboman/mason-lspconfig.nvim')
Plug('hrsh7th/nvim-cmp')
Plug('L3MON4D3/LuaSnip')

Plug('VonHeikemen/lsp-zero.nvim', {branch = 'compat-07'})

vim.call('plug#end')

local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  -- see :help lsp-zero-keybindings
  -- to learn the available actions
  lsp_zero.default_keymaps({buffer = bufnr})
end)

require('mason').setup({})
require('mason-lspconfig').setup({
  handlers = {
    lsp_zero.default_setup,
  }
})
```

