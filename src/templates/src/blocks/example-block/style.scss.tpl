/**
 * Frontend styles for the {{PLUGIN_NAME}} block.
 *
 * These styles apply on both the frontend and in the editor.
 *
 * @see https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/applying-styles-with-stylesheets/
 */

.wp-block-{{PREFIX}}-example-block {
	padding: 1.5rem;
	border-radius: 4px;
	background-color: #f9f9f9;

	p {
		margin: 0;
	}

	&.has-border {
		border: 2px solid currentColor;
	}
}
