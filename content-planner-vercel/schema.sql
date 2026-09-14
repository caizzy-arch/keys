CREATE TABLE IF NOT EXISTS content (id text PRIMARY KEY,payload text NOT NULL,updated text NOT NULL);
CREATE TABLE IF NOT EXISTS feedback (id text PRIMARY KEY,content_id text NOT NULL REFERENCES content(id) ON DELETE CASCADE,user_id text NOT NULL,author text NOT NULL,text text NOT NULL,created_at text NOT NULL);
CREATE TABLE IF NOT EXISTS reviews (id text PRIMARY KEY,content_id text NOT NULL REFERENCES content(id) ON DELETE CASCADE,user_id text NOT NULL,author text NOT NULL,decision text NOT NULL,created_at text NOT NULL);
CREATE INDEX IF NOT EXISTS feedback_content_id ON feedback(content_id);
CREATE INDEX IF NOT EXISTS reviews_content_id ON reviews(content_id);
