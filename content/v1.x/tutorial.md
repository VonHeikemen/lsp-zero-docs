---
prev: false

next:
  text: LSP configuration
  link: ./language-server-configuration
---

# Tutorial

Here we will learn enough about Neovim to configure lsp-zero. We will create a configuration file called `init.lua`, install a plugin manager, a colorscheme and finally setup lsp-zero.

## Requirements

* Basic knowledge about Neovim: what is `normal mode`, `insert mode`, `command mode` and how to navigate between them.
* Neovim v0.7 or greater
* git

## The Entry Point

To start we will create the file known as `init.lua`. The location of this file depends on your operating system. If you want to know where that is execute this command on your terminal.

```sh
nvim --headless -c 'echo stdpath("config")' -c 'echo ""' -c 'quit'
```

Create that folder and then navigate to it. Use whatever method you know best, use a terminal or a graphical file explorer.

Now create an empty file called `init.lua`.

Once the configuration exists in your system you can access it from the terminal using this command.

```sh
nvim -c 'edit $MYVIMRC'
```

Now let's make sure Neovim is actually loading our file. If you press `<Tab>` in insert mode you'll notice it takes 8 spaces, we are going to change that by adding this to our init.lua.

```lua
-- Tab set to two spaces
vim.opt.tabstop = 2
vim.opt.shiftwidth = 2
vim.opt.softtabstop = 2
vim.opt.expandtab = true
```

We save the file and quit with the command `:wq`.

We enter Neovim again, go to insert mode then press `<Tab>`. If tab expands to two spaces we know everything is fine. If not, you're most likely editing the wrong file.

## Install the Plugin Manager

> Note: We don't **need** a plugin manager but they make our lives easier.

To download plugins we are going to use [vim-plug](https://github.com/junegunn/vim-plug), only because is still compatible with Neovim v0.5.

Go to vim-plug's github repo, in the [Installation section](https://github.com/junegunn/vim-plug#neovim), grab the command for your operating system, then execute it in your terminal.

I'll use the linux one:

```sh
sh -c 'curl -fLo "${XDG_DATA_HOME:-$HOME/.local/share}"/nvim/site/autoload/plug.vim --create-dirs \
       https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim'
```

Now we return to our `init.lua`. At the end of the file we add this.

```lua
local Plug = vim.fn['plug#']
vim.call('plug#begin')

vim.call('plug#end')
```

## Adding a new plugin

Now let's use vim-plug for real this time. We are going to test it with a colorscheme, the [nord theme](https://github.com/nordtheme/vim). Is not a fancy theme but is compatible with older versions of Neovim, which is perfect for this tutorial.

Ready? We are going to follow these steps.

1. Add the plugin to vim-plug's list. Use the `Plug` function in between the `vim.call` functions.

```lua{1,5}
local Plug = vim.fn['plug#']
vim.call('plug#begin')

-- Colorscheme
Plug('nordtheme/vim')

vim.call('plug#end')
```

2. Save the file.

3. Execute your configuration using the command `:source %`.

4. Install the plugin using the command `:PlugInstall`

5. Call the new colorscheme at the end of the `init.lua` file.

```lua
vim.opt.termguicolors = true
vim.cmd('colorscheme nord')
```

6. Restart Neovim.

## Setup lsp-zero

We need to add lsp-zero and all its dependencies in vim-plug's list.

```lua
local Plug = vim.fn['plug#']
vim.call('plug#begin')

-- Colorscheme
Plug('nordtheme/vim')

-- LSP Support
Plug('neovim/nvim-lspconfig')
Plug('williamboman/mason.nvim')
Plug('williamboman/mason-lspconfig.nvim')

-- Autocompletion
Plug('hrsh7th/nvim-cmp')
Plug('hrsh7th/cmp-buffer')
Plug('hrsh7th/cmp-path')
Plug('saadparwaiz1/cmp_luasnip')
Plug('hrsh7th/cmp-nvim-lsp')
Plug('hrsh7th/cmp-nvim-lua')

-- Snippets
Plug('L3MON4D3/LuaSnip')
Plug('rafamadriz/friendly-snippets')

Plug('VonHeikemen/lsp-zero.nvim', {branch = 'v1.x'})

vim.call('plug#end')
```

Save the file, "source" it, install the plugins. Then add the configuration of lsp-zero at the end of the file.

```lua
vim.opt.signcolumn = 'yes'

local lsp = require('lsp-zero').preset({
  name = 'minimal',
  set_lsp_keymaps = true,
  manage_nvim_cmp = true,
  suggest_lsp_servers = false,
})

lsp.setup()
```

Now you can restart Neovim.

Try to edit `init.lua`. Use the command `:edit $MYVIMRC`. Then use the command `:LspInstall`. The plugin `mason-lspconfig.nvim` will suggest a language server. It should show this message.

```
Please select which server you want to install for filetype "lua":
1: lua_ls
Type number and <Enter> or click with the mouse (q or empty cancels):
```

Choose 1 for `lua_ls`, then press enter. A floating window will appear, it will show the progress of the installation.

At the moment there is a good chance the language server can't start automatically after install. Use the command `:edit` to refresh the file or restart neovim if that doesn't work. Once the server starts you'll notice warning signs in the global variable `vim`, that means everything is well and good.

If you wanted to, could configure `lua_ls` specifically for neovim, by adding this line of code.

```lua
lsp.nvim_workspace()
```

You need to add it before calling `.setup()`.

```lua{10}
vim.opt.signcolumn = 'yes'

local lsp = require('lsp-zero').preset({
  name = 'minimal',
  set_lsp_keymaps = true,
  manage_nvim_cmp = true,
  suggest_lsp_servers = false,
})

lsp.nvim_workspace()

lsp.setup()
```

## Root directory

This is a very important concept you need to keep in mind. The "root directory" is the path where your code is. Think of it as your project folder. When you open a file compatible with a language server `lspconfig` will search for a set of files in the current folder (your working directory) or any of the parent folders. If it finds them, the language server will start analyzing that folder.

Some language servers have "single file support" enabled, this means if `lspconfig` can't determine the root directory then the current working directory becomes your root directory.

## Complete example

```lua
-- Tab set to two spaces
vim.opt.tabstop = 2
vim.opt.shiftwidth = 2
vim.opt.softtabstop = 2
vim.opt.expandtab = true

local Plug = vim.fn['plug#']
vim.call('plug#begin')

-- Colorscheme
Plug('nordtheme/vim')

-- LSP Support
Plug('neovim/nvim-lspconfig')
Plug('williamboman/mason.nvim')
Plug('williamboman/mason-lspconfig.nvim')

-- Autocompletion
Plug('hrsh7th/nvim-cmp')
Plug('hrsh7th/cmp-buffer')
Plug('hrsh7th/cmp-path')
Plug('saadparwaiz1/cmp_luasnip')
Plug('hrsh7th/cmp-nvim-lsp')
Plug('hrsh7th/cmp-nvim-lua')

-- Snippets
Plug('L3MON4D3/LuaSnip')
Plug('rafamadriz/friendly-snippets')

Plug('VonHeikemen/lsp-zero.nvim', {branch = 'v1.x'})

vim.call('plug#end')

vim.opt.termguicolors = true
vim.cmd('colorscheme nord')

-- Give me space
vim.opt.signcolumn = 'yes'

local lsp = require('lsp-zero').preset({
  name = 'minimal',
  set_lsp_keymaps = true,
  manage_nvim_cmp = true,
  suggest_lsp_servers = false,
})

lsp.nvim_workspace()

lsp.setup()
```

