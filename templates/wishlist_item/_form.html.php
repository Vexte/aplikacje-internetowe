<?php
    /** @var $post ?\App\Model\WishlistItem */
?>

<div class="form-group">
    <label for="game_title">Game Title</label>
    <input type="text" id="game_title" name="wishlist_item[game_title]" value="<?= $wishlist_item ? $wishlist_item->getGameTitle() : '' ?>">
</div>

<div class="form-group">
    <label for="release_date">Release Date</label>
    <input type="date" id="release_date" name="wishlist_item[release_date]" value="<?= $wishlist_item ? $wishlist_item->getReleaseDate() : '' ?>">
</div>

<div class="form-group">
    <label for="description">Description</label>
    <textarea id="description" name="wishlist_item[description]"><?= $wishlist_item ? $wishlist_item->getDescription() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
