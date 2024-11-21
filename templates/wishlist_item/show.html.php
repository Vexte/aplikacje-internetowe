<?php

/** @var \App\Model\WishlistItem $wishlist_item */
/** @var \App\Service\Router $router */

$title = "{$wishlist_item->getGameTitle()} ({$wishlist_item->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $wishlist_item->getGameTitle() ?></h1>
    <a href='<?= $wishlist_item->getStoreLink() ?>'>Go to the store page</a> <br><br>
    <span>Release date: <time><?= $wishlist_item->getReleaseDate() ? $wishlist_item->getReleaseDate() : "Unknown" ?></time></span>
    <article>
        <?= $wishlist_item->getDescription();?>
    </article>

    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('wishlist-index') ?>">Back to wishlist</a></li>
        <li><a href="<?= $router->generatePath('wishlist-edit', ['id'=> $wishlist_item->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
