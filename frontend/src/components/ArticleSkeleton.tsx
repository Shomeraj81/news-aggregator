const ArticleSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 animate-pulse">
      <div className="w-full h-96 bg-gray-300 rounded-xl mb-6" />

      <div className="h-12 bg-gray-300 rounded mb-6 w-3/4" />

      <div className="h-4 bg-gray-300 rounded mb-4 w-1/4" />

      <div className="space-y-4">
        {Array.from({
          length: 10,
        }).map((_, index) => (
          <div
            key={index}
            className="h-4 bg-gray-300 rounded"
          />
        ))}
      </div>
    </div>
  );
};

export default ArticleSkeleton;