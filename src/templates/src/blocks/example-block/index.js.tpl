import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const blockProps = useBlockProps();
		return (
			<div { ...blockProps }>
				<RichText
					tagName="p"
					value={ attributes.message }
					onChange={ ( message ) => setAttributes( { message } ) }
					placeholder={ __( 'Enter message…', '{{TEXT_DOMAIN}}' ) }
				/>
			</div>
		);
	},

	save: ( { attributes } ) => {
		const blockProps = useBlockProps.save();
		return (
			<div { ...blockProps }>
				<RichText.Content tagName="p" value={ attributes.message } />
			</div>
		);
	},
} );
