<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://https://www.linkedin.com/in/imran-hussain-46120270/
 * @since      1.0.0
 *
 * @package    Characterize
 * @subpackage Characterize/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Characterize
 * @subpackage Characterize/admin
 * @author     Imran Hussain <786imranhussain@gmail.com>
 */
class Characterize_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Characterize_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Characterize_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/characterize-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Characterize_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Characterize_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/characterize-admin.js', array( 'jquery' ), $this->version, false );


	}

	// Register Custom Post Type
	public function custom_post_type() {

		$labels = array(
			'name'                  => _x( 'Characters', 'Post Type General Name', 'characterize' ),
			'singular_name'         => _x( 'Character', 'Post Type Singular Name', 'characterize' ),
		);
		$args = array(
			'label'                 => __( 'Character', 'characterize' ),
			'description'           => __( 'Character post type', 'characterize' ),
			'labels'                => $labels,
			'supports'              => array( 'title', 'editor', 'thumbnail', 'custom-fields' ),
			'taxonomies'            => array( 'category', 'post_tag' ),
			'hierarchical'          => false,
			'public'                => true,
			'show_ui'               => true,
			'show_in_menu'          => true,
			'menu_position'         => 5,
			'show_in_rest' 			=> true,
			'show_in_admin_bar'     => true,
			'show_in_nav_menus'     => true,
			'can_export'            => true,
			'has_archive'           => true,
			'exclude_from_search'   => false,
			'publicly_queryable'    => true,
			'capability_type'       => 'page',
		);
		register_post_type( 'character', $args );

	}

	public function characterize_get_attachment_id() {

		if(wp_verify_nonce( $_REQUEST['_nonce'], 'char-attach-id' )) {
			$image_url = isset($_GET['imageUrl']) ? $_GET['imageUrl'] : '';
		
			// Upload the image to the media library
			$upload_file = media_sideload_image($image_url, 0, '', 'src');

			if (is_wp_error($upload_file)) {
				echo json_encode ( array('error' => true, 'message' => 'Error uploading image.' ) );
				wp_die();
			}
		
			// Get the attachment ID based on the uploaded file URL
			$attachment_id = attachment_url_to_postid($upload_file);
		
			echo json_encode ( array('error' => false, 'attachment_id' => $attachment_id ) );
		}else{
			echo json_encode ( array('error' => true, 'message' => 'Invalid nonce!' ) );
		}
	
		wp_die();
	}

	public function characterize_register_gutenberg_block() {
		wp_register_script(
			'characterize-gutenberg-block',
			plugin_dir_url( __FILE__ ) . 'js/block.js',
			array('wp-blocks', 'wp-components', 'wp-element', 'wp-data')
		);

		wp_localize_script('characterize-gutenberg-block', 'chobj', array(
			'nonce' =>  wp_create_nonce( 'char-attach-id' )
		));
	
		register_block_type('custom/characterize-block', array(
			'editor_script' => 'characterize-gutenberg-block',
		));
	}

}
