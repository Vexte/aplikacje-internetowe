<?php

/** @var \App\Model\WishlistItem $post */
/** @var \App\Service\Router $router */

$title = 'Create Wishlist Item';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Create Wishlist Item</h1>
    <form action="<?= $router->generatePath('wishlist-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="wishlist-create">
    </form>

    <a href="<?= $router->generatePath('wishlist-index') ?>">Back to wishlist</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
