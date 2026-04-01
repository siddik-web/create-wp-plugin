<?php
/**
 * WooCommerce Integration
 *
 * @package {{NAMESPACE}}\WooCommerce
 */

namespace {{NAMESPACE}}\WooCommerce;

/**
 * Class Integration
 *
 * Hooks into WooCommerce core. Only instantiated when WooCommerce is active.
 */
class Integration {

	/**
	 * Register WooCommerce hooks.
	 */
	public function register_hooks(): void {
		add_action( 'woocommerce_loaded', [ $this, 'on_woocommerce_loaded' ] );
		add_filter( 'woocommerce_product_tabs', [ $this, 'add_product_tab' ] );
		add_action( 'woocommerce_order_status_completed', [ $this, 'on_order_completed' ] );
	}

	/**
	 * Fires after WooCommerce is fully loaded.
	 */
	public function on_woocommerce_loaded(): void {
		// Initialise sub-components that depend on WooCommerce constants/functions.
	}

	/**
	 * Add a custom tab to the single-product page.
	 *
	 * @param array $tabs Existing product tabs.
	 * @return array
	 */
	public function add_product_tab( array $tabs ): array {
		$tabs['{{PREFIX}}_tab'] = [
			'title'    => esc_html__( '{{PLUGIN_NAME}}', '{{TEXT_DOMAIN}}' ),
			'priority' => 50,
			'callback' => [ $this, 'render_product_tab' ],
		];
		return $tabs;
	}

	/**
	 * Render the custom product tab content.
	 */
	public function render_product_tab(): void {
		echo '<h2>' . esc_html__( '{{PLUGIN_NAME}}', '{{TEXT_DOMAIN}}' ) . '</h2>';
		echo '<p>' . esc_html__( 'Custom product information goes here.', '{{TEXT_DOMAIN}}' ) . '</p>';
	}

	/**
	 * Handle order completion.
	 *
	 * @param int $order_id WooCommerce order ID.
	 */
	public function on_order_completed( int $order_id ): void {
		$order = wc_get_order( $order_id );
		if ( ! $order instanceof \WC_Order ) {
			return;
		}

		// Example: store a flag on the order meta.
		$order->update_meta_data( '_{{PREFIX}}_processed', '1' );
		$order->save();
	}
}
