<?php
/**
 * Plugin Activator
 *
 * @package {{NAMESPACE}}\Includes
 */

namespace {{NAMESPACE}}\Includes;

/**
 * Class Activator
 *
 * Runs on plugin activation: creates DB tables, sets default options.
 */
class Activator {

	/**
	 * Plugin activation routine.
	 */
	public static function activate(): void {
		self::create_tables();
		self::set_default_options();

		// Store the activated version.
		update_option( '{{OPTION_VERSION}}', {{CONST_VERSION}} );

		// Flush rewrite rules after registering post types / endpoints.
		flush_rewrite_rules();
	}

	/**
	 * Create custom database tables.
	 */
	private static function create_tables(): void {
		global $wpdb;

		$charset_collate = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}{{DB_TABLE}} (
			id           BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			user_id      BIGINT(20) UNSIGNED NOT NULL DEFAULT 0,
			title        VARCHAR(255)        NOT NULL DEFAULT '',
			status       VARCHAR(20)         NOT NULL DEFAULT 'active',
			created_at   DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at   DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY  (id),
			KEY          user_id (user_id),
			KEY          status  (status)
		) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	/**
	 * Set default plugin options (only if not already set).
	 */
	private static function set_default_options(): void {
		$defaults = [
			'{{PREFIX}}_per_page'   => 10,
			'{{PREFIX}}_debug_mode' => false,
		];

		foreach ( $defaults as $key => $value ) {
			if ( false === get_option( $key ) ) {
				add_option( $key, $value );
			}
		}
	}
}
