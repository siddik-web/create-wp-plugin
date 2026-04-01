<?php
/**
 * Main Plugin Class
 *
 * @package {{NAMESPACE}}\Includes
 */

namespace {{NAMESPACE}}\Includes;

/**
 * Class Plugin
 *
 * Orchestrates all plugin components via hooks.
 */
class Plugin {

	/**
	 * Plugin version.
	 *
	 * @var string
	 */
	private string $version;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->version = {{CONST_VERSION}};
	}

	/**
	 * Register all hooks and boot all components.
	 */
	public function run(): void {
		$this->load_textdomain();
		$this->register_admin();
		$this->register_frontend();
		$this->register_api();{{WOOCOMMERCE_HOOK}}
	}

	/**
	 * Load plugin translations.
	 */
	private function load_textdomain(): void {
		add_action( 'init', function () {
			load_plugin_textdomain(
				'{{TEXT_DOMAIN}}',
				false,
				dirname( {{CONST_BASENAME}} ) . '/languages'
			);
		} );
	}

	/**
	 * Boot admin functionality.
	 */
	private function register_admin(): void {
		if ( ! is_admin() ) {
			return;
		}

		$admin = new \{{NS_ADMIN}}\Settings();
		$admin->register_hooks();
	}

	/**
	 * Boot frontend functionality.
	 */
	private function register_frontend(): void {
		$frontend = new \{{NS_FRONTEND}}\Assets();
		$frontend->register_hooks();
	}

	/**
	 * Boot REST API.
	 */
	private function register_api(): void {
		add_action( 'rest_api_init', function () {
			$controller = new \{{NS_API}}\Items_Controller();
			$controller->register_routes();
		} );
	}
{{WOOCOMMERCE_METHOD}}
}
