# Bit Assist Translation Build System

This directory contains scripts and configuration for managing translations in the Bit Assist plugin. The plugin uses WordPress's standard i18n system for both backend (PHP) and frontend (React) translations.

## Overview

The translation system extracts translatable strings from both PHP and React code, merges them into a single POT template, and generates translation files in multiple formats:

- **`.pot`** (Portable Object Template): Source template for translators
- **`.po`** (Portable Object): Language-specific translations (maintained by translators)
- **`.mo`** (Machine Object): Binary format used by PHP's gettext
- **`.json`** (JED format): JSON format used by WordPress JavaScript i18n

## Workflow

```mermaid
graph TD
    A[React code with __() calls] -->|react-gettext-parser| B[frontend.pot]
    C[PHP code with __() calls] -->|wp i18n make-pot| D[backend strings]
    B -->|wp i18n make-pot --merge| E[bit-assist.pot]
    D --> E
    E -->|Translator edits| F[bit-assist-{locale}.po]
    F -->|wp i18n make-mo| G[bit-assist-{locale}.mo - for PHP]
    F -->|po-to-jed.mjs| H[bit-assist-{locale}-{handle}.json - for JS]
```

## Build Scripts

### Main Command

```bash
npm run i18n
```

This runs the complete translation build pipeline. Use this after adding new translatable strings.

### Individual Steps

#### 1. Extract Frontend Strings
```bash
npm run i18n:pot:frontend
```
- Scans all TypeScript/React files (`src/**/*.{ts,tsx}`)
- Extracts calls to `__()`, `_x()`, `_n()`, `_nx()`
- Outputs to `../languages/frontend.pot`

#### 2. Merge with Backend Strings
```bash
npm run i18n:pot:merge
```
- Uses WP-CLI to scan all PHP files
- Merges with `frontend.pot` from step 1
- Outputs to `../languages/bit-assist.pot`
- This is the master template file sent to translators

#### 3. Compile MO Files
```bash
npm run i18n:mo
```
- Compiles all `.po` files to binary `.mo` format
- Used by PHP's `load_plugin_textdomain()`

#### 4. Generate JSON for JavaScript
```bash
npm run i18n:jed
```
- Converts `.po` files to JED JSON format
- Used by `@wordpress/i18n` in React
- See `po-to-jed.mjs` for implementation

## Configuration Files

### `react-gettext-parser.config.js`

Configures which functions to extract from React code:

```javascript
{
  funcArgumentsMap: {
    __: ['msgid'],              // Simple translation
    _x: ['msgid', 'msgctxt'],   // Translation with context
    _n: ['msgid', 'msgid_plural'], // Plural forms
    _nx: ['msgid', 'msgid_plural', null, 'msgctxt'] // Plural with context
  }
}
```

**Note**: `sprintf()` is intentionally NOT included - it's a formatting function, not a translation function.

## Adding Translations

### 1. Add translatable strings to your code

**React/TypeScript:**
```tsx
import { __, _x, sprintf } from '@/helpers/i18nwrap'

// Simple translation
const greeting = __('Hello World')

// Translation with context (for disambiguation)
const noun = _x('Post', 'blog post')
const verb = _x('Post', 'submit action')

// Translation with variables
const message = sprintf(__('Welcome %s'), userName)
```

**PHP:**
```php
// Simple translation
echo __('Hello World', 'bit-assist');

// Translation with context
echo _x('Post', 'blog post', 'bit-assist');

// Translation with variables
echo sprintf(__('Welcome %s', 'bit-assist'), $userName);
```

### 2. Run the build

```bash
cd frontend
npm run i18n
```

This creates/updates `languages/bit-assist.pot`

### 3. Send POT to translators

Translators use the `.pot` file to create `.po` files for each language:
- `languages/bit-assist-bn_BD.po` (Bengali)
- `languages/bit-assist-es_ES.po` (Spanish)
- etc.

### 4. Compile translations

After receiving `.po` files from translators, run:

```bash
npm run i18n:mo    # Compile to .mo for PHP
npm run i18n:jed   # Convert to .json for JavaScript
```

## Translation Files

### Version Control

**Commit these files:**
- ✅ `languages/bit-assist.pot` (master template)
- ✅ `languages/frontend.pot` (frontend-only template)
- ✅ `languages/*.po` (translator-maintained)
- ✅ `languages/*.json` (needed at runtime for JS)

**DON'T commit:**
- ❌ `languages/*.mo` (binary, generated from .po)

See `.gitignore` configuration.

### File Formats

#### POT/PO Format
```po
msgid "Hello World"
msgstr "হ্যালো বিশ্ব"

# With context
msgctxt "blog post"
msgid "Post"
msgstr "পোস্ট"

# Plural forms
msgid "One item"
msgid_plural "%d items"
msgstr[0] "একটি আইটেম"
msgstr[1] "%d টি আইটেম"
```

#### JED JSON Format
```json
{
  "locale_data": {
    "messages": {
      "": {
        "domain": "messages",
        "lang": "bn_BD",
        "plural_forms": "nplurals=2; plural=(n != 1);"
      },
      "Hello World": ["হ্যালো বিশ্ব"]
    }
  }
}
```

## How It Works at Runtime

### Backend (PHP)
1. `Plugin.php` calls `load_plugin_textdomain('bit-assist', false, 'languages')`
2. WordPress loads `languages/bit-assist-{locale}.mo`
3. `__('Hello', 'bit-assist')` returns translated string

### Frontend (React)
1. `Layout.php` calls `wp_set_script_translations()` with domain `'bit-assist'` and path `languages/`
2. WordPress loads `languages/bit-assist-{locale}-bit-assist-index-MODULE.json` automatically (filename matches `{domain}-{locale}-{script-handle}.json`)
3. Translations are registered on global `wp.i18n`
4. `index.tsx` bridges global `wp.i18n` → bundled `@wordpress/i18n`
5. `__('Hello')` from `i18nwrap.ts` returns translated string

## Troubleshooting

### Strings not translating

1. **Check locale is set:**
   ```bash
   wp option get WPLANG --allow-root
   ```

2. **Verify JSON file exists:**
   ```bash
   ls -la languages/bit-assist-*-bit-assist-index-MODULE.json
   ```

3. **Check browser console** for i18n errors

4. **Verify locale data bridging** in browser console:
   ```javascript
   wp.i18n.getLocaleData('bit-assist')
   ```

### Build errors

1. **"No PO files found"** - This is normal if no translations exist yet
2. **"Invalid PO structure"** - Check `.po` file syntax
3. **"Directory not found"** - Run from `frontend/` directory

## Requirements

- **WP-CLI**: For `wp i18n make-pot` and `wp i18n make-mo`
- **Node.js**: For `react-gettext-parser` and `po-to-jed.mjs`
- **pnpm**: Package manager (or npm/yarn)

## References

- [WordPress i18n for Developers](https://developer.wordpress.org/plugins/internationalization/)
- [WP-CLI i18n commands](https://developer.wordpress.org/cli/commands/i18n/)
- [@wordpress/i18n package](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/)
- [Jed.js - JED format](https://messageformat.github.io/Jed/)
- [Gettext POT/PO format](https://www.gnu.org/software/gettext/manual/html_node/PO-Files.html)
