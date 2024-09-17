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
  Plug 'neovim/nvim-lspconfig'
  Plug 'williamboman/mason.nvim'
  Plug 'williamboman/mason-lspconfig.nvim'
  Plug 'hrsh7th/nvim-cmp'
  Plug 'hrsh7th/cmp-nvim-lsp'
  Plug 'L3MON4D3/LuaSnip'
  Plug 'VonHeikemen/lsp-zero.nvim', {'branch': 'v3.x'}
call plug#end()

lua <<EOF
local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  -- see :help lsp-zero-keybindings
  -- to learn the available actions
  lsp_zero.default_keymaps({buffer = bufnr})
end)

-- to learn how to use mason.nvim with lsp-zero
-- read this: https://github.com/VonHeikemen/lsp-zero.nvim/blob/v3.x/doc/md/guides/integrate-with-mason-nvim.md
require('mason').setup({})
require('mason-lspconfig').setup({
  handlers = {
    function(server_name)
      require('lspconfig')[server_name].setup({})
    end,
  }
})
EOF
```

