import './style.scss';
import './editor.scss';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { InspectorControls, InnerBlocks } = wp.editor;
const { SelectControl } = wp.components;

const allowedBlocks = [ 'wpress-blocks/dashboard-item2x2', 'wpress-blocks/dashboard-item3x2' ];

//Classnames do not get overwritten when changing templates, so an entirely new block was made
const templates = {
	dashboard2x2: [
		['wpress-blocks/dashboard-item2x2', { className: 'col-md-6'} ],
		['wpress-blocks/dashboard-item2x2', { className: 'col-md-6'} ],
		['wpress-blocks/dashboard-item2x2', { className: 'col-md-6'} ],
		['wpress-blocks/dashboard-item2x2', { className: 'col-md-6'} ],
	],
	dashboard3x2: [
		['wpress-blocks/dashboard-item3x2', { className: 'col-md-4'} ],
		['wpress-blocks/dashboard-item3x2', { className: 'col-md-4'} ],
		['wpress-blocks/dashboard-item3x2', { className: 'col-md-4'} ],
		['wpress-blocks/dashboard-item3x2', { className: 'col-md-4'} ],
		['wpress-blocks/dashboard-item3x2', { className: 'col-md-4'} ],
		['wpress-blocks/dashboard-item3x2', { className: 'col-md-4'} ],		
	]
}

registerBlockType('wpress-blocks/dashboard', {
	title: __('dashboard'), // Block title
	icon: 'dashboard', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed
	keywords: [
		__('ECU'),
		__('dashboard')
	],
	attributes:{
		dashboardStyle: {
			type: 'string',
			default: 'dashboard2x2',
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
		const activeTemplate = templates[attributes.dashboardStyle];

		return (
			<div className={className}>
				<InspectorControls>				
					<SelectControl						
						label={ __( 'Select Dashboard Style' ) }
						value={ attributes.dashboardStyle }
						onChange={ ( dashboardStyle ) => { setAttributes( { dashboardStyle } ) } }						
						options={ [
							{ value: 'dashboard2x2', label: '2 by 2' },
							{ value: 'dashboard3x2', label: '3 by 2' },													
						] }						
					/>
				</InspectorControls>								
					<InnerBlocks 
						template = { activeTemplate }
						allowedBlocks={ allowedBlocks }	
						templateLock='all'		
					/>								
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
	save: function () {
		return (
			<div className="row row-eq-height">
				<InnerBlocks.Content />
			</div>
		);
	},
});
