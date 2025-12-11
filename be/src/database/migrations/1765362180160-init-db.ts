import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb1765362180160 implements MigrationInterface {
    name = 'InitDb1765362180160'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "teachers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "specialization" character varying(100), "bio" text, "years_of_experience" integer, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "REL_4668d4752e6766682d1be0b346" UNIQUE ("user_id"), CONSTRAINT "PK_a8d4f83be3abe4c687b0a0093c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4668d4752e6766682d1be0b346" ON "teachers" ("user_id") `);
        await queryRunner.query(`CREATE TYPE "public"."classes_status_enum" AS ENUM('active', 'inactive', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "classes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "teacher_id" uuid NOT NULL, "name" character varying(255) NOT NULL, "subject" character varying(100) NOT NULL, "description" text, "day_of_week" integer NOT NULL, "time_slot" character varying(50) NOT NULL, "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "max_students" integer NOT NULL DEFAULT '20', "current_students" integer NOT NULL DEFAULT '0', "status" "public"."classes_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_e207aa15404e9b2ce35910f9f7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_37ca4ff81ecfbdd19c40d6cd80" ON "classes" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_f1dd00404ce4035fe0e04e6adc" ON "classes" ("subject") `);
        await queryRunner.query(`CREATE INDEX "IDX_ca358a5164f1c32edfc02dfdc9" ON "classes" ("day_of_week") `);
        await queryRunner.query(`CREATE INDEX "IDX_b34c92e413c4debb6e0f23fed4" ON "classes" ("teacher_id") `);
        await queryRunner.query(`CREATE TABLE "parents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "address" character varying(500), "occupation" character varying(100), "notes" text, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "REL_c94c3cea9b43a18c81269ded41" UNIQUE ("user_id"), CONSTRAINT "PK_9a4dc67c7b8e6a9cb918938d353" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c94c3cea9b43a18c81269ded41" ON "parents" ("user_id") `);
        await queryRunner.query(`CREATE TYPE "public"."subscriptions_status_enum" AS ENUM('active', 'expired', 'cancelled')`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["nestjs_api","public","subscriptions","GENERATED_COLUMN","remaining_sessions","total_sessions - used_sessions"]);
        await queryRunner.query(`CREATE TABLE "subscriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "student_id" uuid NOT NULL, "package_name" character varying(100) NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "total_sessions" integer NOT NULL, "used_sessions" integer NOT NULL DEFAULT '0', "remaining_sessions" integer GENERATED ALWAYS AS (total_sessions - used_sessions) STORED NOT NULL, "status" "public"."subscriptions_status_enum" NOT NULL DEFAULT 'active', "notes" text, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_75e4d2258bf07a5c2a21ba3195" ON "subscriptions" ("start_date", "end_date") `);
        await queryRunner.query(`CREATE INDEX "IDX_6ccf973355b70645eff37774de" ON "subscriptions" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_dee89f47ca621f441b655c282b" ON "subscriptions" ("student_id") `);
        await queryRunner.query(`CREATE TYPE "public"."students_gender_enum" AS ENUM('male', 'female', 'other')`);
        await queryRunner.query(`CREATE TABLE "students" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "parent_id" uuid NOT NULL, "name" character varying(255) NOT NULL, "dob" date NOT NULL, "gender" "public"."students_gender_enum" NOT NULL, "current_grade" character varying(20), "avatar_url" character varying(500), "notes" text, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_209313beb8d3f51f7ad69214d9" ON "students" ("parent_id") `);
        await queryRunner.query(`CREATE TYPE "public"."class_registrations_status_enum" AS ENUM('active', 'cancelled', 'completed')`);
        await queryRunner.query(`CREATE TABLE "class_registrations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "class_id" uuid NOT NULL, "student_id" uuid NOT NULL, "registration_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "status" "public"."class_registrations_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_4de4990d6c8a968fa129c33f0ec" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_53578fc73ed19cd5569ead2ca0" ON "class_registrations" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_bdc678a309f861bcfd50916209" ON "class_registrations" ("student_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_cd8ae82d50bd0c70302c73ac24" ON "class_registrations" ("class_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_76180e734b05c6b71dce6c9431" ON "class_registrations" ("class_id", "student_id") `);
        await queryRunner.query(`CREATE TYPE "public"."attendances_status_enum" AS ENUM('present', 'absent', 'late')`);
        await queryRunner.query(`CREATE TABLE "attendances" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "class_registration_id" uuid NOT NULL, "subscription_id" uuid NOT NULL, "attendance_date" date NOT NULL, "status" "public"."attendances_status_enum" NOT NULL DEFAULT 'present', "notes" text, "marked_by" uuid, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_483ed97cd4cd43ab4a117516b69" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4cb05e42312bf271450939c361" ON "attendances" ("attendance_date") `);
        await queryRunner.query(`CREATE INDEX "IDX_949ae6e4a50fbda1e99dab8138" ON "attendances" ("subscription_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_66f28c51c1b11510bfac5eda08" ON "attendances" ("class_registration_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_88c0295b3d8ff85559237a268f" ON "attendances" ("class_registration_id", "attendance_date") `);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('parent', 'teacher', 'admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "password_hash" character varying(255) NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'parent', "full_name" character varying(255) NOT NULL, "phone" character varying(20), "avatar_url" character varying(500), "is_active" boolean NOT NULL DEFAULT true, "email_verified" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`ALTER TABLE "teachers" ADD CONSTRAINT "FK_4668d4752e6766682d1be0b346f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "classes" ADD CONSTRAINT "FK_b34c92e413c4debb6e0f23fed46" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "parents" ADD CONSTRAINT "FK_c94c3cea9b43a18c81269ded41d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_dee89f47ca621f441b655c282b4" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_209313beb8d3f51f7ad69214d90" FOREIGN KEY ("parent_id") REFERENCES "parents"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "class_registrations" ADD CONSTRAINT "FK_cd8ae82d50bd0c70302c73ac24a" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "class_registrations" ADD CONSTRAINT "FK_bdc678a309f861bcfd50916209f" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendances" ADD CONSTRAINT "FK_66f28c51c1b11510bfac5eda086" FOREIGN KEY ("class_registration_id") REFERENCES "class_registrations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendances" ADD CONSTRAINT "FK_949ae6e4a50fbda1e99dab8138c" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendances" ADD CONSTRAINT "FK_6614d79de1ca2663f0e1bc97a64" FOREIGN KEY ("marked_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attendances" DROP CONSTRAINT "FK_6614d79de1ca2663f0e1bc97a64"`);
        await queryRunner.query(`ALTER TABLE "attendances" DROP CONSTRAINT "FK_949ae6e4a50fbda1e99dab8138c"`);
        await queryRunner.query(`ALTER TABLE "attendances" DROP CONSTRAINT "FK_66f28c51c1b11510bfac5eda086"`);
        await queryRunner.query(`ALTER TABLE "class_registrations" DROP CONSTRAINT "FK_bdc678a309f861bcfd50916209f"`);
        await queryRunner.query(`ALTER TABLE "class_registrations" DROP CONSTRAINT "FK_cd8ae82d50bd0c70302c73ac24a"`);
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_209313beb8d3f51f7ad69214d90"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_dee89f47ca621f441b655c282b4"`);
        await queryRunner.query(`ALTER TABLE "parents" DROP CONSTRAINT "FK_c94c3cea9b43a18c81269ded41d"`);
        await queryRunner.query(`ALTER TABLE "classes" DROP CONSTRAINT "FK_b34c92e413c4debb6e0f23fed46"`);
        await queryRunner.query(`ALTER TABLE "teachers" DROP CONSTRAINT "FK_4668d4752e6766682d1be0b346f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_88c0295b3d8ff85559237a268f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_66f28c51c1b11510bfac5eda08"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_949ae6e4a50fbda1e99dab8138"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4cb05e42312bf271450939c361"`);
        await queryRunner.query(`DROP TABLE "attendances"`);
        await queryRunner.query(`DROP TYPE "public"."attendances_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_76180e734b05c6b71dce6c9431"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cd8ae82d50bd0c70302c73ac24"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bdc678a309f861bcfd50916209"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_53578fc73ed19cd5569ead2ca0"`);
        await queryRunner.query(`DROP TABLE "class_registrations"`);
        await queryRunner.query(`DROP TYPE "public"."class_registrations_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_209313beb8d3f51f7ad69214d9"`);
        await queryRunner.query(`DROP TABLE "students"`);
        await queryRunner.query(`DROP TYPE "public"."students_gender_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dee89f47ca621f441b655c282b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6ccf973355b70645eff37774de"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_75e4d2258bf07a5c2a21ba3195"`);
        await queryRunner.query(`DROP TABLE "subscriptions"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","remaining_sessions","nestjs_api","public","subscriptions"]);
        await queryRunner.query(`DROP TYPE "public"."subscriptions_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c94c3cea9b43a18c81269ded41"`);
        await queryRunner.query(`DROP TABLE "parents"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b34c92e413c4debb6e0f23fed4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ca358a5164f1c32edfc02dfdc9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f1dd00404ce4035fe0e04e6adc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_37ca4ff81ecfbdd19c40d6cd80"`);
        await queryRunner.query(`DROP TABLE "classes"`);
        await queryRunner.query(`DROP TYPE "public"."classes_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4668d4752e6766682d1be0b346"`);
        await queryRunner.query(`DROP TABLE "teachers"`);
    }

}
