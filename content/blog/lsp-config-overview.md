---
prev: false
next: false
---

# LSP config

> Last updated: 2025-03-27

Here I want to give you a quick overview of how you can use an "LSP server" in Neovim `v0.11`.

## Step 1: Install a server

I will use [luals](https://github.com/LuaLS/lua-language-server) as an example. Install instructions for this server are in the official documentation: [luals.github.io/wiki/build](https://luals.github.io/wiki/build/).

## Step 2: Define a configuration

In Neovim's config folder you can create another folder called `lsp`. There you can add a configuration file for each language server you have installed.

```lua
-- ~/.config/nvim/lsp/luals.lua

return {
  cmd = {'lua-language-server'},
  filetypes = {'lua'},
  root_markers = {'.luarc.json', '.luarc.jsonc'},
}
```

## Step 3: Enable the server

Now in your Neovim configuration you enable the server.

```lua
-- ~/.config/nvim/init.lua

vim.lsp.enable('luals')
```

::: details Expand: Neovim and luals

The language server for lua does not have support Neovim's lua API out the box. You won't get code completion for Neovim's builtin functions and you may see some annoying warnings.

To get some basic support for Neovim, create a file called .luarc.json in your Neovim config folder (next to your init.lua file). Then add this content.

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
:::

## Profit

Once Neovim can "attach" the language server to a file it will start analyzing the code in your project. You'll get error/warning messages if there is anything wrong in your code. And you'll get semantic syntax highlight.

Neovim will setup the following keymaps:

* `Control + ]` jump to definition (use control + t to go back).

* `Control + x then Control + o` will trigger code completion menu.

* `Control + w then d` opens a floating window showing the error/warning message in the line under the cursor.

* `[d` and `]d` can be used to move the cursor to the previous and next errors/warnings of the current file.

* `grn` renames all references of the symbol under the cursor.

* `gra` shows a list of code actions available in the line under the cursor.

* `grr` lists all the references of the symbol under the cursor.

* `gri` lists all the implementations for the symbol under the cursor.

* `Control + s` in insert mode displays the function signature of the symbol under the cursor.

Is worth mention not every language server implements all these features. The fact that Neovim can request to rename a variable does not mean the language server can actually do it. You have to keep in mind language servers are independent projects that exist outside of Neovim. They can have their own set of bugs and features.

## Learn more?

If you want to learn more about `vim.lsp.config` and `vim.lsp.enable` read this post:

* [LSP config without plugins](./lsp-config-without-plugins)

If want to know what other things you can implement with Neovim's LSP client read this:

* [LSP client features](./lsp-client-features)

