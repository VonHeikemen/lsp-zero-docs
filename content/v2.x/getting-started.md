---
next:
  text: LSP Configuration
  link: ./language-server-configuration
---

# Getting started

## Requirements

* Neovim v0.8 or greater
* Basic knowledge about Neovim
* Basic knowledge about command line tools

::: tip Note:

If you don't have a configuration file for Neovim (`init.lua`) follow this [step by step tutorial](./tutorial).

:::

## Context

You need to know what's a language server.

A language server is a specific kind of tool. Usually they are command line tools that implement the [LSP specification](https://microsoft.github.io/language-server-protocol/). Long story short, the language server analyzes the source code in your project and tells the editor what to do.

Keep in mind not every command line tool follows the LSP specification. For example, [typescript-language-server](https://github.com/typescript-language-server/typescript-language-server) is a language server. [prettier](https://prettier.io/) (a formatter for javascript) is not a language server. lsp-zero can help you integrate Neovim with `typescript-language-server`, but it can't do the same with `prettier` ([at least not directly](./language-server-configuration#how-to-format-file-using-tool)).

Now, where does one find one of these language servers? You can find a list of language servers in nvim-lspconfig's repository, here: [server_configuration.md](https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md)

## Installing

First thing you would want to do is use your favorite plugin manager to install lsp-zero and all its lua dependencies.

::: details Expand: lazy.nvim

For a more advance config that lazy loads everything take a look at the example on this link: [Lazy loading guide](./guide/lazy-loading-with-lazy-nvim).

```lua
{
  'VonHeikemen/lsp-zero.nvim',
  branch = 'v2.x',
  dependencies = {
    --- Uncomment the two plugins below if you want to manage
    --- the language servers from neovim
    -- {'williamboman/mason.nvim'},
    -- {'williamboman/mason-lspconfig.nvim'},
    
    {'neovim/nvim-lspconfig'},
    {'hrsh7th/nvim-cmp'},
    {'hrsh7th/cmp-nvim-lsp'},
    {'L3MON4D3/LuaSnip'},
  }
}
```

:::

::: details Expand: packer.nvim

```lua
use {
  'VonHeikemen/lsp-zero.nvim',
  branch = 'v2.x',
  requires = {
    --- Uncomment the two plugins below if you want to manage
    --- the language servers from neovim
    -- {'williamboman/mason.nvim'},
    -- {'williamboman/mason-lspconfig.nvim'},

    {'neovim/nvim-lspconfig'},
    {'hrsh7th/nvim-cmp'},
    {'hrsh7th/cmp-nvim-lsp'},
    {'L3MON4D3/LuaSnip'},
  }
}
```

:::

::: details Expand: paq.nvim

```lua
--- Uncomment the two plugins below if you want to manage
--- the language servers from neovim
-- {'williamboman/mason.nvim'};
-- {'williamboman/mason-lspconfig.nvim'};

{'VonHeikemen/lsp-zero.nvim', branch = 'v2.x'};
{'neovim/nvim-lspconfig'};
{'hrsh7th/nvim-cmp'};
{'hrsh7th/cmp-nvim-lsp'};
{'L3MON4D3/LuaSnip'};
```

:::

::: details Expand: vim-plug

```vim
"  Uncomment the two plugins below if you want to manage 
"  the language servers from neovim
"  Plug 'williamboman/mason.nvim'
"  Plug 'williamboman/mason-lspconfig.nvim'

Plug 'neovim/nvim-lspconfig'
Plug 'hrsh7th/nvim-cmp'
Plug 'hrsh7th/cmp-nvim-lsp'
Plug 'L3MON4D3/LuaSnip'
Plug 'VonHeikemen/lsp-zero.nvim', {'branch': 'v2.x'}
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

The next step is to setup the basic configuration for lsp-zero.

```lua
local lsp = require('lsp-zero').preset({})

lsp.on_attach(function(client, bufnr)
  -- see :help lsp-zero-keybindings
  -- to learn the available actions
  lsp.default_keymaps({buffer = bufnr})
end)

lsp.setup()
```

## Install a language server

If you decided to install [mason.nvim](https://github.com/williamboman/mason.nvim) and [mason-lspconfig.nvim](https://github.com/williamboman/mason-lspconfig.nvim), use the command `:LspInstall`. And when the installation is done restart neovim.

If you did not install `mason.nvim`, you can go to nvim-lspconfig's documentation, in the [server_configuration.md](https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md) file you'll find a list of language servers and how to install them.

## Setup a language server

If you installed a language server using mason.nvim then lsp-zero will setup the server for you. But if you didn't you need to add its setup function in your Neovim config.

```lua{11}
local lsp = require('lsp-zero').preset({})

lsp.on_attach(function(client, bufnr)
  -- see :help lsp-zero-keybindings
  -- to learn the available actions
  lsp.default_keymaps({buffer = bufnr})
end)

--- in your own config you should replace `example_server`
--- with the name of a language server you have installed
require('lspconfig').example_server.setup({})

lsp.setup()
```

If you need to customize the language server add your settings inside the `{}`. To know more details about lspconfig use the command `:help lspconfig` or [click here](https://github.com/neovim/nvim-lspconfig/blob/8917d2c830e04bf944a699b8c41f097621283828/doc/lspconfig.txt#L46).

