# LSP configuration

## Default keymaps

Here's the description of the keymaps recommended in the getting started page:

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

## Install new language servers

### Manual install

You can find install instructions for each language server in lspconfig's documentation: [configs.md](https://github.com/neovim/nvim-lspconfig/blob/master/doc/configs.md).

### Via command

If you have [mason.nvim](https://github.com/mason-org/mason.nvim) and [mason-lspconfig](https://github.com/mason-org/mason-lspconfig.nvim) installed you can use the command `:LspInstall` to install a language server. If you call this command while you are in a file it'll suggest a list of language server based on the type of that file.

### Automatic installs

If you have [mason.nvim](https://github.com/mason-org/mason.nvim) `v1.11.0` and [mason-lspconfig](https://github.com/mason-org/mason-lspconfig.nvim) `v1.32.0`, you can instruct `mason-lspconfig` to install the language servers you want using the option `ensure_installed`.

::: info Note:

The name of the language server you want to install must be [on this list](https://github.com/mason-org/mason-lspconfig.nvim#available-lsp-servers).

:::

```lua{5}
require('mason').setup({})
require('mason-lspconfig').setup({
  -- Replace the language servers listed here
  -- with the ones you want to install
  ensure_installed = {'lua_ls', 'rust_analyzer'},
  handlers = {
    function(server_name)
      require('lspconfig')[server_name].setup({})
    end,
  }
})
```

We add a "default handler" to the `handlers` option so we can get automatic setup for all the language servers installed with `mason.nvim`.

## Configure language servers

To pass arguments to a language server use the lua module `lspconfig`.

```lua
require('lspconfig').biome.setup({
  single_file_support = false,
  on_attach = function(client, bufnr)
    print('hello biome')
  end
})
```

If you use `mason-lspconfig (v1.32.0)` handlers to manage the setup of your language servers then you will need to add a custom handler. Here is an example.

```lua{10-17}
require('mason-lspconfig').setup({
  handlers = {
    -- this first function is the "default handler"
    -- it applies to every language server without a "custom handler"
    function(server_name)
      require('lspconfig')[server_name].setup({})
    end,

    -- this is the "custom handler" for `biome`
    biome = function()
      require('lspconfig').biome.setup({
        single_file_support = false,
        on_attach = function(client, bufnr)
          print('hello biome')
        end
      })
    end,
  }
})
```

Notice in `handlers` there is a new property with the name of the language server and it has a function assign to it. That is where you configure the language server.

### Disable semantic highlights

Since Neovim v0.9 a language server can apply new highlights to your code, this is known as semantic tokens. This new feature is enabled by default. To disable it we need to modify the `server_capabilities` property of the language server, more specifically we need to "delete" the `semanticTokensProvider` property.

We can disable this new feature in every server whenever they attach to a buffer.

```lua
vim.api.nvim_create_autocmd('LspAttach', {
  callback = function(event)
    local id = vim.tbl_get(event, 'data', 'client_id')
    local client = id and vim.lsp.get_client_by_id(id)
    if client == nil then
      return
    end

    -- Disable semantic highlights
    client.server_capabilities.semanticTokensProvider = nil
  end
})
```

If you just want to disable it for a particular server, use lspconfig to assign the `on_attach` hook to that server.

```lua{3}
require('lspconfig').lua_ls.setup({
  on_attach = function(client)
    client.server_capabilities.semanticTokensProvider = nil
  end,
})
```

### Disable formatting capabilities

Sometimes you might want to prevent Neovim from using a language server as a formatter. For this you can use the `on_attach` hook to modify the client instance.

```lua{3-4}
require('lspconfig').lua_ls.setup({
  on_attach = function(client)
    client.server_capabilities.documentFormattingProvider = false
    client.server_capabilities.documentFormattingRangeProvider = false
  end,
})
```

## Custom servers

::: info Note:

These instructions use the "legacy api" of nvim-lspconfig.

:::

You can add the configuration to the module `lspconfig.configs` then you can call the `.setup()` function.

But before doing anything, make sure the server you want to add is **not** supported by `lspconfig`. Read the [list of supported language servers](https://github.com/neovim/nvim-lspconfig/blob/master/doc/configs.md#lsp-configs).

You'll need to provide the command that starts the language server, a list of filetypes where you want to attach the language server, and a function that detects the "root directory" of the project.

```lua
local lsp_configurations = require('lspconfig.configs')

if not lsp_configurations.name_of_my_lsp then
  lsp_configurations.name_of_my_lsp = {
    default_config = {
      cmd = {'command-that-start-the-lsp'},
      filetypes = {'my-filetype'},
      root_dir = require('lspconfig.util').root_pattern('some-config-file')
    }
  }
end

require('lspconfig').name_of_my_lsp.setup({})
```

::: info Note:

`root_pattern` expects a list of files. The files that you list there should help `lspconfig` identify the root of your project.

:::

## Enable Format on save

You can setup an autocommand that triggers [vim.lsp.buf.format()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.format()) on the event `BufWritePre`.

When you enable format on save your language server is doing the formatting. The language server does not share the same style configuration as Neovim. Tabs and indents can change after the language server formats the code in the file. Read the documentation of the language server you are using, figure out how to configure it to your prefered style.

```lua{1-15,27}
local buffer_autoformat = function(bufnr)
  local group = 'lsp_autoformat'
  vim.api.nvim_create_augroup(group, {clear = false})
  vim.api.nvim_clear_autocmds({group = group, buffer = bufnr})

  vim.api.nvim_create_autocmd('BufWritePre', {
    buffer = bufnr,
    group = group,
    desc = 'LSP format on save',
    callback = function()
      -- note: do not enable async formatting
      vim.lsp.buf.format({async = false, timeout_ms = 10000})
    end,
  })
end

vim.api.nvim_create_autocmd('LspAttach', {
  callback = function(event)
    local id = vim.tbl_get(event, 'data', 'client_id')
    local client = id and vim.lsp.get_client_by_id(id)
    if client == nil then
      return
    end

    -- make sure there is at least one client with formatting capabilities
    if client.supports_method('textDocument/formatting') then
      buffer_autoformat(event.buf)
    end
  end
})
```

Note that when you have multiple servers active in one file it'll try to format using all of them.

If you need to save the file without formatting you can create a command that executes the `write` command and skips **all** autocommands.

```lua
vim.api.nvim_create_user_command('Write', 'noautocmd write', {})
```

If you want more advanced features like asynchronous autoformatting or the ability to toggle the autoformat on demand, you can use the plugin [lsp-format.nvim](https://github.com/lukas-reineke/lsp-format.nvim).

```lua{12}
vim.api.nvim_create_autocmd('LspAttach', {
  callback = function(event)
    local id = vim.tbl_get(event, 'data', 'client_id')
    local client = id and vim.lsp.get_client_by_id(id)
    if client == nil then
      return
    end

    -- make sure you use clients with formatting capabilities
    -- otherwise you'll get a warning message
    if client.supports_method('textDocument/formatting') then
      require('lsp-format').on_attach(client)
    end
  end
})
```

## Format using a keybinding

You'll want to bind the function [vim.lsp.buf.format()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.format()) to a keymap. The next example will create a keymap `gq` to format the current buffer using **all** active servers with formatting capabilities.

```lua{11-13}
vim.api.nvim_create_autocmd('LspAttach', {
  callback = function(event)
    local opts = {buffer = event.buf}

    vim.keymap.set({'n', 'x'}, 'gq', function()
      vim.lsp.buf.format({async = false, timeout_ms = 10000})
    end, opts)
  end
})
```

If you want to allow only a list of servers, use the `filter` option. You can create a function that compares the current server with a list of allowed servers.

```lua{1-3,13}
local allow_format = function(servers)
  return function(client) return vim.tbl_contains(servers, client.name) end
end

vim.api.nvim_create_autocmd('LspAttach', {
  callback = function(event)
    local opts = {buffer = event.buf}

    vim.keymap.set({'n', 'x'}, 'gq', function()
      vim.lsp.buf.format({
        async = false,
        timeout_ms = 10000,
        filter = allow_format({'lua_ls', 'rust_analyzer'})
      })
    end, opts)
  end
})
```

## How to format file using [tool]?

Where `[tool]` can be prettier or black or stylua or any command line tool that was create before the LSP protocol existed.

Short answer: You need some sort of adapter. Another plugin or a language server that can communicate with `[tool]`.

If you really want to integrate that command line tool with Neovim's LSP client, these are your options:

* [efm-langserver](https://github.com/mattn/efm-langserver)
* [none-ls](https://github.com/nvimtools/none-ls.nvim)

Personally, I would use a plugin that communicates directly with the CLI tool. Here are a few options:

* [conform.nvim](https://github.com/stevearc/conform.nvim)
* [Formatter.nvim](https://github.com/mhartington/formatter.nvim)
* [guard.nvim](https://github.com/nvimdev/guard.nvim)

If you are going that route and you are wondering which one to choose, use `conform.nvim`. People say it's good. Don't think about it too much.

## Diagnostics

You can use the module [vim.diagnostic](https://neovim.io/doc/user/diagnostic.html) to enable or disable diagnostic signs.

This is how you disable the diagnostic signs.

```lua
vim.diagnostic.config({
  signs = false,
})
```

If you want to change the text content of the signs, use a table with the property `text` and assign a string to each type of sign. Something like this.

```lua
vim.diagnostic.config({
  signs = {
    text = {
      [vim.diagnostic.severity.ERROR] = '✘',
      [vim.diagnostic.severity.WARN] = '▲',
      [vim.diagnostic.severity.HINT] = '⚑',
      [vim.diagnostic.severity.INFO] = '»',
    },
  },
})
```

