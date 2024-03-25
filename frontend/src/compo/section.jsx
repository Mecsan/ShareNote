import React, { useContext, useEffect, useRef, useState } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useNavigate } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import toast from "react-hot-toast";
import Owner from "./Owner";
import LinkIcon from "@mui/icons-material/Link";
import { Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  copySection as copy,
  deleteSection,
  updateSection,
} from "../services/section";
import { useDispatch, useSelector } from "react-redux";
import { status } from "../redux/slices/authSlice";
import {
  updateSection as updateSectionAction,
  deleteSection as deleteSectionAction,
  addSection,
} from "../redux/slices/sectionSlice";
import { styles } from "../util/constant";
import { themes } from "../redux/slices/themSlice";

function Section({ section, sectionInfo, permission }) {
  let { token, authStatus } = useSelector((state) => state.auth);
  let { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  let [desc, setdesc] = useState("");
  let [title, settitle] = useState("");

  let updateSectionDb = async (ddata) => {
    let data = await updateSection(token, section, ddata);
    if (data.err) {
      toast.error("something went wrong");
    }
  };

  useEffect(() => {
    let some;
    if (
      permission &&
      title &&
      desc &&
      (title != sectionInfo?.title || desc != sectionInfo?.desc)
    ) {
      let newsection = {
        title: title,
        desc: desc,
      };

      dispatch(
        updateSectionAction({
          ...newsection,
          _id: sectionInfo._id,
        })
      );

      some = setTimeout(() => updateSectionDb(newsection), 1500);
    }

    return () => {
      clearTimeout(some);
    };
  }, [title, desc]);

  useEffect(() => {
    if (sectionInfo) {
      settitle(sectionInfo.title);
      setdesc(sectionInfo.desc);
    }
  }, [sectionInfo]);

  return (
    <>
      {sectionInfo ? (
        <div className="section">
          {permission ? null : <Owner name={sectionInfo.user.name} />}

          <TextareaAutosize
            className="section-area"
            disabled={permission ? false : true}
            value={desc || ""}
            onChange={(e) => setdesc(e.target.value)}
            maxRows={6}
            style={{
              fontSize: "1.1rem",
              background: "transparent",
              maxWidth: "600px",
            }}
          />
        </div>
      ) : null}
    </>
  );
}

export default Section;
