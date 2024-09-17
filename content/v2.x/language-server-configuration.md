---
prev:
  text: Getting Started
  link: ./getting-started

next:
  text: Autocompletion
  link: ./autocomplete
---

# LSP configuration

## Default keybindings

The recommended way to enable lsp-zero's keybindings is by calling the function [.default_keymaps()](./reference/lua-api#default-keymaps-opts) when the language server is active. Then you will have access to things like jump to definition, rename variable, format current file, and more.

```lua{4}
local lsp = require('lsp-zero').preset({})

lsp.on_attach(function(client, bufnr)
  lsp.default_keymaps({buffer = bufnr})
end)

lsp.setup()
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

* `<F3>`: Format code in current buffer. See [:help vim.lsp.buf.format()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.format()).

* `<F4>`: Selects a code action available at the current cursor position. See [:help vim.lsp.buf.code_action()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.code_action()).

* `gl`: Show diagnostics in a floating window. See [:help vim.diagnostic.open_float()](https://neovim.io/doc/user/diagnostic.html#vim.diagnostic.open_float()).

* `[d`: Move to the previous diagnostic in the current buffer. See [:help vim.diagnostic.goto_prev()](https://neovim.io/doc/user/diagnostic.html#vim.diagnostic.goto_prev()).

* `]d`: Move to the next diagnostic. See [:help vim.diagnostic.goto_next()](https://neovim.io/doc/user/diagnostic.html#vim.diagnostic.goto_next()).

By default lsp-zero will not create a keybinding if its "taken". This means if you already use one of these in your config, or some other plugins uses it ([which-key](https://github.com/folke/which-key.nvim) might be one), then lsp-zero's bindings will not work.

You can force lsp-zero's bindings by adding `preserve_mappings = false` to [.default_keymaps()](./reference/lua-api#default-keymaps-opts).

```lua{4}
lsp.on_attach(function(client, bufnr)
  lsp.default_keymaps({
    buffer = bufnr,
    preserve_mappings = false
  })
end)
```

## Creating new keybindings

Just like the default keybindings the idea here is to create them only when a language server is active in a buffer. For this use the [.on_attach()](./reference/lua-api#on-attach-callback) function, and then use neovim's built-in functions to create the keybindings.

Here is an example that replaces the default keybinding `gr` with a [telescope](https://github.com/nvim-telescope/telescope.nvim) command.

```lua
local lsp = require('lsp-zero').preset({})

lsp.on_attach(function(client, bufnr)
  -- see :help lsp-zero-keybindings
  -- to learn the available actions
  lsp.default_keymaps({buffer = bufnr})

  vim.keymap.set('n', 'gr', '<cmd>Telescope lsp_references<cr>', {buffer = bufnr})
end)

lsp.setup()
```

## Disable keybindings

To disable all keybindings just delete the call to [.default_keymaps()](./reference/lua-api#default-keymaps-opts).

If you want lsp-zero to skip only a few keys you can add the `exclude` property to the [.default_keymaps()](./reference/lua-api#default-keymaps-opts) call.

For example, say you want to keep the default behavior of `K` and `gl`, you would do this.

```lua{4}
lsp.on_attach(function(client, bufnr)
  lsp.default_keymaps({
    buffer = bufnr,
    exclude = {'gl', 'K'},
  })
end)
```

## Install new language servers

### Manual install

You can find install instructions for each language server in lspconfig's documentation: [server_configurations.md](https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md).

### Via command

If you have [mason.nvim](https://github.com/williamboman/mason.nvim) and [mason-lspconfig](https://github.com/williamboman/mason-lspconfig.nvim) installed you can use the command `:LspInstall` to install a language server. If you call this command while you are in a file it'll suggest a list of language server based on the type of that file.

### Automatic installs

If you have [mason.nvim](https://github.com/williamboman/mason.nvim) and [mason-lspconfig](https://github.com/williamboman/mason-lspconfig.nvim) installed you can use the function [.ensure_installed()](./reference/lua-api#ensure-installed-list) to list the language servers you want to install with `mason.nvim`.

::: tip Important:

The name of the language server you want to install must be [on this list](https://github.com/williamboman/mason-lspconfig.nvim#available-lsp-servers).

:::

```lua{7-12}
local lsp = require('lsp-zero').preset({})

lsp.on_attach(function(client, bufnr)
  lsp.default_keymaps({buffer = bufnr})
end)

lsp.ensure_installed({
  -- Replace these with whatever servers you want to install
  'tsserver',
  'eslint',
  'rust_analyzer'
})

lsp.setup()
```

## Configure language servers

To pass arguments to a language server you can use the lspconfig directly. Just make sure you call lspconfig after the require of lsp-zero.

```lua{7-12}
local lsp = require('lsp-zero').preset({})

lsp.on_attach(function(client, bufnr)
  lsp.default_keymaps({buffer = bufnr})
end)

require('lspconfig').eslint.setup({
  single_file_support = false,
  on_attach = function(client, bufnr)
    print('hello eslint')
  end
})

lsp.setup()
```

For backwards compatibility with the `v1.x` branch the [.configure()](./reference/lua-api#configure-name-opts) function is still available. So this is still valid.

```lua{7-12}
local lsp = require('lsp-zero').preset({})

lsp.on_attach(function(client, bufnr)
  lsp.default_keymaps({buffer = bufnr})
end)

lsp.configure('eslint', {
  single_file_support = false,
  on_attach = function(client, bufnr)
    print('hello eslint')
  end
})

lsp.setup()
```

### Disable semantic highlights

Neovim v0.9 allows a language server to define highlight groups, this is known as semantic tokens. This new feature is enabled by default. To disable it Neovim's documentation suggest we clear the highlight groups of the colorscheme.

You can add this piece of code before you configure your colorscheme.

```lua
local function hide_semantic_highlights()
  for _, group in ipairs(vim.fn.getcompletion('@lsp', 'highlight')) do
    vim.api.nvim_set_hl(0, group, {})
  end
end

vim.api.nvim_create_autocmd('ColorScheme', {
  desc = 'Clear LSP highlight groups',
  callback = hide_semantic_highlights,
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

## Disable a language server

Use the function [.skip_server_setup()](./reference/lua-api#skip-server-setup-name) to tell lsp-zero to ignore a particular set of language servers.

```lua{7}
local lsp = require('lsp-zero').preset({})

lsp.on_attach(function(client, bufnr)
  lsp.default_keymaps({buffer = bufnr})
end)

lsp.skip_server_setup({'eslint'})

lsp.setup()
```

## Language servers and mason.nvim

Install and updates of language servers is done with [mason.nvim](https://github.com/williamboman/mason.nvim).

::: info Note:

With mason.nvim you can also install formatters and debuggers, but lsp-zero will only configure language servers.

:::

To install a server manually use the command `:LspInstall` with the name of the server you want to install. If you don't provide a name `mason-lspconfig.nvim` will try to suggest a language server based on the filetype of the current buffer.

To check for updates on the language servers use the command `:Mason`. A floating window will open showing you all the tools mason.nvim can install. You can filter the packages by categories for example, language servers are in the second category, so if you press the number `2` it'll show only the language servers. The packages you have installed will appear at the top. If there is any update available the item will display a message. Navigate to that item and press `u` to install the update.

To uninstall a package use the command `:Mason`. Navigate to the item you want to delete and press `X`.

To know more about the available bindings inside the floating window of Mason press `g?`.

If you need to customize mason.nvim make sure you do it before calling the lsp-zero module.

```lua
require('mason').setup({
  ui = {
    border = 'rounded'
  }
})

local lsp = require('lsp-zero').preset({})

lsp.on_attach(function(client, bufnr)
  lsp.default_keymaps({buffer = bufnr})
end)

lsp.setup()
```

### Opt-out of mason.nvim

All you need is to do is uninstall `mason.nvim` and `mason-lspconfig`. Or, call the [.preset()](./reference/lua-api#preset-opts) function and modify these settings:

```lua
setup_servers_on_start = false
call_servers = 'global'
```

After that will need to specify which language server you want to setup, for this use [.setup_servers()](./reference/lua-api#setup-servers-list) or [.configure()](./reference/lua-api#configure-name-opts).

## Custom servers

There are two ways you can use a server that is not supported by `lspconfig`:

### Add the configuration to lspconfig (recommended)

You can add the configuration to the module `lspconfig.configs` then you can call the `.setup()` function.

You'll need to provide the command to start the language server, a list of filetypes where you want to attach it, and a function that detects the "root directory" of the project.

::: tip Note:

Before doing anything, make sure the server you want to add is **not** supported by `lspconfig`. Read the [list of supported LSP servers](https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md#configurations).

:::

```lua
local lsp = require('lsp-zero').preset({})

lsp.on_attach(function(client, bufnr)
  lsp.default_keymaps({buffer = bufnr})
end)

lsp.setup()

local lsp_configurations = require('lspconfig.configs')

if not lsp_configurations.name_of_my_lsp then
  lsp_configurations.name_of_my_lsp = {
    default_config = {
      name = 'name-of-my-lsp',
      cmd = {'command-that-start-the-lsp'},
      filetypes = {'my-filetype'},
      root_dir = require('lspconfig.util').root_pattern('some-config-file')
    }
  }
end

require('lspconfig').name_of_my_lsp.setup({})
```

Note that `root_pattern` expects a list of files. The files that you list there should help `lspconfig` identify the root of your project.

### Use the function [.new_server()](./reference/lua-api#new-server-opts)

If you don't need a "robust" solution you can use the function `.new_server()`. This function is just a thin wrapper that calls [vim.lsp.start()](https://neovim.io/doc/user/lsp.html#vim.lsp.start()) in a `FileType` autocommand.

```lua
local lsp = require('lsp-zero').preset({})

lsp.on_attach(function(client, bufnr)
  lsp.default_keymaps({buffer = bufnr})
end)

lsp.setup()

lsp.new_server({
  name = 'name-of-my-lsp',
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

When you enable format on save your language server is doing the formatting. The server does not share the same style configuration as Neovim. Tabs and indents can change after the language server formats the code in the file. Read the documentation of the server you are using, figure out how to configure it to your prefered style.

:::

### Explicit setup

If you want to control exactly what language server is used to format a file call the function [.format_on_save()](./reference/lua-api#format-on-save-opts), this will allow you to associate a language server with a list of filetypes.

```lua
local lsp = require('lsp-zero').preset({})

lsp.on_attach(function(client, bufnr)
  lsp.default_keymaps({buffer = bufnr})
end)

-- don't add this function in the `on_attach` callback.
-- `format_on_save` should run only once, before the language servers are active.
lsp.format_on_save({
  format_opts = {
    async = false,
    timeout_ms = 10000,
  },
  servers = {
    ['tsserver'] = {'javascript', 'typescript'},
    ['rust_analyzer'] = {'rust'},
  }
})

lsp.setup()
```

### Always use the active servers

If you only ever have **one** language server attached in each file and you are happy with all of them, you can call the function [.buffer_autoformat()](./reference/lua-api#buffer-autoformat-client-bufnr-opts) in the [.on_attach()](./reference/lua-api#on-attach-callback) hook.

```lua{5}
local lsp = require('lsp-zero').preset({})

lsp.on_attach(function(client, bufnr)
  lsp.default_keymaps({buffer = bufnr})
  lsp.buffer_autoformat()
end)

lsp.setup()
```

If you have multiple servers active in one file it'll try to format using all of them, and I can't guarantee the order.

It's worth mentioning [.buffer_autoformat()](./reference/lua-api#buffer-autoformat-client-bufnr-opts) is a blocking (synchronous) function. If you want something that behaves like [.buffer_autoformat()](./reference/lua-api#buffer-autoformat-client-bufnr-opts) but is asynchronous you'll have to use [lsp-format.nvim](https://github.com/lukas-reineke/lsp-format.nvim).

```lua{8-10}
local lsp = require('lsp-zero').preset({})

lsp.on_attach(function(client, bufnr)
  lsp.default_keymaps({buffer = bufnr})

  -- make sure you use clients with formatting capabilities
  -- otherwise you'll get a warning message
  if client.supports_method('textDocument/formatting') then
    require('lsp-format').on_attach(client)
  end
end)

lsp.setup()
```

## Format using a keybinding

### Using built-in functions

You'll want to bind the function [vim.lsp.buf.format()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.format()) to a keymap. The next example will create a keymap `gq` to format the current buffer using **all** active servers with formatting capabilities.

```lua{7-9}
local lsp = require('lsp-zero').preset({})

lsp.on_attach(function(client, bufnr)
  lsp.default_keymaps({buffer = bufnr})
  local opts = {buffer = bufnr}

  vim.keymap.set({'n', 'x'}, 'gq', function()
    vim.lsp.buf.format({async = false, timeout_ms = 10000})
  end, opts)
end)

lsp.setup()
```

If you want to allow only a list of servers, use the `filter` option. You can create a function that compares the current server with a list of allowed servers.

```lua{3-5,15}
local lsp = require('lsp-zero').preset({})

local function allow_format(servers)
  return function(client) return vim.tbl_contains(servers, client.name) end
end

lsp.on_attach(function(client, bufnr)
  lsp.default_keymaps({buffer = bufnr})
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

### Ensure only one LSP server per filetype

If you want to control exactly what language server can format, use the function [.format_mapping()](./reference/lua-api#format-mapping-key-opts). It will allow you to associate a list of filetypes to a particular language server.

Here is an example using `gq` as the keymap.

```lua
local lsp = require('lsp-zero').preset({})

lsp.on_attach(function(client, bufnr)
  lsp.default_keymaps({buffer = bufnr})
end)

lsp.format_mapping('gq', {
  format_opts = {
    async = false,
    timeout_ms = 10000,
  },
  servers = {
    ['tsserver'] = {'javascript', 'typescript'},
    ['rust_analyzer'] = {'rust'},
  }
})

lsp.setup()
```

## How to format file using [tool]?

Where `[tool]` can be prettier or black or stylua or any command line tool that was create before the LSP protocol existed.

Short answer: You need some sort of adapter. Another plugin or a language server that can communicate with `[tool]`.

Long answer: Your question should be more specific to Neovim and not lsp-zero. You should be looking for "how to make [vim.lsp.buf.format()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.format()) use `[tool]`?" And once you know how to do that you can use one of lsp-zero helper functions... or just `vim.lsp.buf.format()`.

If you really want to integrate that command line tool with Neovim's LSP client, these are your options:

* [efm-langserver](https://github.com/mattn/efm-langserver)
* [none-ls](https://github.com/nvimtools/none-ls.nvim)

Personally, I would use a plugin that communicates directly with the CLI tool. Here are a few options:

* [conform.nvim](https://github.com/stevearc/conform.nvim)
* [Formatter.nvim](https://github.com/mhartington/formatter.nvim)
* [guard.nvim](https://github.com/nvimdev/guard.nvim)

If you are going that route and you are wondering which one to choose, use `conform.nvim`. People say it's good. Don't think about it too much.

## Diagnostics

That's the name Neovim uses for error messages, warnings, hints, etc. lsp-zero only does two things to diagnostics: add borders to floating windows and enable "severity sort". All of that can be disable from the [.preset()](./reference/lua-api#preset-opts) call.

```lua
local lsp = require('lsp-zero').preset({
  float_border = 'none',
  configure_diagnostics = false,
})
```

### Use icons in the sign column

If you don't know, the "sign column" is a space in the gutter next to the line numbers. When there is a warning or an error in a line Neovim will show you a letter like `W` or `E`. Well, you can turn that into icons if you wanted to, using the function [.set_sign_icons()](./reference/lua-api#set-sign-icons-opts). 

```lua
local lsp = require('lsp-zero').preset({})

lsp.on_attach(function(client, bufnr)
  lsp.default_keymaps({buffer = bufnr})
end)

lsp.set_sign_icons({
  error = '✘',
  warn = '▲',
  hint = '⚑',
  info = '»'
})

lsp.setup()
```

### Disable diagnostic signs

To hide diagnostics from the gutter you need to use the function [vim.diagnostic.config()](https://neovim.io/doc/user/diagnostic.html#vim.diagnostic.config()).

```lua
vim.diagnostic.config({
  signs = false
})
```

### Disable virtual text

If you want to disable the "virtual text" you'll need to use the function [vim.diagnostic.config()](https://neovim.io/doc/user/diagnostic.html#vim.diagnostic.config()).

```lua
vim.diagnostic.config({
  virtual_text = false,
})
```

## How does it work?

Ever wondered what lsp-zero does under the hood? Let me tell you.

Language servers are configured and initialized using [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig/).

First it adds data to an option called `capabilities` in lspconfig's defaults. This new data comes from [cmp-nvim-lsp](https://github.com/hrsh7th/cmp-nvim-lsp). It tells the language server what features [nvim-cmp](https://github.com/hrsh7th/nvim-cmp) adds to the editor.

Then it creates an autocommand on the event `LspAttach`. This autocommand will be triggered every time a language server is attached to a buffer. Is where all keybindings and commands are created.

Finally it calls the `.setup()` of each language server.

If you were to do it all by yourself, the code would look like this.

```lua
local lspconfig = require('lspconfig')
local lsp_capabilities = require('cmp_nvim_lsp').default_capabilities()

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

    vim.keymap.set('n', 'gl', '<cmd>lua vim.diagnostic.open_float()<cr>', opts)
    vim.keymap.set('n', '[d', '<cmd>lua vim.diagnostic.goto_prev()<cr>', opts)
    vim.keymap.set('n', ']d', '<cmd>lua vim.diagnostic.goto_next()<cr>', opts) 
  end
})

-- call mason.nvim if installed 
-- require('mason').setup()
-- require('mason-lspconfig').setup()

lspconfig.tsserver.setup({capabilities = lsp_capabilities})
lspconfig.eslint.setup({capabilities = lsp_capabilities})
```

