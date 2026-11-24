-- =====================================================================
--  RAJ - Tienda de suplementación deportiva  ·  Proyecto final DAW
--  Script MySQL 8 a partir del modelo relacional
--  Backend: Java (JAX-RS + Hibernate/JPA)  ·  Frontend: JavaScript
-- =====================================================================

DROP DATABASE IF EXISTS signdb;
CREATE DATABASE signdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE signdb;

-- ---------------------------------------------------------------------
-- USER (id PK, firstName, lastName, middleInitial, street, city, state,
--       zip, phone, email UNIQUE, password, role)
-- · "user" va entre comillas invertidas porque es palabra reservada
-- · zip y phone son texto: no se opera con ellos y pueden llevar
--   ceros a la izquierda, "+34", espacios...
-- · password en texto plano (aplicación académica)
-- · role: USER por defecto; el ADMIN puede gestionar productos y categorías
-- ---------------------------------------------------------------------
CREATE TABLE `user` (
    id            BIGINT        NOT NULL,
    firstName     VARCHAR(255),
    lastName      VARCHAR(255),
    middleInitial VARCHAR(255),
    street        VARCHAR(255),
    city          VARCHAR(255),
    state         VARCHAR(255),
    zip           VARCHAR(10),
    phone         VARCHAR(20),
    email         VARCHAR(255)  NOT NULL,
    password      VARCHAR(255)  NOT NULL,
    role          ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    CONSTRAINT pk_user       PRIMARY KEY (id),
    CONSTRAINT uk_user_email UNIQUE (email)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- CATEGORY (id PK, nameCategory, parentCategory_id FK -> CATEGORY.id)
-- Relación reflexiva ParentCategory 1:N: una categoría padre puede tener
-- varias subcategorías -> FK a sí misma, SIN UNIQUE y admite NULL
-- ---------------------------------------------------------------------
CREATE TABLE category (
    id                BIGINT       NOT NULL,
    nameCategory      VARCHAR(255) NOT NULL,
    parentCategory_id BIGINT       NULL,
    CONSTRAINT pk_category        PRIMARY KEY (id),
    CONSTRAINT uk_category_name   UNIQUE (nameCategory),
    CONSTRAINT fk_category_parent FOREIGN KEY (parentCategory_id)
        REFERENCES category (id)
        ON DELETE SET NULL
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- PRODUCT (id PK, name, description, brand, imageUrl, price, stock,
--          category_id FK -> CATEGORY.id)
-- · imageUrl guarda la RUTA o URL de la imagen, no la imagen en sí
-- ---------------------------------------------------------------------
CREATE TABLE product (
    id          BIGINT        NOT NULL,
    name        VARCHAR(255)  NOT NULL,
    description TEXT,
    brand       VARCHAR(100),
    imageUrl    VARCHAR(500),
    price       DECIMAL(10,2) NOT NULL,
    stock       INT           NOT NULL DEFAULT 0,
    category_id BIGINT        NOT NULL,
    CONSTRAINT pk_product          PRIMARY KEY (id),
    CONSTRAINT fk_product_category FOREIGN KEY (category_id)
        REFERENCES category (id),
    CONSTRAINT ck_product_price    CHECK (price >= 0),
    CONSTRAINT ck_product_stock    CHECK (stock >= 0)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- PURCHASE (id PK, dateOrder, totalPrice, pending, user_id FK -> USER.id)
-- · la entidad Order se llama purchase porque ORDER es palabra reservada
-- · pending: TRUE  = compra pendiente (carrito abierto)
--            FALSE = compra completada
-- ---------------------------------------------------------------------
CREATE TABLE purchase (
    id         BIGINT        NOT NULL,
    dateOrder  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    totalPrice DECIMAL(10,2) NOT NULL DEFAULT 0,
    pending    BOOLEAN       NOT NULL DEFAULT TRUE,
    user_id    BIGINT        NOT NULL,
    CONSTRAINT pk_purchase       PRIMARY KEY (id),
    CONSTRAINT fk_purchase_user  FOREIGN KEY (user_id)
        REFERENCES `user` (id),
    CONSTRAINT ck_purchase_total CHECK (totalPrice >= 0)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- PURCHASE_PRODUCT (purchase_id PK FK -> PURCHASE.id,
--                   product_id  PK FK -> PRODUCT.id, quantity, unitPrice)
-- · Sale de la relación N:M "contiene"
-- · unitPrice: precio del producto EN EL MOMENTO de la compra, para que
--   los pedidos antiguos cuadren aunque luego cambie product.price
-- ---------------------------------------------------------------------
CREATE TABLE purchase_product (
    purchase_id BIGINT        NOT NULL,
    product_id  BIGINT        NOT NULL,
    quantity    INT           NOT NULL DEFAULT 1,
    unitPrice   DECIMAL(10,2) NOT NULL,
    CONSTRAINT pk_purchase_product PRIMARY KEY (purchase_id, product_id),
    CONSTRAINT fk_pp_purchase FOREIGN KEY (purchase_id)
        REFERENCES purchase (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_pp_product  FOREIGN KEY (product_id)
        REFERENCES product (id),
    CONSTRAINT ck_pp_quantity  CHECK (quantity > 0),
    CONSTRAINT ck_pp_unitprice CHECK (unitPrice >= 0)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- Tablas de secuencia para Hibernate (@GeneratedValue(strategy = AUTO))
-- No forman parte del modelo relacional; Hibernate las usa para dar los id
-- ---------------------------------------------------------------------
CREATE TABLE user_seq     (next_val BIGINT);
CREATE TABLE category_seq (next_val BIGINT);
CREATE TABLE product_seq  (next_val BIGINT);
CREATE TABLE purchase_seq (next_val BIGINT);

INSERT INTO user_seq     VALUES (1001);
INSERT INTO category_seq VALUES (1001);
INSERT INTO product_seq  VALUES (1001);
INSERT INTO purchase_seq VALUES (1);

-- ---------------------------------------------------------------------
-- Datos de ejemplo
-- ---------------------------------------------------------------------
INSERT INTO category (id, nameCategory, parentCategory_id) VALUES
    (1, 'Proteínas',             NULL),
    (2, 'Fuerza y rendimiento',  NULL),
    (3, 'Energía e intensidad',  NULL),
    (4, 'Salud y recuperación',  NULL),
    (5, 'Proteína whey',         1),    -- subcategorías de Proteínas
    (6, 'Proteína vegetal',      1);

INSERT INTO product (id, name, description, brand, imageUrl, price, stock, category_id) VALUES
    (1, 'Whey Protein 1kg',
        'Proteína de suero de leche con 24 g de proteína por toma. Sabor chocolate.',
        'RAJ Nutrition', 'img/products/whey-1kg.webp', 29.99, 50, 5),
    (2, 'Proteína de guisante 1kg',
        'Proteína vegetal apta para veganos. Sabor neutro.',
        'RAJ Nutrition', 'img/products/pea-1kg.webp', 27.99, 30, 6),
    (3, 'Creatina Monohidrato 300g',
        'Creatina monohidrato micronizada, 3 g por toma.',
        'RAJ Nutrition', 'img/products/creatina-300g.webp', 19.99, 80, 2),
    (4, 'Pre-entreno Explosive',
        'Pre-entreno con cafeína y beta-alanina. Sabor frutos rojos.',
        'RAJ Nutrition', 'img/products/preworkout.webp', 24.99, 40, 3),
    (5, 'Omega 3 90 cápsulas',
        'Aceite de pescado con EPA y DHA.',
        'RAJ Nutrition', 'img/products/omega3.webp', 12.99, 60, 4);

-- ---------------------------------------------------------------------
-- Usuarios de prueba (contraseñas en texto plano)
--   admin@raj.com   / admin123  -> ADMIN
--   usuario@raj.com / user123   -> USER
-- ---------------------------------------------------------------------
INSERT INTO `user` (id, firstName, lastName, middleInitial, street, city, state,
                    zip, phone, email, password, role) VALUES
    (1, 'Admin', 'RAJ', 'A', 'Calle Mayor 1', 'Madrid', 'Madrid',
        '28013', '+34 600000001', 'admin@raj.com', 'admin123', 'ADMIN'),
    (2, 'Jaime', 'Ruiz', 'R', 'Calle Gran Vía 10', 'Madrid', 'Madrid',
        '28013', '+34 600000002', 'usuario@raj.com', 'user123', 'USER');

