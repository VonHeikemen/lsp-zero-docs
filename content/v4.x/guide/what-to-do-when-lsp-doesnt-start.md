---
prev: false
next: false
---

# What to do when a language server doesn't start?

## Ensure the executable is on your PATH

Before we start, do you know what is the "PATH"?

If the answer is "No, I don't know what the hell you are talking about?" I'm going to tell you.

```
The PATH is an environment variable that contains a list of folder locations
that the operating system searches for executable files.
```

Here are a couple of links that can be useful to you.

* [How To View and Update the Linux PATH Environment Variable](https://www.digitalocean.com/community/tutorials/how-to-view-and-update-the-linux-path-environment-variable)

* [How to set the path and environment variables in Windows](https://www.computerhope.com/issues/ch000549.htm)

Now that you know, we can move on.

You can check if Neovim can find the executable of a language server using the command `:LspInfo`, that will show you information about all language servers you have configured with `lspconfig`.

Open a file where the language server should be active, then execute the command `:LspInfo`. If the executable could not be found it you should get an error message like this one:

```
- ERROR Failed to run healthcheck for "lspconfig" plugin. Exception:
  Vim:E475: Invalid value for argument cmd: 'astro-ls' is not executable
```

Here I'm using the astro language server as an example. That's why it shows `cmd: 'astro-ls' is not executable`.

If you get something like this, try to update your PATH environment variable. Add the folder where the executable of the language server is located.

## Inspect the log file

If the language server fails after it starts, look for an error message in the log file. Use this command.

```vim
:LspLog
```

## Ensure mason-lspconfig knows about the server

If you are using `mason-lspconfig` to handle the automatic setup, the first thing you can do is make sure mason-lspconfig recognizes the server.

Execute this command to inspect the list of installed servers.

```lua
:lua = require('mason-lspconfig').get_installed_servers()
```

If everything is okay you should see a list like this.

```lua
{"ts_ls", "eslint"}
```

If your language server is not on this list execute the command `:LspInstall` with the name of the server. For example:

```
:LspInstall eslint
```

## Ensure the setup function for the language server was called

Open Neovim using this commmand `nvim test`. The idea here is that you open Neovim with an empty buffer with no filetype. Why? just in case you are lazy loading lspconfig. Now execute the command `:LspInfo`, this will open a new tabpage with some information. You should have something like this.

```
LSP configs active in this session (globally) ~
- Configured servers: ts_ls, intelephense, rust_analyzer, lua_ls
- OK Deprecated servers: (none)

LSP configs active in this buffer (bufnr: 1) ~
- Language client log: ~/.local/state/nvim/lsp.log
- Detected filetype: ``
- 0 client(s) attached to this buffer

Docs for active configs: ~
```

Notice it says `Configured servers list`, your language server should be there. If it isn't, you need to make sure lspconfig's setup function is being called.

If `lua_ls` were missing then you would need to make sure somewhere in your config this function is being called.

```lua
require('lspconfig').lua_ls.setup({})
```

If you used `mason-lspconfig` automatic setup then it's being called for you in the `handlers` option. You should have something like this.

```lua
require('mason-lspconfig').setup({
  handlers = {
    function(server_name)
      require('lspconfig')[server_name].setup({})
    end,
  }
})
```

## Ensure root_dir can be detected

When you execute the command `:LspInfo` inside an existing file you should get more data about the server.

Sometimes you will get something like this.

```
LSP configs active in this buffer (bufnr: 1) ~
- Language client log: ~/.local/state/nvim/lsp.log
- Detected filetype: `typescript`
- 0 client(s) attached to this buffer
- Other clients that match the "typescript" filetype:
- Config: ts_ls
  filetypes:         javascript, javascriptreact, typescript, typescriptreact
  cmd:               ~/.local/bin/typescript-language-server --stdio
  version:           `4.3.3`
  executable:        true
  autostart:         true
  root directory:    Not found.
```

In this example the language server for typescript is not active in the current file.

The important bit is this.

```
  root directory:    Not found.
```

This means `lspconfig` could not figure out what is the root of your project.

lspconfig will look for some common configuration file in the current directory or the parent directories. If it can't find them the language server doesn't get attached to the file.

How do you know which files lspconfig looks for? Ideally, you would know because you read the documentation. Each server looks for a particular set of files and you can find that information here: [configs.md](https://github.com/neovim/nvim-lspconfig/blob/master/doc/configs.md).

Sometimes the documentation in lspconfig just says `see source file` in the `root_dir` section. In this case what you can do is inspect the source code of lspconfig. If you have lsp-zero installed you can use the command `:LspZeroViewConfigSource` with the name of a language server, this will open the configuration file for that server in a split window.

So you can inspect `ts_ls` config using this.

```
:LspZeroViewConfigSource ts_ls
```

Once there, you can look for a property called `root_dir`. This property is usually a lua function, so you might find some amount of logic there, but you can still get an idea of which files lspconfig looks for.

