create table if not exists "Clients"
(
    id        integer default nextval('"User_id_seq"'::regclass) not null
        constraint "User_pkey"
            primary key,
    firstname varchar(255),
    lastname  varchar(255),
    email     varchar(255),
    password  varchar(255),
    role      varchar(50),
    confirmed boolean(50),
    reset_token text,

);

alter table "Clients"
    owner to "user";

create table if not exists "Product"
(
    id             serial
        primary key,
    name           varchar(255),
    description    text,
    category       varchar(100),
    brand          varchar(100),
    price          numeric(10, 2),
    stockavailable integer,
    status         varchar(50),
    image          varchar(255)
);

alter table "Product"
    owner to "user";

create table if not exists "Order"
(
    id           serial
        primary key,
    userid       integer
        references "Clients",
    dateorder    date,
    statutsorder varchar(50),
    totalamount  numeric(10, 2)
);

alter table "Order"
    owner to "user";

create table if not exists "OrderDetail"
(
    id        serial
        primary key,
    orderid   integer
        references "Order",
    productid integer
        references "Product",
    quantity  integer,
    unitprice numeric(10, 2)
);

alter table "OrderDetail"
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
    id        serial
        primary key,
    userid    integer
        references "Clients",
    productid integer
        references "Product",
    quantity  integer
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
    country    varchar(100) default 'France'::character varying
);

alter table "DeliveryAdress"
    owner to "user";


