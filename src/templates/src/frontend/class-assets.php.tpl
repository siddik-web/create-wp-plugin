<?php
/**
 * Frontend Assets
 *
 * @package {{NAMESPACE}}\Frontend
 */

namespace {{NAMESPACE}}\Frontend;

/**
 * Class Assets
 *
 * Enqueues frontend scripts and styles.
 */
class Assets {

	/**
	 * Register WordPress hooks.
	 */
	public function register_hooks(): void {
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_styles' ] );
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
	}

	/**
	 * Enqueue frontend styles.
	 */
	public function enqueue_styles(): void {
		wp_enqueue_style(
			'{{PREFIX}}-frontend',
			{{CONST_URL}} . 'assets/css/frontend.css',
			[],
			{{CONST_VERSION}}
		);
	}

	/**
	 * Enqueue frontend scripts and localize data.
	 */
	public function enqueue_scripts(): void {
		wp_enqueue_script(
			'{{PREFIX}}-frontend',
			{{CONST_URL}} . 'assets/js/frontend.js',
			[],
			{{CONST_VERSION}},
			true
		);

		wp_localize_script(
			'{{PREFIX}}-frontend',
			'{{PREFIX}}Data',
			[
				'apiUrl' => esc_url_raw( rest_url( '{{PREFIX}}/v1/' ) ),
				'nonce'  => wp_create_nonce( 'wp_rest' ),
				'i18n'   => [
					'loading' => esc_html__( 'Loading...', '{{TEXT_DOMAIN}}' ),
					'error'   => esc_html__( 'An error occurred. Please try again.', '{{TEXT_DOMAIN}}' ),
				],
			]
		);
	}
}
