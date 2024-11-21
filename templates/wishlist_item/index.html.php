<?php

/** @var \App\Model\WishlistItem[] $wishlist_items */
/** @var \App\Service\Router $router */

$title = 'Game Wishlist';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Game Wishlist</h1>

    <a href="<?= $router->generatePath('wishlist-create') ?>">Add item</a>
    <hr>

    <ul class="index-list">
        <?php foreach ($wishlist_items as $wishlist_item): ?>
            <li>
                <h3><?= $wishlist_item->getGameTitle() ?></h3>
                <a href='<?= $wishlist_item->getStoreLink() ?>'>Go to the store page</a>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('wishlist-show', ['id' => $wishlist_item->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('wishlist-edit', ['id' => $wishlist_item->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
