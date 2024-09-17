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

Keep in mind not every command line tool follows the LSP specification. For example, [typescript-language-server](https://github.com/typescript-language-server/typescript-language-server) is a language server. [prettier](https://prettier.io/) (a formatter for javascript) is not a language server. lsp-zero can help you integrate Neovim with `typescript-language-server`, but it can't do the same with `prettier` ([at least not directly](./language-server-configuration#how-to-format-file-using-tool)).

Now, where does one find one of these language servers? You can find a list of language servers in nvim-lspconfig's repository, here: [server_configuration.md](https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md)

## Installing

First thing you would want to do is use your favorite plugin manager to install lsp-zero and all its lua dependencies.

::: details Expand: packer.nvim

```lua
use {
  'VonHeikemen/lsp-zero.nvim',
  branch = 'compat-07',
  requires = {
    --- Uncomment these if you want to manage LSP servers from neovim
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
--- Uncomment these if you want to manage LSP servers from neovim
-- {'williamboman/mason.nvim'};
-- {'williamboman/mason-lspconfig.nvim'};

{'VonHeikemen/lsp-zero.nvim', branch = 'compat-07'};

{'neovim/nvim-lspconfig'};
{'hrsh7th/nvim-cmp'};
{'hrsh7th/cmp-nvim-lsp'};
{'L3MON4D3/LuaSnip'};
```

:::

::: details Expand: vim-plug

```vim
"  Uncomment these if you want to manage LSP servers from neovim
"  Plug 'williamboman/mason.nvim'
"  Plug 'williamboman/mason-lspconfig.nvim'

Plug 'neovim/nvim-lspconfig'
Plug 'hrsh7th/nvim-cmp'
Plug 'hrsh7th/cmp-nvim-lsp'
Plug 'L3MON4D3/LuaSnip'

Plug 'VonHeikemen/lsp-zero.nvim', {'branch': 'compat-07'}
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

The next step is to setup some keybindings. The common convention here is to enable these keybindings only when you have a language server active in the current file. Here is the code to achieve that.

```lua
local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  -- see :help lsp-zero-keybindings
  -- to learn the available actions
  lsp_zero.default_keymaps({buffer = bufnr})
end)

-- here you can setup the language servers 
```

Now you can install a language server. Go to nvim-lspconfig's documentation, in the [server_configuration.md](https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md) file you'll find a list of language servers and how to install them.

## Setup a language server

Once you have a language server installed in your system add it's setup in your Neovim config. Use the module `lspconfig`, like this.

```lua
require('lspconfig').example_server.setup({})

--- in your own config you should replace `example_server`
--- with the name of a language server you have installed
```

If you need to customize the language server add your settings inside the `{}`. To know more details about lspconfig use the command `:help lspconfig` or [click here](https://github.com/neovim/nvim-lspconfig/blob/8917d2c830e04bf944a699b8c41f097621283828/doc/lspconfig.txt#L46).


## Automatic setup

If you decided to install [mason.nvim](https://github.com/williamboman/mason.nvim) and [mason-lspconfig.nvim](https://github.com/williamboman/mason-lspconfig.nvim) you can manage the installation of the language servers from inside Neovim, and then use lsp-zero to handle the configuration.

Here is a basic usage example.

```lua
local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  -- see :help lsp-zero-keybindings
  -- to learn the available actions
  lsp_zero.default_keymaps({buffer = bufnr})
end)

require('mason').setup({})
require('mason-lspconfig').setup({
  ensure_installed = {},
  handlers = {
    lsp_zero.default_setup,
  },
})
```

If you need to configure a language server installed by `mason.nvim`, add a "handler function" to the `handlers` option. Something like this:

```lua
require('mason-lspconfig').setup({
  ensure_installed = {},
  handlers = {
    lsp_zero.default_setup,

    --- replace `example_server` with the name of a language server
    example_server = function()
      --- in this function you can setup
      --- the language server however you want. 
      --- in this example we just use lspconfig

      require('lspconfig').example_server.setup({
        ---
        -- in here you can add your own
        -- custom configuration
        ---
      })
    end,
  },
})
```

::: tip Note:

For more details about how to use mason.nvim with lsp-zero see the guide on how to [integrate with mason.nvim](./guide/integrate-with-mason-nvim).

:::

