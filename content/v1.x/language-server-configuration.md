---
prev:
  text: Getting started
  link: ./getting-started

next:
  text: Autocompletion
  link: ./autocomplete
---

# LSP Configuration

## Introduction

Language servers are configured and initialized using [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig/).

lsp-zero calls lspconfig's setup function to initialize the LSP servers. It uses [cmp-nvim-lsp](https://github.com/hrsh7th/cmp-nvim-lsp) to tell the LSP server what features [nvim-cmp](https://github.com/hrsh7th/nvim-cmp) adds to the editor. And then it configures a function that will be executed every time a language server is attached to a buffer, this is where all keybindings and commands are created.

If you were to do it all by yourself, the code would look like this.

```lua
local lsp_capabilities = require('cmp_nvim_lsp').default_capabilities()
local lsp_attach = function(client, bufnr)
  vim.keymap.set('n', 'K', vim.lsp.buf.hover, {buffer = bufnr})
  -- More keybindings and commands....
end

require('lspconfig').tsserver.setup({
  on_attach = lsp_attach,
  capabilities = lsp_capabilities,
})

require('lspconfig').eslint.setup({
  on_attach = lsp_attach,
  capabilities = lsp_capabilities,
})
```

## Default keybindings

When a language server gets attached to a buffer you gain access to some keybindings and commands. All of these are bound to built-in functions, so you can get more details using the `:help` command.

* `K`: Displays hover information about the symbol under the cursor in a floating window. See [:help vim.lsp.buf.hover()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.hover()).

* `gd`: Jumps to the definition of the symbol under the cursor. See [:help vim.lsp.buf.definition()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.definition()).

* `gD`: Jumps to the declaration of the symbol under the cursor. Some servers don't implement this feature. See [:help vim.lsp.buf.declaration()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.declaration()).

* `gi`: Lists all the implementations for the symbol under the cursor in the quickfix window. See [:help vim.lsp.buf.implementation()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.implementation()).

* `go`: Jumps to the definition of the type of the symbol under the cursor. See [:help vim.lsp.buf.type_definition()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.type_definition()).

* `gr`: Lists all the references to the symbol under the cursor in the quickfix window. See [:help vim.lsp.buf.references()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.references()).

* `<Ctrl-k>`: Displays signature information about the symbol under the cursor in a floating window. See [:help vim.lsp.buf.signature_help()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.signature_help()). If a mapping already exists for this key this function is not bound.

* `<F2>`: Renames all references to the symbol under the cursor. See [:help vim.lsp.buf.rename()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.rename()).

* `<F4>`: Selects a code action available at the current cursor position. See [:help vim.lsp.buf.code_action()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.code_action()).

* `gl`: Show diagnostics in a floating window. See [:help vim.diagnostic.open_float()](https://neovim.io/doc/user/diagnostic.html#vim.diagnostic.open_float()).

* `[d`: Move to the previous diagnostic in the current buffer. See [:help vim.diagnostic.goto_prev()](https://neovim.io/doc/user/diagnostic.html#vim.diagnostic.goto_prev()).

* `]d`: Move to the next diagnostic. See [:help vim.diagnostic.goto_next()](https://neovim.io/doc/user/diagnostic.html#vim.diagnostic.goto_next()).

### Disable default keybindings

Call the function [.preset()](./reference/lua-api#preset-opts) then change the option `set_lsp_keymaps`.

To disable all default keybindings change `set_lsp_keymaps` to `false`.

```lua{3}
local lsp = require('lsp-zero').preset({
  name = 'minimal',
  set_lsp_keymaps = false,
  manage_nvim_cmp = true,
  suggest_lsp_servers = false,
})

lsp.setup()
```

If you just want to disable a few of them use the `omit` option.

```lua{3}
local lsp = require('lsp-zero').preset({
  name = 'minimal',
  set_lsp_keymaps = {omit = {'<F2>', 'gl'}},
  manage_nvim_cmp = true,
  suggest_lsp_servers = false,
})

lsp.setup()
```

### Create new keybindings

Just like the default keybindings the idea here is to create them only when a language server is active in a buffer. For this use the [.on_attach()](./reference/lua-api#on-attach-callback) function, and then use neovim's built-in functions create the keybindings.

```lua{11}
local lsp = require('lsp-zero').preset({
  name = 'minimal',
  set_lsp_keymaps = true,
  manage_nvim_cmp = true,
  suggest_lsp_servers = false,
})

lsp.on_attach(function(client, bufnr)
  local opts = {buffer = bufnr}

  vim.keymap.set('n', '<leader>r', '<cmd>lua vim.lsp.buf.rename()<cr>', opts)
  -- more keybindings...
end)

lsp.setup()
```

## Install new language servers

### Manual install

You can find the instruction for each language server in lspconfig's documentation: [server_configurations.md](https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md).

### Via command

If you have [mason.nvim](https://github.com/williamboman/mason.nvim) and [mason-lspconfig](https://github.com/williamboman/mason-lspconfig.nvim) installed you can use the command `:LspInstall` to install a language server. If you call this command while you are in a file it'll suggest a list of language server based on the type of that file.

### Automatic installs

If you have [mason.nvim](https://github.com/williamboman/mason.nvim) and [mason-lspconfig](https://github.com/williamboman/mason-lspconfig.nvim) installed you can use the function [.ensure_installed()](./reference/lua-api#ensure-installed-list) to list the language servers you want to install with mason.nvim.

::: tip Note:

The names of the servers must be in [this list](https://github.com/williamboman/mason-lspconfig.nvim#available-lsp-servers).

:::

```lua{8-11}
local lsp = require('lsp-zero').preset({
  name = 'minimal',
  set_lsp_keymaps = true,
  manage_nvim_cmp = true,
  suggest_lsp_servers = false,
})

lsp.ensure_installed({
  -- replace these with the language server you want to install
  'tsserver',
  'rust_analyzer',
})

lsp.setup()
```

## Configure language servers

To pass arguments to language servers use the function [.configure()](./reference/lua-api#configure-name-opts). You'll need to call it before [.setup()](./reference/lua-api#setup).

You can find the list of servers here: [server configurations](https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md).

Here is an example that adds a few options to `tsserver`.

```lua{8-17}
local lsp = require('lsp-zero').preset({
  name = 'minimal',
  set_lsp_keymaps = true,
  manage_nvim_cmp = true,
  suggest_lsp_servers = false,
})

lsp.configure('tsserver', {
  on_attach = function(client, bufnr)
    print('hello tsserver')
  end,
  settings = {
    completions = {
      completeFunctionCalls = true
    }
  }
})

lsp.setup()
```

This ".configure()" function uses [lspconfig](https://github.com/neovim/nvim-lspconfig/) under the hood. So the call to `.configure()` is very close to this.

```lua
--- **Do not** use the module `lspconfig` after using lsp-zero.

require('lspconfig')['tsserver'].setup({
  on_attach = function(client, bufnr)
    print('hello tsserver')
  end,
  settings = {
    completions = {
      completeFunctionCalls = true
    }
  }
})
```

I'm telling you this because I want you to know you can "translate" any config that uses `lspconfig` to lsp-zero.

### Disable a language server

Use the function [.skip_server_setup()](./reference/lua-api#skip-server-setup-list) to tell lsp-zero to ignore a particular set of language servers.

```lua{8}
local lsp = require('lsp-zero').preset({
  name = 'minimal',
  set_lsp_keymaps = true,
  manage_nvim_cmp = true,
  suggest_lsp_servers = false,
})

lsp.skip_server_setup({'eslint'})

lsp.setup()
```

## Custom servers

There are two ways you can use a server that is not supported by `lspconfig`:

### Add the configuration to lspconfig (recommended)

You can add the configuration to the module `lspconfig.configs` and then use lsp-zero.

You'll need to provide the command to start the LSP server, a list of filetypes where you want to attach the LSP server, and a function that detects the "root directory" of the project.

```lua
require('lspconfig.configs').name_of_my_lsp = {
  default_config = {
    name = 'my-new-lsp',
    cmd = {'command-that-starts-the-lsp'},
    filetypes = {'my-filetype'},
    root_dir = require('lspconfig.util').root_pattern({'some-config-file'})
  }
}

local lsp = require('lsp-zero').preset({
  name = 'minimal',
  set_lsp_keymaps = true,
  manage_nvim_cmp = true,
  suggest_lsp_servers = false,
})

lsp.configure('name_of_my_lsp', {force_setup = true})

lsp.setup()
```

### Use the function [.new_server()](./reference/lua-api#new-server-opts)

If you don't need a "robust" solution you can use the function `.new_server()`. This function is just a wrapper that calls [vim.lsp.start_client()](https://neovim.io/doc/user/lsp.html#vim.lsp.start_client()) in a `FileType` autocommand.

```lua
local lsp = require('lsp-zero').preset({
  name = 'minimal',
  set_lsp_keymaps = true,
  manage_nvim_cmp = true,
  suggest_lsp_servers = false,
})

lsp.new_server({
  name = 'my-new-lsp',
  cmd = {'my-new-lsp'},
  filetypes = {'my-filetype'},
  root_dir = function()
    return lsp.dir.find_first({'some-config-file'}) 
  end
})

lsp.setup()
```

## Enable Format on save

You can choose one of these methods.

### Explicit setup

If you want to control exactly what language server is used to format a file call the function [.format_on_save()](./reference/lua-api#format-on-save-opts), this will allow you to associate a language server with a list of filetypes.

```lua
local lsp = require('lsp-zero').preset({
  name = 'minimal',
  set_lsp_keymaps = true,
  manage_nvim_cmp = true,
  suggest_lsp_servers = false,
})

lsp.format_on_save({
  format_opts = {
    async = false,
    timeout_ms = 10000,
  },
  servers = {
    ['lua_ls'] = {'lua'},
    ['rust_analyzer'] = {'rust'},
  }
})

lsp.setup()
```

### Always use the active servers

If you only ever have **one** language server attached in each file and you are happy with all of them, you can call the function [.buffer_autoformat()](./reference/lua-api#buffer-autoformat-client-bufnr) in the [.on_attach](./reference/lua-api#on-attach-callback) hook.

```lua{9}
local lsp = require('lsp-zero').preset({
  name = 'minimal',
  set_lsp_keymaps = true,
  manage_nvim_cmp = true,
  suggest_lsp_servers = false,
})

lsp.on_attach(function(client, bufnr)
  lsp.buffer_autoformat()
end)

lsp.setup()
```

If you have multiple servers active in one file it'll try to format using all of them, and I can't guarantee the order.

Is worth mention [.buffer_autoformat()](./reference/lua-api#buffer-autoformat-client-bufnr) is a blocking (synchronous) function.

If you want something that behaves like [.buffer_autoformat()](./reference/lua-api#buffer-autoformat-client-bufnr) but is asynchronous you'll have to use [lsp-format.nvim](https://github.com/lukas-reineke/lsp-format.nvim).

```lua{11-13}
local lsp = require('lsp-zero').preset({
  name = 'minimal',
  set_lsp_keymaps = true,
  manage_nvim_cmp = true,
  suggest_lsp_servers = false,
})

lsp.on_attach(function(client, bufnr)
  -- make sure you use clients with formatting capabilities
  -- otherwise you'll get a warning message
  if client.supports_method('textDocument/formatting') then
    require('lsp-format').on_attach(client)
  end
end)

lsp.setup()
```

## Format buffer using a keybinding

### Using built-in functions

You'll want to bind the function [vim.lsp.buf.format()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.format()) to a keymap.

```lua{11-13}
local lsp = require('lsp-zero').preset({
  name = 'minimal',
  set_lsp_keymaps = true,
  manage_nvim_cmp = true,
  suggest_lsp_servers = false,
})

lsp.on_attach(function(client, bufnr)
  local opts = {buffer = bufnr}

  vim.keymap.set({'n', 'x'}, 'gq', function()
    vim.lsp.buf.format({async = false, timeout_ms = 10000})
  end, opts)
end)

lsp.setup()
```

With this the keyboard shortcut `gq` will be able to format the current buffer using **all** active servers with formatting capabilities.

If you want to allow only a list of servers, use the `filter` option.

```lua{8-10,19}
local lsp = require('lsp-zero').preset({
  name = 'minimal',
  set_lsp_keymaps = true,
  manage_nvim_cmp = true,
  suggest_lsp_servers = false,
})

local function allow_format(servers)
  return function(client) return vim.tbl_contains(servers, client.name) end
end

lsp.on_attach(function(client, bufnr)
  local opts = {buffer = bufnr}

  vim.keymap.set({'n', 'x'}, 'gq', function()
    vim.lsp.buf.format({
      async = false,
      timeout_ms = 10000,
      filter = allow_format({'lua_ls', 'rust_analyzer'})
    })
  end, opts)
end)

lsp.setup()
```

Using this `allow_format` function you can specify the language servers that you want to use.

### Ensure only one LSP server per filetype

If you want to control exactly what language server can format, use the function [.format_mapping()](./reference/lua-api#format-mapping-key-opts). It will allow you to associate a list of filetypes to a particular language server.

```lua
local lsp = require('lsp-zero').preset({
  name = 'minimal',
  set_lsp_keymaps = true,
  manage_nvim_cmp = true,
  suggest_lsp_servers = false,
})

lsp.format_mapping('gq', {
  format_opts = {
    async = false,
    timeout_ms = 10000,
  },
  servers = {
    ['lua_ls'] = {'lua'},
    ['rust_analyzer'] = {'rust'},
  }
})

lsp.setup()
```

## Diagnostics

### Default settings

To configure the UI for diagnostics lsp-zero uses [vim.diagnostic.config](https://neovim.io/doc/user/diagnostic.html#vim.diagnostic.config()) with the following arguments.

```lua
{
  virtual_text = false,
  signs = true,
  update_in_insert = false,
  underline = true,
  severity_sort = true,
  float = {
    focusable = false,
    style = 'minimal',
    border = 'rounded',
    source = 'always',
    header = '',
    prefix = '',
  },
}
```

### Configure diagnostics

If you want to override some settings lsp-zero provides make sure you call `vim.diagnostic.config` after lsp-zero's setup.

Here is an example that restores neovim's default configuration for diagnostics.

```lua
local lsp = require('lsp-zero').preset({
  name = 'minimal',
  set_lsp_keymaps = true,
  manage_nvim_cmp = true,
  suggest_lsp_servers = false,
})

lsp.setup()

vim.diagnostic.config({
  virtual_text = true,
  signs = true,
  update_in_insert = false,
  underline = true,
  severity_sort = false,
  float = true,
})
```

## Language servers and mason.nvim

Install and updates of language servers is done with [mason.nvim](https://github.com/williamboman/mason.nvim).

> With mason.nvim you can also install formatters and debuggers, but lsp-zero will only configure LSP servers.

To install a server manually use the command `LspInstall` with the name of the server you want to install. If you don't provide a name `mason-lspconfig.nvim` will try to suggest a language server based on the filetype of the current buffer.

To check for updates on the language servers use the command `Mason`. A floating window will open showing you all the tools mason.nvim can install. You can filter the packages by categories for example, language servers are in the second category, so if you press the number `2` it'll show only the language servers. The packages you have installed will appear at the top. If there is any update available the item will display a message. Navigate to that item and press `u` to install the update.

To uninstall a package use the command `Mason`. Navigate to the item you want to delete and press `X`.

To know more about the available bindings inside the floating window of Mason press `g?`.

If you need to customize mason.nvim make sure you do it before calling the lsp-zero module.

```lua
require('mason.settings').set({
  ui = {
    border = 'rounded'
  }
})

local lsp = require('lsp-zero').preset({
  name = 'minimal',
  set_lsp_keymaps = true,
  manage_nvim_cmp = true,
  suggest_lsp_servers = false,
})

lsp.setup()
```

### Opt-out of mason.nvim

Really all you need is to do is uninstall `mason.nvim` and `mason-lspconfig`. Or call [.preset()](./reference/lua-api#preset-opts) and use these settings:

```lua
suggest_lsp_servers = false
setup_servers_on_start = false
call_servers = 'global'
```

Then you need to specify which language server you want to setup, for this use [.setup_servers()](./reference/lua-api#setup-servers-list) or [.configure()](./reference/lua-api#configure-name-opts).

