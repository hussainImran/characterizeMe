<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://github.com/hussainImran
 * @since             1.0.0
 * @package           Characterize
 *
 * @wordpress-plugin
 * Plugin Name:       Characterize Me
 * Plugin URI:        https://github.com/hussainImran/characterizeMe
 * Description:       Update CPT title and featured image from API
 * Version:           1.0.1
 * Author:            Imran Hussain
 * Author URI:        https://github.com/hussainImran
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       characterize
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'CHARACTERIZE_VERSION', '1.0.1' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-characterize.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_characterize() {

	$plugin = new Characterize();
	$plugin->run();

}
run_characterize();
