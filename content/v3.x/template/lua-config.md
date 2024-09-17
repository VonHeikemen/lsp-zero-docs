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

After you install a language server with mason.nvim there is a good chance the server won't be able to initialize correctly the first time. Try to "refresh" the file with the command `:edit`, and if that doesn't work restart Neovim.

```lua
local lazypath = vim.fn.stdpath('data') .. '/lazy/lazy.nvim'

-- Auto-install lazy.nvim if not present
if not vim.loop.fs_stat(lazypath) then
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
  {'VonHeikemen/lsp-zero.nvim', branch = 'v3.x'},
  {'williamboman/mason.nvim'},
  {'williamboman/mason-lspconfig.nvim'},
  {'neovim/nvim-lspconfig'},
  {'hrsh7th/cmp-nvim-lsp'},
  {'hrsh7th/nvim-cmp'},
  {'L3MON4D3/LuaSnip'},
})

-- if you are using neovim v0.9 or lower
-- this colorscheme is better than the default
vim.cmd.colorscheme('habamax')

local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  -- see :help lsp-zero-keybindings
  -- to learn the available actions
  lsp_zero.default_keymaps({buffer = bufnr})
end)

-- to learn how to use mason.nvim
-- read this: https://github.com/VonHeikemen/lsp-zero.nvim/blob/v3.x/doc/md/guides/integrate-with-mason-nvim.md
require('mason').setup({})
require('mason-lspconfig').setup({
  handlers = {
    function(server_name)
      require('lspconfig')[server_name].setup({})
    end,
  }
})
```

