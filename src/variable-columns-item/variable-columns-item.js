import './style.scss';
import './editor.scss';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { RangeControl } = wp.components;
const { InnerBlocks } = wp.editor;

registerBlockType('wpress-blocks/variable-columns-item', {
	title: __('Variable Column'), // Block title
	icon: 'tagcloud', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed
	keywords: [
		__('columns'),
		__('bootstrap')
	],
	parent: ['wpress-blocks/variable-columns-wrapper'],
	attributes:{
		columnSize: {
			type: 'number',
			default: 6,
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

		const { attributes, setAttributes } = props;	
		const { columnSize  } = attributes;
		
		const columnClass = `variable-col-item col-md-${columnSize}`;

		return (
			<div className={props.className}>				
				<div className='column-controls'>
					<RangeControl								
						value={ columnSize }
						initialPosition={ 6 }
						min={ 1 }
						max={ 12 }
						step={ 1 }
						onChange={value => { setAttributes( { columnSize: value } )	} }						
						help={ __( 'Column width out of 12 units' ) } 														
					/>				
				</div>
				<div className={ columnClass }>				
					<InnerBlocks />
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
		const { attributes } = props;	
		const { columnSize  } = attributes;	

		const columnClass = `variable-col-item col-md-${columnSize}`;

		return (			
			<div className={ columnClass }>				
				<InnerBlocks.Content />
			</div>			
		);
	},
});
