import type { Advertise } from "../interface/models";
import AdsCard from "./AdsCard";

interface AdsListProps {
  adsList: Advertise[];
  onEdit?: (ad: Advertise) => void;
}

const AdsList = ({ adsList, onEdit }: AdsListProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {adsList.map((ads) => (
        <AdsCard ads={ads} key={ads.id} onEdit={onEdit} />
      ))}
    </div>
  );
};

export default AdsList;
