<?php
/**
 * REST API Items Controller
 *
 * @package {{NAMESPACE}}\Api
 */

namespace {{NAMESPACE}}\Api;

use WP_REST_Controller;
use WP_REST_Server;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

/**
 * Class Items_Controller
 *
 * Handles /{{PREFIX}}/v1/items REST endpoints.
 */
class Items_Controller extends WP_REST_Controller {

	protected $namespace = '{{PREFIX}}/v1';
	protected $rest_base = 'items';

	/**
	 * Register routes.
	 */
	public function register_routes(): void {
		register_rest_route( $this->namespace, '/' . $this->rest_base, [
			[
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => [ $this, 'get_items' ],
				'permission_callback' => [ $this, 'get_items_permissions_check' ],
				'args'                => $this->get_collection_params(),
			],
			[
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => [ $this, 'create_item' ],
				'permission_callback' => [ $this, 'create_item_permissions_check' ],
			],
		] );

		register_rest_route( $this->namespace, '/' . $this->rest_base . '/(?P<id>[\d]+)', [
			[
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => [ $this, 'get_item' ],
				'permission_callback' => [ $this, 'get_item_permissions_check' ],
			],
			[
				'methods'             => WP_REST_Server::DELETABLE,
				'callback'            => [ $this, 'delete_item' ],
				'permission_callback' => [ $this, 'delete_item_permissions_check' ],
			],
		] );
	}

	public function get_items_permissions_check( WP_REST_Request $request ): bool|WP_Error {
		return current_user_can( 'read' );
	}

	public function create_item_permissions_check( WP_REST_Request $request ): bool|WP_Error {
		return current_user_can( 'edit_posts' );
	}

	public function get_item_permissions_check( WP_REST_Request $request ): bool|WP_Error {
		return current_user_can( 'read' );
	}

	public function delete_item_permissions_check( WP_REST_Request $request ): bool|WP_Error {
		return current_user_can( 'delete_posts' );
	}

	public function get_items( WP_REST_Request $request ): WP_REST_Response {
		global $wpdb;

		$per_page = absint( $request->get_param( 'per_page' ) ?: 10 );
		$page     = absint( $request->get_param( 'page' ) ?: 1 );
		$offset   = ( $page - 1 ) * $per_page;

		$items = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM {$wpdb->prefix}{{DB_TABLE}} WHERE status = %s ORDER BY created_at DESC LIMIT %d OFFSET %d",
				'active', $per_page, $offset
			)
		);

		$total    = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->prefix}{{DB_TABLE}} WHERE status = 'active'" );
		$response = new WP_REST_Response( $items, 200 );
		$response->header( 'X-WP-Total', $total );
		$response->header( 'X-WP-TotalPages', (int) ceil( $total / $per_page ) );

		return $response;
	}

	public function get_item( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		global $wpdb;

		$id   = absint( $request->get_param( 'id' ) );
		$item = $wpdb->get_row(
			$wpdb->prepare( "SELECT * FROM {$wpdb->prefix}{{DB_TABLE}} WHERE id = %d", $id )
		);

		if ( ! $item ) {
			return new WP_Error( 'not_found', __( 'Item not found.', '{{TEXT_DOMAIN}}' ), [ 'status' => 404 ] );
		}

		return new WP_REST_Response( $item, 200 );
	}

	public function create_item( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		global $wpdb;

		$title = sanitize_text_field( $request->get_param( 'title' ) );

		if ( empty( $title ) ) {
			return new WP_Error( 'invalid_data', __( 'Title is required.', '{{TEXT_DOMAIN}}' ), [ 'status' => 400 ] );
		}

		$inserted = $wpdb->insert(
			$wpdb->prefix . '{{DB_TABLE}}',
			[ 'user_id' => get_current_user_id(), 'title' => $title, 'status' => 'active' ],
			[ '%d', '%s', '%s' ]
		);

		if ( ! $inserted ) {
			return new WP_Error( 'db_error', __( 'Could not create item.', '{{TEXT_DOMAIN}}' ), [ 'status' => 500 ] );
		}

		$item = $wpdb->get_row(
			$wpdb->prepare( "SELECT * FROM {$wpdb->prefix}{{DB_TABLE}} WHERE id = %d", $wpdb->insert_id )
		);

		return new WP_REST_Response( $item, 201 );
	}

	public function delete_item( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		global $wpdb;

		$id      = absint( $request->get_param( 'id' ) );
		$deleted = $wpdb->delete( $wpdb->prefix . '{{DB_TABLE}}', [ 'id' => $id ], [ '%d' ] );

		if ( ! $deleted ) {
			return new WP_Error( 'not_found', __( 'Item not found.', '{{TEXT_DOMAIN}}' ), [ 'status' => 404 ] );
		}

		return new WP_REST_Response( [ 'deleted' => true ], 200 );
	}
}
