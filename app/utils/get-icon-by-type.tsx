import { Hash, Phone, Video } from "lucide-react";

export function getIconByType(type: "AUDIO" | "VIDEO" | "TEXT") {
  switch (type) {
    case "TEXT":
      return <Hash />;
    case "AUDIO":
      return <Phone />;
    default:
      return <Video />;
  }
}
