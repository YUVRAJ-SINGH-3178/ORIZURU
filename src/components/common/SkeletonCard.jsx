import React from "react";

const SkeletonCard = () => (
    <div className="aspect-[2/3] bg-white/5 rounded-[24px] md:rounded-[32px] overflow-hidden animate-pulse">
        <div className="h-full w-full bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-4 md:p-6">
            <div className="h-3 w-16 bg-white/10 rounded mb-2" />
            <div className="h-6 w-full bg-white/10 rounded mb-2" />
            <div className="h-3 w-24 bg-white/10 rounded" />
        </div>
    </div>
);

export default SkeletonCard;
