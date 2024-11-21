<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\WishlistItem;
use App\Service\Router;
use App\Service\Templating;

class WishlistController
{
	public function indexAction(Templating $templating, Router $router): ?string
	{
		$wishlist_items = WishlistItem::findAll();
		$html = $templating->render('wishlist_item/index.html.php', [
			'wishlist_items' => $wishlist_items,
			'router' => $router,
		]);
		return $html;
	}

	public function createAction(?array $request_wishlist_item, Templating $templating, Router $router): ?string
	{
		if ($request_wishlist_item) {
			$wishlist_item = WishlistItem::fromArray($request_wishlist_item);
			$wishlist_item->save();

			$path = $router->generatePath('wishlist-index');
			$router->redirect($path);
			return null;
		} else {
			$wishlist_item = new WishlistItem();
		}

		$html = $templating->render('wishlist_item/create.html.php', [
			'wishlist_item' => $wishlist_item,
			'router' => $router,
		]);
		return $html;
	}

	public function editAction(int $wishlist_item_id, ?array $request_wishlist_item, Templating $templating, Router $router): ?string
	{
		$wishlist_item = WishlistItem::find($wishlist_item_id);
		if (! $wishlist_item) {
			throw new NotFoundException("Missing wishlist_item with id $wishlist_item_id");
		}

		if ($request_wishlist_item) {
			$wishlist_item->fill($request_wishlist_item);
			// @todo missing validation
			$wishlist_item->save();

			$path = $router->generatePath('wishlist-index');
			$router->redirect($path);
			return null;
		}

		$html = $templating->render('wishlist_item/edit.html.php', [
			'wishlist_item' => $wishlist_item,
			'router' => $router,
		]);
		return $html;
	}

	public function showAction(int $wishlist_item_id, Templating $templating, Router $router): ?string
	{
		$wishlist_item = WishlistItem::find($wishlist_item_id);
		if (! $wishlist_item) {
			throw new NotFoundException("Missing wishlist_item with id $wishlist_item_id");
		}

		$html = $templating->render('wishlist_item/show.html.php', [
			'wishlist_item' => $wishlist_item,
			'router' => $router,
		]);
		return $html;
	}

	public function deleteAction(int $wishlist_item_id, Router $router): ?string
	{
		$wishlist_item = WishlistItem::find($wishlist_item_id);
		if (! $wishlist_item) {
			throw new NotFoundException("Missing wishlist_item with id $wishlist_item_id");
		}

		$wishlist_item->delete();
		$path = $router->generatePath('wishlist-index');
		$router->redirect($path);
		return null;
	}
}
