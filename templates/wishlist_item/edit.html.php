<?php

/** @var \App\Model\WishlistItem $wishlist_item */
/** @var \App\Service\Router $router */

$title = "Edit Post {$wishlist_item->getGameTitle()} ({$wishlist_item->getId()})";
$bodyClass = "edit";

ob_start(); ?>
    <h1><?= $title ?></h1>
    <form action="<?= $router->generatePath('wishlist_item-edit') ?>" method="wishlist_item" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="wishlist-edit">
        <input type="hidden" name="id" value="<?= $wishlist_item->getId() ?>">
    </form>

    <ul class="action-list">
        <li>
            <a href="<?= $router->generatePath('wishlist-index') ?>">Back to wishlist</a></li>
        <li>
            <form action="<?= $router->generatePath('wishlist-delete') ?>" method="post">
                <input type="submit" value="Delete" onclick="return confirm('Are you sure?')">
                <input type="hidden" name="action" value="wishlist-delete">
                <input type="hidden" name="id" value="<?= $wishlist_item->getId() ?>">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
