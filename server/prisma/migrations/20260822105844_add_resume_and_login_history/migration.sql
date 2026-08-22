-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "resumeSummary" TEXT;
