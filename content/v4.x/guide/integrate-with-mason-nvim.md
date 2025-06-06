---
prev: false
next: false
---

# Integrate with mason.nvim (version 1)

We can use [mason.nvim](https://github.com/williamboman/mason.nvim) and [mason-lspconfig.nvim](https://github.com/williamboman/mason-lspconfig.nvim) to help us manage the installation of language servers. And then we can use [lspconfig](https://github.com/neovim/nvim-lspconfig) to setup the servers only when they are installed.

::: info Note:

`mason.nvim` version 2 requires Neovim v0.10 or greater. And, `mason-lspconfig.nvim` version 2 requires Neovim v0.11.

:::

Here is a basic example.

```lua
require('mason').setup({})
require('mason-lspconfig').setup({
  -- Replace the language servers listed here 
  -- with the ones you want to install
  ensure_installed = {'lua_ls', 'rust_analyzer'},
  handlers = {
    function(server_name)
      require('lspconfig')[server_name].setup({})
    end,
  },
})
```

This config will tell `mason-lspconfig` to install lua_ls and rust_analyzer automatically if they are missing. And [lspconfig](https://github.com/neovim/nvim-lspconfig) will handle the configuration of those servers.

The servers listed in the `ensure_installed` option must be on [this list](https://github.com/williamboman/mason-lspconfig.nvim#available-lsp-servers).

Note that after you install a language server you will need to restart Neovim so the language server can be configured properly.

## Configure a language server

If we need to add a custom configuration for a server, you'll need to add a property to `handlers`. This new property must have the same name as the language server you want to configure, and you need to assign a function to it.

Lets use an imaginary language server called `example_server` as an example.

```lua
--- in your own config you should replace 
--- `example_server` with the name of a language server

require('mason-lspconfig').setup({
  handlers = {
    -- this first function is the "default handler"
    -- it applies to every language server without a "custom handler"
    function(server_name)
      require('lspconfig')[server_name].setup({})
    end,

    -- this is the "custom handler" for `example_server`
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

If we want to ignore a language server we can use an empty function as a handler. This will make `mason-lspconfig` ignore the setup for the language server.

```lua{4,15}
--- in your own config you should replace 
--- `example_server` with the name of a language server

local noop = function() end

require('mason-lspconfig').setup({
  handlers = {
    -- this first function is the "default handler"
    -- it applies to every language server without a "custom handler"
    function(server_name)
      require('lspconfig')[server_name].setup({})
    end,

    -- this is the "custom handler" for `example_server`
    example_server = noop,
  },
})
```

So `example_server = noop` is the same thing as this.

```lua
example_server = function() end
```

When the time comes for `mason-lspconfig` to setup `example_server` it will execute an empty function.

