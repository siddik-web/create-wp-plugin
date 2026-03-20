<?php
/**
 * Plugin Deactivator
 *
 * @package {{NAMESPACE}}\Includes
 */

namespace {{NAMESPACE}}\Includes;

/**
 * Class Deactivator
 *
 * Runs on plugin deactivation.
 */
class Deactivator {

	/**
	 * Plugin deactivation routine.
	 */
	public static function deactivate(): void {
		// Flush rewrite rules to remove any custom rewrites.
		flush_rewrite_rules();
	}
}
