import React from "react";

const UserAvatar = ({ user, size = "md" }) => {
    const sizeClasses = {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-16 h-16 text-xl",
    };

    return (
        <div
            className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center font-black uppercase`}
        >
            {user?.name?.charAt(0) || "?"}
        </div>
    );
};

export default UserAvatar;
