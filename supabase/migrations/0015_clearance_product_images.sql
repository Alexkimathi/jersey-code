-- Add images to clearance sale products

alter table products disable trigger trg_enforce_product_update;

update products set image_url = 'https://www.tudnfanshop.com/cdn/shop/files/E4LXLLwt_RRW.png?v=1726766421'
where name = 'Barcelona Home Jersey 2023/24';

update products set
  image_url   = 'https://aztecasoccer.com/cdn/shop/files/nike-mens-fc-barcelona-2023-24-away-jersey-white-red-blue-front.jpg?v=1695233458',
  description = 'Previous season away kit in white — Nike 2023/24 Barcelona away jersey.'
where name = 'Barcelona Away Jersey 2023/24';

update products set image_url = 'https://aztecasoccer.com/cdn/shop/files/adidas-mens-real-madrid-2023-24-authentic-home-jersey-white-black-front.jpg?v=1687457157'
where name = 'Real Madrid Home Jersey 2023/24';

update products set
  image_url   = 'https://soccerzone.shop/cdn/shop/products/Real_Madrid_22-23_Away_Jersey_Purple_H18489_21_model.jpg?v=1678733784',
  description = 'Previous season purple away kit — Adidas 2022/23 Real Madrid away jersey.'
where name = 'Real Madrid Away Jersey 2023/24';

update products set image_url = 'https://soccerzone.shop/cdn/shop/products/H39900_1_APPAREL_Photography_FrontView_transparent.png?v=1657910907'
where name = 'Bayern Munich Home Jersey 2022/23';

update products set
  image_url   = 'https://aztecasoccer.com/cdn/shop/products/adidas-mens-juventus-2022-23-away-jersey-black-white-front.jpg?v=1658933484',
  description = 'All-black away kit from the 2022/23 season — limited stock remaining.'
where name = 'Juventus Away Jersey 2022/23';

update products set image_url = 'https://soccerzone.shop/cdn/shop/products/765834_02_mod01.png?v=1661451083'
where name = 'AC Milan Away Jersey 2022/23';

update products set
  image_url   = 'https://www.prosoccer.com/cdn/shop/files/nike-2023-inter-milan-youth-third-jersey-yellow-black-blue-4086175.webp?v=1767650894',
  description = 'Yellow third-kit from the 2022/23 season — now at clearance price.'
where name = 'Inter Milan Third Jersey 2022/23';

update products set image_url = 'https://footballfashion.org/wordpress/wp-content/uploads/2022/07/borussia-dortmund-2022-2023-puma-away-kit-1.jpg'
where name = 'Borussia Dortmund Away Jersey 2022/23';

update products set image_url = 'https://footballfashion.org/wordpress/wp-content/uploads/2022/08/SSC-Napoli-2022-2023-EA7-Third-Kit-3.jpg'
where name = 'Napoli Third Jersey 2022/23';

alter table products enable trigger trg_enforce_product_update;
