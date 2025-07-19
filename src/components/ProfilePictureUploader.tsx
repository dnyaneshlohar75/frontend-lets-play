import { uploadProfilePicture } from "@/actions/user";
import { Button } from "@heroui/button";
import { useRef, useState } from "react";
import { TbCloudUpload } from "react-icons/tb";

const ProfilePictureUploader = () => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");

  const CLOUD_NAME = "debltzrg8";
  const UPLOAD_PRESET = "profie_images";
  const UPLOAD_FOLDER = "user_profile_images";

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL?.createObjectURL(selected));
      setUrl("");
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", UPLOAD_FOLDER);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        setUrl(data.secure_url);

        await uploadProfilePicture(data.secure_url);
      } else {
        alert("Upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4">
      <div className="bg-white rounded-xl p-8 max-w-md w-full space-y-6">

        <div
          onClick={() => fileInputRef.current.click()}
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 transition"
        >
          {preview ? (
            <img src={preview} alt="Preview" className="h-full object-contain" />
          ) : (
            <p className="text-gray-500">Click to select an image</p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        
        <Button
          onPress={handleUpload}
          disabled={!file || uploading}
          startContent = {<TbCloudUpload size={22} />}
          className="cursor-pointer w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition"
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>

        {url && (
          <div className="text-sm text-green-600 text-center">
            Uploaded! <a href={url} target="_blank" rel="noopener noreferrer" className="underline">View</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePictureUploader;
