--CREATE TABLE users(
--	user_id UUID NOT NULL PRIMARY KEY,
--	name VARCHAR(50) NOT NULL,
--	age INTEGER NOT NULL,
--	gender VARCHAR(50) NOT NULL,
--	status BOOLEAN NOT NULL,
--	creationTimestamp VARCHAR(50) NOT NULL,
--	modificationTimestamp VARCHAR(50)
--)

--INSERT INTO users(user_id, name, age, gender, status, creationTimestamp) 
--VALUES (uuid_generate_v4(), 'aaaa', 32, 'male', false, '2023-07-12T15:45:37.008Z'),
--	   (uuid_generate_v4(), 'bbbb', 22, 'female', false, '2023-07-12T15:45:37.008Z'),
--	   (uuid_generate_v4(), 'cccc', 55, 'male', false, '2023-07-12T15:45:37.008Z')




CREATE TABLE posts (
  post_id UUID NOT NULL PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) NOT NULL,
  post_title VARCHAR(255) NOT NULL,
  post_content VARCHAR(255) NOT NULL,
  creationtimestamp DATE NOT NULL,
  updatetimestamp DATE
);

INSERT INTO posts(post_id , user_id, post_title , post_content, creationtimestamp) 
VALUES (uuid_generate_v4(), '9fa95109-e524-4a09-bd48-bf4996b4ad52', 'title1', 'content1', '2023-07-25T15:45:37.008Z')
