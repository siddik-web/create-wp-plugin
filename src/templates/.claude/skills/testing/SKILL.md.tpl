---
name: testing
description: PHPUnit + WP_Mock testing patterns for {{PLUGIN_NAME}}. Auto-invoked when writing or reviewing files in tests/. Use AAA pattern and factory methods.
allowed tools: Read, Bash, Grep
---

# Testing Skill — {{PLUGIN_NAME}}

## Stack
- PHPUnit 9+ with WP_Mock for unit tests
- WordPress test suite for integration tests
- Pattern: Arrange → Act → Assert

## Unit Test Template
```php
namespace {{NAMESPACE}}\Tests\Unit;

use WP_Mock;
use WP_Mock\Tools\TestCase;
use {{NAMESPACE}}\Admin\Settings;

class Test_My_Class extends TestCase {
    public function setUp(): void    { parent::setUp(); WP_Mock::setUp(); }
    public function tearDown(): void { WP_Mock::tearDown(); parent::tearDown(); }

    public function test_something(): void {
        // Arrange
        WP_Mock::userFunction( 'get_option' )
            ->with( '{{PREFIX}}_setting', false )
            ->andReturn( 'value' );

        // Act
        $result = ( new Settings() )->get_something();

        // Assert
        $this->assertSame( 'value', $result );
        WP_Mock::assertActionsCalled();
    }
}
```

## WP_Mock Quick Reference
```php
WP_Mock::userFunction( 'wp_die' )->once();
WP_Mock::userFunction( 'current_user_can' )->with( 'manage_options' )->andReturn( true );
WP_Mock::expectAction( '{{PREFIX}}_after_save', $id );
WP_Mock::onFilter( '{{PREFIX}}_items' )->with( [] )->reply( [ 'a', 'b' ] );
```

## REST API Test
```php
public function test_get_items_returns_200(): void {
    $user = $this->factory->user->create_and_get( [ 'role' => 'editor' ] );
    wp_set_current_user( $user->ID );
    $response = rest_do_request( new WP_REST_Request( 'GET', '/{{PREFIX}}/v1/items' ) );
    $this->assertEquals( 200, $response->get_status() );
}
```

## Commands
```bash
composer test           # All tests
composer test:unit      # Unit only (fast, no WP needed)
composer test:coverage  # With HTML coverage report
```
