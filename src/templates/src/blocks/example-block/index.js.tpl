/**
 * {{PLUGIN_NAME}} — Example Block
 *
 * Entry point for the block. Registers the block type using metadata
 * from block.json and delegates rendering to edit/save components.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

import metadata from './block.json';
import Edit from './edit';
import Save from './save';
import './style.scss';

registerBlockType( metadata.name, {
	edit: Edit,
	save: Save,
} );
