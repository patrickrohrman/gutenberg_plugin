import './style.scss';
import './editor.scss';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { RichText, InspectorControls } = wp.editor;
const { PanelBody, ToggleControl } = wp.components;

registerBlockType('wpress-blocks/cards', {
	title: __('Cards'), // Block title
	icon: 'admin-page', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed
	keywords: [
		__('ECU'),
		__('cards')
	],
	//Needed for alignment toolbar, allows you to specify which alignments are selectable
	supports: {
		align:true,
		align: ['left','right','wide']
	},
	//Styles add class to the main div in the pattern of 'is-style-style-name'
	styles: [
		{
			name: 'grey',
			label: __('Grey'),
			isDefault: true
		},
		{
			name: 'dark-purple',
			label: __('Dark Purple')
		},
		{
			name: 'hot-pink',
			label: __('Hot Pink')
		},
		{
			name: 'ecu-purple',
			label: __('ECU Purple')
		},
		{
			name: 'gold-grey',
			label: __('Gold-Grey')
		},
		{
			name: 'dark-teal',
			label: __('Dark Teal')
		},
		{
			name: 'dark-grey',
			label: __('Dark Grey')
		},
		{
			name: 'teal',
			label: __('Teal')
		},
	],
	attributes: {
		alignment: {
			type: 'string',			
		},
		//Text has to be stored as an array if we want to be able to have formatted text
		//Otherwise html tags will show up as text when displayed on the front end
		//Validation errors can occur if the selectors are not unique within the block
		title: {
			type: 'array',
			source: 'children',
			selector: 'div.title-helper'	
		},
		body: {
			type: 'array',
			source: 'children',	
			selector: 'div.body-helper'
		},
		has_drop_shadow: {
			type: 'boolean'		
		},
		has_hidden_title: {
			type: 'boolean'
		},
		has_button: {
			type: 'boolean'
		},
		//Made two different button text attributes so they can have different values initially
		button_text: {
			type: 'string',
			default: 'Button Text'
		},
		button_text_holder: {
			type: 'string'
		},
		heading_size: {
			type: 'string',
			default: '3'		
		},
			button_url: {
			type: 'string',
			selector: 'a',			
			source: 'attribute',
			attribute: 'href',
			default: ''
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
		const { alignment, body, button_text, button_text_holder, button_url, has_button, has_drop_shadow, has_hidden_title, heading_size, title } = attributes;

		//Creates component called 'TitleTag' that is used as a header tag with the number set to 'heading_size'
		const TitleTag = `h${heading_size}`;

		//Functions to update the attributes we have as they are changed in the editor
		function onChangeTitle( content ) {
			setAttributes( { title: content } );
		}
		function onChangeBody( content ) {
			setAttributes( { body: content } );
		}
		function setHeadingSize( event ) {
			const selected = event.target.querySelector( 'option:checked' );
			setAttributes( { heading_size: selected.value } );
		}
		//Updates both of our button text attributes so they match once it has been changed from default
		function onChangeButtonText( content ) {
			setAttributes( { button_text: content } )
			setAttributes( { button_text_holder: content } );
		}
		function onChangeButtonURL( content ) {
			setAttributes( { button_url: content } );
		}

		return (			
			// Adds the class 'has_drop_shadow' to the div if the value is set to true
			<div className={ [props.className, has_drop_shadow && 'has_drop_shadow'] 
			.filter(e => !!e)
			.join(' ')
			}
			data-align={alignment}>			
				{/* InspectorControls section on the right side */}
				<InspectorControls>
					<PanelBody
						title={__('Card Options')}
						initialOpen={true}
					>						
						<ToggleControl
							label="Drop Shadow"	
							help= { has_drop_shadow ? 'Has drop shadow.' : 'No drop shadow.'}						
							checked={ has_drop_shadow }
							onChange={ () => setAttributes( { has_drop_shadow: ! has_drop_shadow } ) }
    					/>
						<ToggleControl
							label="Hide Title"
							help= { has_hidden_title ? 'Title is hidden.' : 'Title is visible.'}	
							checked={ has_hidden_title }
							onChange={ () => setAttributes( { has_hidden_title: ! has_hidden_title } ) }
    					/>						
						<label class="button-labels">Heading Size:</label>
							<form onSubmit={ setHeadingSize }>
								<select value={ heading_size } onChange={ setHeadingSize }>
									<option value="4">Small</option>									
									<option value="3">Medium</option>
									<option value="2">Large</option>																	
								</select>
							</form>
							<br />						
					</PanelBody>
					{/* Can create multiple PanelBody sections within the InspectorControls section */}
					<PanelBody
						title={__('Button Options')}
						initialOpen={false}
					>						
						<ToggleControl
							label="Has Button"	
							help= { has_button ? 'Displays link button.' : 'No link button.'}						
							checked={ has_button }
							onChange={ () => setAttributes( { has_button: ! has_button } ) }
    					/>							
							<label class="button-labels">Button Text:</label>
							<RichText 
								format="string"								
								onChange={ onChangeButtonText }
								value={ button_text_holder }	
								placeholder={ __ ( 'Text on your button' ) }
								keepPlaceholderOnFocus={true}		
							/>
						<br />						
						<label class="button-labels">URL:</label>
							<RichText 
								format="string"
								onChange={ onChangeButtonURL }
								value={ button_url }	
								placeholder={ __ ( 'http://www.example.com') }	
								keepPlaceholderOnFocus={true}
							/>					
					</PanelBody>
				</InspectorControls>					
				{/* Adds the class 'has_hidden_title' to the div if the value is set to true */}				
				<div className={ ['card-title', has_hidden_title && 'has_hidden_title'] 
				.filter(e => !!e)
				.join(' ')
				} >
					{/* TitleTag component that gets updated with the heading size dropdown */}
					<TitleTag>
						<div className='title-helper'>							 				
							<RichText 
								tagName='div'														
								onChange={ onChangeTitle }
								value={ title }	
								placeholder={ __ ( 'Heading Goes Here' ) }	
								keepPlaceholderOnFocus={true}	
							/>	
						</div>						
					</TitleTag>
				</div>
				<div className='card-body'>
					<div className='body-helper'>
						<RichText 
							tagName='div'														
							onChange={ onChangeBody }
							value={ body }	
							placeholder={ __ ( 'Body goes here' ) }	
							keepPlaceholderOnFocus={true}	
						/>
					</div>										
					<a href={ button_url } className={ ['btn', has_button && 'has_button'] .filter(e => !!e) .join(' ') } >
						{ button_text }						
					</a>
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
		const TitleTag = `h${attributes.heading_size}`;

		//Checks to see if 'button_url' string has a length greater than 0 - used to hide the button if it is empty.
		const isUrlEmpty = attributes.button_url.length > 0 ? false : true;	

		//Makes the button into a componant so the code is a little cleaner when it is used below.
		const CardButton = () => {
			return <a href={ attributes.button_url } className={ ['btn', attributes.has_button && 'has_button'] .filter(e => !!e) .join(' ') } >
				{attributes.button_text}						
			</a>
		};
		
		return (		
			<div className={ [props.className, attributes.has_drop_shadow && 'has_drop_shadow'] 
			.filter(e => !!e)
			.join(' ')
			} >				
				<div className={ ['card-title', attributes.has_hidden_title && 'has_hidden_title'] 
				.filter(e => !!e)
				.join(' ')
				} > 
					<TitleTag>
						<div className='title-helper'>							
							{attributes.title}		
						</div>					
					</TitleTag>
				</div>
				<div className='card-body'>
					<div className='input-text'>
						<div className='body-helper'>
							{attributes.body}
						</div>
					</div>
					{/* Uses the value of 'isUrlEmpty' to display the button or not. */}
					{ (isUrlEmpty) ? ({}): (<CardButton></CardButton>)}
				</div>					
			</div>			
		);
	},
});
