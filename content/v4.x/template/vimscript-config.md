---
prev: false
next: false
---

# vimscript config

If vimscript is your jam I'm going to assume you already have some experience configuring Neovim. So I'm going to show you a minimal config that you can copy to your own `init.vim`.

Make sure you download [vim-plug](https://github.com/junegunn/vim-plug) (the plugin manager) before you copy this code into your config.

```vim
set signcolumn=yes

call plug#begin()
  Plug 'neovim/nvim-lspconfig', {'tag': 'v1.8.0', 'frozen': 1} 
  Plug 'mason-org/mason.nvim', {'tag': 'v1.11.0', 'frozen': 1}
  Plug 'mason-org/mason-lspconfig.nvim', {'tag': 'v1.32.0', 'frozen': 1}
  Plug 'hrsh7th/nvim-cmp'
  Plug 'hrsh7th/cmp-nvim-lsp'
call plug#end()

function! LspAttached() abort
  nnoremap <buffer> K <cmd>lua vim.lsp.buf.hover()<cr>
  nnoremap <buffer> gd <cmd>lua vim.lsp.buf.definition()<cr>
  nnoremap <buffer> gD <cmd>lua vim.lsp.buf.declaration()<cr>
  nnoremap <buffer> gi <cmd>lua vim.lsp.buf.implementation()<cr>
  nnoremap <buffer> go <cmd>lua vim.lsp.buf.type_definition()<cr>
  nnoremap <buffer> gr <cmd>lua vim.lsp.buf.references()<cr>
  nnoremap <buffer> gs <cmd>lua vim.lsp.buf.signature_help()<cr>
  nnoremap <buffer> <F2> <cmd>lua vim.lsp.buf.rename()<cr>
  nnoremap <buffer> <F3> <cmd>lua vim.lsp.buf.format({async = true})<cr>
  xnoremap <buffer> <F3> <cmd>lua vim.lsp.buf.format({async = true})<cr>
  nnoremap <buffer> <F4> <cmd>lua vim.lsp.buf.code_action()<cr>
endfunction

autocmd LspAttach * call LspAttached()

lua <<EOF
local lspconfig_defaults = require('lspconfig').util.default_config
lspconfig_defaults.capabilities = vim.tbl_deep_extend(
  'force',
  lspconfig_defaults.capabilities,
  require('cmp_nvim_lsp').default_capabilities()
)

require('mason').setup({})
require('mason-lspconfig').setup({
  handlers = {
    function(server_name)
      require('lspconfig')[server_name].setup({})
    end,
  }
})

local cmp = require('cmp')

cmp.setup({
  sources = {
    {name = 'nvim_lsp'},
  },
  snippet = {
    expand = function(args)
      vim.snippet.expand(args.body)
    end,
  },
  mapping = cmp.mapping.preset.insert({}),
})
EOF
```

