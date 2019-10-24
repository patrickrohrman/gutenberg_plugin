import './style.scss';
import './editor.scss';
import pickBy from 'lodash/pickBy';
import isUndefined from 'lodash/isUndefined';


const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { Component, Fragment } = wp.element;
const { PanelBody, Placeholder, Spinner, SelectControl, ToggleControl } = wp.components;
const { InspectorControls, RichText } = wp.editor;
const { withSelect } = wp.data;

class NewPostsEdit extends Component {
	static getInitialState( selectedCategory ) {
		return{
			categories: [],
			selectedCategory: selectedCategory,
			category: [],
		};
	}
	
	constructor() {
		super( ...arguments );
		this.state = this.constructor.getInitialState( this.props.attributes.selectedCategory );
		//Bind so we can use 'this' inside the method.
		this.getOptions = this.getOptions.bind(this);
		//Load categories.
		this.getOptions();
		//Bind
		this.onChangeSelectCategory = this.onChangeSelectCategory.bind(this);		
	}
	
	onChangeSelectCategory( value ) {
		//find category
		const category = this.state.categories.find( ( item ) => { return item.id == parseInt( value ) } );
		//set state
		this.setState( { selectedCategory: parseInt ( value ), category } );
		//set attribute
		this.props.setAttributes( {
			selectedCategory: parseInt( value ),
			category_name: category.name,
			category_slug: category.slug,
		} );		
		this.props.setAttributes( { category: value } );
	}	

	onChangeImageClass( value ) {
		this.props.setAttributes( { imageClass: value } );
	}

	getOptions(){		
		wp.apiFetch( { path: '/wp/v2/categories' } ).then( ( categories ) => {
			if( categories && 0 !== this.state.category ) {
				const category = categories.find( ( item ) => { return item.id == this.state.category } );
				this.setState( { category, categories } );				
			} else {
				this.setState({ categories });
			}
		});
	}

	render() {		
		
		
		const { attributes, setAttributes, posts } = this.props;
		const { postsToShow, sectionTitle, imageClass, hiddenImages, gridStyleClass, titleAlignClass } = attributes;
		const options = [];

		//populate category dropdown
		let output  = __( 'Loading Categories' );
		this.props.className += ' loading';
		
		if( this.state.categories.length > 0 ) {
			const loading = __( 'There are %d categories. Choose one.' );
			output = loading.replace( '%d', this.state.categories.length );
			this.state.categories.forEach((category) => {
				options.push({value:category.id, label:category.name});
			});
		} else {
			output = __( 'No categories found. Please create some first.' );
		} 		

		//changes postsToShow and gridStyleClass based on the grid style chosen
		function onChangeSetGridStyle( value ) {
			if( value == 'grid2x1') { 
				setAttributes( { gridStyleClass: 'col-md-6' } );
				setAttributes( { postsToShow: 2 } );
			}
			if( value == 'grid3x1') { 
				setAttributes( { gridStyleClass: 'col-md-4' } );
				setAttributes( { postsToShow: 3 } );
			}
			if( value == 'grid4x1') { 
				setAttributes( { gridStyleClass: 'col-md-3' } );
				setAttributes( { postsToShow: 4 } );
			}
			if( value == 'grid2x2') { 
				setAttributes( { gridStyleClass: 'col-md-6' } );
				setAttributes( { postsToShow: 4 } );
			}
			if( value == 'grid3x2') { 
				setAttributes( { gridStyleClass: 'col-md-4' } );
				setAttributes( { postsToShow: 6 } );
			}
			if( value == 'grid4x2') { 
				setAttributes( { gridStyleClass: 'col-md-3' } );
				setAttributes( { postsToShow: 8 } );
			}
		}

		const inspectorControls = (
			<InspectorControls>
				<PanelBody title={ __( 'New Posts Settings', 'new-posts-block' ) }>				
				<SelectControl
					onChange={ this.onChangeSelectCategory }
					value={ this.props.attributes.selectedCategory }
					label={ __( 'Select a Category' ) }
					options={ options }
					/>				
				<label>Section Title:</label>
					<RichText 
						format="string"							
						onChange={ ( value ) => { setAttributes( { sectionTitle: value } ) } }
						value={ sectionTitle }	
						placeholder={ __ ('Title Here')}				
					/>
					<br />
					<SelectControl						
						label={ __( 'Select Title Alignment size' ) }
						value={ this.state.titleAlignClass } // e.g: value = [ 'a', 'c' ]
						onChange={ ( titleAlignClass ) => { setAttributes( { titleAlignClass } ) } }
						options={ [
							{ value: 'title-align center', label: 'Center' },
							{ value: 'title-align left', label: 'Left' },
							{ value: 'title-align right', label: 'Right' },
						] }
					/>				
					<SelectControl						
						label={ __( 'Select Grid Style' ) }
						value={ this.state.gridStyle } // e.g: value = [ 'a', 'c' ]
						// onChange={ ( gridStyle ) => { setAttributes( { gridStyle } ) } }
						onChange={ ( value ) => { onChangeSetGridStyle(value) } }
						options={ [
							{ value: 'grid2x1', label: '2 x 1' },
							{ value: 'grid3x1', label: '3 x 1' },
							{ value: 'grid4x1', label: '4 x 1' },
							{ value: 'grid2x2', label: '2 x 2' },
							{ value: 'grid3x2', label: '3 x 2' },
							{ value: 'grid4x2', label: '4 x 2' },					
						] }
					/>					
					<ToggleControl
							label="Hidden Images?"	
							help= { hiddenImages ? 'Hide Images' : 'Show Images'}						
							checked={ hiddenImages }
							onChange={ () => setAttributes( { hiddenImages: ! hiddenImages } ) }
    				/>
					<SelectControl						
						label={ __( 'Select image size' ) }
						value={ this.state.imageClass } // e.g: value = [ 'a', 'c' ]
						onChange={ ( imageClass ) => { setAttributes( { imageClass } ) } }
						options={ [
							{ value: 'post-img sm', label: 'Small' },
							{ value: 'post-img md', label: 'Medium' },
							{ value: 'post-img lg', label: 'Large' },
						] }
					/>					
				</PanelBody>
			</InspectorControls>
		);

		const hasPosts = Array.isArray( posts ) && posts.length;
		if ( ! hasPosts ) {
			return (
				<Fragment>
					{ inspectorControls }
					<Placeholder
						icon = 'admin-post'
						label = { __( 'New Posts', 'new-posts-block' ) }
					>
						{ ! Array.isArray( posts ) ?
							<Spinner /> :
							__( 'No posts found. Please select a category.', 'new-posts-block' )
						}
					</Placeholder>
				</Fragment>
			);
		}

		const displayPosts = posts.length > postsToShow ? posts.slice( 0, postsToShow ) : posts;		
		return (
			<Fragment>
				{ inspectorControls }
				<div class={ titleAlignClass }>
					<h2>{ sectionTitle }</h2>
				</div>				
				<div class="row">
					{ displayPosts.map( ( post ) => {
						const titleTrimmed = post.title.rendered.trim();				
						return (											
							<div className={ 'post-data', gridStyleClass }>
								<center>							
									<div className={ ['post-img-div', hiddenImages && 'hiddenImages'] 
										.filter(e => !!e)
										.join(' ')
									} >
										<a href={ post.link } target="_blank" rel="noreferrer noopener">
											<img className={ imageClass } src={ post.images.large }></img>
										</a>
										<br />										
									</div>						
									<span className="post-title">										
										<a href={ post.link } target="_blank" rel="noreferrer noopener">
											{ titleTrimmed }	
										</a>								
									</span>															
									<br />
									{ post.excerpt.rendered }	
								</center>							
							</div>						
						);
					} ) }				
				</div>
			</Fragment>
		);
	}
}

registerBlockType('wpress-blocks/post-grid', {
	title: __('Post Grid'), // Block title
	icon: 'grid-view', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed
	keywords: [
		__('ECU'),
		__('posts')
	],
	supports: {
		html: false,
		align: ['wide'],
	},
	attributes:{
		postTypeSlug: {
			type: 'string',
			default: 'post',
		},
		orderBy: {
			type: 'string',
			default: 'date',
		},
		postsToShow: {
			type: 'number',
			default: 2,
		},
		selectedCategory: {
			type: 'number',
			default: 0,
		},
		sectionTitle: {
			type: 'string',			
		},
		imageClass: {
			type: 'string',	
			default: 'post-img sm',			
		},
		hiddenImages: {
			type: 'boolean',				
		},
		gridStyleClass: {
			type: 'string',
			default: 'col-md-6',
		},
		align: {
			type: 'string',
			default: 'wide',
		},
		titleAlignClass: {
			type: 'string',
			default: 'title-align center',
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

	 edit: withSelect( ( select, props ) => {
		const { getEntityRecords, getPostTypes } = select( 'core' );
		const { postTypeSlug, orderBy, postsToShow, selectedCategory } = props.attributes;
		const postTypes = getPostTypes( { per_page: -1 } ) || [];
		const NewPostsQuery = pickBy( {
			order: 'desc',
			orderby: orderBy,
			per_page: postsToShow,
			categories: selectedCategory,			
		}, ( value ) => ! isUndefined( value ) );
		return {						
			posts: getEntityRecords( 'postType', postTypeSlug, NewPostsQuery ) || [],
			postTypes: postTypes.filter( postType => postType.viewable ).filter( postType => postType.rest_base !== 'media' ),						
		};
	} ) ( NewPostsEdit ),

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */

	//Output is null because the front end for dynamic blocks has to be rendered using PHP
	save: function () {
		return (null);		
	}
});
