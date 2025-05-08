---
next:
  text: LSP Configuration
  link: ./language-server-configuration
---

# Getting started

In this section you will learn how to add a very basic LSP setup to your existing Neovim config. If you want to learn how to setup everything from scratch, go to the [tutorial for beginners](./tutorial).

::: info Note:

Since Neovim v0.11 there is a "new API" to interact with language servers. But here I'll only show the "legacy API" that works in Neovim v0.10 and v0.9.

:::

## Requirements

Before doing anything, make sure you...

  * Have Neovim v0.10 installed
    * Neovim v0.9 also works
  * Know what is a language server
    * Neovim's LSP client only works with language servers
    * [prettier](https://prettier.io/) is not a language server

## Installing

Use your favorite method to install these plugins.

  * [neovim/nvim-lspconfig](https://github.com/neovim/nvim-lspconfig) `(v1.8.0)`
  * [hrsh7th/nvim-cmp](https://github.com/hrsh7th/nvim-cmp)
  * [hrsh7th/cmp-nvim-lsp](https://github.com/hrsh7th/cmp-nvim-lsp)

## Extend nvim-lspconfig

Now that you installed all the lua plugins is time to add some code in your Neovim configuration.

The first step is to prepare your custom keymaps and add extra settings from `cmp_nvim_lsp` to `nvim-lspconfig` defaults.

```lua
-- Reserve a space in the gutter
-- This will avoid an annoying layout shift in the screen
vim.opt.signcolumn = 'yes'

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
  desc = 'LSP actions',
  callback = function(event)
    local opts = {buffer = event.buf}

    vim.keymap.set('n', 'K', '<cmd>lua vim.lsp.buf.hover()<cr>', opts)
    vim.keymap.set('n', 'gd', '<cmd>lua vim.lsp.buf.definition()<cr>', opts)
    vim.keymap.set('n', 'gD', '<cmd>lua vim.lsp.buf.declaration()<cr>', opts)
    vim.keymap.set('n', 'gi', '<cmd>lua vim.lsp.buf.implementation()<cr>', opts)
    vim.keymap.set('n', 'go', '<cmd>lua vim.lsp.buf.type_definition()<cr>', opts)
    vim.keymap.set('n', 'gr', '<cmd>lua vim.lsp.buf.references()<cr>', opts)
    vim.keymap.set('n', 'gs', '<cmd>lua vim.lsp.buf.signature_help()<cr>', opts)
    vim.keymap.set('n', '<F2>', '<cmd>lua vim.lsp.buf.rename()<cr>', opts)
    vim.keymap.set({'n', 'x'}, '<F3>', '<cmd>lua vim.lsp.buf.format({async = true})<cr>', opts)
    vim.keymap.set('n', '<F4>', '<cmd>lua vim.lsp.buf.code_action()<cr>', opts)
  end,
})
```

## Use nvim-lspconfig

Remember that you need to install a language server so nvim-lspconfig can work properly. You can find a list of language servers in [nvim-lspconfig's documentation](https://github.com/neovim/nvim-lspconfig/blob/master/doc/configs.md).

Once you have a language server installed you add its setup function in your Neovim config. Follow this syntax.

```lua
require('lspconfig').example_server.setup({})
```

Where `example_server` is the name of the language server you installed in your system. For example, this is the setup for function for the lua language server.

```lua
require('lspconfig').lua_ls.setup({})
```

::: details Expand: Neovim and lua_ls

The language server for lua does not have "support" Neovim's lua API out the box. You won't get code completion for Neovim's built-in functions and you may see some annoying warnings.

To get some basic support for Neovim, create a file called `.luarc.json` in your Neovim config folder (next to your `init.lua` file). Then add this content.

```json
{
  "runtime.version": "LuaJIT",
  "runtime.path": [
    "lua/?.lua",
    "lua/?/init.lua"
  ],
  "diagnostics.globals": ["vim"],
  "workspace.checkThirdParty": false,
  "workspace.library": [
    "$VIMRUNTIME"
  ]
}
```

:::

### Alternative install method

There is a way to install **some** language servers from inside Neovim. This requires two extra plugins and learning how to use them together with `lspconfig`. The details are in this guide: [Integrate with mason.nvim](./guide/integrate-with-mason-nvim).

## Minimal autocompletion config

`nvim-cmp` is the plugin that you would use to get code autocompletion. By default nvim-cmp only handles the interface of the completion menu. It does not gather data from language servers or any other source.

`cmp_nvim_lsp` is an extension for nvim-cmp. This is the plugin that collects data from the language servers and gives it to `nvim-cmp`.

If you have Neovim v0.10 you can use this configuration.

```lua
local cmp = require('cmp')

cmp.setup({
  sources = {
    {name = 'nvim_lsp'},
  },
  snippet = {
    expand = function(args)
      -- You need Neovim v0.10 to use vim.snippet
      vim.snippet.expand(args.body)
    end,
  },
  mapping = cmp.mapping.preset.insert({}),
})
```

If you have Neovim v0.9 you will need to install a snippet engine. I recommend [luasnip](https://github.com/L3MON4D3/LuaSnip). Once you have it installed you can use it in the `snippet.expand` option.

```lua
snippet = {
  expand = function(args)
    require('luasnip').lsp_expand(args.body)
  end,
},
```

## Complete code

Lua code from previous sections put together.

::: details Expand: code snippet

```lua
-- Reserve a space in the gutter
vim.opt.signcolumn = 'yes'

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
  desc = 'LSP actions',
  callback = function(event)
    local opts = {buffer = event.buf}

    vim.keymap.set('n', 'K', '<cmd>lua vim.lsp.buf.hover()<cr>', opts)
    vim.keymap.set('n', 'gd', '<cmd>lua vim.lsp.buf.definition()<cr>', opts)
    vim.keymap.set('n', 'gD', '<cmd>lua vim.lsp.buf.declaration()<cr>', opts)
    vim.keymap.set('n', 'gi', '<cmd>lua vim.lsp.buf.implementation()<cr>', opts)
    vim.keymap.set('n', 'go', '<cmd>lua vim.lsp.buf.type_definition()<cr>', opts)
    vim.keymap.set('n', 'gr', '<cmd>lua vim.lsp.buf.references()<cr>', opts)
    vim.keymap.set('n', 'gs', '<cmd>lua vim.lsp.buf.signature_help()<cr>', opts)
    vim.keymap.set('n', '<F2>', '<cmd>lua vim.lsp.buf.rename()<cr>', opts)
    vim.keymap.set({'n', 'x'}, '<F3>', '<cmd>lua vim.lsp.buf.format({async = true})<cr>', opts)
    vim.keymap.set('n', '<F4>', '<cmd>lua vim.lsp.buf.code_action()<cr>', opts)
  end,
})

-- These are just examples. Replace them with the language
-- servers you have installed in your system
require('lspconfig').gleam.setup({})
require('lspconfig').rust_analyzer.setup({})

local cmp = require('cmp')

cmp.setup({
  sources = {
    {name = 'nvim_lsp'},
  },
  snippet = {
    expand = function(args)
      -- You need Neovim v0.10 to use vim.snippet
      vim.snippet.expand(args.body)
    end,
  },
  mapping = cmp.mapping.preset.insert({}),
})
```

:::

