---
name: code-review
description: WordPress plugin code review for {{PLUGIN_NAME}}. Auto-invoked when reviewing PHP files. Applies WordPress VIP coding standards, checks escaping, sanitization, nonces, and capability checks.
allowed tools: Read, Grep, Bash
---

# Code Review Skill — {{PLUGIN_NAME}}

## Security Checklist

### Output Escaping (required on ALL output)
```php
echo esc_html( $value );          // plain text
echo esc_attr( $value );          // HTML attributes
echo esc_url( $url );             // URLs
echo wp_kses_post( $html );       // rich HTML
```

### Input Sanitization (required before save/use)
```php
$name  = sanitize_text_field( $_POST['name'] );
$id    = absint( $_POST['id'] );
$email = sanitize_email( $_POST['email'] );
```

### Nonces (required for all forms and AJAX)
```php
check_admin_referer( '{{PREFIX}}_save_settings' );
check_ajax_referer( '{{PREFIX}}_action', 'nonce' );
```

### Capability Checks (required before privileged actions)
```php
if ( ! current_user_can( 'manage_options' ) ) {
    wp_die( esc_html__( 'Unauthorized', '{{TEXT_DOMAIN}}' ) );
}
// REST: 'permission_callback' must never be '__return_true'
```

## Naming Conventions
- Prefix ALL hooks, options, transients: `{{PREFIX}}_`
- PHP namespace root: `{{NAMESPACE}}\`
- Constants: `{{PREFIX_UPPER}}_*`
- Text domain: `{{TEXT_DOMAIN}}`

## DB Queries
```php
// Always use prepare() with variables
$wpdb->get_results(
    $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}{{DB_TABLE}} WHERE id = %d", $id )
);
```

## i18n
```php
// Every user-facing string must be wrapped
esc_html__( 'Save', '{{TEXT_DOMAIN}}' )
__( 'Hello %s', '{{TEXT_DOMAIN}}' )
```
