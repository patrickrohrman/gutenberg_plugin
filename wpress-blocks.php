<?php
/**
 * Plugin Name: Wpress Blocks
 * Description: Plugin to provide custom blocks
 * Version: 1.0.0
 * Text Domain: wpress-blocks
 * 
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue Gutenberg block assets for backend editor
 *
 * @uses {wp-blocks} for block type registration & related functions
 * @uses {wp-element} for WP Element abstraction — structure of blocks
 * @uses {wp-i18n} to internationalize the block's text
 * @uses {wp-editor} for WP editor styles
 * @since 1.0.0
 */
function wpress_blocks_editor_assets() {
	// Scripts
	wp_enqueue_script(
		'wpress_blocks-editor-js', // Handle
		plugins_url( '/wpress-blocks/dist/blocks.build.js'), // Block.build.js: We register the block here. Built with Webpack
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ), // Dependencies, defined above
		true // Enqueue the script in the footer
	);

	// Styles
	wp_enqueue_style(
		'wpress_blocks-editor-styles', // Handle
		plugins_url( '/wpress-blocks/dist/blocks.editor.build.css'), // Block editor CSS
		array( 'wp-edit-blocks' ), // Dependency to include the CSS after it
		filemtime(plugin_dir_path( __FILE__ ) . '/dist/blocks.editor.build.css')
	);
}

// Hook: Editor assets.
add_action( 'enqueue_block_editor_assets', 'wpress_blocks_editor_assets');

/**
 * Enqueue Gutenberg block assets for both frontend + backend
 *
 * @uses {wp-editor} for WP editor styles
 * @since 1.0.0
 */
function wpress_blocks_frontend_assets() {
	// Styles
	wp_enqueue_style(
		'wpress_blocks-frontend-styles', // Handle
		plugins_url( '/wpress-blocks/dist/blocks.style.build.css'), // Block style CSS
		array( 'wp-editor' ), // Dependency to include the CSS after it
		filemtime(plugin_dir_path( __FILE__ ) . '/dist/blocks.style.build.css')
	);
}

// Hook: Frontend assets
add_action( 'enqueue_block_assets', 'wpress_blocks_frontend_assets');

//Disable the custom color picker in gutenberg
function gutenberg_disable_custom_colors() {
	add_theme_support( 'disable-custom-colors' );
}
add_action( 'after_setup_theme', 'gutenberg_disable_custom_colors' );

//Adds the php file needed for serverside rendering of the post-grid block
include(plugin_dir_path(__FILE__) . '/src/post-grid/index.php');

//Removes automatically generated <p> tags from excerpt of post-grid block
remove_filter( 'the_excerpt', 'wpautop' );

//Adds the featured images to the WP API
function ws_register_images_field() {
    register_rest_field( 
        'post',
        'images',
        array(
            'get_callback'    => 'ws_get_images_urls',
            'update_callback' => null,
            'schema'          => null,
        )
    );
}

add_action( 'rest_api_init', 'ws_register_images_field' );

function ws_get_images_urls( $object, $field_name, $request ) {
    $medium = wp_get_attachment_image_src( get_post_thumbnail_id( $object->id ), 'medium' );
    $medium_url = $medium['0'];

    $large = wp_get_attachment_image_src( get_post_thumbnail_id( $object->id ), 'large' );
    $large_url = $large['0'];

    return array(
        'medium' => $medium_url,
        'large'  => $large_url,
    );
}