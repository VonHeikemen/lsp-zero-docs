---
prev: false
next: false
---

# Lua config

Make sure to download [vim-plug](https://github.com/junegunn/vim-plug) (the plugin manager) before you copy this code into your config (`init.lua`).

Note: after you install a language server with `mason.nvim` there is a good chance the server won't be able to initialize correctly. Try to "refresh" the file with the command `:edit`, and if that doesn't work restart neovim.

```lua
local Plug = vim.fn['plug#']
vim.call('plug#begin')

-- LSP Support
Plug('neovim/nvim-lspconfig')
Plug('williamboman/mason.nvim')
Plug('williamboman/mason-lspconfig.nvim')

-- Autocompletion
Plug('hrsh7th/nvim-cmp')
Plug('hrsh7th/cmp-buffer')
Plug('hrsh7th/cmp-path')
Plug('saadparwaiz1/cmp_luasnip')
Plug('hrsh7th/cmp-nvim-lsp')
Plug('hrsh7th/cmp-nvim-lua')

-- Snippets
Plug('L3MON4D3/LuaSnip')
Plug('rafamadriz/friendly-snippets')

Plug('VonHeikemen/lsp-zero.nvim', {branch = 'v1.x'})

vim.call('plug#end')

vim.opt.signcolumn = 'yes'

local lsp = require('lsp-zero').preset({
  name = 'minimal',
  set_lsp_keymaps = true,
  manage_nvim_cmp = true,
  suggest_lsp_servers = false,
})

-- (Optional) configure lua language server for neovim
-- lsp.nvim_workspace()

lsp.setup()
```

