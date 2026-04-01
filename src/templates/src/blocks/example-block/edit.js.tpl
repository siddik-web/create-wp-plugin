/**
 * Block Editor component.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 */
import { useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', '{{TEXT_DOMAIN}}' ) }>
					<ToggleControl
						label={ __( 'Show border', '{{TEXT_DOMAIN}}' ) }
						checked={ attributes.showBorder }
						onChange={ ( showBorder ) => setAttributes( { showBorder } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div
				{ ...blockProps }
				className={ `${ blockProps.className }${
					attributes.showBorder ? ' has-border' : ''
				}` }
			>
				<RichText
					tagName="p"
					value={ attributes.message }
					onChange={ ( message ) => setAttributes( { message } ) }
					placeholder={ __( 'Enter message…', '{{TEXT_DOMAIN}}' ) }
				/>
			</div>
		</>
	);
}
