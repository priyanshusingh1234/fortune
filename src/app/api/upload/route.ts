import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate image type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPG, PNG, WEBP, GIF, and SVG images are allowed." },
        { status: 400 }
      );
    }

    // Limit size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image file is too large. Maximum size is 5MB per image." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "png";
    const cleanFileName = `screenshot_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

    // 1. Try uploading to Supabase Storage bucket 'fortune-screenshots'
    try {
      const { data, error } = await supabase.storage
        .from("fortune-screenshots")
        .upload(cleanFileName, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (!error && data?.path) {
        const { data: urlData } = supabase.storage
          .from("fortune-screenshots")
          .getPublicUrl(data.path);

        if (urlData?.publicUrl) {
          return NextResponse.json({
            success: true,
            url: urlData.publicUrl,
            storage: "supabase",
            fileName: cleanFileName,
          });
        }
      }
    } catch (supaErr) {
      console.warn("Supabase bucket upload attempt failed, falling back to local storage:", supaErr);
    }

    // 2. Fallback: Save to public/uploads directory for seamless local and production dev
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, cleanFileName);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${cleanFileName}`,
      storage: "local",
      fileName: cleanFileName,
    });
  } catch (err: any) {
    console.error("Upload handler error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to upload image file." },
      { status: 500 }
    );
  }
}

