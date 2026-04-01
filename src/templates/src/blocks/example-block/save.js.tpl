/**
 * Block Save component.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
	const blockProps = useBlockProps.save();

	return (
		<div
			{ ...blockProps }
			className={ `${ blockProps.className }${
				attributes.showBorder ? ' has-border' : ''
			}` }
		>
			<RichText.Content tagName="p" value={ attributes.message } />
		</div>
	);
}
