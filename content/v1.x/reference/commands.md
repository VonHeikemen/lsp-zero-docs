---
prev: false
---

# Commands

## LspZeroFormat

Formats the current buffer or range. If the "bang" is provided formatting will be synchronous (ex: LspZeroFormat!). If you provide the name of a language server as a first argument it will try to format only using that server. Otherwise, it will use every active language server with formatting capabilities. See [:help vim.lsp.buf.formatting()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.formatting()), [:help vim.lsp.buf.range_formatting()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.range_formatting()), [:help vim.lsp.buf.formatting_sync()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.formatting_sync()).

## LspZeroWorkspaceRemove

Remove the folder at path from the workspace folders. See [:help vim.lsp.buf.remove_workspace_folder()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.remove_workspace_folder()).

## LspZeroWorkspaceAdd

Add the folder at path to the workspace folders. See [:help vim.lsp.buf.add_workspace_folder()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.add_workspace_folder()).

## LspZeroWorkspaceList

List workspace folders. See [:help vim.lsp.buf.list_workspace_folders()](https://neovim.io/doc/user/lsp.html#vim.lsp.buf.list_workspace_folders()).

## LspZeroSetupServers

It takes a space separated list of servers and configures them. It calls the function [.use()](../reference/lua-api#use-name-opts) under the hood. If the `bang` is provided the root dir of the language server will be the same as neovim. It is recommended that you use only if you decide to handle server setup manually.

