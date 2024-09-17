---
prev: false
next: false
---

# vimscript config

If vimscript is your jam I'm going to assume you already have some experience configuring Neovim. So I'm going to show you a minimal config that you can copy to your own `init.vim`.

Note that after you install a language server with mason.nvim there is a good chance the server won't be able to initialize correctly the first time. Try to "refresh" the file with the command `:edit`, and if that doesn't work restart Neovim.

Make sure you have Neovim v0.8 or greater and download [vim-plug](https://github.com/junegunn/vim-plug) (the plugin manager) before you copy this code into your config.

```vim
call plug#begin()
  " LSP Support
  Plug 'neovim/nvim-lspconfig'             " Required
  Plug 'williamboman/mason.nvim'           " Optional
  Plug 'williamboman/mason-lspconfig.nvim' " Optional

  " Autocompletion
  Plug 'hrsh7th/nvim-cmp'         " Required
  Plug 'hrsh7th/cmp-nvim-lsp'     " Required
  Plug 'L3MON4D3/LuaSnip'         " Required

  Plug 'VonHeikemen/lsp-zero.nvim', {'branch': 'v2.x'}
call plug#end()

lua <<EOF
local lsp = require('lsp-zero').preset({})

lsp.on_attach(function(client, bufnr)
  --" see :help lsp-zero-keybindings "
  --" to learn the available actions "
  lsp.default_keymaps({buffer = bufnr})
end)

--" (Optional) Configure lua language server for neovim "
require('lspconfig').lua_ls.setup(lsp.nvim_lua_ls())

lsp.setup()
EOF
```

