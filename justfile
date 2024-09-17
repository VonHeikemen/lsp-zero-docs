default:
  just --list

build:
  pnpm run build:v4
  pnpm run build:v3
  pnpm run build:blog

update-redirect:
  rm ./output/_redirects
  cp ./_redirects ./output/_redirects

new-index:
  rm ./output/index.html
  rm ./output/_redirects
  cp ./output/docs/index.html ./output/index.html
  cp ./_redirects ./output/_redirects

