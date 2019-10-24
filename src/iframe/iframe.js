import './style.scss';
import './editor.scss';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { RichText, InspectorControls } = wp.editor;
const { PanelBody } = wp.components;

registerBlockType('wpress-blocks/iframe', {
	title: __('Iframe'), // Block title
	icon: 'welcome-view-site', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed
	keywords: [
		__('ECU'),
		__('iframe')
	],

	/**
	 * Attributes set up how our values are extracted
	 * and specify where we are going to use them
	 */
	attributes: {
		frame_url: {				
			type: 'string', 		//type - string
			selector: 'iframe',		//used in the iframe tag
			source: 'attribute',							
			attribute: 'src',		//with the "src" attribute			
		},
		frame_width: {
			type: 'int',
			selector: 'iframe',
			source: 'attribute',
			attribute: 'width',			
		},
		frame_height: {
			type: 'int',
			selector: 'iframe',
			source: 'attribute',
			attribute: 'height',			
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
	edit: function(props) {

		let { attributes, className, setAttributes } = props
		let frame_url = attributes.frame_url
		let frame_width = attributes.frame_width
		let frame_height = attributes.frame_height

		/**
		 * Sets and updates the value of the variables as they change in the editor.
		 */
		function onChangeContentURL ( content ) {
			setAttributes({frame_url: content})
		}
		function onChangeContentWidth ( content ) {
			setAttributes({frame_width: content})
		}
		function onChangeContentHeight ( content ) {
			setAttributes({frame_height: content})
		}

		return (
			/**
			 * Input fields for URL, Width, & Height
			 */
			<div className={className}>
				
				<InspectorControls>
					<PanelBody
						title={__('Iframe Options')}
						initialOpen={true}
					>	
						<label class="iframe-labels">URL:</label>
						<RichText 
							format="string"
							className={className}
							onChange={onChangeContentURL}
							value={frame_url}	
							placeholder={ __ ( 'http://www.example.com')}
							keepPlaceholderOnFocus={true}		
						/>
						<br />
						<label class="iframe-labels">Width in pixels:</label>
						<RichText 
							format="string"
							className={className}
							onChange={onChangeContentWidth}
							value={frame_width}	
							placeholder={ __ ('•••')}				
						/>
						<br />
						<label class="iframe-labels">Height in pixels:</label>
						<RichText 
							format="string"
							className={className}
							onChange={onChangeContentHeight}
							value={frame_height}
							placeholder={ __ ('•••')}					
						/>
					</PanelBody>
				</InspectorControls>				
				<div>
					<iframe src={attributes.frame_url} height={attributes.frame_height} width={attributes.frame_width}></iframe>
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
		let { attributes } = props
		return (
			<div>
				<iframe src={attributes.frame_url} height={attributes.frame_height} width={attributes.frame_width}></iframe>
			</div>
		);
	},
});
