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

This can be overwhelming for people who are (very) new to Neovim. So, if you find yourself overwhelmed use the "simple version" from the [lua config section](./lua-config) as a starting point.

```lua
local lazypath = vim.fn.stdpath('data') .. '/lazy/lazy.nvim'

-- Auto-install lazy.nvim if not present
if not vim.loop.fs_stat(lazypath) then
  print('Installing lazy.nvim....')
  vim.fn.system({
    'git',
    'clone',
    '--filter=blob:none',
    'https://github.com/folke/lazy.nvim.git',
    '--branch=stable', -- latest stable release
    lazypath,
  })
end

vim.opt.rtp:prepend(lazypath)

require('lazy').setup({
  {'VonHeikemen/lsp-zero.nvim', branch = 'v3.x'},
  {'williamboman/mason.nvim'},
  {'williamboman/mason-lspconfig.nvim'},
  {'neovim/nvim-lspconfig'},
  {'L3MON4D3/LuaSnip'},
  {'hrsh7th/nvim-cmp'},
  {'hrsh7th/cmp-nvim-lsp'},
  {'hrsh7th/cmp-buffer'},
  {'hrsh7th/cmp-path'},
  {'saadparwaiz1/cmp_luasnip'},
  {'rafamadriz/friendly-snippets'},
})

-- if you are using neovim v0.9 or lower
-- this colorscheme is better than the default
vim.cmd.colorscheme('habamax')

local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  -- keybindings are listed here:
  -- https://github.com/VonHeikemen/lsp-zero.nvim/blob/v3.x/doc/md/api-reference.md#default_keymapsopts
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

-- to learn how to use mason.nvim
-- read this: https://github.com/VonHeikemen/lsp-zero.nvim/blob/v3.x/doc/md/guides/integrate-with-mason-nvim.md
require('mason').setup({})
require('mason-lspconfig').setup({
  handlers = {
    function(server_name)
      require('lspconfig')[server_name].setup({})
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
  snippet = {
    expand = function(args)
      require('luasnip').lsp_expand(args.body)
    end,
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
  -- note: if you are going to use lsp-kind (another plugin)
  -- replace the line below with the function from lsp-kind
  formatting = lsp_zero.cmp_format({details = true}),
})
```

