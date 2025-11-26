import React from 'react';

const Loading = ({ 
  fullScreen = false, 
  text = '로딩 중...',
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };
  
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* 로딩 스피너 */}
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 border-4 border-ajou-light rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-ajou-primary rounded-full animate-spin" />
      </div>
      
      {/* 로딩 텍스트 */}
      {text && (
        <p className="text-gray-500 text-sm font-medium">{text}</p>
      )}
    </div>
  );
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  );
};

// 스켈레톤 로더
export const Skeleton = ({ className = '', variant = 'rect' }) => {
  const baseClasses = 'animate-pulse bg-gray-200';
  
  const variants = {
    rect: 'rounded-lg',
    circle: 'rounded-full',
    text: 'rounded h-4',
  };
  
  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} />
  );
};

// 메뉴 카드 스켈레톤
export const MenuCardSkeleton = () => (
  <div className="card flex gap-4">
    <Skeleton className="w-24 h-24 rounded-xl flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="text" className="w-1/2" />
      <Skeleton variant="text" className="w-1/4 mt-4" />
    </div>
  </div>
);

// 카페 카드 스켈레톤
export const CafeCardSkeleton = () => (
  <div className="card">
    <Skeleton className="w-full h-40 rounded-xl mb-4" />
    <Skeleton variant="text" className="w-2/3 mb-2" />
    <Skeleton variant="text" className="w-1/3" />
  </div>
);

export default Loading;
