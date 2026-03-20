<?php
/**
 * Admin Settings Page
 *
 * @package {{NAMESPACE}}\Admin
 */

namespace {{NAMESPACE}}\Admin;

/**
 * Class Settings
 *
 * Registers admin menu, settings page, and Settings API fields.
 */
class Settings {

	/**
	 * Register WordPress hooks.
	 */
	public function register_hooks(): void {
		add_action( 'admin_menu', [ $this, 'add_menu_page' ] );
		add_action( 'admin_init', [ $this, 'register_settings' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
	}

	/**
	 * Add plugin admin menu entry.
	 */
	public function add_menu_page(): void {
		add_menu_page(
			esc_html__( '{{PLUGIN_NAME}}', '{{TEXT_DOMAIN}}' ),
			esc_html__( '{{PLUGIN_NAME}}', '{{TEXT_DOMAIN}}' ),
			'manage_options',
			'{{PREFIX}}-settings',
			[ $this, 'render_settings_page' ],
			'dashicons-admin-plugins',
			80
		);
	}

	/**
	 * Register settings via the Settings API.
	 */
	public function register_settings(): void {
		register_setting(
			'{{PREFIX}}_settings_group',
			'{{PREFIX}}_per_page',
			[
				'type'              => 'integer',
				'sanitize_callback' => 'absint',
				'default'           => 10,
			]
		);

		add_settings_section(
			'{{PREFIX}}_general',
			esc_html__( 'General Settings', '{{TEXT_DOMAIN}}' ),
			'__return_null',
			'{{PREFIX}}-settings'
		);

		add_settings_field(
			'{{PREFIX}}_per_page',
			esc_html__( 'Items Per Page', '{{TEXT_DOMAIN}}' ),
			[ $this, 'render_per_page_field' ],
			'{{PREFIX}}-settings',
			'{{PREFIX}}_general'
		);
	}

	/**
	 * Enqueue admin page assets.
	 *
	 * @param string $hook Current admin page hook.
	 */
	public function enqueue_assets( string $hook ): void {
		if ( 'toplevel_page_{{PREFIX}}-settings' !== $hook ) {
			return;
		}

		wp_enqueue_style(
			'{{PREFIX}}-admin',
			{{CONST_URL}} . 'assets/css/admin.css',
			[],
			{{CONST_VERSION}}
		);
	}

	/**
	 * Render the per_page settings field.
	 */
	public function render_per_page_field(): void {
		$value = absint( get_option( '{{PREFIX}}_per_page', 10 ) );
		printf(
			'<input type="number" name="{{PREFIX}}_per_page" value="%d" min="1" max="100" class="small-text" />',
			$value
		);
		echo '<p class="description">' . esc_html__( 'Number of items to show per page.', '{{TEXT_DOMAIN}}' ) . '</p>';
	}

	/**
	 * Render the settings page HTML.
	 */
	public function render_settings_page(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You do not have permission to access this page.', '{{TEXT_DOMAIN}}' ) );
		}
		?>
		<div class="wrap">
			<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
			<form method="post" action="options.php">
				<?php
				settings_fields( '{{PREFIX}}_settings_group' );
				do_settings_sections( '{{PREFIX}}-settings' );
				submit_button( esc_html__( 'Save Settings', '{{TEXT_DOMAIN}}' ) );
				?>
			</form>
		</div>
		<?php
	}
}
