---
prev:
  text: Getting started
  link: ./getting-started

next:
  text: Autocompletion
  link: ./autocomplete
---

# LSP configuration

## Default keybindings

If you choose to use the function [.default_keymaps()](./reference/lua-api#default-keymaps-opts) you'll be able to use Neovim's built-in functions for various actions. Things like jump to definition, rename variable, format current file, and some more.

Note that the keybindings have to be enabled explicitly, like this.

```lua{4}
local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  lsp_zero.default_keymaps({buffer = bufnr})
end)
```

Here's the list of available keybindings:

* `K`: Displays hover information about the symbol under the cursor in a floating window. See [:help vim.lsp.buf.hover()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.hover()).

* `gd`: Jumps to the definition of the symbol under the cursor. See [:help vim.lsp.buf.definition()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.definition()).

* `gD`: Jumps to the declaration of the symbol under the cursor. Some servers don't implement this feature. See [:help vim.lsp.buf.declaration()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.declaration()).

* `gi`: Lists all the implementations for the symbol under the cursor in the quickfix window. See [:help vim.lsp.buf.implementation()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.implementation()).

* `go`: Jumps to the definition of the type of the symbol under the cursor. See [:help vim.lsp.buf.type_definition()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.type_definition()).

* `gr`: Lists all the references to the symbol under the cursor in the quickfix window. See [:help vim.lsp.buf.references()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.references()).

* `gs`: Displays signature information about the symbol under the cursor in a floating window. See [:help vim.lsp.buf.signature_help()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.signature_help()). If a mapping already exists for this key this function is not bound.

* `<F2>`: Renames all references to the symbol under the cursor. See [:help vim.lsp.buf.rename()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.rename()).

* `<F3>`: Format code in current buffer. See `:help vim.lsp.buf.formatting()`.

* `<F4>`: Selects a code action available at the current cursor position. See [:help vim.lsp.buf.code_action()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.code_action()).

* `gl`: Show diagnostics in a floating window. See [:help vim.diagnostic.open_float()](https://neovim.io/doc/user/diagnostic.html#vim.diagnostic.open_float()).

* `[d`: Move to the previous diagnostic in the current buffer. See [:help vim.diagnostic.goto_prev()](https://neovim.io/doc/user/diagnostic.html#vim.diagnostic.goto_prev()).

* `]d`: Move to the next diagnostic. See [:help vim.diagnostic.goto_next()](https://neovim.io/doc/user/diagnostic.html#vim.diagnostic.goto_next()).

By default lsp-zero will not create a keybinding if its "taken". This means if you already use one of these in your config, or some other plugins uses it ([which-key](https://github.com/folke/which-key.nvim) might be one), then lsp-zero's bindings will not work.

You can force lsp-zero's bindings by adding `preserve_mappings = false` to [.default_keymaps()](./reference/lua-api#default-keymaps-opts).

```lua{4}
lsp_zero.on_attach(function(client, bufnr)
  lsp_zero.default_keymaps({
    buffer = bufnr,
    preserve_mappings = false
  })
end)
```

## Creating new keybindings

Just like the default keybindings the idea here is to create them only when a language server is active in a buffer. For this use the [.on_attach()](./reference/lua-api#on-attach-callback) function, and then use neovim's built-in functions create the keybindings.

Here is an example that replaces the default keybinding `gr` with a [telescope](https://github.com/nvim-telescope/telescope.nvim) command.

```lua{9}
local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  -- see :help lsp-zero-keybindings
  -- to learn the available actions
  lsp_zero.default_keymaps({buffer = bufnr})
  local opts = {buffer = bufnr}

  vim.keymap.set('n', 'gr', '<cmd>Telescope lsp_references<cr>', opts)
end)

-- Replace the language servers listed here
-- with the ones you have installed
lsp_zero.setup_servers({'tsserver', 'rust_analyzer'})
```

## Disable keybindings

To disable all keybindings just delete the call to [.default_keymaps()](./reference/lua-api#default-keymaps-opts).

If you want lsp-zero to skip only a few keys you can add the `exclude` property to the [.default_keymaps()](./reference/lua-api#default-keymaps-opts) call. Say you want to keep the default behavior of `K` and `gl`, you would do this.

```lua{4}
lsp_zero.on_attach(function(client, bufnr)
  lsp_zero.default_keymaps({
    buffer = bufnr,
    exclude = {'gl', 'K'},
  })
end
```

## Install new language servers

### Manual install

You can find install instructions for each language server in lspconfig's documentation: [server_configurations.md](https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md).

### Via command

If you have [mason.nvim](https://github.com/williamboman/mason.nvim) and [mason-lspconfig](https://github.com/williamboman/mason-lspconfig.nvim) installed you can use the command `:LspInstall` to install a language server. If you call this command while you are in a file it'll suggest a list of language server based on the type of that file.

### Automatic installs

If you have [mason.nvim](https://github.com/williamboman/mason.nvim) and [mason-lspconfig](https://github.com/williamboman/mason-lspconfig.nvim), you can instruct `mason-lspconfig` to install the language servers you want using the option `ensure_installed`.

::: tip Important:

The name of the language server must be [on this list](https://github.com/williamboman/mason-lspconfig.nvim#available-lsp-servers).

:::

```lua{11}
local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  lsp_zero.default_keymaps({buffer = bufnr})
end)

require('mason').setup({})
require('mason-lspconfig').setup({
  -- Replace the language servers listed here
  -- with the ones you want to install
  ensure_installed = {'tsserver', 'rust_analyzer'},
  handlers = {
    lsp_zero.default_setup,
  }
})
```

Notice here we also use the function [.default_setup()](./reference/lua-api#default-setup-server). We add this to the `handlers` so we can get automatic setup for all the language servers installed with `mason.nvim`.

For more details on how to use mason.nvim with lsp-zero [read this guide](./guide/integrate-with-mason-nvim).

## Configure language servers

To pass arguments to a language server you can use the lspconfig directly.

```lua{7-12}
local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  lsp_zero.default_keymaps({buffer = bufnr})
end)

require('lspconfig').tsserver.setup({
  single_file_support = false,
  on_attach = function(client, bufnr)
    print('hello tsserver')
  end
})
```

### Disable formatting capabilities

Sometimes you might want to prevent Neovim from using a language server as a formatter. For this you can use the `on_init` hook to modify the client instance.

```lua{3-4}
require('lspconfig').tsserver.setup({
  on_init = function(client)
    client.server_capabilities.documentFormattingProvider = false
    client.server_capabilities.documentFormattingRangeProvider = false
  end,
})
```

## Custom servers

There are two ways you can use a server that is not supported by `lspconfig`:

### Add the configuration to lspconfig (recommended)

You can add the configuration to the module `lspconfig.configs` then you can call the `.setup` function.

You'll need to provide the command to start the LSP server, a list of filetypes where you want to attach the LSP server, and a function that detects the "root directory" of the project.

::: tip Note:

before doing anything, make sure the server you want to add is **not** supported by `lspconfig`. Read the [list of supported LSP servers](https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md#configurations).

:::

```lua
local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  lsp_zero.default_keymaps({buffer = bufnr})
end)

local lsp_configurations = require('lspconfig.configs')

if not lsp_configurations.name_of_my_lsp then
  lsp_configurations.name_of_my_lsp = {
    default_config = {
      name = 'name-of-my-new-lsp',
      cmd = {'command-that-start-the-lsp'},
      filetypes = {'my-filetype'},
      root_dir = require('lspconfig.util').root_pattern('some-config-file')
    }
  }
end

require('lspconfig').name_of_my_lsp.setup({})
```

::: tip Note:

`root_pattern` expects a list of files. The files that you list there should help `lspconfig` identify the root of your project.

:::

### Use the function [.new_client()](./reference/lua-api#new-client-opts)

If you don't need a "robust" solution you can use the function `.new_client()`. This function is just a thin wrapper that calls [vim.lsp.start_client()](https://neovim.io/doc/user/lsp.html#vim.lsp.start_client()) in a `FileType` autocommand.

```lua
local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  lsp_zero.default_keymaps({buffer = bufnr})
end)

lsp_zero.new_client({
  name = 'name-of-my-new-lsp',
  cmd = {'command-that-start-the-lsp'},
  filetypes = {'my-filetype'},
  root_dir = function()
    return lsp_zero.dir.find_first({'some-config-file'}) 
  end
})
```

## Enable Format on save

You have two ways to enable format on save.

::: tip Note:

When you enable format on save your LSP server is doing the formatting. The LSP server does not share the same style configuration as Neovim. Tabs and indents can change after the LSP formats the code in the file. Read the documentation of the LSP server you are using, figure out how to configure it to your prefered style.

:::

### Explicit setup

If you want to control exactly what language server is used to format a file call the function [.format_on_save()](./reference/lua-api#format-on-save-opts), this will allow you to associate a language server with a list of filetypes.

```lua
local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  lsp_zero.default_keymaps({buffer = bufnr})
end)

lsp_zero.format_on_save({
  format_opts = {
    async = false,
    timeout_ms = 10000,
  },
  servers = {
    ['tsserver'] = {'javascript', 'typescript'},
    ['rust_analyzer'] = {'rust'},
  }
})

-- Replace the language servers listed here
-- with the ones you have installed
lsp_zero.setup_servers({'tsserver', 'rust_analyzer'})
```

### Always use the active servers

If you only ever have **one** language server attached in each file and you are happy with all of them, you can call the function [.buffer_autoformat()](./reference/lua-api#buffer-autoformat-client-bufnr-opts) in the [.on_attach()](./reference/lua-api#on-attach-callback) hook.

```lua{5}
local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  lsp_zero.default_keymaps({buffer = bufnr})
  lsp_zero.buffer_autoformat()
end)

-- Replace the language servers listed here
-- with the ones you have installed
lsp_zero.setup_servers({'tsserver', 'rust_analyzer'})
```

If you have multiple servers active in one file it'll try to format using all of them, and I can't guarantee the order.

Is worth mention [.buffer_autoformat()](./reference/lua-api#buffer-autoformat-client-bufnr-opts) is a blocking (synchronous) function. If you want something that behaves like [.buffer_autoformat()](./reference/lua-api#buffer-autoformat-client-bufnr-opts) but is asynchronous you'll have to use [lsp-format.nvim](https://github.com/lukas-reineke/lsp-format.nvim).

```lua{8-10}
local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  lsp_zero.default_keymaps({buffer = bufnr})

  -- make sure you use clients with formatting capabilities
  -- otherwise you'll get a warning message
  if client.supports_method('textDocument/formatting') then
    require('lsp-format').on_attach(client)
  end
end)

-- Replace the language servers listed here
-- with the ones you have installed
lsp_zero.setup_servers({'tsserver', 'rust_analyzer'})
```

## Format buffer using a keybinding

### Using built-in functions

You'll want to bind the function [vim.lsp.buf.format()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.format()) to a keymap. The next example will create a keymap `gq` to format the current buffer using **all** active servers with formatting capabilities.

```lua{7-9}
local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  lsp_zero.default_keymaps({buffer = bufnr})
  local opts = {buffer = bufnr}

  vim.keymap.set({'n', 'x'}, 'gq', function()
    vim.lsp.buf.format({async = false, timeout_ms = 10000})
  end, opts)
end)

-- Replace the language servers listed here
-- with the ones you have installed
lsp_zero.setup_servers({'tsserver', 'rust_analyzer'})
```

If you want to allow only a list of servers, use the `filter` option. You can create a function that compares the current server with a list of allowed servers.

```lua{3-5,15}
local lsp_zero = require('lsp-zero')

local function allow_format(servers)
  return function(client) return vim.tbl_contains(servers, client.name) end
end

lsp_zero.on_attach(function(client, bufnr)
  lsp_zero.default_keymaps({buffer = bufnr})
  local opts = {buffer = bufnr}

  vim.keymap.set({'n', 'x'}, 'gq', function()
    vim.lsp.buf.format({
      async = false,
      timeout_ms = 10000,
      filter = allow_format({'lua_ls', 'rust_analyzer'})
    })
  end, opts)
end)

-- Replace the language servers listed here
-- with the ones you have installed
lsp_zero.setup_servers({'tsserver', 'lua_ls', 'rust_analyzer'})
```

### Ensure only one LSP server per filetype

If you want to control exactly what language server can format, use the function [.format_mapping()](./reference/lua-api#format-mapping-key-opts). It will allow you to associate a list of filetypes to a particular language server.

Here is an example using `gq` as the keymap.

```lua
local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  lsp_zero.default_keymaps({buffer = bufnr})
end)

lsp_zero.format_mapping('gq', {
  format_opts = {
    async = false,
    timeout_ms = 10000,
  },
  servers = {
    ['tsserver'] = {'javascript', 'typescript'},
    ['rust_analyzer'] = {'rust'},
  }
})

-- Replace the language servers listed here
-- with the ones you have installed
lsp_zero.setup_servers({'tsserver', 'rust_analyzer'})
```

## How to format file using [tool]?

Where `[tool]` can be prettier or black or stylua or any command line tool that was create before the LSP protocol existed.

Short answer: You need some sort of adapter. Another plugin or a language server that can communicate with `[tool]`.

Long answer: Your question should be more specific to Neovim and not lsp-zero. You should be looking for "how to make `[tool]` integrate with neovim's LSP client?" And once you know how to do that you can use one of lsp-zero helper functions.

If you really want to integrate that command line tool with Neovim's LSP client, these are your options:

* [efm-langserver](https://github.com/mattn/efm-langserver)
* [none-ls](https://github.com/nvimtools/none-ls.nvim)

Personally, I would use a plugin that communicates directly with the CLI tool. Here are a few options:

* [conform.nvim](https://github.com/stevearc/conform.nvim)
* [Formatter.nvim](https://github.com/mhartington/formatter.nvim)
* [guard.nvim](https://github.com/nvimdev/guard.nvim)

## Diagnostics

### Use icons in the sign column

If you don't know, the "sign column" is a space in the gutter next to the line numbers. When there is a warning or an error in a line Neovim will show you a letter like `W` or `E`. Well, you can turn that into icons if you wanted to, using the function [.set_sign_icons()](./reference/lua-api#set-sign-icons-opts). 

```lua
local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  lsp_zero.default_keymaps({buffer = bufnr})
end)

lsp_zero.set_sign_icons({
  error = '✘',
  warn = '▲',
  hint = '⚑',
  info = '»'
})

-- Replace the language servers listed here
-- with the ones you have installed
lsp_zero.setup_servers({'tsserver', 'rust_analyzer'})
```

### Disable diagnostic signs

To hide diagnostics from the gutter you need to use the function [vim.diagnostic.config()](https://neovim.io/doc/user/diagnostic.html#vim.diagnostic.config()).

```lua
local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  lsp_zero.default_keymaps({buffer = bufnr})
end)

vim.diagnostic.config({
  signs = false
})
```

## How does it work?

Language servers are configured and initialized using [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig/).

lsp-zero first adds data to an option called `capabilities` in lspconfig's defaults. This new data comes from [cmp-nvim-lsp](https://github.com/hrsh7th/cmp-nvim-lsp). It tells the language server what features [nvim-cmp](https://github.com/hrsh7th/nvim-cmp) adds to the editor.

In order to create the keybindings and commands lsp-zero assigns a function to the "hook" called `on_attach`. This function will be triggered every time lspconfig attaches a language server to a buffer. Is where all keybindings and commands are created.

If you were to do it all by yourself, the code would look like this.

```lua
local lspconfig = require('lspconfig')
local lsp_defaults = lspconfig.util.default_config

lsp_defaults.capabilities = vim.tbl_deep_extend(
  'force',
  lsp_defaults.capabilities,
  require('cmp_nvim_lsp').default_capabilities()
)

lsp_defaults.on_attach = function(client, bufnr)
  local opts = {buffer = bufnr}

  vim.keymap.set('n', 'K', '<cmd>lua vim.lsp.buf.hover()<cr>', opts)
  vim.keymap.set('n', 'gd', '<cmd>lua vim.lsp.buf.definition()<cr>', opts)
  vim.keymap.set('n', 'gD', '<cmd>lua vim.lsp.buf.declaration()<cr>', opts)
  vim.keymap.set('n', 'gi', '<cmd>lua vim.lsp.buf.implementation()<cr>', opts)
  vim.keymap.set('n', 'go', '<cmd>lua vim.lsp.buf.type_definition()<cr>', opts)
  vim.keymap.set('n', 'gr', '<cmd>lua vim.lsp.buf.references()<cr>', opts)
  vim.keymap.set('n', 'gs', '<cmd>lua vim.lsp.buf.signature_help()<cr>', opts)
  vim.keymap.set('n', '<F2>', '<cmd>lua vim.lsp.buf.rename()<cr>', opts)
  vim.keymap.set('n', '<F3>', '<cmd>lua vim.lsp.buf.formatting()<cr>', opts)
  vim.keymap.set('x', '<F3>', '<cmd>lua vim.lsp.buf.range_formatting()<cr>', opts)
  vim.keymap.set('n', '<F4>', '<cmd>lua vim.lsp.buf.code_action()<cr>', opts)

  vim.keymap.set('n', 'gl', '<cmd>lua vim.diagnostic.open_float()<cr>', opts)
  vim.keymap.set('n', '[d', '<cmd>lua vim.diagnostic.goto_prev()<cr>', opts)
  vim.keymap.set('n', ']d', '<cmd>lua vim.diagnostic.goto_next()<cr>', opts) 
end

lspconfig.tsserver.setup({})
lspconfig.rust_analyzer.setup({})
```

