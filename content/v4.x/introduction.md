# Introduction

## What is lsp-zero?

Collection of functions that will help you use Neovim's LSP client. The aim is to provide abstractions on top of Neovim's LSP client that are easy to use.

::: details Expand: Showcase

```lua
-- WARNING: This is not a snippet you want to copy/paste blindly

-- This snippet is just a fun example I can show to people.
-- A showcase of all the functions they don't know about.
-- It also shows lsp-zero can work without nvim-lspconfig and nvim-cmp

vim.opt.updatetime = 800

local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  lsp_zero.default_keymaps({buffer = bufnr})
  lsp_zero.highlight_symbol(client, bufnr)
  lsp_zero.buffer_autoformat()
end)

lsp_zero.ui({
  float_border = 'rounded',
  sign_text = {
    error = '✘',
    warn = '▲',
    hint = '⚑',
    info = '»',
  },
})

lsp_zero.omnifunc.setup({
  trigger = '<C-Space>',
  tabcomplete = true,
  use_fallback = true,
  update_on_delete = true,
  -- You need Neovim v0.10 to use vim.snippet.expand
  expand_snippet = vim.snippet.expand
})

-- For this to work you need to install this:
-- https://www.npmjs.com/package/intelephense
lsp_zero.new_client({
  cmd = {'intelephense', '--stdio'},
  filetypes = {'php'},
  root_dir = function(bufnr)
    -- You need Neovim v0.10 to use vim.fs.root
    -- If vim.fs.root is not available, use this:
    -- lsp_zero.dir.find_first({buffer = true, 'composer.json'})

    return vim.fs.root(bufnr, {'composer.json'})
  end,
})

-- For this to work you need to install this:
-- https://github.com/LuaLS/lua-language-server
lsp_zero.new_client({
  cmd = {'lua-language-server'},
  filetypes = {'lua'},
  on_init = function(client)
    lsp_zero.nvim_lua_settings(client, {})
  end,
  root_dir = function(bufnr)
    -- You need Neovim v0.10 to use vim.fs.root
    -- Note: include a .git folder in the root of your Neovim config

    return vim.fs.root(bufnr, {'.git', '.luarc.json', '.luarc.jsonc'})
  end,
})
```

:::


## How to get started?

If you are new to neovim and you don't have a configuration file (`init.lua`) follow this [step by step tutorial](./tutorial).

If you know how to configure neovim go to the [Getting started section](./getting-started).

