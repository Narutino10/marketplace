-- This script was generated by the ERD tool in pgAdmin 4.
-- Please log an issue at https://github.com/pgadmin-org/pgadmin4/issues/new/choose if you find any bugs, including reproduction steps.
BEGIN;


CREATE TABLE IF NOT EXISTS public."Alerts"
(
    id serial NOT NULL,
    userid integer,
    alerttype character varying(50) COLLATE pg_catalog."default",
    productid integer,
    status character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT "Alerts_pkey" PRIMARY KEY (id)
    );

CREATE TABLE IF NOT EXISTS public."Cart"
(
    id serial NOT NULL,
    userid integer,
    productid integer,
    quantity integer,
    CONSTRAINT "Cart_pkey" PRIMARY KEY (id)
    );

CREATE TABLE IF NOT EXISTS public."DeliveryAdress"
(
    id serial NOT NULL,
    userid integer,
    fullname character varying(255) COLLATE pg_catalog."default",
    adress character varying(255) COLLATE pg_catalog."default",
    city character varying(100) COLLATE pg_catalog."default",
    postalcode character varying(20) COLLATE pg_catalog."default",
    department character varying(100) COLLATE pg_catalog."default",
    country character varying(100) COLLATE pg_catalog."default" DEFAULT 'France'::character varying,
    CONSTRAINT "DeliveryAdress_pkey" PRIMARY KEY (id)
    );

CREATE TABLE IF NOT EXISTS public."Order"
(
    id serial NOT NULL,
    userid integer,
    dateorder date,
    statutsorder character varying(50) COLLATE pg_catalog."default",
    totalamount numeric(10, 2),
    CONSTRAINT "Order_pkey" PRIMARY KEY (id)
    );

CREATE TABLE IF NOT EXISTS public."OrderDetail"
(
    id serial NOT NULL,
    orderId integer,
    productid integer,
    quantity integer,
    unitprice numeric(10, 2),
    CONSTRAINT "OrderDetail_pkey" PRIMARY KEY (id)
    );

CREATE TABLE IF NOT EXISTS public."Product"
(
    id serial NOT NULL,
    name character varying(255) COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    category character varying(100) COLLATE pg_catalog."default",
    brand character varying(100) COLLATE pg_catalog."default",
    price numeric(10, 2),
    stockavailable integer,
    status character varying(50) COLLATE pg_catalog."default",
    image character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT "Product_pkey" PRIMARY KEY (id)
    );

CREATE TABLE IF NOT EXISTS public."User"
(
    id serial NOT NULL,
    firstname character varying(255) COLLATE pg_catalog."default",
    lastname character varying(255) COLLATE pg_catalog."default",
    email character varying(255) COLLATE pg_catalog."default",
    password character varying(255) COLLATE pg_catalog."default",
    role character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT "User_pkey" PRIMARY KEY (id)
    );

ALTER TABLE IF EXISTS public."Alerts"
    ADD CONSTRAINT "Alerts_productid_fkey" FOREIGN KEY (productid)
    REFERENCES public."Product" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
       ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public."Alerts"
    ADD CONSTRAINT "Alerts_userid_fkey" FOREIGN KEY (userid)
    REFERENCES public."User" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
       ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public."Cart"
    ADD CONSTRAINT "Cart_productid_fkey" FOREIGN KEY (productid)
    REFERENCES public."Product" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
       ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public."Cart"
    ADD CONSTRAINT "Cart_userid_fkey" FOREIGN KEY (userid)
    REFERENCES public."User" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
       ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public."DeliveryAdress"
    ADD CONSTRAINT "DeliveryAdress_userid_fkey" FOREIGN KEY (userid)
    REFERENCES public."User" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
       ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public."Order"
    ADD CONSTRAINT "Order_userid_fkey" FOREIGN KEY (userid)
    REFERENCES public."User" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
       ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public."OrderDetail"
    ADD CONSTRAINT "OrderDetail_orderid_fkey" FOREIGN KEY (orderid)
    REFERENCES public."Order" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
       ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public."OrderDetail"
    ADD CONSTRAINT "OrderDetail_productid_fkey" FOREIGN KEY (productid)
    REFERENCES public."Product" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
       ON DELETE NO ACTION;

END;

