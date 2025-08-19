<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'sigmasof_wp_vfy7e' );

/** Database username */
define( 'DB_USER', 'sigmasof_wp_bz49o' );

/** Database password */
define( 'DB_PASSWORD', 'EA!Yl1%pGC12b6ab' );

/** Database hostname */
define( 'DB_HOST', 'localhost:3306' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY', 'Ll@E[(-NkH5t74)F*la%gDNdy!SaF--2)D75)6:2|g]mI%Ia)E:B|G%Y|77ekS6T');
define('SECURE_AUTH_KEY', '[)m7J0Gc9DT0[(X|9V2B_]M:7_W_PA#C8Z8N9*5WA!Y8%N!R1j4:&8(Fx9~;kjHZ');
define('LOGGED_IN_KEY', '4;YzLTa0N-CMk222(xEAMtPNd12UycC~g0_z0X]xt3R!Y&q+0R@)]]&g1zR3f-2f');
define('NONCE_KEY', 'a96f5tn1e_h800M3_3n[#[cm-c:1;~3~G#/*7c;62%Fx|KgaonKH[8/(P81rtwcy');
define('AUTH_SALT', '~/T332b2-2|47Zet~:7oIu9-[tv8_@iG-8Wp[xrs8@!2oel!:44ncJ#1Ur[79Dvp');
define('SECURE_AUTH_SALT', '~zWLc3-0[Y5+X9/#Fp6V6c/eDX(B|3cEisOx]OO;3m!)8IjH10+8ydHM&_asZ0u]');
define('LOGGED_IN_SALT', '|Ptb7T9xa1x2MIb26NF4jcgc/q3sS/R34A7KtPm3Dc8nKt8J2193]3%+b6~P[107');
define('NONCE_SALT', '4T2/A/tX#%Ms1C;DS2#@-3oj_6[uHEu(~%8Vyo1FNb0&3M6@VA@9Gp_7|s6B|4wv');


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'FCp4mvJ_';


/* Add any custom values between this line and the "stop editing" line. */

define('WP_ALLOW_MULTISITE', true);
/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
