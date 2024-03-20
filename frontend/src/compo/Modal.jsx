import React, { useState } from "react";
import { Divider, Tooltip } from "@mui/material";

import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ClearIcon from "@mui/icons-material/Clear";

import { closeModal, styles } from "../util/constant";
import Editor from "./editor";

function Modal({ addnote }) {
  let [desc, setdesc] = useState("");
  let [title, settitle] = useState("");

  const handleSubmit = async () => {
    let note = {
      title: title,
      desc: desc,
    };
    addnote(note);
  };
  const handleBlur = (e) => {
    if (e.target.classList.contains("back")) {
      closeModal();
    }
  };
  return (
    <div onClick={handleBlur} className="bigNoteRef back">
      <div className="bignote">
        <div className="big_top">
          <div className="big_title">
            <input
              placeholder="title"
              type="text"
              value={title}
              onChange={(e) => {
                settitle(e.target.value);
              }}
              className="t_title"
            />

            <div className="big_btn_grp">
              <div className="add_big" onClick={handleSubmit}>
                <Tooltip title="save">
                  <LibraryAddCheckIcon
                    style={{
                      cursor: "pointer",
                      color: styles.dark["btn-primary"],
                    }}
                  />
                </Tooltip>
              </div>
              <div className="big_close" onClick={closeModal}>
                <Tooltip title="close">
                  <ClearIcon style={{ cursor: "pointer" }} />
                </Tooltip>
              </div>

              <div className="big_back" onClick={closeModal}>
                <Tooltip title="close">
                  <KeyboardBackspaceIcon style={{ cursor: "pointer" }} />
                </Tooltip>
              </div>
            </div>
          </div>
          <Divider />
        </div>

        <Editor
          text={desc}
          onChange={(e) => {
            setdesc(JSON.stringify(e.document));
          }}
        />
      </div>
    </div>
  );
}

export default Modal;
