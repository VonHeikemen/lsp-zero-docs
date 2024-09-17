---
next:
  text: LSP Configuration
  link: ./language-server-configuration
---

# Getting started

## Requirements

* Neovim v0.7 or greater
* Basic knowledge about Neovim
* Basic knowledge about command line tools

::: tip Note:

If you don't have a configuration file for Neovim (`init.lua`) follow this [step by step tutorial](./tutorial).

:::

## Context

You need to know what's a language server.

A language server is a specific kind of tool. Usually they are command line tools that implement the [LSP specification](https://microsoft.github.io/language-server-protocol/). Long story short, the language server analyzes the source code in your project and tells the editor what to do.

Keep in mind not every command line tool follows the LSP specification. For example, [typescript-language-server](https://github.com/typescript-language-server/typescript-language-server) is a language server. [prettier](https://prettier.io/) (a formatter for javascript) is not a language server. lsp-zero can help you integrate Neovim with `typescript-language-server`, but it can't do the same with `prettier` (at least not directly).

Now, where does one find one of these language servers? You can find a list of language servers in nvim-lspconfig's repository, here: [server_configuration.md](https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md)

## Installing

First thing you would want to do is use your favorite plugin manager to install lsp-zero and all its lua dependencies.

::: details Expand: lazy.nvim

```lua
{
  'VonHeikemen/lsp-zero.nvim',
  branch = 'v1.x',
  dependencies = {
    -- LSP Support
    {'neovim/nvim-lspconfig'},             -- Required
    {'williamboman/mason.nvim'},           -- Optional
    {'williamboman/mason-lspconfig.nvim'}, -- Optional

    -- Autocompletion
    {'hrsh7th/nvim-cmp'},         -- Required
    {'hrsh7th/cmp-nvim-lsp'},     -- Required
    {'hrsh7th/cmp-buffer'},       -- Optional
    {'hrsh7th/cmp-path'},         -- Optional
    {'saadparwaiz1/cmp_luasnip'}, -- Optional
    {'hrsh7th/cmp-nvim-lua'},     -- Optional

    -- Snippets
    {'L3MON4D3/LuaSnip'},             -- Required
    {'rafamadriz/friendly-snippets'}, -- Optional
  }
}
```

:::

::: details Expand: packer.nvim

```lua
use {
  'VonHeikemen/lsp-zero.nvim',
  branch = 'v1.x',
  requires = {
    -- LSP Support
    {'neovim/nvim-lspconfig'},             -- Required
    {'williamboman/mason.nvim'},           -- Optional
    {'williamboman/mason-lspconfig.nvim'}, -- Optional

    -- Autocompletion
    {'hrsh7th/nvim-cmp'},         -- Required
    {'hrsh7th/cmp-nvim-lsp'},     -- Required
    {'hrsh7th/cmp-buffer'},       -- Optional
    {'hrsh7th/cmp-path'},         -- Optional
    {'saadparwaiz1/cmp_luasnip'}, -- Optional
    {'hrsh7th/cmp-nvim-lua'},     -- Optional

    -- Snippets
    {'L3MON4D3/LuaSnip'},             -- Required
    {'rafamadriz/friendly-snippets'}, -- Optional
  }
}
```

:::

::: details Expand: paq.nvim

```lua
{'VonHeikemen/lsp-zero.nvim', branch = 'v1.x'};

-- LSP Support
{'neovim/nvim-lspconfig'};             -- Required
{'williamboman/mason.nvim'};           -- Optional
{'williamboman/mason-lspconfig.nvim'}; -- Optional

-- Autocompletion Engine
{'hrsh7th/nvim-cmp'};         -- Required
{'hrsh7th/cmp-nvim-lsp'};     -- Required
{'hrsh7th/cmp-buffer'};       -- Optional
{'hrsh7th/cmp-path'};         -- Optional
{'saadparwaiz1/cmp_luasnip'}; -- Optional
{'hrsh7th/cmp-nvim-lua'};     -- Optional

-- Snippets
{'L3MON4D3/LuaSnip'};             -- Required
{'rafamadriz/friendly-snippets'}; -- Optional
```

:::

::: details Expand: vim-plug

```vim
" LSP Support
Plug 'neovim/nvim-lspconfig'             " Required
Plug 'williamboman/mason.nvim'           " Optional
Plug 'williamboman/mason-lspconfig.nvim' " Optional

" Autocompletion Engine
Plug 'hrsh7th/nvim-cmp'         " Required
Plug 'hrsh7th/cmp-nvim-lsp'     " Required
Plug 'hrsh7th/cmp-buffer'       " Optional
Plug 'hrsh7th/cmp-path'         " Optional
Plug 'saadparwaiz1/cmp_luasnip' " Optional
Plug 'hrsh7th/cmp-nvim-lua'     " Optional

"  Snippets
Plug 'L3MON4D3/LuaSnip'             " Required
Plug 'rafamadriz/friendly-snippets' " Optional

Plug 'VonHeikemen/lsp-zero.nvim', {'branch': 'v1.x'}
```

When using vimscript you can wrap lua code in `lua <<EOF ... EOF`.

```vim
lua <<EOF
print('this an example code')
print('written in lua')
EOF
```

:::

## Usage

Inside your configuration file add this piece of lua code.

```lua
local lsp = require('lsp-zero').preset({
  name = 'minimal',
  set_lsp_keymaps = true,
  manage_nvim_cmp = true,
  suggest_lsp_servers = false,
})

-- (Optional) Configure lua language server for neovim
-- lsp.nvim_workspace()

lsp.setup()
```

## Installing a language server

If you have [mason.nvim](https://github.com/williamboman/mason.nvim) and [mason-lspconfig](https://github.com/williamboman/mason-lspconfig.nvim) installed you can use the command `:LspInstall` to install a language server. If you call this command while you are in a file it'll suggest a list of language server based on the type of that file.

Alternatively, you can use the function [.ensure_installed()](./reference/lua-api#ensure-installed-list) to list the language servers you want to install with mason.nvim.

```lua{8-11}
local lsp = require('lsp-zero').preset({
  name = 'minimal',
  set_lsp_keymaps = true,
  manage_nvim_cmp = true,
  suggest_lsp_servers = false,
})

lsp.ensure_installed({
  -- replace these with the language servers you want to install
  'tsserver',
  'rust_analyzer',
})

lsp.setup()
```

