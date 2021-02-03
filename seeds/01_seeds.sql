INSERT INTO users (id, name, email, password) VALUES (1, 'Eva Stanley', 'sebastianguerra@ymail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');
INSERT INTO users (id, name, email, password) VALUES (2, 'Louisa Meyer', 'jacksonrose@gmx.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');
INSERT INTO users (id, name, email, password) VALUES (3, 'Eva Stanley', 'victoriablack@outlook.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');
INSERT INTO users (id, name, email, password) VALUES (4, 'Eva Stanley', 'jasonvincent@hmai.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');
INSERT INTO users (id, name, email, password) VALUES (5, 'Eva Stanley', 'jacksondavi@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');
INSERT INTO users (id, name, email, password) VALUES (6, 'Eva Stanley', 'makaylaweiss@icloud.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO reservations (id, start_date, end_date, property_id, guest_id) VALUES (1, '2018-09-11','2018-09-17', 1, 2);
INSERT INTO reservations (id, start_date, end_date, property_id, guest_id) VALUES (2, '2019-07-11','2019-07-17', 6, 3);
INSERT INTO reservations (id, start_date, end_date, property_id, guest_id) VALUES (3, '2018-02-11','2018-03-10', 4, 4);
INSERT INTO reservations (id, start_date, end_date, property_id, guest_id) VALUES (4, '2017-02-11','2017-02-23', 3, 5);
INSERT INTO reservations (id, start_date, end_date, property_id, guest_id) VALUES (5, '2020-01-01','2020-02-17', 2, 6);
INSERT INTO reservations (id, start_date, end_date, property_id, guest_id) VALUES (6,'2019-11-10','2019-11-17', 5, 1);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) VALUES (2, 3, 1, 5, 'messages');
INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) VALUES (1, 2, 2, 5, 'messages');
INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) VALUES (3, 1, 3, 5, 'messages');
INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) VALUES (5, 4, 4, 5, 'messages');
INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) VALUES (6, 5, 5, 5, 'messages');
INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) VALUES (4, 6, 6, 5, 'messages');