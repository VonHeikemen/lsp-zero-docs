---
prev: false
next: false
---

# Migrating from v1.x branch

I will assume you are using Neovim v0.10 or greater.

Here you will find how to re-enable most of the features that were in the `v1.x` branch. If you just want to see a complete config, go to [example config](#example-config).

## Configure nvim-lspconfig

This is all the configuration that was done automatically in the `v1.x` branch.

```lua
-- Reserve a space in the gutter
-- This will avoid an annoying layout shift in the screen
vim.opt.signcolumn = 'yes'

-- Add borders to floating windows
vim.lsp.handlers['textDocument/hover'] = vim.lsp.with(
  vim.lsp.handlers.hover,
  {border = 'rounded'}
)
vim.lsp.handlers['textDocument/signatureHelp'] = vim.lsp.with(
  vim.lsp.handlers.signature_help,
  {border = 'rounded'}
)

-- Configure error/warnings interface
vim.diagnostic.config({
  virtual_text = false,
  severity_sort = true,
  float = {
    style = 'minimal',
    border = 'rounded',
    header = '',
    prefix = '',
  },
  signs = {
    text = {
      [vim.diagnostic.severity.ERROR] = '✘',
      [vim.diagnostic.severity.WARN] = '▲',
      [vim.diagnostic.severity.HINT] = '⚑',
      [vim.diagnostic.severity.INFO] = '»',
    },
  },
})

-- Add cmp_nvim_lsp capabilities settings to lspconfig
-- This should be executed before you configure any language server
local lspconfig_defaults = require('lspconfig').util.default_config
lspconfig_defaults.capabilities = vim.tbl_deep_extend(
  'force',
  lspconfig_defaults.capabilities,
  require('cmp_nvim_lsp').default_capabilities()
)

-- This is where you enable features that only work
-- if there is a language server active in the file
vim.api.nvim_create_autocmd('LspAttach', {
  callback = function(event)
    local opts = {buffer = event.buf}

    vim.keymap.set('n', 'K', '<cmd>lua vim.lsp.buf.hover()<cr>', opts)
    vim.keymap.set('n', 'gd', '<cmd>lua vim.lsp.buf.definition()<cr>', opts)
    vim.keymap.set('n', 'gD', '<cmd>lua vim.lsp.buf.declaration()<cr>', opts)
    vim.keymap.set('n', 'gi', '<cmd>lua vim.lsp.buf.implementation()<cr>', opts)
    vim.keymap.set('n', 'go', '<cmd>lua vim.lsp.buf.type_definition()<cr>', opts)
    vim.keymap.set('n', 'gr', '<cmd>lua vim.lsp.buf.references()<cr>', opts)
    vim.keymap.set('n', 'gs', '<cmd>lua vim.lsp.buf.signature_help()<cr>', opts)
    vim.keymap.set('n', 'gl', '<cmd>lua vim.diagnostic.open_float()<cr>', opts)
    vim.keymap.set('n', '<F2>', '<cmd>lua vim.lsp.buf.rename()<cr>', opts)
    vim.keymap.set({'n', 'x'}, '<F3>', '<cmd>lua vim.lsp.buf.format({async = true})<cr>', opts)
    vim.keymap.set('n', '<F4>', '<cmd>lua vim.lsp.buf.code_action()<cr>', opts)
  end,
})
```

## Configure the lua language server

You will need to setup `lua_ls` using lspconfig, and then add the configuration in the language server setup.

```lua
require('lspconfig').lua_ls.setup({
  settings = {
    Lua = {
      runtime = {
        version = 'LuaJIT',
      },
      diagnostics = {
        globals = {'vim'},
      },
      workspace = {
        library = {vim.env.VIMRUNTIME},
      },
    },
  },
})
```

## Automatic install of language servers

This can be done using the module `mason-lspconfig (v1.32.0)`. Use the `ensure_installed` property of their `.setup()` function. There you can list all the language servers you want to install.

```lua
require('mason-lspconfig').setup({
  ensure_installed = {'lua_ls', 'rust_analyzer'},
})
```

## Enable automatic setup of language servers

This can be done using the module `mason-lspconfig (v1.32.0)`. In their `.setup()` function you will need to configure a property called `handlers`. You can setup a "default handler" and this will be enough to get the behaviour you want.

```lua
require('mason').setup({})
require('mason-lspconfig').setup({
  handlers = {
    -- this first function is the "default handler"
    -- it applies to every language server without a "custom handler"
    function(server_name)
      require('lspconfig')[server_name].setup({})
    end,
  },
})
```

To add a custom configuration to a server you need to add property to `handlers`, this property must be the name of the language server and you must assign a function. In this new function is where you will configure the language server.

```lua
require('mason-lspconfig').setup({
  handlers = {
    -- this first function is the "default handler"
    -- it applies to every language server without a "custom handler"
    function(server_name)
      require('lspconfig')[server_name].setup({})
    end,

    -- this is the "custom handler" for `lua_ls`
    lua_ls = function()
      require('lspconfig').lua_ls.setup({
        settings = {
          Lua = {
            runtime = {
              version = 'LuaJIT',
            },
            diagnostics = {
              globals = {'vim'},
            },
            workspace = {
              library = {vim.env.VIMRUNTIME},
            },
          },
        },
      })
    end,
  },
})
```

## Exclude a language server from automatic configuration

You'll also need to use the option `handlers` in mason-lspconfig in order to disable a language server. This is in place of the `skip_server_setup` that was present in the `v1.x` branch.

Create an empty function and use it as a handler to make mason-lspconfig ignore the language server.

```lua
local noop = function() end

require('mason').setup({})
require('mason-lspconfig').setup({
  ensure_installed = {'lua_ls', 'rust_analyzer', 'jdtls'},
  handlers = {
    function(server_name)
      require('lspconfig')[server_name].setup({})
    end,
    jdtls = noop,
  },
})
```

## Configure nvim-cmp

This is a minimal configuration to make autocompletion work.

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

## Configure completion sources

If you want to use the previous recommended config install these plugins in your Neovim config:

* [hrsh7th/nvim-cmp](https://github.com/hrsh7th/nvim-cmp)
* [hrsh7th/cmp-nvim-lsp](https://github.com/hrsh7th/cmp-nvim-lsp)
* [hrsh7th/cmp-buffer](https://github.com/hrsh7th/cmp-buffer)
* [hrsh7th/cmp-path](https://github.com/hrsh7th/cmp-path)
* [saadparwaiz1/cmp_luasnip](https://github.com/saadparwaiz1/cmp_luasnip)
* [rafamadriz/friendly-snippets](https://github.com/rafamadriz/friendly-snippets)
* [L3MON4D3/LuaSnip](https://github.com/L3MON4D3/LuaSnip)

```lua
local cmp = require('cmp')
require('luasnip.loaders.from_vscode').lazy_load()

cmp.setup({
  sources = {
    {name = 'path'},
    {name = 'nvim_lsp'},
    {name = 'buffer', keyword_length = 3},
    {name = 'luasnip', keyword_length = 2},
  },
  snippet = {
    expand = function(args)
      require('luasnip').lsp_expand(args.body)
    end,
  },
  mapping = cmp.mapping.preset.insert({}),
})
```

## Configure autocomplete mappings

You can add the mappings you want in your cmp setup. This config uses the old mappings from `v1.x`.

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
  mapping = cmp.mapping.preset.insert({
    -- confirm completion item
    ['<CR>'] = cmp.mapping.confirm({select = false}),

    -- scroll documentation window
    ['<C-f>'] = cmp.mapping.scroll_docs(5),
    ['<C-u>'] = cmp.mapping.scroll_docs(-5),

    -- toggle completion menu
    ['<C-e>'] = cmp.mapping(function(fallback)
      if cmp.visible() then
        cmp.abort()
      else
        cmp.complete()
      end
    end),

    -- tab complete
    ['<Tab>'] = cmp.mapping(function(fallback)
      local col = vim.fn.col('.') - 1

      if cmp.visible() then
        cmp.select_next_item({behavior = 'select'})
      elseif col == 0 or vim.fn.getline('.'):sub(col, col):match('%s') then
        fallback()
      else
        cmp.complete()
      end
    end, {'i', 's'}),

    -- go to previous item
    ['<S-Tab>'] = cmp.mapping.select_prev_item({behavior = 'select'}),

    -- navigate to next snippet placeholder
    ['<C-d>'] = cmp.mapping(function(fallback)
      local luasnip = require('luasnip')

      if luasnip.jumpable(1) then
        luasnip.jump(1)
      else
        fallback()
      end
    end, {'i', 's'}),

    -- navigate to the previous snippet placeholder
    ['<C-b>'] = cmp.mapping(function(fallback)
      local luasnip = require('luasnip')

      if luasnip.jumpable(-1) then
        luasnip.jump(-1)
      else
        fallback()
      end
    end, {'i', 's'}),
  }),
})
```

## Add borders to documentation window in completion menu

Add nvim-cmp's preset to the `window.documentation` property.

```lua
local cmp = require('cmp')

cmp.setup({
  window = {
    documentation = cmp.config.window.bordered(),
  },
})
```

## Preselect first completion item

Add the following settings to nvim-cmp.

```lua
local cmp = require('cmp')
vim.opt.completeopt = {'menu', 'menuone', 'noselect'}

cmp.setup({
  preselect = 'item',
  completion = {
    completeopt = 'menu,menuone,noinsert',
  },
})
```

## Completion item label

In `v1.x` each completion item has a label that shows the source that created the item. This is how you can implement it.

```lua
local cmp = require('cmp')

cmp.setup({
  formatting = {
    fields = {'abbr', 'menu', 'kind'},
    format = function(entry, item)
      local n = entry.source.name
      if n == 'nvim_lsp' then
        item.menu = '[LSP]'
      else
        item.menu = string.format('[%s]', n)
      end
      return item
    end,
  },
})
```

## Example config

The following config recreates most of the features that were in the `v1.x` branch.

```lua
--[[
  Make sure you have these plugins installed:
  * neovim/nvim-lspconfig (v1.8.0)
  * mason-org/mason.nvim (v1.11.0)
  * mason-org/mason-lspconfig.nvim (v1.32.0)
  * hrsh7th/nvim-cmp
  * hrsh7th/cmp-nvim-lsp
  * hrsh7th/cmp-buffer
  * hrsh7th/cmp-path
  * saadparwaiz1/cmp_luasnip
  * L3MON4D3/LuaSnip
  * rafamadriz/friendly-snippets
]]

-- Reserve a space in the gutter
-- This will avoid an annoying layout shift in the screen
vim.opt.signcolumn = 'yes'

-- Add borders to floating windows
vim.lsp.handlers['textDocument/hover'] = vim.lsp.with(
  vim.lsp.handlers.hover,
  {border = 'rounded'}
)
vim.lsp.handlers['textDocument/signatureHelp'] = vim.lsp.with(
  vim.lsp.handlers.signature_help,
  {border = 'rounded'}
)

-- Configure error/warnings interface
vim.diagnostic.config({
  virtual_text = false,
  severity_sort = true,
  float = {
    style = 'minimal',
    border = 'rounded',
    header = '',
    prefix = '',
  },
  signs = {
    text = {
      [vim.diagnostic.severity.ERROR] = '✘',
      [vim.diagnostic.severity.WARN] = '▲',
      [vim.diagnostic.severity.HINT] = '⚑',
      [vim.diagnostic.severity.INFO] = '»',
    },
  },
})

-- Add cmp_nvim_lsp capabilities settings to lspconfig
-- This should be executed before you configure any language server
local lspconfig_defaults = require('lspconfig').util.default_config
lspconfig_defaults.capabilities = vim.tbl_deep_extend(
  'force',
  lspconfig_defaults.capabilities,
  require('cmp_nvim_lsp').default_capabilities()
)

-- This is where you enable features that only work
-- if there is a language server active in the file
vim.api.nvim_create_autocmd('LspAttach', {
  callback = function(event)
    local opts = {buffer = event.buf}

    vim.keymap.set('n', 'K', '<cmd>lua vim.lsp.buf.hover()<cr>', opts)
    vim.keymap.set('n', 'gd', '<cmd>lua vim.lsp.buf.definition()<cr>', opts)
    vim.keymap.set('n', 'gD', '<cmd>lua vim.lsp.buf.declaration()<cr>', opts)
    vim.keymap.set('n', 'gi', '<cmd>lua vim.lsp.buf.implementation()<cr>', opts)
    vim.keymap.set('n', 'go', '<cmd>lua vim.lsp.buf.type_definition()<cr>', opts)
    vim.keymap.set('n', 'gr', '<cmd>lua vim.lsp.buf.references()<cr>', opts)
    vim.keymap.set('n', 'gs', '<cmd>lua vim.lsp.buf.signature_help()<cr>', opts)
    vim.keymap.set('n', 'gl', '<cmd>lua vim.diagnostic.open_float()<cr>', opts)
    vim.keymap.set('n', '<F2>', '<cmd>lua vim.lsp.buf.rename()<cr>', opts)
    vim.keymap.set({'n', 'x'}, '<F3>', '<cmd>lua vim.lsp.buf.format({async = true})<cr>', opts)
    vim.keymap.set('n', '<F4>', '<cmd>lua vim.lsp.buf.code_action()<cr>', opts)
  end,
})

require('mason').setup({})
require('mason-lspconfig').setup({
  ensure_installed = {},
  handlers = {
    -- this first function is the "default handler"
    -- it applies to every language server without a custom handler
    function(server_name)
      require('lspconfig')[server_name].setup({})
    end,

    -- this is the "custom handler" for `lua_ls`
    lua_ls = function()
      require('lspconfig').lua_ls.setup({
        settings = {
          Lua = {
            runtime = {
              version = 'LuaJIT',
            },
            diagnostics = {
              globals = {'vim'},
            },
            workspace = {
              library = {vim.env.VIMRUNTIME},
            },
          },
        },
      })
    end,
  },
})

local cmp = require('cmp')

require('luasnip.loaders.from_vscode').lazy_load()

vim.opt.completeopt = {'menu', 'menuone', 'noselect'}

cmp.setup({
  preselect = 'item',
  completion = {
    completeopt = 'menu,menuone,noinsert'
  },
  window = {
    documentation = cmp.config.window.bordered(),
  },
  sources = {
    {name = 'path'},
    {name = 'nvim_lsp'},
    {name = 'buffer', keyword_length = 3},
    {name = 'luasnip', keyword_length = 2},
  },
  snippet = {
    expand = function(args)
      require('luasnip').lsp_expand(args.body)
    end,
  },
  formatting = {
    fields = {'abbr', 'menu', 'kind'},
    format = function(entry, item)
      local n = entry.source.name
      if n == 'nvim_lsp' then
        item.menu = '[LSP]'
      else
        item.menu = string.format('[%s]', n)
      end
      return item
    end,
  },
  mapping = cmp.mapping.preset.insert({
    -- confirm completion item
    ['<CR>'] = cmp.mapping.confirm({select = false}),

    -- scroll documentation window
    ['<C-f>'] = cmp.mapping.scroll_docs(5),
    ['<C-u>'] = cmp.mapping.scroll_docs(-5),

    -- toggle completion menu
    ['<C-e>'] = cmp.mapping(function(fallback)
      if cmp.visible() then
        cmp.abort()
      else
        cmp.complete()
      end
    end),

    -- tab complete
    ['<Tab>'] = cmp.mapping(function(fallback)
      local col = vim.fn.col('.') - 1

      if cmp.visible() then
        cmp.select_next_item({behavior = 'select'})
      elseif col == 0 or vim.fn.getline('.'):sub(col, col):match('%s') then
        fallback()
      else
        cmp.complete()
      end
    end, {'i', 's'}),

    -- go to previous item
    ['<S-Tab>'] = cmp.mapping.select_prev_item({behavior = 'select'}),

    -- navigate to next snippet placeholder
    ['<C-d>'] = cmp.mapping(function(fallback)
      local luasnip = require('luasnip')

      if luasnip.jumpable(1) then
        luasnip.jump(1)
      else
        fallback()
      end
    end, {'i', 's'}),

    -- navigate to the previous snippet placeholder
    ['<C-b>'] = cmp.mapping(function(fallback)
      local luasnip = require('luasnip')

      if luasnip.jumpable(-1) then
        luasnip.jump(-1)
      else
        fallback()
      end
    end, {'i', 's'}),
  }),
})
```

