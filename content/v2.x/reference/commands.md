---
next:
  text: Lua API
  link: ./lua-api
---

# Commands

## LspZeroFormat

Formats the current buffer or range. Under the hood lsp-zero is using the function `vim.lsp.buf.format()`. If the "bang" is provided formatting will be asynchronous (ex: `LspZeroFormat!`). If you provide the name of a language server as a first argument it will try to format only using that server. Otherwise, it will use every active language server with formatting capabilities. With the `timeout` parameter you can configure the time in milliseconds to wait for the response of the formatting requests.

Examples:

Format buffer using all active language servers with formatting capabilities.

```vim
:LspZeroFormat
```

Format buffer using `lua_ls` and set a timeout (in milliseconds).

```vim
:LspZeroFormat lua_ls timeout=1000
```

## LspZeroSetupServers

It takes a space separated list of servers and configures them.

Example:

Setup the language servers for typescript and lua.

```vim
:LspZeroSetupServers tsserver lua_ls
```

Setup the lua language server using the current working directory as the root directory.

```vim
:LspZeroSetupServers! lua_ls
```

## LspZeroWorkspaceRemove

Remove current folder from the workspace folders. See [:help vim.lsp.buf.remove_workspace_folder()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.remove_workspace_folder()).

## LspZeroWorkspaceAdd

Add current folder the workspace folders. See [:help vim.lsp.buf.add_workspace_folder()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.add_workspace_folder()).

## LspZeroWorkspaceList

List workspace folders. See [:help vim.lsp.buf.list_workspace_folders()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.list_workspace_folders()).

