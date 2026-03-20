<?php
/**
 * Plugin Name:       {{PLUGIN_NAME}}
 * Plugin URI:        {{PLUGIN_URI}}
 * Description:       {{PLUGIN_DESCRIPTION}}
 * Version:           1.0.0
 * Requires at least: {{MIN_WP}}
 * Requires PHP:      {{MIN_PHP}}
 * Author:            {{AUTHOR_NAME}}
 * Author URI:        {{AUTHOR_URI}}
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       {{TEXT_DOMAIN}}
 * Domain Path:       /languages
 *
 * @package {{NAMESPACE}}
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Define plugin constants.
define( '{{CONST_VERSION}}', '1.0.0' );
define( '{{CONST_FILE}}', __FILE__ );
define( '{{CONST_DIR}}', plugin_dir_path( __FILE__ ) );
define( '{{CONST_URL}}', plugin_dir_url( __FILE__ ) );
define( '{{CONST_BASENAME}}', plugin_basename( __FILE__ ) );

// Autoloader.
require_once {{CONST_DIR}} . 'vendor/autoload.php';

// Activation / deactivation hooks.
register_activation_hook( __FILE__, [ '{{NS_INCLUDES}}\\Activator', 'activate' ] );
register_deactivation_hook( __FILE__, [ '{{NS_INCLUDES}}\\Deactivator', 'deactivate' ] );

// Boot the plugin after all plugins are loaded.
add_action( 'plugins_loaded', function () {
	$plugin = new {{NS_INCLUDES}}\\Plugin();
	$plugin->run();
}, 10 );
