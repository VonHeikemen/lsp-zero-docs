---
prev:
  text: Variables
  link: ./variables

next:
  text: Commands
  link: ./commands
---

# Lua API

## extend_lspconfig(*opts*)

Handle some basic configuration steps and makes lspconfig easier to work with.

`{opts}` supports the following properties:

  * capabilities: (Table, Optional) Options that describe the features the LSP client supports. These will be added automatically to every language server configured with [lspconfig](https://github.com/neovim/nvim-lspconfig).

  * lsp_attach: (Function, Optional) Callback invoked when client attaches to a buffer. This will be executed in the [LspAttach](https://neovim.io/doc/user/lsp.html#LspAttach) event.

  * sign_text: (Boolean | Table, Optional) Configures the diagnostic signs. For more details see [lsp-zero.ui()](#ui-opts).

  * float_border: (String, Optional) Configure the style of some floating windows. For more details see [lsp-zero.ui()](#ui-opts).

Here is a basic usage example.

```lua
local lsp_zero = require('lsp-zero')

local lsp_attach = function(client, bufnr)
  -- this is where you enable features that only work
  -- if there is a language server active in the file
end

lsp_zero.extend_lspconfig({
  sign_text = true,
  lsp_attach = lsp_attach,
  capabilities = require('cmp_nvim_lsp').default_capabilities()
})

-- Replace the language servers listed here
-- with the ones you have installed in your system
require('lspconfig').gleam.setup({})
require('lspconfig').lua_ls.setup({})
```

## ui(*opts*)

Configure some UI elements. Right now is just floating window border style and diagnostic signs.

Note: The function [lsp-zero.extend_lspconfig()](#extend-lspconfig-opts) already uses this under the hood. You would call this function yourself if you don't have [lspconfig](https://github.com/neovim/nvim-lspconfig) installed. 

`{opts}` table supports these properties:

  * float_border (String, Optional) Set the style of the border of diagnostic floating window, hover window and signature help window. These are valid the styles: `'none'`, `'single'`, `'double'`, `'rounded'`, `'solid'` or `'shadow'`.

  * sign_text (Boolean | Table, Optional) If the value is `true` it will make sure diagnostic signs are enable and reserve a space in the signcolumn. If the value is `false` it will disable the diagnostics signs. If the value is a table, it can modify the text of the diagnostic signs using these properties:

    * error
    * warn
    * hint
    * info
    
If the font supports it, you can change the sign with fancy icons.

```lua
local lsp_zero = require('lsp-zero')

lsp_zero.ui({
  float_border = 'rounded',
  sign_text = {
    error = '✘',
    warn = '▲',
    hint = '⚑',
    info = '»',
  },
})
```

## on_attach(*callback*)

Execute `{callback}` function every time a server is attached to a buffer.

This can be used if you don't have [lspconfig](https://github.com/neovim/nvim-lspconfig) installed.

```lua
local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  -- this is where you enable features that only work
  -- if there is a language server active in the file
end)

lsp_zero.new_client({
  cmd = {'gleam', 'lsp'},
  filetypes = {'gleam'},
  root_dir = function(bufnr)
    -- You need Neovim v0.10 to use vim.fs.root
    return vim.fs.root(bufnr, {'gleam.toml'})
  end,
})
```

## default_keymaps(*opts*)

Creates the [keybindings described](../language-server-configuration#default-keymaps) in the language server configuration page.

`{opts}` supports the following properties:

  * buffer: (Number, Optional) Defaults to 0. The "id" of an open buffer. If the number 0 is provided then the keymaps will be effective in the current buffer.

  * preserve_mappings: (Boolean, Optional) Defaults to `true`. When set to `true` lsp-zero will not override your existing keybindings.

  * exclude: (Table, Optional) List of valid keybindings. lsp-zero will preserve the behavior of these keybindings.

You can use this function when a language server is attached to a buffer.

```lua
local lsp_zero = require('lsp-zero')

local lsp_attach = function(client, bufnr)
  -- see :help lsp-zero-keybindings
  -- to learn the available actions
  lsp_zero.default_keymaps({buffer = bufnr})
end

lsp_zero.extend_lspconfig({
  lsp_attach = lsp_attach,
})
```

## highlight_symbol(*client*, *bufnr*)

Uses the [CursorHold](https://neovim.io/doc/user/autocmd.html#CursorHold) event to trigger a document highlight request. In other words, it will highlight the symbol under the cursor.

For this to work properly your colorscheme needs to set these highlight groups: `LspReferenceRead`, `LspReferenceText` and `LspReferenceWrite`.

Keep in mind the event `CursorHold` depends on the [updatetime](https://neovim.io/doc/user/options.html#'updatetime') option. If you want the highlight to happen fast, you will need to set this option to a "low" value.

```lua
vim.opt.updatetime = 500

local lsp_zero = require('lsp-zero')

local lsp_attach = function(client, bufnr)
  lsp_zero.highlight_symbol(client, bufnr)
end

lsp_zero.extend_lspconfig({
  lsp_attach = lsp_attach,
})

-- Replace the language servers listed here
-- with the ones you have installed
require('lspconfig').gleam.setup({})
require('lspconfig').lua_ls.setup({})
```

## format_on_save(*opts*)

Setup autoformat on save. This will to allow you to associate a language server with a list of filetypes.

This function was designed to allow one language server per filetype, this is so the formatting is consistent.

`{opts}` supports the following properties:

  * servers: (Table) Key/value pair list. On the left hand side you must specify the name of a language server. On the right hand side you must provide a list of filetypes, this can be any pattern supported by the [FileType](https://neovim.io/doc/user/autocmd.html#FileType) autocommand.

  * format_opts: (Table, optional). Configuration that will passed to the formatting function. It supports the following properties:

    * async: (Boolean, optional). If true it will send an asynchronous format request to the language server.

    * timeout_ms: (Number, optional). Time in milliseconds to block for formatting requests. Defaults to `10000`.

    * formatting_options: (Table, optional). Can be used to set `FormattingOptions`, these options are sent to the language server. See [FormattingOptions specification](https://neovim.io/doc/user/autocmd.html#FileType).

When you enable format on save the language server is doing the formatting. The language server does not share the same style configuration as Neovim. Tabs and indents can change after the language server formats the code in the file. Read the documentation of the language server you are using, figure out how to configure it to your prefered style.

```lua
local lsp_zero = require('lsp-zero')
lsp_zero.extend_lspconfig({})

-- don't add this function in the `lsp_attach` callback.
-- `format_on_save` should run only once, before the language servers are active.
lsp_zero.format_on_save({
  format_opts = {
    async = false,
    timeout_ms = 10000,
  },
  servers = {
    ['lua_ls'] = {'lua'},
    ['biome'] = {'javascript', 'typescript'},
  }
})

-- Replace the language servers listed here
-- with the ones you have installed in your system
require('lspconfig').biome.setup({})
require('lspconfig').lua_ls.setup({})
```

## buffer_autoformat(*client*, *bufnr*, *opts*)

Format the current buffer using the active language servers.

  * client: (Table, Optional) if provided it must be a lua table with a `name` property or an instance of [vim.lsp.client](https://neovim.io/doc/user/lsp.html#vim.lsp.Client). If provided it will only use the language server associated with that client.

  * bufnr: (Number, Optional) if provided it must be the id of an open buffer.

  * opts: (Table, optional). Configuration that will passed to the formatting function. It supports the following properties:

    * timeout_ms: (Number, optional). Time in milliseconds to block for formatting requests. Defaults to `10000`.

    * formatting_options: (Table, optional). Can be used to set `FormattingOptions`, these options are sent to the language server. See [FormattingOptions specification](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#formattingOptions).

Tabs and indents can change after the language server formats the code in the file. Read the documentation of the language servers you are using, figure out how to configure it to your prefered style.

```lua
local lsp_zero = require('lsp-zero')

local lsp_attach = function(client, bufnr)
  lsp_zero.buffer_autoformat()
end

lsp_zero.extend_lspconfig({
  lsp_attach = lsp_attach,
})

-- Replace the language servers listed here
-- with the ones you have installed in your system
require('lspconfig').gleam.setup({})
require('lspconfig').lua_ls.setup({})
```

## async_autoformat(*client*, *bufnr*, *opts*)

Send a formatting request to `{client}`. After the getting the response from the client it will save the file (again).

Here is how it works: when you save the file Neovim will write your changes without formatting. Then, lsp-zero will send a request to `{client}`, when it gets the response it will apply the formatting and save the file again.

  * client: (Table) It must be an instance of [vim.lsp.client](https://neovim.io/doc/user/lsp.html#vim.lsp.Client).

  * bufnr: (Number, Optional) if provided it must be the id of an open buffer.

  * opts: (Table, Optional). Supports the following properties:

    * formatting_options: Settings send to the language server. These are the same settings as the `formatting_options` argument in [vim.lsp.buf.format()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.format()).

    * timeout_ms: (Number, Optional) Defaults to 10000. Time in milliseconds to ignore the current format request.

Do not use this in the global `on_attach`, call this function with the specific language server you want to format with.

```lua
local lsp_zero = require('lsp-zero')
lsp_zero.extend_lspconfig({})

require('lspconfig').gleam.setup({
  on_attach = function(client, bufnr)
    lsp_zero.async_autoformat(client, bufnr)
  end
})
```

## format_mapping(*key*, *opts*)

Configure `{key}` to format the current buffer.

The idea here is that you associate a language server with a list of filetypes, so {key} can format the buffer using only one language server.

`{opts}` supports the following properties:

  * servers: (Table) Key/value pair list. On the left hand side you must specify the name of a language server. On the right hand side you must provide a list of filetypes, this can be any pattern supported by the [FileType](https://neovim.io/doc/user/autocmd.html#FileType) autocommand.

  * mode: (Table). The list of modes where the keybinding will be active. By default is set to `{'n', 'x'}`, which means normal mode and visual mode.

  * format_opts: (Table, optional). Configuration that will passed to the formatting function. It supports the following properties:

    * async: (Boolean, optional). If true it will send an asynchronous format request to the language server.

    * timeout_ms: (Number, optional). Time in milliseconds to block for formatting requests. Defaults to `10000`.

    * formatting_options: (Table, optional). Can be used to set `FormattingOptions`, these options are sent to the language server. See [FormattingOptions specification](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#formattingOptions).

Tabs and indents can change after the language server formats the code in the file. Read the documentation of the language servers you are using, figure out how to configure it to your prefered style.

```lua
local lsp_zero = require('lsp-zero')
lsp_zero.extend_lspconfig({})

-- don't add this function in the `lsp_attach` callback.
-- `format_mapping` should run only once, before the language servers are active.
lsp_zero.format_mapping('gq', {
  servers = {
    ['lua_ls'] = {'lua'},
    ['biome'] = {'javascript', 'typescript'},
  }
})

require('lspconfig').biome.setup({})
require('lspconfig').lua_ls.setup({})
```

## setup_servers(*list*, *opts*)

Will configure all the language servers you have on `{list}` using [lspconfig](https://github.com/neovim/nvim-lspconfig).

The `{opts}` table only supports one property:

  * exclude: (optional) Table. List of names of language servers you **don't** want to setup.

```lua
local lsp_zero = require('lsp-zero')
lsp_zero.extend_lspconfig({})

-- Replace the language servers listed here
-- with the ones you have installed
lsp_zero.setup_servers({'gleam', 'lua_ls'})
```

## configure(*name*, *opts*)

Useful when you need to pass some options to a specific language server. Takes the same options as `nvim-lspconfig`'s setup function. For more details go the help page, see `:help lspconfig-setup`.

```lua
local lsp_zero = require('lsp-zero')
lsp_zero.extend_lspconfig({})

lsp_zero.configure('lua_ls', {
  single_file_support = false,
  on_attach = function(client, bufnr)
    print('hello lua_ls')
  end
})
```

## use(*name*, *opts*)

For when you want full control of the servers you want to use in a particular project. It is meant to be called in project local config.

Ideally, you would setup some default values for your servers in your Neovim config using [lsp-zero.configure()](#configure-name-opts), or maybe [lsp-zero.store-config()](#store-config-name-opts).

```lua
-- init.lua

local lsp_zero = require('lsp-zero')
lsp_zero.extend_lspconfig({})

lsp_zero.configure('pyright', {
  single_file_support = false,
})
```

And then in your local config you can tweak the server options even more.

```lua
-- local config

local lsp_zero = require('lsp-zero')

lsp_zero.use('pyright', {
  settings = {
    python = {
      analysis = {
        extraPaths = {'/path/to/my/dependencies'},
      }
    }
  }
})
```

Options from [lsp-zero.configure()](#configure-name-opts) will be merged with the ones on `.use()` and the server will restart with the new config.

lsp-zero does not execute files. It only provides utility functions. So to execute your "local config" you'll have to use another plugin.

## store_config(*name*, *opts*)

Saves the configuration options for a language server, so you can use it at a later time in a local config file.

## nvim_lua_ls(*opts*)

Returns settings specific to Neovim for the lua language server, lua_ls. If you provide the `{opts}` table it'll merge it with the defaults, this way you can extend or change the values easily.

```lua
local lsp_zero = require('lsp-zero')
lsp_zero.extend_lspconfig({})

local lua_opts = lsp_zero.nvim_lua_ls()
require('lspconfig').lua_ls.setup(lua_opts)
```

## nvim_lua_settings(*client*, *opts*)

Apply Neovim specific setting to `{client}`. This is meant to be used in the `on_init` callback of the lua language server.

Note the Neovim settings will only be effective if there isn't a `.luarc.json` or a `.luarc.jsonc` file in the root of the project.

You can use `{opts}` to override or add your own settings.

```lua
local lsp_zero = require('lsp-zero')
lsp_zero.extend_lspconfig({})

require('lspconfig').lua_ls.setup({
  on_init = function(client)
    lsp_zero.nvim_lua_settings(client, {})
  end,
})
```

## client_config(*opts*)

Share the configuration provided in `{opts}` with all the language servers setup with [lsp-zero.new_client()](#new-client-opts) or [lspconfig](https://github.com/neovim/nvim-lspconfig).

For example:

```lua
local lsp_zero = require('lsp-zero')
lsp_zero.extend_lspconfig({})

lsp_zero.client_config({
  on_init = function(client)
    print('hello from' .. client.name)
  end,
})

require('lspconfig').gleam.setup({})
require('lspconfig').lua_ls.setup({})
```

## new_client(*opts*)

lsp-zero will execute a user provided function to detect the root directory of the project when Neovim assigns the file type for a buffer. If the root directory is detected the language server will be attached to the file.

This function does not depend on [lspconfig](https://github.com/neovim/nvim-lspconfig), it's a thin wrapper around a Neovim function called [vim.lsp.start()](https://neovim.io/doc/user/lsp.html#vim.lsp.start()).

`{opts}` supports every property [vim.lsp.start()](https://neovim.io/doc/user/lsp.html#vim.lsp.start()) supports with a few changes:

  * `filestypes`: Can be list filetype names. This can be any pattern the [FileType](https://neovim.io/doc/user/autocmd.html#FileType) autocommand accepts.

  * `root_dir`: Can be a function, it'll be executed after Neovim assigns the file type for a buffer. If it returns a string that will be considered the root directory for the project.

Other important properties are:

  * `cmd`: (Table) A lua table with the arguments necessary to start the language server.

  * `name`: (String) This is the name Neovim will assign to the client object.

  * `on_attach`: (Function) A function that will be executed after the language server gets attached to a buffer.

Here is an example that starts the language server for gleam, but only in a project that has a `gleam.toml` file in the current directory or any of its parent folders.

```lua
local lsp_zero = require('lsp-zero')

lsp_zero.ui({sign_text = true})

lsp_zero.on_attach(function()
  -- see :help lsp-zero-keybindings
  -- to learn the available actions
  lsp_zero.default_keymaps({buffer = bufnr})
end)

lsp_zero.new_client({
  cmd = {'gleam', 'lsp'},
  filetypes = {'gleam'},
  root_dir = function()
    -- You need Neovim v0.10 to use vim.fs.root
    return vim.fs.root(bufnr, {'gleam.toml'})
  end
})
```

## dir.find_first(*list*)

Checks the parent directories and returns the path to the first folder that has a file in `{list}`. This is useful to detect the root directory. 

Note: search will stop once it gets to your "HOME" folder.

`{list}` supports the following properties:

  * path: (String) The path from where it should start looking for the files in `{list}`.

  * buffer: (Boolean) When set to `true` use the path of the current buffer.

```lua
local lsp_zero = require('lsp-zero')

require('lspconfig').lua_ls.setup({
  root_dir = function()
    --- project root will be the first directory that has
    --- either .luarc.json or .stylua.toml
    return lsp_zero.dir.find_first({'.luarc.json', '.stylua.toml'})
  end
})
```

## dir.find_all(*list*)

Checks the parent directories and returns the path to the first folder that has all the files in `{list}`.

Note: search will stop once it gets to your "HOME" folder.

`{list}` supports the following properties:

  * path: (String) The path from where it should start looking for the files in `{list}`.

  * buffer: (Boolean) When set to `true` use the path of the current buffer.

```lua
local lsp_zero = require('lsp-zero')

require('lspconfig').vuels.setup({
  root_dir = function()
    --- project root will be the directory that has
    --- package.json + vetur config
    return lsp_zero.dir.find_all({'package.json', 'vetur.config.js'})
  end
})
```

## get_capabilities()

Returns Neovim's default capabilities mixed with the settings provided to lsp-zero in the functions [lsp-zero.extend_lspconfig()](#extend-lspconfig-opts) or [lsp-zero.client_config()](#client-config-opts).

This is useful when you want to configure a language using a specialized plugin.

## omnifunc.setup(*opts*)

Configure the behavior of Neovim's completion mechanism. If for some reason you refuse to install nvim-cmp you can use this function to make the built-in completions more user friendly.

`{opts}` supports the following properties:

  * `autocomplete`: Boolean. Default value is `false`. When enabled it triggers the completion menu if the character under the cursor matches `opts.keyword_pattern`. Completions will be disabled when you are recording a macro. Do note, the implementation here is extremely simple, there isn't any kind of optimizations in place. Is literally like pressing `<Ctrl-x><Ctrl-o>` after you insert a character in a word.

  * `tabcomplete`: Boolean. Default value is `false`. When enabled `<Tab>` will trigger the completion menu if the cursor is in the middle of a word. When the completion menu is visible it will navigate to the next item in the menu. If there is a blank character under the cursor it inserts a `Tab` character. `<Shift-Tab>` will navigate to the previous item in the menu, and if the menu is not visible it'll insert a `Tab` character.

  * `trigger`: String. It must be a valid keyboard shortcut. This will be used as a keybinding to trigger the completion menu manually. Actually, it will be able to toggle the completion menu. You'll be able to show and hide the menu with the same keybinding.

  * `use_fallback`: Boolean. Default value is `false`. When enabled lsp-zero will try to complete using the words in the current buffer. And when an LSP server is attached to the buffer, it will replace the fallback completion with the LSP completions.

  * `keyword_pattern`: String. Regex pattern used by the autocomplete implementation. Default value is `"[[:keyword:]]"`.

  * `update_on_delete`: Boolean. Default value is `false`. Turns out Neovim will hide the completion menu when you delete a character, so when you enable this option lsp-zero will trigger the menu again after you press `<backspace>`. This will only happen with LSP completions, the fallback completion updates automatically (again, this is Neovim's default behavior). This option is disabled by default because it requires lsp-zero to bind the backspace key, which may cause conflicts with other plugins.

  * `select_behavior`: String. Default value is `"select"`. Configures what happens when you select an item in the completion menu. When the value is `"insert"` Neovim will insert the text of the item in the buffer. When the value is `"select"` nothing happens, Neovim will only highlight the item in the menu, the text in the buffer will not change.

  * `preselect`: Boolean. Default value is `true`. When enabled the first item in the completion menu will be selected automatically.

  * `verbose`: Boolean. Default value is `false`. When enabled Neovim will show the state of the completion in message area.

  * `expand_snippet`: Function. Callback that will be invoked when the CompleteDone event is triggered and the completion item is a snippet.

  * `mapping`: Table. Defaults to an empty table. With this you can configure the keybinding for common actions.

    * `confirm`: Accept the selected completion item.

    * `abort`: Cancel current completion.

    * `next_item`: Navigate to next item in the completion menu.

    * `prev_item`: Navigate to previous item in the completion menu.

You can configure a basic "tab completion" behavior using these settings.

```lua
local lsp_zero = require('lsp-zero')

lsp_zero.omnifunc.setup({
  tabcomplete = true,
  use_fallback = true,
  update_on_delete = true,
})
```

And here is an example for autocomplete.

```lua
local lsp_zero = require('lsp-zero')

lsp_zero.omnifunc.setup({
  autocomplete = true,
  use_fallback = true,
  update_on_delete = true,
  trigger = '<C-Space>',
})
```

## cmp_format(*opts*)

When used the completion items will show a label that identifies the source they come from.

By default it will override the property where nvim-cmp shows extra data about the completion item. This can be configured using the `details` property in `opts`.

`{opts}` supports the following properties:

  * details: (Boolean, Optional). Defaults to `false`. When enabled it will show extra information about completion item.

  * max_width: (Number, Optional). Maximum width the text content of the suggestion can have.

The return value of this function must be used in the `formatting` property of nvim-cmp.

```lua
local cmp = require('cmp')
local cmp_format = require('lsp-zero').cmp_format()

cmp.setup({
  formatting = cmp_format
})
```

## cmp_action()

Is a function that returns methods meant to be used as mappings for nvim-cmp.

These are the supported methods:

* `tab_complete`: Enables completion when the cursor is inside a word. If the completion menu is visible it will navigate to the next item in the list. If the line is empty it uses the fallback.

* `select_prev_or_fallback`: If the completion menu is visible navigate to the previous item in the list. Else, uses the fallback.

* `toggle_completion`: If the completion menu is visible it cancels the process. Else, it triggers the completion menu. You can use the property `modes` in the first argument to specify where this mapping should active (the default is `{modes = {'i'}}`).

* `vim_snippet_jump_forward`: Go to the next placeholder in a snippet created by the module `vim.snippet`. This requires Neovim v0.10 or greater.

* `vim_snippet_jump_backward`: Go to the previous placeholder in a snippet created by the module `vim.snippet`. This requires Neovim v0.10 or greater.

* `vim_snippet_next`: If completion menu is visible it will navigate to the next item in the list. If the cursor can jump to a vim snippet placeholder, it moves to it. Else, it uses the fallback. This requires Neovim v0.10 or greater.

* `vim_snippet_prev`: If completion menu is visible it will navigate to the previous item in the list. If the cursor can jump to a vim snippet placeholder, it moves to it. Else, it uses the fallback. This requires Neovim v0.10 or greater.

* `vim_snippet_tab_next`: If the completion menu is visible it will navigate to the next item in the list. If the cursor can jump to a vim snippet placeholder, it moves to it. If the cursor is in the middle of a word it displays the completion menu. Else, it uses the fallback. This requires Neovim v0.10 or greater.

* `luasnip_jump_forward`: Go to the next placeholder in a snippet created by luasnip.

* `luasnip_jump_backward`: Go to the previous placeholder in a snippet created by luasnip.

* `luasnip_next`: If completion menu is visible it will navigate to the next item in the list. If the cursor can jump to a luasnip placeholder, it moves to it. Else, it uses the fallback.

* `luasnip_next_or_expand`: If completion menu is visible it will navigate to the next item in the list. If cursor is on top of the trigger of a snippet it'll expand it. If the cursor can jump to a luasnip placeholder, it moves to it. Else, it uses the fallback.

* `luasnip_supertab`: If the completion menu is visible it will navigate to the next item in the list. If cursor is on top of the trigger of a snippet it'll expand it. If the cursor can jump to a luasnip placeholder, it moves to it. If the cursor is in the middle of a word that doesn't trigger a snippet it displays the completion menu. Else, it uses the fallback.

* `luasnip_shift_supertab`: If the completion menu is visible it will navigate to previous item in the list. If the cursor can navigate to a previous snippet placeholder, it moves to it. Else, it uses the fallback.

Quick note: "the fallback" is the default behavior of the key you assign to a method.

## noop()

Doesn't do anything. Literally.

You can use this as an "empty handler" for [mason-lspconfig.nvim](https://github.com/williamboman/mason-lspconfig.nvim). Consider this example.

```lua
local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  lsp_zero.default_keymaps({buffer = bufnr})
end)

require('mason').setup({})
require('mason-lspconfig').setup({
  ensure_installed = {'biome', 'rust_analyzer', 'jdtls'},
  handlers = {
    -- this first function is the "default handler"
    -- it applies to every language server without a "custom handler"
    function(server_name)
      require('lspconfig')[server_name].setup({})
    end,

    -- this is the "custom handler" for `jdtls`
    -- noop is an empty function that doesn't do anything
    jdtls = lsp_zero.noop,
  },
})
```

In here [mason-lspconfig](https://github.com/williamboman/mason-lspconfig.nvim) will install all the servers in `ensure_installed`. Then it will try configure the servers but it will ignore `jdtls` because the handler doesn't do anything. So you are free to configure jdtls however you like.

