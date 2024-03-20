import React from "react";
import { useSelector } from "react-redux";

function User() {
  const { user } = useSelector((state) => state.auth);
  return (
    <>
      {user && (
        <div className="user">
          <div className="name">
            <span className="pre">welcome</span>
            <div className="some">{user.name}</div>
            <span style={{ color: "grey", fontSize: "0.85rem" }}>
              {user.mail}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default User;
