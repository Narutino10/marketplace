ROLLBACK;

create sequence "User_id_seq"
    as integer;

alter sequence "User_id_seq" owner to "user";

create table if not exists "Clients"
(
    id                        integer   default nextval('"User_id_seq"'::regclass) not null
    constraint "User_pkey"
    primary key,
    firstname                 varchar(255),
    lastname                  varchar(255),
    email                     varchar(255),
    password                  varchar(255),
    role                      varchar(50),
    confirmed                 boolean   default false,
    reset_token               text,
    reset_token_expiry        timestamp,
    confirmation_token        varchar,
    confirmation_token_expiry timestamp default CURRENT_DATE,
    password_last_changed     date,
    account_created_at        date      default now()
    );

alter table "Clients"
    owner to "user";

alter sequence "User_id_seq" owned by "Clients".id;

create table if not exists "Product"
(
    id              serial
    primary key,
    name            varchar(255),
    description     text,
    category        varchar(100),
    brand           varchar(100),
    price           numeric(10, 2),
    stock_available integer,
    status          varchar(50),
    image           varchar(255)
    );

alter table "Product"
    owner to "user";

create table if not exists "Alerts"
(
    id        serial
    primary key,
    userid    integer
    references "Clients",
    alerttype varchar(50),
    productid integer
    references "Product",
    status    varchar(50)
    );

alter table "Alerts"
    owner to "user";

create table if not exists "Cart"
(
    id              serial
    primary key,
    userid          integer
    references "Clients",
    productid       integer
    references "Product",
    quantity        integer,
    "sessionId"     varchar(255),
    "reservedUntil" timestamp default CURRENT_TIMESTAMP
    );

alter table "Cart"
    owner to "user";

create table if not exists "DeliveryAdress"
(
    id         serial
    primary key,
    userid     integer
    references "Clients",
    fullname   varchar(255),
    adress     varchar(255),
    city       varchar(100),
    postalcode varchar(20),
    department varchar(100),
    country    varchar(100) default 'France'::character varying,
    address    text not null
    );

alter table "DeliveryAdress"
    owner to "user";

create table if not exists "SequelizeMeta"
(
    name varchar(255) not null
    primary key
    );

alter table "SequelizeMeta"
    owner to "user";

create table if not exists "Media"
(
    id          serial
    primary key,
    "productId" integer
    references "Product"
    on delete cascade,
    path        varchar(255) not null
    );

alter table "Media"
    owner to "user";

create table if not exists "Section"
(
    id          serial
    primary key,
    name        varchar(255)             not null,
    "createdAt" timestamp with time zone not null,
    "updatedAt" timestamp with time zone not null
                              );

alter table "Section"
    owner to "user";

create table if not exists favorite
(
    id          serial
    primary key,
    userid      integer                  not null
    references "Clients",
    productids  integer[] default ARRAY []::integer[],
    "createdAt" timestamp with time zone not null,
    "updatedAt" timestamp with time zone not null
);

alter table favorite
    owner to "user";

create table if not exists "Orders"
(
    id           serial
    primary key,
    date_order   timestamp with time zone not null,
    status_order varchar(255)             not null,
    total_amount double precision         not null,
    "userId"     integer                  not null
    references "Clients"
    on update cascade on delete cascade,
    "createdAt"  timestamp with time zone not null,
    "updatedAt"  timestamp with time zone not null
        );

alter table "Orders"
    owner to "user";

create table if not exists "OrderDetails"
(
    id          serial
    primary key,
    products    json                     not null,
    order_id    integer                  not null,
    "createdAt" timestamp with time zone not null,
    "updatedAt" timestamp with time zone not null
);

alter table "OrderDetails"
    owner to "user";




select * from "User";
