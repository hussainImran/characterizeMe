=== Characterize ===
Contributors: wpimran
Tags: characterize
Requires at least: 3.0.1
Tested up to: 5.9
Stable tag: 1.0.1
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

This plugin updates the post title and featured image of character post type from an API as the user types the character ID in the Characterize Block.

## Description

Characterize is a WordPress plugin that automatically updates the post title and featured image of character post types based on user input character IDs in the Characterize Block. It interacts with an external API to fetch relevant data.

## Installation

1. Upload `characterize.php` to the `/wp-content/plugins/` directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.

## How to Use

1. Add the Characterize Block in the Gutenberg editor.
2. Enter the character ID in the input box (max ID according to the API is 52).
3. Check the post title & featured image, updated from the API response.
4. If a number doesn't have an associated character, an error message will be displayed.

## Changelog

= 1.0.1 =
* Minor issues fixed and made some improvements.

= 1.0.0 =
* First Released 🚀.
