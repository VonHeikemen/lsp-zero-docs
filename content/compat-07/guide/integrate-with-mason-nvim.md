---
prev: false
next: false
---

# Integrate with mason.nvim

We can use [mason.nvim](https://github.com/williamboman/mason.nvim) and [mason-lspconfig.nvim](https://github.com/williamboman/mason-lspconfig.nvim) to help us manage the installation of language servers. And then we can use lsp-zero to help with the automatic configuration.

Here is a basic example.

```lua
local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  -- see :help lsp-zero-keybindings
  -- to learn the available actions
  lsp_zero.default_keymaps({buffer = bufnr})
end)

require('mason').setup({})
require('mason-lspconfig').setup({
  -- Replace the language servers listed here 
  -- with the ones you want to install
  ensure_installed = {'tsserver', 'rust_analyzer'},
  handlers = {
    lsp_zero.default_setup,
  },
})
```

This config will tell `mason-lspconfig` to install tsserver and rust_analyzer automatically if they are missing. And lsp-zero will handle the configuration of those servers.

The servers listed in the `ensure_installed` option must be on [this list](https://github.com/williamboman/mason-lspconfig.nvim#available-lsp-servers).

Note that after you install a language server you will need to restart Neovim so the language can be configured properly.

## Configure a language server

If we need to add a custom configuration for a server, you'll need to add a property to `handlers`. This new property must have the same name as the language server you want to configure, and you need to assign a function to it.

Lets use an imaginary language server called `example_server` as an example.

```lua
--- in your own config you should replace 
--- `example_server` with the name of a language server

require('mason-lspconfig').setup({
  handlers = {
    lsp_zero.default_setup,
    example_server = function()
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

Here we use the module `lspconfig` to setup the language server and we add our custom config in the first argument of `.example_server.setup()`.

## Exclude a language server from the automatic setup

If we want to ignore a language server we can use the function [.noop()](../reference/lua-api#noop) as a handler. This will make `mason-lspconfig` ignore the setup for the language server.

```lua{7}
--- in your own config you should replace 
--- `example_server` with the name of a language server

require('mason-lspconfig').setup({
  handlers = {
    lsp_zero.default_setup,
    example_server = lsp_zero.noop,
  },
})
```

When the time comes for `mason-lspconfig` to setup `example_server` it will execute an empty function.

## The magic behind .default_setup()

The function [.default_setup()](../reference/lua-api#default-setup-server) is really just a "shortcut" that calls `lspconfig`.

This basically what happens (explained with code):

```lua
-- just in case: there is no need to copy/paste this example in your own config
-- this snippet exists only for educational purpose.

require('mason-lspconfig').setup({
  ensure_installed = {'tsserver', 'rust_analyzer'},
  handlers = {
    function(name)
      local lsp = require('lspconfig')[name]
      if lsp.manager then
        -- if lsp.manager is defined it means the
        -- language server was configured some place else
        return
      end

      -- at this point lsp-zero has already applied
      -- the "capabilities" options to lspconfig's defaults. 
      -- so there is no need to add them here manually.

      lsp.setup({})
    end,
  },
})
```

