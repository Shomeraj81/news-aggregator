import SkeletonCard
from "./SkeletonCard";

const FeedSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({
        length: 8,
      }).map((_, index) => (
        <SkeletonCard
          key={index}
        />
      ))}
    </div>
  );
};

export default FeedSkeleton;