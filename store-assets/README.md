# Chrome Web Store assets

## Icon

- `icon-128-transparent.png`
- 128 x 128 pixels
- PNG with a transparent background

## Global screenshots

Upload the files in this order:

1. `screenshots/01-brand-overview.png`
2. `screenshots/02-find-non-followers.png`
3. `screenshots/03-connection-filters.png`
4. `screenshots/04-safe-unfollow.png`
5. `screenshots/05-privacy-languages.png`

Every screenshot is 1280 x 800 pixels, 24-bit RGB PNG, and has no alpha channel.

Run `powershell -ExecutionPolicy Bypass -File scripts/generate-store-assets.ps1` from the project root to regenerate the files from `screenshots/source.html`.
