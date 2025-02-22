import './style.scss';
import './editor.scss';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

registerBlockType('wpress-blocks/[BLOCK SLUG]', {
	title: __('[BLOCK NAME]'), // Block title
	icon: '[DASHICON]', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/
	category: '[CATEGORY]', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed
	keywords: [
		__('[KEYWORD1]'),
		__('[KEYWORD2]')
	],

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: function (props) {
		return (
			<div className={props.className}>
				[BACKEND CODE]
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
			<div>
				[FRONTEND CODE]
			</div>
		);
	},
});
