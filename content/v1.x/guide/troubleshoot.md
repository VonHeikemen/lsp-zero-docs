---
next: false
---

# Troubleshooting

## Automatic setup failed

To figure out what happened use the function `require('lsp-zero.check').run()` in command mode, pass a string with the name of the language server.

Here is an example with `lua_ls`.

```lua
:lua require('lsp-zero.check').run('lua_ls')
```

::: tip Note:

The name of the language server must match with one in this list: [server_configurations](https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md#configurations).

:::

If the language server is not being configured you'll get a message like this.

```
LSP server: lua_ls
- was not installed with mason.nvim
- hasn't been configured with lspconfig
```

This means `mason.nvim` doesn't have the server listed as "available" and that's why the automatic setup failed. Try re-install with the command `:LspInstall`.

When everything is fine the report should be this.

```
LSP server: lua_ls
+ was installed with mason.nvim
+ was configured using lspconfig
+ "lua-language-server" is executable
```

If it says `- "lua-language-server" was not found` it means Neovim could not find the executable in the "PATH".

You can inspect your PATH using this command.

```lua
:lua vim.tbl_map(print, vim.split(vim.env.PATH, ':'))
```

::: tip Note:

If you use windows replace ':' with ';' in the second argument of `vim.split`. 

:::

The executable for your language server should be in one of those folders. Make sure it is present and the file itself is executable.

## Root directory not found

You used the command `:LspInfo` and it showed `root directory: Not found.` This means [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig/) couldn't figure out what is the "root" folder of your project. In this case you should go to `lspconfig`'s github repo and browse the [server_configurations](https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md) file, look for the language server then search for `root_dir`, it'll have something like this.

```lua
root_pattern("somefile.json", ".somefile" , ".git")
```

`root_pattern` is a function inside lspconfig, it tries to look for one of those files/folders in the current folder or any of the parent folders. Make sure you have at least one of the files/folders listed in the arguments of the function.

Now, sometimes the documentation in lspconfig just says `see source file`. This means you need to go the source code to figure out what lspconfig looks for. You need to go to the [server config folder](https://github.com/neovim/nvim-lspconfig/tree/master/lua/lspconfig/server_configurations), click in the file for the language server, look for the `root_dir` property that is inside a "lua table" called `default_config`.

## Inspect server settings

Let say that you added some "settings" to a server... something like this.

```lua
lsp.configure('tsserver', {
  settings = {
    completions = {
      completeFunctionCalls = true
    }
  }
})
```

Notice here that we have a property called `settings`, and you want to know if lsp-zero did send your config to the active language server. Use the function `require('lsp-zero.check').inspect_settings()` in command mode, pass a string with the name of the language server.

```lua
:lua require('lsp-zero.check').inspect_settings('tsserver')
```

If everything went well you should get every default config lspconfig added plus your own.

If this didn't showed your settings, make sure you don't call `lspconfig` in another part of your neovim config. lspconfig can override everything lsp-zero does.

## Inspect the entire server config

Use the function `require('lsp-zero.check').inspect_server_config()` in command mode, pass a string with the name of the language server.

Here is an example.

```lua
:lua require('lsp-zero.check').inspect_server_config('tsserver')
```

::: tip Note:

The name of the language server must match with one in this list: [server_configurations](https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md#configurations).

:::

## Testing a server in isolation

And by that I mean without the lsp-zero setup.

First thing you'll need to do is delete or "comment out" the configuration you have for lsp-zero. Then do everything manually. Call the setup function for `mason` and `mason-lspconfig`. After that, use `lspconfig` to configure the language server you want to test. If you use lsp-zero's keybindings or commands, you can add them in the `.on_attach` function.

Here is an example configuration for `tsserver`.

```lua
local lsp_zero = require('lsp-zero')
local lspconfig = require('lspconfig')

require('mason').setup()
require('mason-lspconfig').setup()

lspconfig.tsserver.setup({
  capabilities = require('cmp_nvim_lsp').default_capabilities(),
  on_attach = function(client, bufnr)
    lsp_zero.default_keymaps({buffer = bufnr})
    lsp_zero.buffer_commands()
  end
})
```

If the issue you have persists even without lsp-zero and you want to ask for help in `stackoverflow` or any other forum, I suggest you present a minimal config like this one. You'll increase the chances of getting support from the community (because sadly there aren't any lsp-zero experts out there).

If you need a minimal config for nvim-cmp, use this.

```lua
local cmp = require('cmp')

cmp.setup({
  sources = {
    {name = 'nvim_lsp'},
  },
  snippet = {
    expand = function(args)
      require('luasnip').lsp_expand(args.body)
    end,
  },
  mapping = cmp.mapping.preset.insert({
    ['<C-Space>'] = cmp.mapping.complete(),
    ['<C-b>'] = cmp.mapping.scroll_docs(-4),
    ['<C-f>'] = cmp.mapping.scroll_docs(4),
  })
})
```

