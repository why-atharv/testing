import { useEffect, useState } from "react";

/** Creates an object URL for a Blob and revokes it when the Blob changes or the component unmounts. */
export function usePhotoUrl(photo: Blob | null) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!photo) {
      setUrl(null);
      return;
    }
    const next = URL.createObjectURL(photo);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [photo]);
  return url;
}
