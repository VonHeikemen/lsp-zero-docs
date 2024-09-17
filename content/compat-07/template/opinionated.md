---
prev: false
next: false
---

# Opinionated config

Here I will show you a fully working example configuration that you can use as your `init.lua`. This one will have a fair amount code that goes beyond the essential. Here I will add more "completion sources" to nvim-cmp. More keybindings to the autocompletion plugin (nvim-cmp). And more snippets.

::: details Expand: what's an init.lua?

Before I tell you, consider following [this tutorial](../tutorial) instead of copy/pasting this example config.

`init.lua` is the configuration file Neovim looks for during the initialization process.

The location of this file depends on your operating system. If you want to know where it should be located, you can execute this command in your terminal.

```sh
nvim --headless -c 'echo stdpath("config") . "\n"' -c 'quit'
```

Note that Neovim will not create that folder (or the init.lua file) for you. You need to do that manually.

:::

::: tip Note:

This can be overwhelming for people (very) new to Neovim. I've seen people getting extremely confused because the autocompletion plugin works without a language server. Some of them deleted lsp-zero from their Neovim configuration because they don't know how to tweak it to their liking. So, if you find yourself overwhelmed use the "simple version" from the [lua config section](./lua-config) as a starting point.

:::

Make sure you download [vim-plug](https://github.com/junegunn/vim-plug) (the plugin manager) before you copy this code into your config.

```lua
local Plug = vim.fn['plug#']
vim.call('plug#begin')

Plug('williamboman/mason.nvim')
Plug('williamboman/mason-lspconfig.nvim')
Plug('neovim/nvim-lspconfig')
Plug('L3MON4D3/LuaSnip')
Plug('hrsh7th/nvim-cmp')
Plug('hrsh7th/cmp-nvim-lsp')
Plug('hrsh7th/cmp-buffer')
Plug('hrsh7th/cmp-path')
Plug('saadparwaiz1/cmp_luasnip')
Plug('rafamadriz/friendly-snippets')

Plug('VonHeikemen/lsp-zero.nvim', {branch = 'v3.x'})

vim.call('plug#end')

local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  lsp_zero.default_keymaps({buffer = bufnr})
end)

-- technically these are "diagnostic signs"
-- neovim enables them by default.
-- here we are just changing them to fancy icons.
lsp_zero.set_sign_icons({
  error = '✘',
  warn = '▲',
  hint = '⚑',
  info = '»'
})

require('mason').setup({})
require('mason-lspconfig').setup({
  handlers = {
    lsp_zero.default_setup,
    lua_ls = function()
      local lua_opts = lsp_zero.nvim_lua_ls()
      require('lspconfig').lua_ls.setup(lua_opts)
    end,
  }
})

local cmp = require('cmp')
local cmp_action = lsp_zero.cmp_action()

-- this is the function that loads the extra snippets
-- from rafamadriz/friendly-snippets
require('luasnip.loaders.from_vscode').lazy_load()

cmp.setup({
  sources = {
    {name = 'path'},
    {name = 'nvim_lsp'},
    {name = 'luasnip', keyword_length = 2},
    {name = 'buffer', keyword_length = 3},
  },
  window = {
    completion = cmp.config.window.bordered(),
    documentation = cmp.config.window.bordered(),
  },
  mapping = cmp.mapping.preset.insert({
    -- confirm completion item
    ['<Enter>'] = cmp.mapping.confirm({ select = true }),

    -- trigger completion menu
    ['<C-Space>'] = cmp.mapping.complete(),

    -- scroll up and down the documentation window
    ['<C-u>'] = cmp.mapping.scroll_docs(-4),
    ['<C-d>'] = cmp.mapping.scroll_docs(4),   

    -- navigate between snippet placeholders
    ['<C-f>'] = cmp_action.luasnip_jump_forward(),
    ['<C-b>'] = cmp_action.luasnip_jump_backward(),
  }),
  snippet = {
    expand = function(args)
      require('luasnip').lsp_expand(args.body)
    end,
  },
  -- note: if you are going to use lsp-kind (another plugin)
  -- replace the line below with the function from lsp-kind
  formatting = lsp_zero.cmp_format({details = true}),
})
```

