---
prev: false
next: false
---

# LSP config without plugins

In the nightly version of Neovim (`v0.11`) we can integrate a language server with Neovim using two new functions: [vim.lsp.config](https://neovim.io/doc/user/lsp.html#vim.lsp.config()) and [vim.lsp.enable()](https://neovim.io/doc/user/lsp.html#vim.lsp.enable()). And here going to show an example of how to use them.

**IMPORTANT:** these functions are experimental and they are only available in the nightly build of Neovim. This means the API can change at any point in time.

## Install a language server

But first, a brief introduction:

A language server is a tool that follows the [LSP specification](https://microsoft.github.io/language-server-protocol/). These tools analyze the code in our project and send information to a client. The "client" in this case is Neovim.

Where can you find a language server compatible with Neovim? In the documentation of `nvim-lspconfig`, here: [nvim-lspconfig/doc/configs.md](https://github.com/neovim/nvim-lspconfig/blob/master/doc/configs.md). There you'll find a list of language servers. Some of them will show the command you can use to install them, others will just have a link to the project.

### lua language server

Since I want to show you an example configuration I will use [luals](https://github.com/LuaLS/lua-language-server).

If you know how to use pre-compiled executables, you can download the latest version from the [github releases](https://github.com/LuaLS/lua-language-server/releases). Or, you can [build it from the source code](https://luals.github.io/wiki/build/).

## Define a configuration

Once you have a language server installed is time to tell Neovim how to use it. For this we use `vim.lsp.config`.

Now in what file should we configure our language servers?

Option 1: Any `.lua` (or `.vim`) file that Neovim executes during startup will be good enough.

Option 2: Any folder in Neovim's runtimepath can have a folder called `lsp`, and there we can have our "default" server configurations.

Turns out Neovim's config folder is a valid location for that `lsp` folder I just mentioned. We can use that.

If you don't know the location of Neovim's config folder you can execute this command on your terminal.

```sh
nvim --headless -c 'echo stdpath("config") . "\n"' -c 'quit'
```

If that folder doesn't exists you have to create it.

I'm going to pretend this is the path of Neovim's config folder:

```
~/.config/nvim
```

We can place the configuration for `luals` in this file:

```
~/.config/nvim/lsp/luals.lua
```

And now here's the configuration code we need:

```lua
vim.lsp.config.luals = {
  cmd = {'lua-language-server'},
  filetypes = {'lua'},
  root_markers = {'.luarc.json', '.luarc.jsonc'},
}
```

### How does that work?

Fair question. Let me explain.

First thing you should know is `vim.lsp.config` is a meta-table, which means we can use it in different ways.

When we assign a property to it we define a new server configuration.

```lua
vim.lsp.config.luals = {
  ...
}
```

Here `luals` is the name we want to give to our language server. The lua table on the right hand of the `=` sign is the configuration itself.

When we use `vim.lsp.config` as a function it means we want to extend an existing configuration. For example:

```lua
vim.lsp.config('luals', {
  on_init = function()
    print('luals now runs in the background')
  end,
})
```

This would add the `on_init` function on top of the configuration we defined in `nvim/lsp/luals.lua`.

This is cool because a plugin can give you a basic configuration that "just works" and then you can extend it to your liking.

Using this form, the first argument of the function is the name of the language server. The second argument is the configuration.

### Global defaults

If we create a server configuration with the name `*` Neovim will use it like a fallback configuration.

Consider the following example. Pretend you have an `init.lua` file with this:

```lua
-- ~/.config/nvim/init.lua

vim.lsp.config['*'] = {
  on_init = function()
    print('this will be everywhere')
  end,
}

vim.lsp.config.luals = {
  on_attach = function()
    print('luals is now active in this file')
  end,
}
```

Here the final configuration for luals will have both `on_init` and `on_attach`.

But what if we add `on_init` to luals? Then luals won't use the one in `*`.

### Config options

The bare minimum we need to start a language server is this.

* `cmd`: Command that will spawn the language server in the background. You usually specify this as a list of strings. It could also be a lua function that connects to an existing server, but that's an advanced use case (that the server needs to support).

* `filetypes`: List of languages the server supports. These must be valid Neovim filetype names.

* `root_markers`: Okay... so the server needs to know the path of your project. This is a problem Neovim needs to solve. The idea here is that you provide a list of files you only find at the root the project. For example in rust that's `cargo.toml`, in php that's `composer.json` and javascript projects have a `package.json`. This is the kind of information you add to `root_markers`.

You can find the official description of these properties in the documentation, in [vim.lsp.Config](https://neovim.io/doc/user/lsp.html#vim.lsp.Config). And the full list of options is in [vim.lsp.ClientConfig](https://neovim.io/doc/user/lsp.html#vim.lsp.ClientConfig).

### Server configs

How do learn what's the correct configuration for a particular language server?

The first thing you should try is read the official documentation of the language server you want to use.

Another thing you could do is browse the `configs` folder of [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig). In [nvim-lspconfig/lua/lspconfig/configs](https://github.com/neovim/nvim-lspconfig/tree/master/lua/lspconfig/configs) you'll find more than 300 configurations.

If you inspect [lua_ls.lua](https://github.com/neovim/nvim-lspconfig/blob/12d163c5c2b05e85431f2deef5d9d59a8fd8dfc2/lua/lspconfig/configs/lua_ls.lua) you'll find something like this:

```lua
local root_files = {
  '.luarc.json',
  '.luarc.jsonc',
  '.luacheckrc',
  '.stylua.toml',
  'stylua.toml',
  'selene.toml',
  'selene.yml',
}

return {
  default_config = {
    cmd = {'lua-language-server'},
    filetypes = {'lua'},
    root_dir = function(fname)
      ---
      -- A lot of code...
      ---
    end,
  },
}
```

You can find the `cmd` and `filetypes` in the `default_config` table. Now `root_markers` is tricky, because there is some amount of logic that goes into detecting the root folder. Here we have a `root_files` variable that's easy to spot, you can just use that same list. Sometimes that list is directly in the `root_dir` property. Like this.

```lua
root_dir = util.root_pattern('zls.json', 'build.zig', '.git'),
```

Remember, the syntax for lua tables is `{thing, ...}`. Notice the curly braces. Do not try to copy `(thing, ...)` as is. A list inside parenthesis is not a lua table.

## Enable the server

With all the ingredients ready now is time to learn about `vim.lsp.enable()`.

`vim.lsp.enable()` is the function that will invoke our configuration. This will create the "event listeners" Neovim needs to use the language server.

Let's talk about this for a second. Do you want Neovim to use the lua language server when you open a `javascript` file? No. That makes no sense. When you open a lua file, that's when it makes sense to use it. For this to work Neovim will need to create a function that runs only under that condition. That's what `vim.lsp.enable()` will do for you.

So this is all you have to do:

```lua
vim.lsp.enable('luals')
```

::: details Expand: Neovim and luals

The language server for lua does not have "support" Neovim's lua API out the box. You won't get code completion for Neovim's builtin functions and you may see some annoying warnings.

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

That's it. Just pass the name of a language server as a first argument.

You might be wondering why isn't `vim.lsp.config` enough? It has all the information. The filetype, the commmand, root_marker stuff. Why do we need an extra function? Because weird projects exists.

Imagine. You have a default config that works fine... except in that one monorepo at work. You know the one. Then you wish you could have a special config just for that one use case. Good news, you can do that, because configuration and setup are separate steps. You can use `vim.lsp.enable()` to invoke the right config at the right time.

## Quick example code

To recap, to use a language server in Neovim `v0.11` we have to:

1. Install a language server
2. Define a configuration
3. Enable said configuration

We can do steps 2 and 3 in a single file if we really wanted to.

If you have an `init.lua` file, you are free to do something like this:

```lua
-- ~/.config/nvim/init.lua

vim.lsp.config.luals = {
  cmd = {'lua-language-server'},
  filetypes = {'lua'},
  root_markers = {'.luarc.json', '.luarc.jsonc'},
}

vim.lsp.enable('luals')
```

And that's it. That's the end of this part of the story.

## What's next?

You can learn about the features the LSP client can offer:

* [LSP client features](./lsp-client-features)

