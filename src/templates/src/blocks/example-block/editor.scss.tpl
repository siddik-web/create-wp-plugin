/**
 * Editor-only styles for the {{PLUGIN_NAME}} block.
 *
 * These styles are only loaded in the block editor and will not
 * appear on the frontend.
 *
 * @see https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/applying-styles-with-stylesheets/
 */

.wp-block-{{PREFIX}}-example-block {
	outline: 1px dashed rgba(0, 0, 0, 0.15);
	outline-offset: -1px;

	&:focus-within {
		outline-color: var(--wp-admin-theme-color, #007cba);
	}
}
