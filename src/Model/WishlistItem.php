<?php
namespace App\Model;

use App\Service\Config;

class WishlistItem
{
	private ?int $id = null;
	private ?string $game_title = null;
	private ?string $release_date = null;
	private ?string $description = null;
	private ?string $store_link = null;

	public function getId(): ?int
	{
		return $this->id;
	}

	public function setId(?int $id): WishlistItem
	{
		$this->id = $id;

		return $this;
	}

	public function getGameTitle(): ?string
	{
		return $this->game_title;
	}

	public function setGameTitle(?string $game_title): WishlistItem
	{
		$this->game_title = $game_title;

		return $this;
	}

	public function getReleaseDate(): ?string
	{
		return $this->release_date;
	}

	public function setReleaseDate(?string $release_date): WishlistItem
	{
		$this->release_date = $release_date;

		return $this;
	}

	public function getDescription(): ?string
	{
		return $this->description;
	}

	public function setDescription(?string $description): WishlistItem
	{
		$this->description = $description;

		return $this;
	}

	public function getStoreLink(): ?string
	{
		return $this->store_link;
	}

	public function setStoreLink(?string $store_link): WishlistItem
	{
		$this->store_link = $store_link;

		return $this;
	}

	public static function fromArray($array): WishlistItem
	{
		$wishlist_item = new self();
		$wishlist_item->fill($array);

		return $wishlist_item;
	}

	public function fill($array): WishlistItem
	{
		if (isset($array['id']) && ! $this->getId())
		{
			$this->setId($array['id']);
		}
		if (isset($array['game_title']))
		{
			$this->setGameTitle($array['game_title']);
		}
		if (isset($array['release_date']))
		{
			$this->setReleaseDate($array['release_date']);
		}
		if (isset($array['description']))
		{
			$this->setDescription($array['description']);
		}
		if (isset($array['store_link']))
		{
			$this->setStoreLink($array['store_link']);
		}

		return $this;
	}

	public static function findAll(): array
	{
		$pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
		$sql = 'SELECT * FROM wishlist';
		$statement = $pdo->prepare($sql);
		$statement->execute();

		$wishlist_items = [];
		$wishlist_items_array = $statement->fetchAll(\PDO::FETCH_ASSOC);
		foreach ($wishlist_items_array as $wishlist_items_array) {
			$wishlist_items[] = self::fromArray($wishlist_items_array);
		}

		return $wishlist_items;
	}

	public static function find($id): ?WishlistItem
	{
		$pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
		$sql = 'SELECT * FROM wishlist WHERE id = :id';
		$statement = $pdo->prepare($sql);
		$statement->execute(['id' => $id]);

		$wishlist_item_array = $statement->fetch(\PDO::FETCH_ASSOC);
		if (! $wishlist_item_array) {
			return null;
		}
		$wishlist_item = WishlistItem::fromArray($wishlist_item_array);

		return $wishlist_item;
	}

	public function save(): void
	{
		$pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
		if (! $this->getId()) {
			$sql = "INSERT INTO `wishlist` (game_title, release_date, description, store_link) VALUES (:game_title, :release_date, :description, :store_link)";
			$statement = $pdo->prepare($sql);
			$statement->execute([
				'game_title' => $this->getGameTitle(),
				'release_date' => $this->getReleaseDate(),
				'description' => $this->getDescription(),
				'store_link' => $this->getStoreLink()
			]);

			$this->setId($pdo->lastInsertId());
		} else {
			$sql = "UPDATE wishlist SET game_title = :game_title, release_date = :release_date, description = :description, store_link = :store_link WHERE id = :id";
			$statement = $pdo->prepare($sql);
			$statement->execute([
				':release_date' => $this->getGameTitle(),
				':release_date' => $this->getReleaseDate(),
				':description' => $this->getDescription(),
				':store_link' => $this->getStoreLink(),
				':id' => $this->getId()
			]);
		}
	}

	public function delete(): void
	{
		$pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
		$sql = "DELETE FROM wishlist WHERE id = :id";
		$statement = $pdo->prepare($sql);
		$statement->execute([
			':id' => $this->getId(),
		]);

		$this->setId(null);
		$this->setGameTitle(null);
		$this->setReleaseDate(null);
		$this->setDescription(null);
		$this->setStoreLink(null);
	}
}
