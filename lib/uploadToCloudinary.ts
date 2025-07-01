export async function uploadToCloudinary(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    console.error('Cloudinary upload failed');
    return null;
  }

  const data = await res.json();
  return data.secure_url; // The final image/video/document URL
}
