import './style.scss';
import './editor.scss';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { InspectorControls, InnerBlocks } = wp.editor;
const { SelectControl } = wp.components;

const allowedBlocks = [ 'core/heading', 'core/paragraph', 'core/list', 'core/image'];

const templates = {
	withList: [
		['core/heading', { placeholder: 'Title Here', className: 'dash-item-title', level: 2 }],
		['core/heading', { placeholder: 'Subtitle Here', className: 'dash-item-subtitle', level: 4 }],
		['core/list', { className: 'dash-item-list'}]
],
	withParagraph: [
		['core/heading', { placeholder: 'Title Here', className: 'dash-item-title', level: 2 }],
		['core/heading', { placeholder: 'Subtitle Here', className: 'dash-item-subtitle', level: 4 }],
		['core/paragraph', { placeholder: 'Paragraph Here', className: 'dash-item-paragraph'}]
],
	withPolaroid: [
		['core/image', { align: 'center', className: 'dash-item-polaroid'}],
		['core/heading', { placeholder: 'Title Here', className: 'dash-item-title', level: 2 }],		
]
}

registerBlockType('wpress-blocks/dashboard-item3x2', {
	title: __('3x2 Dashboard Item'), // Block title
	icon: 'pressthis', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed	
	keywords: [
		__('ECU'),
		__('dashboard')
	],
	parent: ['wpress-blocks/dashboard'],
	attributes:{
		itemStyle: {
			type: 'string',
			default: 'withParagraph',
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
		const { attributes, className, setAttributes } = props
		const activeTemplate = templates[attributes.itemStyle]
		return (
			<div className={className}>
				<InspectorControls>					
					<SelectControl						
						label={ __( 'Select Dashboard Style' ) }
						value={ attributes.itemStyle }
						onChange={ ( itemStyle ) => { setAttributes( { itemStyle } ) } }
						options={ [
							{ value: 'withList', label: 'Bulleted List' },
							{ value: 'withParagraph', label: 'Text Block' },
							{ value: 'withPolaroid', label: 'With Polaroid' },													
						] }						
					/>
				</InspectorControls>
				<div className='child-block'>
					<InnerBlocks
						template={activeTemplate}
						allowedBlocks={ allowedBlocks}
						// templateLock='false'			**locked parent blocks with unlocked child blocks currently does not give intended results.
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
			<div className={props.className}>
				<div className='child-block'>
					<InnerBlocks.Content />
				</div>			
			</div>
		);
	},
});
