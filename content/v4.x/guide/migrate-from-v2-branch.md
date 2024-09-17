---
prev: false
next: false
---

# Migrating from v2.x branch

I will assume you are using Neovim v0.10 or greater.

Here you will find how to re-enable most of the features that were removed from the `v2.x` branch. If you want to see a complete config example, go to [example config](#example-config).

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

## Automatic install of language servers

In order to get automatic install of language server you will have to use the module `mason-lspconfig` and list the servers in the `ensure_installed` option. Like this.

```lua
require('mason').setup({})
require('mason-lspconfig').setup({
  ensure_installed = {'lua_ls', 'rust_analyzer'},
})
```

## Automatic configuration of language servers

To configure the language servers installed with `mason.nvim` automatically you should use the module `mason-lspconfig`.

You'll need to use the option `handlers` in mason-lspconfig. You can make a "default handler" that will setup the language servers using `lspconfig`.

```lua
local lsp_zero = require('lsp-zero')

require('mason').setup({})
require('mason-lspconfig').setup({
  ensure_installed = {'lua_ls', 'rust_analyzer'},
  handlers = {
    function(server_name)
      require('lspconfig')[server_name].setup({})
    end,
  }
})
```

To get more details on how to use mason.nvim with lsp-zero read this guide: [Integrate with mason.nvim](./integrate-with-mason-nvim)

## Exclude a language server from automatic configuration

You'll also need to use the option `handlers` in mason-lspconfig in order to disable a language server. This is in place of the `skip_server_setup` that was present in the `v2.x` branch.

Use the function [lsp-zero.noop()](../reference/lua-api#noop) as a handler to make mason-lspconfig ignore the language server.

```lua
local lsp_zero = require('lsp-zero')

require('mason').setup({})
require('mason-lspconfig').setup({
  ensure_installed = {'lua_ls', 'rust_analyzer', 'jdtls'},
  handlers = {
    -- this first function is the "default handler"
    -- it applies to every language server without a "custom handler"
    function(server_name)
      require('lspconfig')[server_name].setup({})
    end,

    -- this is the "custom handler" for `jdtls`
    -- noop is an empty function that doesn't do anything
    jdtls = lsp_zero.noop,
  }
})
```

## Setup lua_ls using mason-lspconfig

When using mason-lspconfig, if you want to configure a language server you need to add a handler with the name of the language server. In this handler you will assign a lua function, and inside this function you will configure the server.

```lua
local lsp_zero = require('lsp-zero')

require('mason').setup({})
require('mason-lspconfig').setup({
  ensure_installed = {'lua_ls', 'rust_analyzer'},
  handlers = {
    -- this first function is the "default handler"
    -- it applies to every language server without a "custom handler"
    function(server_name)
      require('lspconfig')[server_name].setup({})
    end,

    -- this is the "custom handler" for `lua_ls`
    lua_ls = function()
      require('lspconfig').lua_ls.setup({
        on_init = function(client)
          lsp_zero.nvim_lua_settings(client, {})
        end,
      })
    end,
  }
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
  mapping = cmp.mapping.preset.insert({}),
})
```

## Completion item label

In `v2.x` each completion item has a label that shows the source that created the item. This feature is now opt-in, you can use the function [lsp-zero.cmp_format()](../reference/lua-api#cmp-format-opts) to get the settings needed for nvim-cmp.

```lua
local cmp = require('cmp')
local cmp_format = require('lsp-zero').cmp_format()

cmp.setup({
  formatting = cmp_format,
})
```

## Scroll the documentation of completion item

To scroll the documentation window you will have to set the mappings manually.

```lua
local cmp = require('cmp')

cmp.setup({
  mapping = cmp.mapping.preset.insert({
    -- scroll up and down the documentation window
    ['<C-u>'] = cmp.mapping.scroll_docs(-4),
    ['<C-d>'] = cmp.mapping.scroll_docs(4),
  }),
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
  {'williamboman/mason.nvim'},
  {'williamboman/mason-lspconfig.nvim'},
  {'hrsh7th/nvim-cmp'},
  {'hrsh7th/cmp-nvim-lsp'},
  {'L3MON4D3/LuaSnip'},
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

require('mason').setup({})
require('mason-lspconfig').setup({
  ensure_installed = {},
  handlers = {
    -- this first function is the "default handler"
    -- it applies to every language server without a "custom handler"
    function(server_name)
      require('lspconfig')[server_name].setup({})
    end,

    -- this is the "custom handler" for `lua_ls`
    lua_ls = function()
      require('lspconfig').lua_ls.setup({
        on_init = function(client)
          lsp_zero.nvim_lua_settings(client, {})
        end,
      })
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
      require('luasnip').lsp_expand(args.body)
    end,
  },
  formatting = lsp_zero.cmp_format(),
  mapping = cmp.mapping.preset.insert({
    -- scroll up and down the documentation window
    ['<C-u>'] = cmp.mapping.scroll_docs(-4),
    ['<C-d>'] = cmp.mapping.scroll_docs(4),
  }),
})
```

