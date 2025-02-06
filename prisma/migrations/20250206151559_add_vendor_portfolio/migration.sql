-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "portfolioItemId" UUID;

-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "portfolioItemId" UUID;

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "vendorId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioItem" (
    "id" UUID NOT NULL,
    "publicId" TEXT NOT NULL,
    "portfolioId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "media" JSONB NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_publicId_key" ON "Portfolio"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_vendorId_key" ON "Portfolio"("vendorId");

-- CreateIndex
CREATE INDEX "Portfolio_vendorId_idx" ON "Portfolio"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioItem_publicId_key" ON "PortfolioItem"("publicId");

-- CreateIndex
CREATE INDEX "PortfolioItem_portfolioId_idx" ON "PortfolioItem"("portfolioId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_portfolioItemId_fkey" FOREIGN KEY ("portfolioItemId") REFERENCES "PortfolioItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_portfolioItemId_fkey" FOREIGN KEY ("portfolioItemId") REFERENCES "PortfolioItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioItem" ADD CONSTRAINT "PortfolioItem_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
