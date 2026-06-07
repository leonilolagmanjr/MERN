import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CircleUserRound } from "lucide-react";

const UserLink = ({ userId, name, className = "" }) => {
  const { user } = useAuth();

  const isOwn = userId === user?.id;
  const displayName = isOwn ? name : name || "Unknown";

  if (!userId) {
    return (
      <span className={`inline font-medium text-[#A27B5C] ${className}`}>
        {displayName}
      </span>
    );
  }

  return (
    <Link to={`/profile/${userId}`} className="inline-block no-underline ">
      <div className="flex items-center  rounded-lg px-5 py-2 transition-colors  hover:text-[#C08A5D] hover:bg-white/5">
        <CircleUserRound className="inline mr-2" size={24} />
        <span
          className={`
          inline
          text-sm
          text-white
          transition-colors
          hover:text-[#DCD7C9]
          border-b-2 border-transparent
    ]

          ${className}
        `}
        >
          {displayName}
        </span>
      </div>
    </Link>
  );
};

export default UserLink;
