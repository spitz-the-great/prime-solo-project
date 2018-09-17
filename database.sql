CREATE TABLE person (
    id SERIAL PRIMARY KEY,
    username VARCHAR (80) UNIQUE NOT NULL,
    password VARCHAR (1000) NOT NULL
);



CREATE TABLE "user_profile" (
	"profile_id" serial NOT NULL,
	"privacy_setting" varchar(24) NOT NULL,
	"user_id" integer NOT NULL,
	CONSTRAINT user_profile_pk PRIMARY KEY ("profile_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "friends" (
	"friends_id" serial NOT NULL,
	"user1_id" integer NOT NULL,
	"user2_id" integer NOT NULL,
	CONSTRAINT friends_pk PRIMARY KEY ("friends_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "friend_requests" (
	"request_id" serial NOT NULL,
	"request_date" DATE NOT NULL DEFAULT 'now()',
	"approved_date" DATE NOT NULL DEFAULT 'now()',
	"approved" BOOLEAN NOT NULL,
	"from_user_id" integer NOT NULL,
	"to_user_id" integer NOT NULL,
	CONSTRAINT friend_requests_pk PRIMARY KEY ("request_id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_fk0" FOREIGN KEY ("user_id") REFERENCES "person"("id");

ALTER TABLE "friends" ADD CONSTRAINT "friends_fk0" FOREIGN KEY ("user1_id") REFERENCES "person"("id");
ALTER TABLE "friends" ADD CONSTRAINT "friends_fk1" FOREIGN KEY ("user2_id") REFERENCES "person"("id");

ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_fk0" FOREIGN KEY ("from_user_id") REFERENCES "person"("id");
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_fk1" FOREIGN KEY ("to_user_id") REFERENCES "person"("id");
