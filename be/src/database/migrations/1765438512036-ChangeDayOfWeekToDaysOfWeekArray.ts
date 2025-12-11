import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeDayOfWeekToDaysOfWeekArray1765438512036
  implements MigrationInterface
{
  name = 'ChangeDayOfWeekToDaysOfWeekArray1765438512036';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ca358a5164f1c32edfc02dfdc9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "classes" RENAME COLUMN "day_of_week" TO "days_of_week"`,
    );
    await queryRunner.query(`ALTER TABLE "classes" DROP COLUMN "days_of_week"`);
    await queryRunner.query(
      `ALTER TABLE "classes" ADD "days_of_week" integer array NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."classes_status_enum" RENAME TO "classes_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."classes_status_enum" AS ENUM('active', 'inactive', 'cancelled', 'completed')`,
    );
    await queryRunner.query(
      `ALTER TABLE "classes" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "classes" ALTER COLUMN "status" TYPE "public"."classes_status_enum" USING "status"::"text"::"public"."classes_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "classes" ALTER COLUMN "status" SET DEFAULT 'active'`,
    );
    await queryRunner.query(`DROP TYPE "public"."classes_status_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."subscriptions_status_enum" RENAME TO "subscriptions_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."subscriptions_status_enum" AS ENUM('active', 'expired', 'cancelled', 'completed')`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ALTER COLUMN "status" TYPE "public"."subscriptions_status_enum" USING "status"::"text"::"public"."subscriptions_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ALTER COLUMN "status" SET DEFAULT 'active'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."subscriptions_status_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."subscriptions_status_enum_old" AS ENUM('active', 'expired', 'cancelled')`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ALTER COLUMN "status" TYPE "public"."subscriptions_status_enum_old" USING "status"::"text"::"public"."subscriptions_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ALTER COLUMN "status" SET DEFAULT 'active'`,
    );
    await queryRunner.query(`DROP TYPE "public"."subscriptions_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."subscriptions_status_enum_old" RENAME TO "subscriptions_status_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."classes_status_enum_old" AS ENUM('active', 'inactive', 'cancelled')`,
    );
    await queryRunner.query(
      `ALTER TABLE "classes" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "classes" ALTER COLUMN "status" TYPE "public"."classes_status_enum_old" USING "status"::"text"::"public"."classes_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "classes" ALTER COLUMN "status" SET DEFAULT 'active'`,
    );
    await queryRunner.query(`DROP TYPE "public"."classes_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."classes_status_enum_old" RENAME TO "classes_status_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "classes" DROP COLUMN "days_of_week"`);
    await queryRunner.query(
      `ALTER TABLE "classes" ADD "days_of_week" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "classes" RENAME COLUMN "days_of_week" TO "day_of_week"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ca358a5164f1c32edfc02dfdc9" ON "classes" ("day_of_week") `,
    );
  }
}
