-- DropForeignKey
ALTER TABLE "public"."BlogImage" DROP CONSTRAINT "BlogImage_blogPostId_fkey";

-- DropForeignKey
ALTER TABLE "public"."BlogPost" DROP CONSTRAINT "BlogPost_adminId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ResumeImage" DROP CONSTRAINT "ResumeImage_adminId_fkey";

-- DropForeignKey
ALTER TABLE "public"."YoutubeVideo" DROP CONSTRAINT "YoutubeVideo_adminId_fkey";

-- AddForeignKey
ALTER TABLE "public"."ResumeImage" ADD CONSTRAINT "ResumeImage_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlogPost" ADD CONSTRAINT "BlogPost_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlogImage" ADD CONSTRAINT "BlogImage_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "public"."BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YoutubeVideo" ADD CONSTRAINT "YoutubeVideo_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
