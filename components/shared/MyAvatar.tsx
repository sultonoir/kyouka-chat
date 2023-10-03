import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  src: string | null | undefined;
  alt?: string | null | undefined;
  width?: number;
  height?: number;
  fallback?: string;
}

export function MyAvatar({ src, fallback, alt, width, height }: Props) {
  return (
    <Avatar>
      <AvatarImage
        src={src || ""}
        width={width || 24}
        height={height || 24}
        alt={alt || "Profile"}
      />
      <AvatarFallback>{fallback || "K"}</AvatarFallback>
    </Avatar>
  );
}
