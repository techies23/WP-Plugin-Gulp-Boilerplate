<?php
/**
* @link              http://www.deepenbajracharya.com.np
* @since             1.0.0
*
* Plugin Name:       Basic Boilerplate Plugin using Gulp
* Plugin URI:        http://www.deepenbajracharya.com.np
* Description:       Basic Boilerplate Template for WordPress plugin Gulp Usage
* Version:           1.0.0
* Author:            Deepen Bajracharya
* Author URI:        http://www.deepenbajracharya.com.np
* License:           GPL-2.0+
* License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
*/

if ( ! defined( 'ABSPATH' ) ) {
  die("No scripts kiddies !");
}

final class WP_Plugin_Gulp {

  public $version = '1.0.0';

  public $required_wp_version = '4.5.2';

  private static $_instance = null;

  /**
  * Create only one instance so that it may not Repeat
  * @since 2.0.0
  */
  public static function instance() {
    if ( is_null( self::$_instance ) ) {
      self::$_instance = new self();
    }
    return self::$_instance;
  }


}

add_action( 'plugins_loaded', array( 'WP_Plugin_Gulp', 'instance' ) );