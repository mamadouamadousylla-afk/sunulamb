-- Seed data from existing frontend hardcoded values

-- Arenas
INSERT INTO arenas (name, address, city, latitude, longitude, capacity, image_url, is_active)
VALUES
  ('Arene Nationale', 'Pikine, Dakar', 'Dakar', 14.7645, -17.3907, 20000, '/images/arene-nationale.jpg', true),
  ('Stade Demba Diop', 'Avenue Malick Sy, Dakar', 'Dakar', 14.6937, -17.4441, 15000, '/images/demba-diop.jpg', true),
  ('Stade Leopold Sedar Senghor', 'Route de la Corniche, Dakar', 'Dakar', 14.7063, -17.4712, 60000, '/images/lss.jpg', true),
  ('Arene de Mbour', 'Centre-ville, Mbour', 'Mbour', 14.4167, -16.9667, 8000, '/images/arene-mbour.jpg', true)
ON CONFLICT DO NOTHING;

-- Fighters
INSERT INTO fighters (name, nickname, wins, losses, height, weight, image_url, bio, ecurie, is_active)
VALUES
  ('Modou Lo', 'Le Roi des Arenes', 35, 2, '1.88m', '120kg', '/images/fighters/modou-lo.jpg', 'Roi des arenes en titre, leader inconteste de la lutte senegalaise.', 'Rock Energie', true),
  ('Balla Gaye 2', 'Le Lion de Guediawaye', 30, 5, '1.85m', '115kg', '/images/fighters/balla-gaye.jpg', 'Un des plus grands lutteurs de sa generation.', 'Baol Mbollo', true),
  ('Bombardier', 'Le Bombardier', 28, 7, '1.92m', '130kg', '/images/fighters/bombardier.jpg', 'Force brute et technique, le Bombardier fait trembler les arenes.', 'Ecurie Fass', true),
  ('Eumeu Sene', 'Le Tarkinda', 25, 8, '1.90m', '125kg', '/images/fighters/eumeu-sene.jpg', 'Le Tarkinda de Pikine, determination sans faille.', 'Tay Shinger', true),
  ('Boy Niang 2', 'Le Faucon', 20, 4, '1.86m', '118kg', '/images/fighters/boy-niang.jpg', 'Jeune talent montant avec une technique exceptionnelle.', 'Ecurie de Niari Tally', true),
  ('Lac de Guiers 2', 'Le Crocodile', 22, 6, '1.84m', '110kg', '/images/fighters/lac-guiers.jpg', 'Agilite et ruse, le Crocodile du lac.', 'Ecurie Ndakaru', true),
  ('Ama Balde', 'Le Roi du Pakao', 18, 3, '1.87m', '116kg', '/images/fighters/ama-balde.jpg', 'Dominant dans le sud, Ama Balde monte a Dakar.', 'Kolda FC', true),
  ('Tapha Tine', 'Le Geant', 24, 5, '1.95m', '135kg', '/images/fighters/tapha-tine.jpg', 'Le geant imposant qui ecrase tout sur son passage.', 'Ecurie Fass', true)
ON CONFLICT DO NOTHING;

-- Events
INSERT INTO events (title, slug, date, time, location, address, description, image_url, status, category, is_featured, arena_id)
VALUES
  ('Modou Lo vs Balla Gaye 2', 'modou-lo-vs-balla-gaye-2', '2026-04-15', '16:00', 'Arene Nationale', 'Pikine, Dakar', 'Le combat du siecle entre le Roi des Arenes et le Lion de Guediawaye. Un affrontement historique qui marquera la lutte senegalaise.', '/images/events/modou-balla.jpg', 'published', 'Lutte avec frappe', true, 1),
  ('Grand Gala de Guediawaye', 'grand-gala-guediawaye', '2026-05-20', '15:00', 'Stade Demba Diop', 'Avenue Malick Sy, Dakar', 'Un gala exceptionnel avec 8 combats de haut niveau. Les meilleurs lutteurs de Guediawaye se retrouvent.', '/images/events/gala-guediawaye.jpg', 'published', 'Gala de lutte', true, 2),
  ('Bombardier vs Eumeu Sene', 'bombardier-vs-eumeu-sene', '2026-06-10', '16:30', 'Arene Nationale', 'Pikine, Dakar', 'Revanche tant attendue entre deux legendes de la lutte.', '/images/events/bombardier-eumeu.jpg', 'published', 'Lutte avec frappe', false, 1),
  ('Tournoi des Espoirs', 'tournoi-des-espoirs', '2026-07-05', '14:00', 'Arene de Mbour', 'Centre-ville, Mbour', 'Les jeunes talents de demain s''affrontent dans ce tournoi regional. Decouvrez les futurs champions.', '/images/events/tournoi-espoirs.jpg', 'draft', 'Lutte simple', false, 4)
ON CONFLICT DO NOTHING;

-- Event-Fighter assignments
INSERT INTO event_fighters (event_id, fighter_id, corner)
VALUES
  (1, 1, 1), -- Modou Lo corner 1
  (1, 2, 2), -- Balla Gaye 2 corner 2
  (2, 5, 1), -- Boy Niang 2
  (2, 6, 2), -- Lac de Guiers 2
  (3, 3, 1), -- Bombardier corner 1
  (3, 4, 2), -- Eumeu Sene corner 2
  (4, 7, 1), -- Ama Balde
  (4, 8, 2)  -- Tapha Tine
ON CONFLICT DO NOTHING;

-- Ticket categories for events
INSERT INTO ticket_categories (event_id, name, price, color, total_seats, available_seats)
VALUES
  -- Modou Lo vs Balla Gaye 2
  (1, 'VIP', 25000, '#FFD700', 500, 127),
  (1, 'Tribune', 10000, '#60A5FA', 2000, 845),
  (1, 'Pelouse', 5000, '#34D399', 5000, 3200),
  -- Grand Gala de Guediawaye
  (2, 'VIP', 20000, '#FFD700', 300, 300),
  (2, 'Tribune', 8000, '#60A5FA', 1500, 1500),
  (2, 'Pelouse', 3000, '#34D399', 4000, 4000),
  -- Bombardier vs Eumeu Sene
  (3, 'VIP', 20000, '#FFD700', 400, 400),
  (3, 'Tribune', 8000, '#60A5FA', 1800, 1800),
  (3, 'Pelouse', 4000, '#34D399', 4500, 4500),
  -- Tournoi des Espoirs
  (4, 'VIP', 10000, '#FFD700', 200, 200),
  (4, 'Tribune', 5000, '#60A5FA', 1000, 1000),
  (4, 'Pelouse', 2000, '#34D399', 3000, 3000)
ON CONFLICT DO NOTHING;

-- Sample users
INSERT INTO users (full_name, phone, email, points, level, referral_code)
VALUES
  ('Mamadou Diallo', '+221 77 123 4567', 'mamadou@example.com', 450, 'Supporter', 'MDIALLO01'),
  ('Fatou Sow', '+221 78 234 5678', 'fatou@example.com', 1200, 'Fan', 'FSOW02'),
  ('Ousmane Ndiaye', '+221 76 345 6789', 'ousmane@example.com', 2500, 'Superfan', 'ONDIAYE03'),
  ('Awa Ba', '+221 77 456 7890', 'awa@example.com', 800, 'Supporter', 'ABA04'),
  ('Ibrahima Fall', '+221 78 567 8901', 'ibrahima@example.com', 100, 'Debutant', 'IFALL05')
ON CONFLICT DO NOTHING;

-- Sample tickets
INSERT INTO tickets (ticket_number, user_id, event_id, category_id, quantity, qr_code, gate, status)
VALUES
  ('TK-2026-001', 1, 1, 1, 2, 'QR-TK-2026-001', 'Porte A - VIP', 'valid'),
  ('TK-2026-002', 2, 1, 2, 1, 'QR-TK-2026-002', 'Porte B - Tribune', 'valid'),
  ('TK-2026-003', 3, 1, 3, 4, 'QR-TK-2026-003', 'Porte C - Pelouse', 'valid'),
  ('TK-2026-004', 4, 1, 2, 2, 'QR-TK-2026-004', 'Porte B - Tribune', 'used'),
  ('TK-2026-005', 1, 2, 4, 1, 'QR-TK-2026-005', 'Porte A - VIP', 'valid'),
  ('TK-2026-006', 5, 1, 3, 1, 'QR-TK-2026-006', 'Porte C - Pelouse', 'cancelled')
ON CONFLICT DO NOTHING;

-- Sample payments
INSERT INTO payments (ticket_id, user_id, amount, method, status, phone, full_name, transaction_ref)
VALUES
  (1, 1, 50000, 'wave', 'completed', '+221 77 123 4567', 'Mamadou Diallo', 'TXN-WAVE-001'),
  (2, 2, 10000, 'orange_money', 'completed', '+221 78 234 5678', 'Fatou Sow', 'TXN-OM-002'),
  (3, 3, 20000, 'wave', 'completed', '+221 76 345 6789', 'Ousmane Ndiaye', 'TXN-WAVE-003'),
  (4, 4, 20000, 'free_money', 'completed', '+221 77 456 7890', 'Awa Ba', 'TXN-FM-004'),
  (5, 1, 20000, 'wave', 'pending', '+221 77 123 4567', 'Mamadou Diallo', 'TXN-WAVE-005'),
  (6, 5, 5000, 'orange_money', 'failed', '+221 78 567 8901', 'Ibrahima Fall', 'TXN-OM-006')
ON CONFLICT DO NOTHING;

-- Sample challenges
INSERT INTO challenges (event_id, title, points_reward, is_active)
VALUES
  (1, 'Qui va gagner: Modou Lo vs Balla Gaye 2?', 500, true),
  (3, 'Qui va gagner: Bombardier vs Eumeu Sene?', 300, true)
ON CONFLICT DO NOTHING;

-- Sample notifications
INSERT INTO notifications (user_id, title, message, type, is_read)
VALUES
  (1, 'Billet confirme', 'Votre billet pour Modou Lo vs Balla Gaye 2 a ete confirme.', 'ticket', true),
  (2, 'Nouvel evenement', 'Le Grand Gala de Guediawaye est maintenant disponible!', 'info', false),
  (NULL, 'Promo exclusive', 'Profitez de -20% sur les billets Tribune ce weekend!', 'promo', false),
  (3, 'Defi actif', 'Un nouveau defi est disponible pour le combat Modou Lo vs Balla Gaye 2.', 'info', false),
  (1, 'Points gagnes', 'Vous avez gagne 50 points pour votre achat de billets!', 'system', true)
ON CONFLICT DO NOTHING;
