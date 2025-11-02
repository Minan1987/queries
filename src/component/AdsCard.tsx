import type { Advertise } from "../interface/models";

interface AdsCardProps {
  ads: Advertise;
  onEdit?: (ad: Advertise) => void;
}

const AdsCard = ({ ads, onEdit }: AdsCardProps) => {
  return (
    <div className="card bg-base-100 w-full shadow-sm mb-4">
      <figure className="relative">
        <img
          src={ads.image}
          alt={ads.title}
          style={{ width: "100%", height: "200px", objectFit: "cover" }}
        />
        <div className="badge badge-error absolute top-0 right-0">
          {ads.ad_type}
        </div>
      </figure>
      <div className="card-body">
        <h2 className="card-title">{ads.title}</h2>
        <p className="truncate">{ads.description}</p>
        <div className="flex card-actions justify-between items-center">
          <button
            className="btn btn-outline btn-warning"
            onClick={() => onEdit?.(ads)}
          >
            ویرایش
          </button>
          <button className="btn btn-skybtn btn-outline btn-info">
            افزودن
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdsCard;
