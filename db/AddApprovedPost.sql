DROP PROCEDURE IF EXISTS steemmak_steemmakers.AddApprovedPost;

CREATE
PROCEDURE steemmak_steemmakers.AddApprovedPost(IN authorName VARCHAR(50), IN permlink VARCHAR(1000), IN categoryName VARCHAR(45), IN discovererName VARCHAR(50), IN reviewerName VARCHAR(50),IN assignedKeywords VARCHAR(1000))
BEGIN
	BEGIN
		DROP TABLE IF EXISTS errors;
		CREATE TEMPORARY TABLE errors(error INT)ENGINE=MEMORY;
	END;
	BEGIN
		DECLARE hasErrors BOOLEAN DEFAULT FALSE;
		DECLARE categoryID int DEFAULT 0;
		DECLARE authorID int DEFAULT 0;
		DECLARE discovererID int DEFAULT NULL;
		DECLARE reviewerID int DEFAULT 0;
		declare approvedPostID int default null;
		
		# Check reviewer
		SELECT reviewers.id INTO reviewerID
			FROM reviewers
			INNER JOIN users ON reviewers.user_id=users.id
			WHERE name = reviewerName AND enabled = TRUE;
		
		IF (reviewerID = 0) THEN
			INSERT INTO errors VALUES(1);
		END IF;
		
		# Check category
		SELECT id INTO categoryID
			FROM categories
			WHERE name = categoryName;
		
		IF (categoryID = 0) THEN
			INSERT INTO errors VALUES(2);
		END IF; 
		
		SELECT COUNT(*) > 0 INTO hasErrors FROM errors;
		
		IF hasErrors THEN
			SELECT * FROM errors;
		ELSE  
			# Author
			SELECT id INTO authorID FROM users WHERE name = authorName;
			IF authorID = 0 THEN
				INSERT INTO users(name) VALUES(authorName);
				SELECT LAST_INSERT_ID() INTO authorID;
			END IF;
			
			# Discoverer
			IF (discovererName IS NOT NULL) THEN
				SELECT id INTO discovererID FROM users WHERE name = discovererName;
				IF discovererID = 0 THEN
					INSERT INTO users(name) VALUES(discovererName);
					SELECT LAST_INSERT_ID() INTO discovererID;
				END IF;
			END IF;
			
			INSERT INTO approved_posts(author_id, permlink, discoverer_id, category_id, reviewer_id, reviewed_on)
				VALUES(authorID, permlink, discovererID, categoryID, reviewerID, NOW());
			
			SELECT LAST_INSERT_ID() INTO approvedPostID;
			
			INSERT INTO approved_posts_keywords (approved_posts_id, keywords_id)
				SELECT approvedPostID, id FROM keywords
				WHERE FIND_IN_SET(name, assignedKeywords) > 0;
		
		END IF; 
	END; 
END