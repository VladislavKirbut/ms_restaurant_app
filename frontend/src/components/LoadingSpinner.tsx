export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-gray-medium rounded-full"></div>
        <div className="absolute inset-0 border-4 border-accent rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
};
