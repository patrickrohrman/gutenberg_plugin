import './style.scss';
import './editor.scss';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { InnerBlocks } = wp.editor;
const { SelectControl } = wp.components;

const allowedBlocks = [ 'wpress-blocks/linked-grid-item' ];

const templates = {
	oneItem: [
		['wpress-blocks/linked-grid-item', { className: 'col-md'} ],		
	],
	twoItem: [
		['wpress-blocks/linked-grid-item', { className: 'col-md'} ],
		['wpress-blocks/linked-grid-item', { className: 'col-md'} ],				
	],
	threeItem: [
		['wpress-blocks/linked-grid-item', { className: 'col-md'} ],
		['wpress-blocks/linked-grid-item', { className: 'col-md'} ],
		['wpress-blocks/linked-grid-item', { className: 'col-md'} ],		
	],
}

registerBlockType('wpress-blocks/linked-grid', {
	title: __('Linked Grid'), // Block title
	icon: 'building', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed
	keywords: [
		__('linked'),
		__('grid')
	],
	attributes:{
		gridStyle: {
			type: 'string',
			default: 'oneItem',
		},		
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: function (props) {
		const { attributes, className, setAttributes } = props;		
		const activeTemplate = templates[attributes.gridStyle];

		return (
			<div className={className}>				
				<div className='gridStyleSelect'>
					<SelectControl						
						label={ __( 'Select Grid Style' ) }
						value={ attributes.gridStyle }
						onChange={ ( gridStyle ) => { setAttributes( { gridStyle } ) } }						
						options={ [
							{ value: 'oneItem', label: 'One item' },
							{ value: 'twoItem', label: 'Two items' },	
							{ value: 'threeItem', label: 'Three items' },													
						] }						
					/>
				</div>
				<br />											
				<div className='linked-grid-wrapper row'>
					<InnerBlocks 
						template={ activeTemplate }
						allowedBlocks={ allowedBlocks }	
						templateLock='all'		
					/>
				</div>							
			</div>
		);
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save: function (props) {
		return (
			<div className="linked-grid-wrapper row">
				<InnerBlocks.Content />
			</div>
		);
	},
});
