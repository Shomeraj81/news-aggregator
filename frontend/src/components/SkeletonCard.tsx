const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-52 bg-gray-300" />

      <div className="p-4">
        <div className="h-4 bg-gray-300 rounded mb-3 w-1/3" />

        <div className="h-6 bg-gray-300 rounded mb-3 w-full" />

        <div className="h-4 bg-gray-300 rounded mb-2 w-full" />

        <div className="h-4 bg-gray-300 rounded w-3/4" />
      </div>
    </div>
  );
};

export default SkeletonCard;