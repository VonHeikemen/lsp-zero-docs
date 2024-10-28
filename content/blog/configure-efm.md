---
prev: false
next: false
---

# Configure the efm language server in lua

> Last updated: 2024-10-27

With the help of [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig).

## Initialization

First thing you do is add the `efm` setup function to your Neovim configuration.

```lua
require('lspconfig').efm.setup({})
```

And inside the curly braces we are going to add all our options.

We need to specify the features our tools support. We do this using the `init_options` property.

```lua{2-9}
require('lspconfig').efm.setup({
  init_options = {
    documentFormatting = false,
    documentRangeFormatting = false,
    hover = false,
    documentSymbol = false,
    completion = false,
    codeAction = false
  },
})
```

You might notice everything is set to `false`, that's because I don't know which tools **you** are going to use. You'll have to enable the things you want to use.

## Tool config

To help you organize your code a little bit you can add the configuration for each tool inside a lua table. Here is an example.

```lua
local efm_tools = {
  some_formatter = {
    formatCommand = "example-formatter '${INPUT}'",
    formatCanRange = false,
    formatStdin = false,
  },
  some_linter = {
    lintCommand = "example-linter '${INPUT}'",
    lintStdin = false,
  },
}
```

Here all the configurations will be stored in the lua table `efm_tools`. And since lua tables can be nested we can have have each tool in its own table.

Now, how do you know which properties you can use inside each tool? `formatCommand`, `formatStdin`... where does that come from? Well, in efm's readme there is [an example config](https://github.com/mattn/efm-langserver?tab=readme-ov-file#example-for-configyaml) written in yaml. You can see the basic configuration options they have available. And if you want to know more details go to [schemas.md](https://github.com/mattn/efm-langserver/blob/master/schema.md) file.

The thing you should be aware of is in yaml you use `kebab-case`. But in lua you use `camelCase`. So, `format-stdin` in yaml becomes `formatStdin` in lua.

## Language support

Now lets pretend our tools ready, how do we add them to efm?

Inside the property `settings` you are going to add another lua table with the languages you want to support.

```lua{11-16}
local efm_tools = {
  -- code omitted for brevity....
}

require('lspconfig').efm.setup({
  init_options = {
    -- code omitted....
  },
  settings = {
    rootMarkers = {'.git/'},
    languages = {
      example_lang = {
        efm_tools.some_formatter,
        efm_tools.some_linter,
      },
    }
  },
})
```

Here `example_lang` is the language we want to support. And inside we list all the tools we want to use in this language.

What is that `rootMarkers` thing? That's the list of directories or files that efm will use to figure out what is the top level directory of your project. A `.git` directory is usually a good indicator.

## The last step (optional)

The last detail you need to be aware of is the `filetypes` in which you want Neovim to attach the efm language server. If you don't do this, `lspconfig` will attach efm to every file you open.

You can ignore this step. But if you want more control over which file efm can act on, you should specify a list of valid Neovim filetypes in the `filetypes` property.

```lua{8-11}
require('lspconfig').efm.setup({
  init_options = {
    -- code omitted....
  },
  settings = {
    -- code omitted....
  },
  filetypes = {
    'somefiletype',
    'anotherfiletype',
  },
})
```

## Example config

This example will use [prettierd](https://github.com/fsouza/prettierd) and [eslint_d](https://github.com/mantoni/eslint_d.js).

Note in recent versions of `eslint` (v9 and greater) the `visualstudio` formatter was removed. You may need to install [eslint-formatter-visualstudio](https://www.npmjs.com/package/eslint-formatter-visualstudio) as a dev dependency.

```lua
local efm_tools = {
  prettierd = {
    formatCommand = "prettierd '${INPUT}' ${--range-start=charStart} ${--range-end=charEnd}",
    formatStdin = true,
    formatCanRange = true,
  },
  eslint_d = {
    lintSource = 'efm/eslint_d',
    lintCommand = 'eslint_d --no-color --format visualstudio --stdin-filename "${INPUT}" --stdin',
    lintIgnoreExitCode = true,
    lintStdin = true,
    lintFormats = {
      '%f(%l,%c): %trror %m',
      '%f(%l,%c): %tarning %m'
    },
    rootMarkers = {
      'eslint.config.js',
      'eslint.config.mjs',
      'eslint.config.cjs',
      'package.json',
    },
  }
}

require('lspconfig').efm.setup({
  init_options = {
    documentFormatting = true,
    documentRangeFormatting = true,
  },
  settings = {
    rootMarkers = {'.git/'},
    languages = {
      javascript = {
        efm_tools.eslint_d,
        efm_tools.prettierd,
      },
      typescript = {
        efm_tools.eslint_d,
        efm_tools.prettierd,
      },
    },
  },
  filetypes = {
    'javascript',
    'javascriptreact',
    'javascript.jsx',
    'typescript',
    'typescriptreact',
    'typescript.jsx',
  },
})
```

