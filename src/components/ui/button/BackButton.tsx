import { ChevronLeft } from "@/utils/icons";
import IconButton from "./IconButton";

export interface BackButtonProps {
  href?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ href = "/" }) => {
  return <IconButton icon={<ChevronLeft />} iconSize={32} variant="light" href={href} />;
};

export default BackButton;
