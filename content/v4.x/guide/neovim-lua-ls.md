---
prev: false
next: false
---

# Configure lua language server for Neovim

There are two ways you can do this:

## Project specific config (recommended)

We can create a file called `.luarc.json` file in Neovim's config folder and add the following config.

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
    "$VIMRUNTIME"
  ]
}
```

## Lua config

So, if there isn't any local config file (`.luarc.json`) in the current root directory then we can apply the Neovim specific settings to the language server.

```lua
require('lspconfig').lua_ls.setup({
  settings = {
    Lua = {
      telemetry = {
        enable = false
      },
    },
  },
  on_init = function(client)
    local join = vim.fs.joinpath
    local path = client.workspace_folders[1].name

    -- Don't do anything if there is project local config
    if vim.uv.fs_stat(join(path, '.luarc.json')) 
      or vim.uv.fs_stat(join(path, '.luarc.jsonc'))
    then
      return
    end

    -- Apply neovim specific settings
    local runtime_path = vim.split(package.path, ';')
    table.insert(runtime_path, join('lua', '?.lua'))
    table.insert(runtime_path, join('lua', '?', 'init.lua'))

    local nvim_settings = {
      runtime = {
        -- Tell the language server which version of Lua you're using
        version = 'LuaJIT',
        path = runtime_path
      },
      diagnostics = {
        -- Get the language server to recognize the `vim` global
        globals = {'vim'}
      },
      workspace = {
        checkThirdParty = false,
        library = {
          -- Make the server aware of Neovim runtime files
          vim.env.VIMRUNTIME,
          vim.fn.stdpath('config'),
        },
      },
    }

    client.config.settings.Lua = vim.tbl_deep_extend(
      'force',
      client.config.settings.Lua,
      nvim_settings
    )
  end,
})
```

If you used `mason-lspconfig.nvim` to setup your language servers, add `lua_ls` to your handlers config.

```lua
require('mason').setup({})
require('mason-lspconfig').setup({
  handlers = {
    function(server_name)
      require('lspconfig')[server_name].setup({})
    end,
    lua_ls = function()
      require('lspconfig').lua_ls.setup({
        settings = {
          Lua = {
            telemetry = {
              enable = false
            },
          },
        },
        on_init = function(client)
          local join = vim.fs.joinpath
          local path = client.workspace_folders[1].name

          -- Don't do anything if there is project local config
          if vim.uv.fs_stat(join(path, '.luarc.json')) 
            or vim.uv.fs_stat(join(path, '.luarc.jsonc'))
          then
            return
          end

          -- Apply neovim specific settings
          local runtime_path = vim.split(package.path, ';')
          table.insert(runtime_path, join('lua', '?.lua'))
          table.insert(runtime_path, join('lua', '?', 'init.lua'))

          local nvim_settings = {
            runtime = {
              -- Tell the language server which version of Lua you're using
              version = 'LuaJIT',
              path = runtime_path
            },
            diagnostics = {
              -- Get the language server to recognize the `vim` global
              globals = {'vim'}
            },
            workspace = {
              checkThirdParty = false,
              library = {
                -- Make the server aware of Neovim runtime files
                vim.env.VIMRUNTIME,
                vim.fn.stdpath('config'),
              },
            },
          }

          client.config.settings.Lua = vim.tbl_deep_extend(
            'force',
            client.config.settings.Lua,
            nvim_settings
          )
        end,
      })
    end,
  },
})
```

