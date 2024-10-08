import React, { useState } from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { status } from "../redux/slices/authSlice";
function Home() {
  const { authStatus } = useSelector((state) => state.auth);
  let { sections: links, loading } = useSelector((state) => state.sections);

  let [search, setsearch] = useState("");

  let filtered = links.filter((link) => {
    return link.title.toLowerCase().includes(search.trim().toLowerCase());
  });

  const navigate = useNavigate();

  if (authStatus == status.NOAUTH) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      {loading === false ? (
        <>
          {links.length ? (
            <div className="section-conta">
              <div className="search-container">
                <input
                  placeholder="Search..."
                  className="search"
                  type="text"
                  value={search}
                  onChange={(e) => setsearch(e.target.value)}
                />
              </div>

              <div className="section-container">
                {filtered.map((link) => (
                  <div
                    onClick={() => {
                      navigate(link._id);
                    }}
                    className="small-section"
                    key={link._id}
                  >
                    <DescriptionIcon />
                    {link.title}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="add_any_section">
              <h2>Add One Section</h2>
              <CreateNewFolderIcon
                style={{ fontSize: "max(20vw,5rem)", color: "grey" }}
              />
            </div>
          )}
        </>
      ) : null}
    </>
  );
}

export default Home;
