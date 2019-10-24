/*
* PLEASE NOTE: there are currently issues involving icon masking with the FA React component when used with Wordpress
* FA component is currently V. 0.1.4 and Wordpress is currently V. 5.2.3
* The issue is that the masking works as intended in the editor, but on the front end appears as a square regardless of the mask selected
* Simple masks have been created using CSS
* Original code has been left in place as comments in case a future update fixes the issue, and this is to be implemented.
*/

import './style.scss';
import './editor.scss';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import Downshift from 'downshift'

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { InspectorControls } = wp.editor;
const { SelectControl, RangeControl, ToggleControl, PanelBody } = wp.components;

const iconList = Object
	.keys(Icons)
	.filter(key => key !== "fas" && key !== "prefix" )
	.map(icon => Icons[icon])

library.add(...iconList)

registerBlockType('wpress-blocks/fa-insert', {
	title: __('Icon Insert'), // Block title
	icon: 'visibility', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed
	supports: {
		align: true,
		align: ['left','center','right']
	},
	keywords: [
		__('icon'),
		__('font'),
		__('awesome'),
		__('ECU'),
	],
	attributes:{
		iconName: {
			type: 'string',
			default: 'crow',
		},	
		sizeHolder: {
			type: 'number',
			default: 5,
		},
		hasFixedWidth: {
			type: 'boolean',
			default: false
		},
		hasIconBorder: {
			type: 'boolean',
			default: false
		},
		iconColor: {
			type: 'string',
			default: 'black',
		},
		iconFlip: {
			type: 'string',
			default: 'none',
		},
		// iconMask: {
		// 	type: 'string',
		// 	default: 'none',
		// },
		cssMask: {
			type: 'string',
			default: 'none',
		},
		hasTransform: {
			type: 'boolean',
			default: false
		},
		transSize: {
			type: 'number',
			default: 0,
		},		
		transXAmount: {
			type: 'number',
			default: 0,
		},
		transYAmount: {
			type: 'number',
			default: 0,
		},
		transRotate: {
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
	edit: function (props) {

		const {
			attributes,
			setAttributes,
			value
		} = props;	

		const {
			iconName,
			sizeHolder,
			hasFixedWidth,
			iconColor,
			iconFlip,
			// iconMask,
			cssMask,
			hasIconBorder,
			hasTransform,
			transSize,			
			transXAmount,
			transYAmount,			
			transRotate			
		} = attributes;

		const iconSize = `${sizeHolder}x`;
		const transformation = `grow-${transSize} right-${transXAmount} up-${transYAmount} rotate-${transRotate}`			

		const IconTag = () => {			
			return (
				<div className='iconWrapper'>			
					<FontAwesomeIcon
						icon={iconName}
						size={iconSize}
						flip={iconFlip}
						// mask={iconMask}
						border={hasIconBorder}
						fixedWidth={hasFixedWidth}
						transform={transformation}					
						className={['faIcon', iconColor, cssMask] .filter(e => !!e) .join(' ')}
					/>
				</div>	
			)
		};

		function onChangeIcon( value ) {
			setAttributes( { iconName: value } );			
		}

		function dismissTransform(){
			setAttributes( { transXAmount: 0 } );
			setAttributes( { transYAmount: 0 } );			
			setAttributes( { transRotate: 0 } );						
			if( cssMask === 'none' ) {
				setAttributes( { transSize: 0 } );								
			} else {
				setAttributes( { transSize: -4 } );
			}
		}

		function onChangeBackground (value) {
			setAttributes( { transSize: -4 } );
			setAttributes( { cssMask: value } );
		}
		
		const IconPicker = props => {	  
			return (
				<div className='iconPickerWrapper'>					
					<form>				
						<Downshift
							itemToString={item => (item ? item.value : '')}
							onChange={selection => onChangeIcon(selection.value)}							
							initialSelectedItem={{value}}
						>
							{({
								getInputProps,
								getItemProps,
								getLabelProps,
								getMenuProps,
								isOpen,
								inputValue,
								highlightedIndex,								
							}) => (
								<div className='iconSearchBox'>
									<label {...getLabelProps()}>Search for an icon: </label>
									<input {...getInputProps()}/>
									<ul {...getMenuProps()}>
										{isOpen
											? Object.values(Icons)
											.map(({iconName}) => iconName)
											.filter(Boolean)
											.map(icon => ({value: icon}))
											.filter(item => !inputValue || item.value.includes(inputValue))
											.map((item, index) => (
												<li
													{...getItemProps({
														key: item.value,
														index,
														item,
														style: {backgroundColor: highlightedIndex === index ? 'lightgray' : 'white'}
													})}
												>
													<span><FontAwesomeIcon icon={item.value} />{' '}{item.value}</span>
												</li>
											))
										: null}
									</ul>
								</div>)}
						</Downshift>							
					</form>					
				</div>
			)
		}

		const inspectorControls = (		
			<InspectorControls>
				<PanelBody
					title="Icon Settings"					
					initialOpen={ true }
				>			
					<IconPicker></IconPicker>
					Icon Size:
					<RangeControl					
						value={ sizeHolder }
						initialPosition={ 5 }
						min={ 1 }
						max={ 10 }
						step={ 1 }
						onChange={value => { setAttributes( { sizeHolder: value } )	} }							 														
					/>					
					<ToggleControl
						label={ hasIconBorder ? 'Has icon border' : 'No icon border'}										
						checked={ hasIconBorder }
						onChange={ () => setAttributes( { hasIconBorder: ! hasIconBorder } ) }
					/>
					<ToggleControl
						label={ hasFixedWidth ? 'Has fixed width' : 'No fixed width'}												
						checked={ hasFixedWidth }
						onChange={ () => setAttributes( { hasFixedWidth: ! hasFixedWidth } ) }
					/>
					<SelectControl						
						label={ __( 'Select Icon Color' ) }
						value={ iconColor }
						onChange={ ( iconColor ) => { setAttributes( { iconColor } ) } }						
						options={ [
							{ value: 'black', label: 'Black' },
							{ value: 'grey', label: 'Grey' },
							{ value: 'dark-grey', label: 'Dark Grey' },	
							{ value: 'ecu-purple', label: 'ECU Purple' },
							{ value: 'dark-purple', label: 'Dark Purple' },
							{ value: 'ecu-gold', label: 'ECU Gold' },
							{ value: 'burnt-gold', label: 'Burnt Gold' },													
							{ value: 'manatee', label: 'Manatee' },
							{ value: 'dark-teal', label: 'Dark Teal' },																			
						] }						
					/>
					<SelectControl						
						label={ __( 'Select Icon Flip' ) }
						value={ iconFlip }
						onChange={ ( iconFlip ) => { setAttributes( { iconFlip } ) } }						
						options={ [
							{ value: 'none', label: 'None' },
							{ value: 'horizontal', label: 'Horizontal' },
							// { value: 'vertical', label: 'Vertical' },
							// { value: 'both', label: 'Both' },													
						] }						
					/>
					{/* <SelectControl						
						label={ __( 'Select Icon Mask' ) }
						value={ iconMask }
						onChange={ ( iconMask ) => { setAttributes( { iconMask } ) } }						
						options={ [
							{ value: 'none', label: 'None' },
							{ value: 'circle', label: 'Circle' },
							{ value: 'square', label: 'Square' },
							{ value: 'comment', label: 'Comment' },																				
						] }						
					/>				 */}
					<SelectControl						
						label={ __( 'Select Icon Background' ) }
						value={ cssMask }
						// onChange={ ( cssMask ) => { setAttributes( { cssMask } ) } }	
						onChange={ onChangeBackground }					
						options={ [
							{ value: 'none', label: 'None' },
							{ value: 'bg circle', label: 'Circle' },
							{ value: 'bg square', label: 'Square' },
							{ value: 'bg leaf', label: 'Leaf' },																										
						] }						
					/>				
					<ToggleControl
						label={ hasTransform ? 'Apply transformation' : 'No transformation'}										
						checked={ hasTransform }
						onChange={ () => setAttributes( { hasTransform: ! hasTransform } ) }
					/>						
					{ hasTransform === true && (														
						<div className='transformationWrapper'>								
							Shrink/Grow
							<RangeControl														
								value={ transSize }
								initialPosition={ 0 }
								min={ -10 }
								max={ 10 }
								step={ 1 }
								onChange={value => { setAttributes( { transSize: value } )	} }							 														
							/>								
							Move Left/Right
							<RangeControl								
								value={ transXAmount }
								initialPosition={ 0 }
								min={ -10 }
								max={ 10 }
								step={ 1 }
								onChange={value => { setAttributes( { transXAmount: value } )	} }							 														
							/>
							Move Up/Down
							<RangeControl								
								value={ transYAmount }
								initialPosition={ 0 }
								min={ -10 }
								max={ 10 }
								step={ 1 }
								onChange={value => { setAttributes( { transYAmount: value } )	} }							 														
							/>
							Rotation
							<RangeControl								
								value={ transRotate }
								initialPosition={ 0 }
								min={ 0 }
								max={ 360 }
								step={ 1 }
								onChange={value => { setAttributes( { transRotate: value } )	} }							 														
							/>
						</div>												
					)}
					{ hasTransform === false && (							
						dismissTransform()							
					)}
				</PanelBody>
			</InspectorControls>	
		)

		return (
			<div className={props.className}>				
				<IconTag></IconTag>				
				{inspectorControls}														
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
		const {
			iconName,
			sizeHolder,
			hasFixedWidth,
			iconColor,
			iconFlip,
			// iconMask,
			cssMask,
			hasIconBorder,			
			transSize,						
			transXAmount,
			transYAmount,			
			transRotate			
		} = attributes;

		const iconSize = `${sizeHolder}x`;
		const transformation = `grow-${transSize} right-${transXAmount} up-${transYAmount} rotate-${transRotate}`				

		const IconTag = () => {			
			return (
				<div className='iconWrapper'>			
					<FontAwesomeIcon
						icon={iconName}
						size={iconSize}
						flip={iconFlip}
						// mask={iconMask}
						border={hasIconBorder}
						fixedWidth={hasFixedWidth}
						transform={transformation}					
						className={['faIcon', iconColor, cssMask] .filter(e => !!e) .join(' ')}
					/>					
				</div>	
			)
		};				
		return (			
			<div>								
				<IconTag></IconTag>
			</div>
		);		
	},
});
