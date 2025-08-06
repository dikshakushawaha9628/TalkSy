// import { Link } from "react-router";
// import { BriefcaseBusiness, MapPin } from "lucide-react";
// import me from "../../public/img.png";

// const FriendCard = ({ friend }) => {
//     return (
//         <div className="card bg-base-200 hover:shadow-md transition-shadow">
//             <div className="card-body p-4">
//                 {/* USER INFO */}
//                 <div className="flex items-center gap-3 mb-3">
//                     <div className="avatar size-12">
//                         <img src={friend.profilePic || me} alt={friend.fullName} />
//                     </div>
//                     <h3 className="font-semibold truncate">{friend.fullName}</h3>
//                 </div>

//                 <div className="flex flex-wrap gap-1.5 mb-3">
//                     <span className="badge badge-secondary text-xs">
//                         <BriefcaseBusiness />
//                         Profession: {friend.Profession}
//                     </span>
//                     <span className="badge badge-outline text-xs">
//                         <MapPin />
//                         Location: {friend.Location}
//                     </span>
//                 </div>

//                 <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
//                     Message
//                 </Link>
//             </div>
//         </div>
//     );
// };
// export default FriendCard;

import { Link } from "react-router-dom"; // ✅ Use 'react-router-dom', not 'react-router'
import { BriefcaseBusiness, MapPin } from "lucide-react";
import me from "../../public/img.png";
import NoFriendsFound from "./NoFriendsFound";

const FriendCard = ({ friend }) => {
  // if (friend) return <>
  // <NoFriendsFound/>
  // </> 

  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img
              src={friend.profilePic ?  me: friend.profilePic}
              alt={friend.fullName || "Friend"}
              className="rounded-full w-12 h-12 object-cover"
            />
          </div>
          <h3 className="font-semibold truncate">
            {friend.fullName || "Unknown User"}
          </h3>
        </div>

        {/* BADGES */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs flex items-center gap-1">
            <BriefcaseBusiness className="w-3 h-3" />
            Profession: {friend.Profession || "N/A"}
          </span>
          <span className="badge badge-outline text-xs flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Location: {friend.Location || "N/A"}
          </span>
        </div>

        {/* CHAT LINK */}
        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;
