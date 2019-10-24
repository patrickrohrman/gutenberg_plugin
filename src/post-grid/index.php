<?php
    /**
    * Because the block is dynamic, the frontend has to be rendered serverside with php.
    * Otherwise, the content on the front end would not change as new posts are added.
    * Also, the front end and the backend would not match - causing validation issues.
    * 
    * @link https://developer.wordpress.org/block-editor/tutorials/block-tutorial/creating-dynamic-blocks/
    */

    function get_featured_image($post_id, $attributes) {
        // Get the post thumbnail
        $fetured_image = '';
        $post_thumb_id = get_post_thumbnail_id($post_id);
        $image_size_class = $attributes['imageClass'];
        
        //Apply image class based on show/hide option
        if ($attributes['hiddenImages'] == 'true') {
            $image_hidden_class = 'hiddenImages';
        } else {
            $image_hidden_class = 'showImages';
        }        

        if (isset($attributes['displayPostImage']) && $post_thumb_id) {           
            //Image output markup
            $fetured_image = sprintf(
                '<div class="pg-image %1$s %2$s">
                    <a href="%3$s">
                        %4$s
                    </a>
                </div>',
                sprintf($image_size_class),
                sprintf($image_hidden_class),
                esc_url(get_permalink($post_id)),
                wp_get_attachment_image($post_thumb_id, $post_thumb_size)                
            );
        }
        return $fetured_image; 
    }

    //Get post excerpt
    function post_layouts_get_excerpt($post_id, $post_query, $attributes) {
        //Get excerpt
        $excerpt = apply_filters('the_excerpt', get_post_field('post_excerpt', $post_id, 'display'));
        //Set length based on excerptLength attribute         
        $excerptLength = $attributes['excerptLength']; 
        //Set $excerpt to the excerpt trimmed to specified length
        $excerpt = apply_filters('the_excerpt', wp_trim_words(get_the_content(), $excerptLength));         

        if (!$excerpt) {
            $excerpt = null;
        }

        //Sanitize excerpt for allowed HTML
        $excerpt_data = wp_kses_post($excerpt);
                
        return $excerpt_data;        
    }

    //Render the block for the front end
    function render_block_core_post_grid( $attributes ) {
        //Query arguments
        $args = array(
            'posts_per_page' => $attributes['postsToShow'],
            'post_status' => 'publish',
            'order' => $attributes['order'],
            'orderby' => $attributes['orderBy'],
            'cat' => !empty($attributes['selectedCategory']) ? $attributes['selectedCategory'] : '',        
        );       

        $post_query = new WP_Query($args);            

        //opening block & main title markup
        if ($post_query->have_posts()) {            
            $item_markup .= sprintf(
                '<div class="pg-block align%1$s">
                    <div class="%2$s">
                        <h2>
                            %3$s
                        </h2>
                    </div>',
                esc_attr($attributes['align']),
                esc_attr($attributes['titleAlignClass']),
                esc_attr($attributes['sectionTitle'])
            );
            
            $item_markup .= sprintf('<div class="row">');

            //loop the query
            while ($post_query->have_posts()) {
            
                $post_query->the_post();                
                $post_id = get_the_ID();
                $post_thumb_id = get_post_thumbnail_id($post_id);

                if ($post_thumb_id && isset($attributes['displayPostImage'])) {
                    $post_thumb_class = 'has-thumb';
                } else {
                    $post_thumb_class = 'no-thumb';
                }

                // Start the markup for the post                            
                $item_markup .= sprintf(
                    '<div class="pg-item %1$s %2$s">',
                    esc_attr($post_thumb_class),
                    esc_attr($attributes['gridStyleClass'])
                );

                //Get the featured image
                $item_markup .= get_featured_image($post_id, $attributes);

                //Get the post title
                $title = get_the_title($post_id);

                if (!$title) {
                    $title = __('Untitled', blank);
                }                                             
                //Post title markup
                $item_markup .= sprintf(
                    '<div class="pg-title">
                        <h3>
                            <a href="%1$s">
                                %2$s
                            </a>
                        </h3>                    
                    </div>',
                    esc_url(get_permalink($post_id)),
                    esc_html($title) 
                );
                //Excerpt wrapper
                $item_markup .= sprintf('<div class="pg-excerpt">');
                //Get excerpt
                $item_markup .= post_layouts_get_excerpt($post_id, $post_query, $attributes);               
                //Close the 'pg-excerpt' & 'pg-item' divs                    
                $item_markup .= sprintf('                    
                    </div>  
                        </div>'
                );                 
            }
            //Close the 'row' and 'pg-block' divs
            $item_markup .= sprintf('                    
                </div>  
                    </div>'
            ); 
        }        
        return $item_markup;       
    }

    //Registers the block on server.
    function register_block_core_post_grid() {
        register_block_type( 'wpress-blocks/post-grid', array(
            'attributes' => array(
                'category' => array(
                    'type' => 'string',
                ),
                'postsToShow' => array(
                    'type' => 'number',
                    'default' => 2,
                ),		               
                'order' => array(
                    'type' => 'string',
                    'default' => 'desc',
                ),
                'orderBy' => array(
                    'type' => 'string',
                    'default' => 'date',
                ),
                'displayPostImage' => array(
                    'type' => 'boolean',
                    'default' => true,
                ),
                'excerptLength' => array(
                    'type' => 'string',
                    'default' => 25,
                ),               
                'sectionTitle' => array(
                    'type' => 'string',				
                ),
                'imageClass' => array(
                    'type' => 'string',
                    'default' => 'post-img sm',				
                ),
                'hiddenImages' => array(
                    'type' => 'boolean',
                    'default' => 'false',
                ), 
                'gridStyleClass' => array(
                    'type' => 'string',
                    'default' => 'col-md-6',				
                ),
                'titleAlignClass' => array(
                    'type' => 'string',
                    'default' => 'title-align center',				
                ),
                'align' => array(
                    'type' => 'string',
                    'default' => 'wide',				
                ),
            ),
            'render_callback' => 'render_block_core_post_grid',
        ) );
    }
    add_action( 'init', 'register_block_core_post_grid' );