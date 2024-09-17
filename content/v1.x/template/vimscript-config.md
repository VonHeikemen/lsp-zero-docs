---
prev: false
next: false
---

# vimscript config

Make sure to download [vim-plug](https://github.com/junegunn/vim-plug) (the plugin manager) before you copy this code into your config (`init.lua`).

Note: after you install a language server with `mason.nvim` there is a good chance the server won't be able to initialize correctly. Try to "refresh" the file with the command `:edit`, and if that doesn't work restart neovim.

```vim
call plug#begin()
  " LSP Support
  Plug 'neovim/nvim-lspconfig'             " Required
  Plug 'williamboman/mason.nvim'           " Optional
  Plug 'williamboman/mason-lspconfig.nvim' " Optional

  " Autocompletion Engine
  Plug 'hrsh7th/nvim-cmp'         " Required
  Plug 'hrsh7th/cmp-nvim-lsp'     " Required
  Plug 'hrsh7th/cmp-buffer'       " Optional
  Plug 'hrsh7th/cmp-path'         " Optional
  Plug 'saadparwaiz1/cmp_luasnip' " Optional
  Plug 'hrsh7th/cmp-nvim-lua'     " Optional

  " Snippets
  Plug 'L3MON4D3/LuaSnip'             " Required
  Plug 'rafamadriz/friendly-snippets' " Optional

  " LSP Setup
  Plug 'VonHeikemen/lsp-zero.nvim', {'branch': 'v1.x'}
call plug#end()

set signcolumn=yes

lua <<EOF
local lsp = require('lsp-zero').preset({
  name = 'minimal',
  set_lsp_keymaps = true,
  manage_nvim_cmp = true,
  suggest_lsp_servers = false,
})

lsp.setup()
EOF
```

