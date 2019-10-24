import './style.scss';
import './editor.scss';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { InspectorControls, RichText, MediaUpload, MediaUploadCheck } = wp.editor;
const { PanelBody, SelectControl, ToggleControl, Button } = wp.components;
const { Fragment, Component } = wp.element;

class mySelectPosts extends Component {
	
	//set initial state
	static getInitialState( selectedPost ) {
		return {
			posts: [],
			selectedPost: selectedPost,
			post: {},
		};
	}

	constructor() {
		super( ...arguments );
		this.state = this.constructor.getInitialState( this.props.attributes.selectedPost );
		this.getOptions = this.getOptions.bind(this);
		this.getOptions();
		this.onChangeSelectPost = this.onChangeSelectPost.bind(this);
	}

	onChangeSelectPost( value ) {
		const post = this.state.posts.find( ( item ) => { return item.id == parseInt( value ) } );
		this.setState( { selectedPost: parseInt( value ), post } );
		this.props.setAttributes( {
			selectedPost: parseInt( value ),		
			linkText: post.title.rendered,
			linkUrl: post.link,								
		});
		this.props.setAttributes( { post: value } );
	} 

	getOptions(){		
		wp.apiFetch( { path: '/wp/v2/posts' } ).then( ( posts ) => {
			if( posts && 0 !== this.state.selectedPost ) {
				const post = posts.find( ( item ) => { return item.id == this.state.selectedPost } );
				this.setState( { post, posts } );				
			} else {
				this.setState({ posts });
			}
		});
	}	
	
	render() {

		const { attributes, setAttributes, posts } = this.props;
		const { hasExternalLink, imageUrl, linkText, mediaId, linkUrl } = attributes;
		const options = [];
		
		let output = __( 'Loading posts' );
		this.props.className += ' loading';

		if( this.state.posts.length > 0 ) {
			const loading = __( 'There are %d posts. Choose one.' );
			output = loading.replace( '%d', this.state.posts.length );
			this.state.posts.forEach((post) => {
				options.push({value:post.id, label:post.title.rendered, });
			});
		} else {
			output = __( 'No posts found.' );
		} 

		if( this.state.post.hasOwnProperty('title' ) ) {
			<div className='row'>
				<div className='grid-item'>													
						<img className='item-image' src={imageUrl}/>
					<div className='text-overlay'>
						{linkText}														
					</div>
				</div>
			</div>
		}

		function selectImage(value) {			
			setAttributes({imageUrl: value.sizes.full.url})
		}

		const linkRichText = (
			<RichText
				className="link-text"
				tagName="div"						
				format="string"	
				value={ linkText }						
				onChange={ ( value ) => { setAttributes( { linkText: value } ) } }							
				placeholder={ __ ('Type Text Here')}
				keepPlaceholderOnFocus={true}				
			/>
		)

		const inspectorControls = (
			<Fragment>
				<InspectorControls>				
					<PanelBody title={ __( 'Item Settings', 'new-posts-block' ) }>					
						<center>
							<MediaUploadCheck>
								<MediaUpload					
									onSelect={ selectImage }
									allowedTypes={ 'image' }
									value={ mediaId }
									render={ ( { open } ) => (						
										<Button className='media-button' onClick={ open }>
											Select/Upload Image
										</Button>						
									)}
								/>				
							</MediaUploadCheck>
						</center>
						<br />						
						<ToggleControl
							label= {'External Link or Post?'} 	
							help= { hasExternalLink ? 'Use external link' : 'Link to post'}						
							checked={ hasExternalLink }
							onChange={ () => setAttributes( { hasExternalLink: ! hasExternalLink } ) }
						/>				
							{ hasExternalLink === true && (														
								<div className='link-wrapper'>
									<label className='button-labels'>Link URL:</label>								
									<RichText 
										format="string"
										onChange={ ( value ) => { setAttributes( { linkUrl: value } ) } }	
										value={ linkUrl }	
										placeholder={ __ ( 'http://www.example.com') }	
										keepPlaceholderOnFocus={true}
									/>		
								</div>												
							)}
							{ hasExternalLink === false && (
								<div className='post-wrapper'>	
									<SelectControl
										value={ this.props.attributes.selectedPost }
										label={ __( 'Select a post' ) }
										options={ options }
										onChange={ this.onChangeSelectPost }
									/>	
								</div>
							)}
					</PanelBody>			
				</InspectorControls>
			</Fragment>			
		)

		return (			
			<fragment>				
				<div className='linked-grid-item'>
					{inspectorControls}
					<div className='row'>						
						<div className='grid-item'>							
							<img className='item-image' src={imageUrl}/>
							<div className='text-overlay'>
								{linkRichText}																							
							</div>								
						</div>					
					</div>
				</div>
			</fragment>
		);	
	}
}

registerBlockType('wpress-blocks/linked-grid-item', {
	title: __('Linked Grid Item'), // Block title
	icon: 'schedule', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed
	keywords: [
		__('ECU'),
		__('grid')
	],
	parent: ['wpress-blocks/linked-grid'],
	attributes:{		
		imageUrl: {
			type: 'string',
			selector: ''
		},
		linkUrl: {
			type: 'string',
			selector: 'a'
		},
		hasExternalLink: {
			type: 'boolean',
			default: true
		},	
		linkText: {
			type: 'array',
			selector: '.text-overlay',
			source: 'children',
		},
		selectedPost: {
			type: 'number',
			default: 0,
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

	 edit: mySelectPosts,

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
			<div className={ props.className }>
				<center>
					<div className='linked-grid-item'>						
						<div className='grid-item'>
							<a href={ props.attributes.linkUrl } className='linked-grid-a'>						
								<img className='item-image' src={props.attributes.imageUrl}/>
								<div className='text-overlay'>
									{ props.attributes.linkText }																							
								</div>	
							</a>							
						</div>										
					</div>
				</center>	
			</div>					
		);
	},
});
