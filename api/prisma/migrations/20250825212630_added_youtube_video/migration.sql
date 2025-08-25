-- CreateTable
CREATE TABLE "public"."YoutubeVideo" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "adminId" INTEGER,

    CONSTRAINT "YoutubeVideo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."YoutubeVideo" ADD CONSTRAINT "YoutubeVideo_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
