-- initialize database with some sample trains
CREATE DATABASE IF NOT EXISTS train_db;
USE train_db;

CREATE TABLE IF NOT EXISTS train_schedule (
  id INT AUTO_INCREMENT PRIMARY KEY,
  train_number VARCHAR(50),
  departure_station VARCHAR(100),
  arrival_station VARCHAR(100),
  departure_time VARCHAR(10),
  arrival_time VARCHAR(10)
);

INSERT INTO train_schedule (train_number, departure_station, arrival_station, departure_time, arrival_time)
VALUES
('101', 'Bangkok', 'Chiang Mai', '08:00', '18:00'),
('201', 'Bangkok', 'Nakhon Ratchasima', '09:00', '12:30');
