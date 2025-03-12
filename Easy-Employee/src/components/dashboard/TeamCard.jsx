import React from "react";
import "../../assets/css/style.css"; // Import CSS for styling

const TeamCard = ({ teamName, members }) => {
  return (
    <div className="team-card">
      <h2 className="team-name">{teamName}</h2>
      <div className="team-members">
        {members.map((member, index) => (
          <div className="team-member" key={index}>
            <div className="avatar">{member.name.charAt(0)}</div>
            <div className="info">
              <h4>{member.name}</h4>
              <p>{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamCard;
