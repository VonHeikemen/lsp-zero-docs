---
prev: false
next: false
---

# Lua config

Here I will show you a fully working example configuration that you can use as your `init.lua`.

::: details Expand: what's an init.lua?

Before I tell you, consider following [this tutorial](../tutorial) instead of copy/pasting this example config.

`init.lua` is the configuration file Neovim looks for during the initialization process.

The location of this file depends on your operating system. If you want to know where it should be located, you can execute this command in your terminal.

```sh
nvim --headless -c 'echo stdpath("config") . "\n"' -c 'quit'
```

Note that Neovim will not create that folder (or the init.lua file) for you. You need to do that manually.

:::

Note: after you install a language server with mason.nvim there is a good chance the server won't be able to initialize correctly. Try to "refresh" the file with the command :edit, and if that doesn't work restart neovim.

```lua
local lazypath = vim.fn.stdpath('data') .. '/lazy/lazy.nvim'
local uv = vim.uv or vim.loop

-- Auto-install lazy.nvim if not present
if not uv.fs_stat(lazypath) then
  print('Installing lazy.nvim....')
  vim.fn.system({
    'git',
    'clone',
    '--filter=blob:none',
    'https://github.com/folke/lazy.nvim.git',
    '--branch=stable', -- latest stable release
    lazypath,
  })
end

vim.opt.rtp:prepend(lazypath)

require('lazy').setup({
  {
    'VonHeikemen/lsp-zero.nvim',
    branch = 'v2.x',
    dependencies = {
      -- LSP Support
      {'neovim/nvim-lspconfig'},             -- Required
      {'williamboman/mason.nvim'},           -- Optional
      {'williamboman/mason-lspconfig.nvim'}, -- Optional

      -- Autocompletion
      {'hrsh7th/nvim-cmp'},     -- Required
      {'hrsh7th/cmp-nvim-lsp'}, -- Required
      {'L3MON4D3/LuaSnip'},     -- Required
    }
  }
})

local lsp = require('lsp-zero').preset({})

lsp.on_attach(function(client, bufnr)
  -- see :help lsp-zero-keybindings
  -- to learn the available actions
  lsp.default_keymaps({buffer = bufnr})
end)

-- (Optional) Configure lua language server for neovim
require('lspconfig').lua_ls.setup(lsp.nvim_lua_ls())

lsp.setup()
```

