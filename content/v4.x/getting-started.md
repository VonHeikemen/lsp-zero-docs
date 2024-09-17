---
next:
  text: LSP Configuration
  link: ./language-server-configuration
---

# Getting started

## Requirements

Before doing anything, make sure you...

  * Have Neovim v0.10 installed
    * Neovim v0.9 also works
  * Know how to install Neovim plugins
  * Know where to add the configuration code for lua plugins
  * Know what is LSP, and what is a language server

## Installing

Here I will show you how to use these plugins:

  * [VonHeikemen/lsp-zero.nvim](https://github.com/VonHeikemen/lsp-zero.nvim/tree/v4.x)
  * [neovim/nvim-lspconfig](https://github.com/neovim/nvim-lspconfig)
  * [hrsh7th/nvim-cmp](https://github.com/hrsh7th/nvim-cmp)
  * [hrsh7th/cmp-nvim-lsp](https://github.com/hrsh7th/cmp-nvim-lsp)

Use your favorite method to install them.

::: details Expand: lazy.nvim

```lua
{'VonHeikemen/lsp-zero.nvim', branch = 'v4.x'},
{'neovim/nvim-lspconfig'},
{'hrsh7th/cmp-nvim-lsp'},
{'hrsh7th/nvim-cmp'},
```

For a more advance config that lazy loads everything take a look at the example on this link: [Lazy loading with lazy.nvim](./guide/lazy-loading-with-lazy-nvim).

:::

::: details Expand: paq.nvim

```lua
{'VonHeikemen/lsp-zero.nvim', branch = 'v4.x'},
{'neovim/nvim-lspconfig'},
{'hrsh7th/cmp-nvim-lsp'},
{'hrsh7th/nvim-cmp'},
```

:::

::: details Expand: pckr.nvim

[lewis6991/pckr.nvim](https://github.com/lewis6991/pckr.nvim) is the spiritual successor of `packer.nvim`.

```lua
{'VonHeikemen/lsp-zero.nvim', branch = 'v4.x'};
{'neovim/nvim-lspconfig'};
{'hrsh7th/cmp-nvim-lsp'};
{'hrsh7th/nvim-cmp'};
```

:::

::: details Expand: packer.nvim

Note [wbthomason/packer.nvim](https://github.com/wbthomason/packer.nvim) has been officially unmantained since August 2023.

```lua
use({'VonHeikemen/lsp-zero.nvim', branch = 'v4.x'})
use({'neovim/nvim-lspconfig'})
use({'hrsh7th/nvim-cmp'})
use({'hrsh7th/cmp-nvim-lsp'})
```

:::

::: details Expand: mini.deps

```lua
MiniDeps.add({source = 'VonHeikemen/lsp-zero.nvim', checkout = 'v4.x'})
MiniDeps.add({source = 'neovim/nvim-lspconfig'})
MiniDeps.add({
  source = 'hrsh7th/nvim-cmp',
  depends = {
    'hrsh7th/cmp-nvim-lsp',
  },
})
```

:::

::: details Expand: vim-plug

```vim
Plug 'neovim/nvim-lspconfig'
Plug 'hrsh7th/nvim-cmp'
Plug 'hrsh7th/cmp-nvim-lsp'
Plug 'VonHeikemen/lsp-zero.nvim', {'branch': 'v4.x'}
```

When using vimscript you can wrap lua code in `lua <<EOF ... EOF`.

```lua
lua <<EOF
print('this an example code')
print('written in lua')
EOF
```
:::

::: details Expand: rocks.nvim

```
Rocks install lsp-zero.nvim scm
```

Is worth mention I don't manage the package that is hosted on luarocks. I think the developers of rocks.nvim have an automated process that does all the things. Also, I don't manage the versions of lsp-zero with git tags, I do it with branches. This means you'll have to install the "development" version.

**IMPORTANT:** If the autocompletion doesn't work you can try installing the dependencies manually. For that you have two options:

* Option 1: download from luarocks

  Install nvim-cmp.

  ```
  Rocks install nvim-cmp
  ```

  Install the LSP completion source.

  ```
  Rocks install cmp-nvim-lsp
  ```

* Option 2: download from git

  To allow rocks.nvim to download plugins from github you need to install this extension.

  ```
  Rocks install rocks-git.nvim
  ```

  Install nvim-cmp.

  ```
  Rocks install hrsh7th/nvim-cmp rev=main
  ```

  Install the LSP completion source.

  ```
  Rocks install hrsh7th/cmp-nvim-lsp rev=main
  ```

:::


::: details Expand: Git clone

To install a plugin without a plugin manager you just have to download them in the right location.

* Create the folder where plugins should be downloaded

  The exact path depends on your operating system and environment variables. To get a valid location you can execute this command in your terminal.

  ```sh
  nvim --headless -c "echo stdpath('config') . '/pack/github/start/'" -c "echo ''" -c "quit"
  ```

  Create that folder and navigate to it. Use whatever method you know best.

  Use the command `git clone` inside that folder.

* Install lsp-zero

  ```sh
  git clone --branch=v4.x https://github.com/VonHeikemen/lsp-zero.nvim.git
  ```

* Install nvim-lspconfig

  ```sh
  git clone https://github.com/neovim/nvim-lspconfig.git
  ```

* Install nvim-cmp

  ```sh
  git clone https://github.com/hrsh7th/nvim-cmp.git
  ```

* Install cmp-nvim-lsp

  ```sh
  git clone https://github.com/hrsh7th/cmp-nvim-lsp.git
  ```

:::

## Extend nvim-lspconfig

Now that you installed all the lua plugins is time to add some code in your Neovim configuration. Let's start with lsp-zero.

lsp-zero can handle some configurations steps for you: Set additional `capabilities` in nvim-lspconfig, creating an autocommand on the `LspAttach` event and reserve space in the gutter for diagnostic signs.

```lua
local lsp_zero = require('lsp-zero')

-- lsp_attach is where you enable features that only work
-- if there is a language server active in the file
local lsp_attach = function(client, bufnr)
  local opts = {buffer = bufnr}

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
end

lsp_zero.extend_lspconfig({
  sign_text = true,
  lsp_attach = lsp_attach,
  capabilities = require('cmp_nvim_lsp').default_capabilities(),
})
```

## Use nvim-lspconfig

Remember that you need to install a language server so nvim-lspconfig can work properly. You can find a list of language servers in [nvim-lspconfig's documentation](https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md).

Once you have a language server installed you add its setup function in your Neovim config. Follow this syntax.

```lua
require('lspconfig').example_server.setup({})

-- You would add this setup function after calling lsp_zero.extend_lspconfig()
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
    "$VIMRUNTIME",
    "${3rd}/luv/library"
  ]
}
```

:::

### Alternative install method

There is a way to install **some** language servers from inside Neovim. This requires two extra plugins and learning how to use them together with `lspconfig`. The details are in this guide: [Integrate with mason.nvim](./guide/integrate-with-mason-nvim)

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
---
-- LSP configuration
---
local lsp_zero = require('lsp-zero')

local lsp_attach = function(client, bufnr)
  local opts = {buffer = bufnr}

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
end

lsp_zero.extend_lspconfig({
  sign_text = true,
  lsp_attach = lsp_attach,
  capabilities = require('cmp_nvim_lsp').default_capabilities(),
})

-- These are just examples. Replace them with the language
-- servers you have installed in your system
require('lspconfig').gleam.setup({})
require('lspconfig').rust_analyzer.setup({})

---
-- Autocompletion setup
---
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

## Plot twist

You can get the same setup without lsp-zero.

Did you notice we use **only one** function of lsp-zero in this getting started? There are [more functions](./reference/lua-api) but if extend_lspconfig is all you need then you don't have to install my plugin.

::: details Expand: You might not need lsp-zero

```lua
---
-- LSP configuration
---
vim.opt.signcolumn = 'yes'

local lspconfig = require('lspconfig')

-- Add cmp_nvim_lsp capabilities settings to lspconfig
lspconfig.util.default_config.capabilities = vim.tbl_deep_extend(
  'force',
  lspconfig.util.default_config.capabilities,
  require('cmp_nvim_lsp').default_capabilities()
)

-- Executes the callback function every time a
-- language server is attached to a buffer.
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

---
-- Autocompletion setup
---
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

