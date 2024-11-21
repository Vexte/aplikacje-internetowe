create table wishlist
(
    id      integer not null
            constraint wishlist_pk
            primary key autoincrement,
    game_title text not null,
    release_date text not null,
    description text not null,
    store_link text not null
);
