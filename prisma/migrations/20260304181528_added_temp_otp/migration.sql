-- CreateTable
CREATE TABLE "tempOtp" (
    "id" SERIAL NOT NULL,
    "otp" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,

    CONSTRAINT "tempOtp_pkey" PRIMARY KEY ("id")
);
