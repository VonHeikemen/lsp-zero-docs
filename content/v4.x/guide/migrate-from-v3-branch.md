---
prev: false
next: false
---

# Migrating from v3.x branch

I will assume you are using Neovim v0.10 or greater.

Here you will find how to re-enable most of the features that were removed from the `v3.x` branch. If you want to see a complete config example, go to [example config](#example-config).

## Configure nvim-lspconfig

All options and configurations that were done automatically to nvim-lspconfig are opt-in.

Now you have to call the function [lsp-zero.extend_lspconfig()](../reference/lua-api#extend-lspconfig-opts).

```lua
local lsp_zero = require('lsp-zero')

local lsp_attach = function(client, bufnr)
  -- see :help lsp-zero-keybindings
  -- to learn the available actions
  lsp_zero.default_keymaps({buffer = bufnr})
end

lsp_zero.extend_lspconfig({
  capabilities = require('cmp_nvim_lsp').default_capabilities(),
  lsp_attach = lsp_attach,
  float_border = 'rounded',
  sign_text = true,
})
```

## Configure nvim-cmp

lsp-zero version 4 doesn't configure nvim-cmp automatically. You will have to provide the minimal configuration to make autocompletion work.

```lua
local cmp = require('cmp')

cmp.setup({
  sources = {
    {name = 'nvim_lsp'},
  },
  snippet = {
    expand = function(args)
      require('luasnip').lsp_expand(args.body)
    end,
  },
  mapping = cmp.mapping.preset.insert({}),
})
```

## Example Config

```lua
local lazypath = vim.fn.stdpath('data') .. '/lazy/lazy.nvim'
vim.opt.rtp:prepend(lazypath)

local ok, lazy = pcall(require, 'lazy')

if not ok then
  local msg = 'You need to install the plugin manager lazy.nvim\n'
    .. 'in this folder: ' .. lazypath

  print(msg)
  return
end

lazy.setup({
  {'VonHeikemen/lsp-zero.nvim', branch = 'v4.x'},
  {'neovim/nvim-lspconfig'},
  {'hrsh7th/nvim-cmp'},
  {'hrsh7th/cmp-nvim-lsp'},
  {'L3MON4D3/LuaSnip'},
})

local cmp = require('cmp')

cmp.setup({
  sources = {
    {name = 'nvim_lsp'},
  },
  snippet = {
    expand = function(args)
      require('luasnip').lsp_expand(args.body)
    end,
  },
  mapping = cmp.mapping.preset.insert({}),
})

local lsp_zero = require('lsp-zero')

local lsp_attach = function(client, bufnr)
  -- see :help lsp-zero-keybindings
  -- to learn the available actions
  lsp_zero.default_keymaps({buffer = bufnr})
end

lsp_zero.extend_lspconfig({
  capabilities = require('cmp_nvim_lsp').default_capabilities(),
  lsp_attach = lsp_attach,
  float_border = 'rounded',
  sign_text = true,
})

-- These are just examples. Replace them with the language
-- servers you have installed in your system
require('lspconfig').gleam.setup({})
require('lspconfig').ocamllsp.setup({})
```

