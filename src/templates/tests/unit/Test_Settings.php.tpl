<?php
/**
 * Test: Settings class
 *
 * @package {{NAMESPACE}}\Tests\Unit
 */

namespace {{NAMESPACE}}\Tests\Unit;

use WP_Mock;
use WP_Mock\Tools\TestCase;
use {{NAMESPACE}}\Admin\Settings;

/**
 * Class Test_Settings
 */
class Test_Settings extends TestCase {

	public function setUp(): void {
		parent::setUp();
		WP_Mock::setUp();
	}

	public function tearDown(): void {
		WP_Mock::tearDown();
		parent::tearDown();
	}

	public function test_register_hooks_adds_admin_menu(): void {
		WP_Mock::expectActionAdded( 'admin_menu', [ new Settings(), 'add_menu_page' ] );
		WP_Mock::expectActionAdded( 'admin_init', [ new Settings(), 'register_settings' ] );

		$settings = new Settings();
		$settings->register_hooks();

		$this->assertConditionsMet();
	}

	public function test_render_per_page_field_shows_saved_value(): void {
		WP_Mock::userFunction( 'get_option' )
			->with( '{{PREFIX}}_per_page', 10 )
			->andReturn( 25 );

		$settings = new Settings();

		ob_start();
		$settings->render_per_page_field();
		$output = ob_get_clean();

		$this->assertStringContainsString( 'value="25"', $output );
	}
}
