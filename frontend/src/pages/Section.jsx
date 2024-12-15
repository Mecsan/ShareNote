import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Divider, Tooltip } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Note from "../compo/note";
import SectionIn from "../compo/section";
import LoadingBar from "react-top-loading-bar";
import toast from "react-hot-toast";
import { createNote } from "../services/note";
import { getSection } from "../services/section";
import { useDispatch, useSelector } from "react-redux";
import { addNote, removeCopy, setNotes } from "../redux/slices/noteSlice";
import { closeModal, openModal, styles } from "../util/constant";
import Loading from "../compo/loading";
import { themes } from "../redux/slices/themSlice";
import Modal from "../compo/Modal";
import NoteIcon from '@mui/icons-material/Note';
import { changeHeader } from "../redux/slices/headerSlice";
import Debounce from 'lodash.debounce'

function Section() {
  const dispatch = useDispatch();

  let { token } = useSelector((state) => state.auth);
  let { notes, copyNote } = useSelector((state) => state.notes);
  let { loading } = useSelector((state) => state.sections);
  let { theme } = useSelector((state) => state.theme);

  let { section } = useParams();

  let load = useRef(null);

  let [sectionInfo, setsectionInfo] = useState(null);
  const [permission, setpermission] = useState(false);
  const [isAdd, setadd] = useState(false);

  const toggleIsAdd = () => {
    setadd((pre) => !pre);
  };

  let [search, setsearch] = useState("");

  var fetchSection = async (token, section, search) => {
    load?.current?.staticStart();
    let data = await getSection(token, section, search.trim(), dispatch);
    if (data.err) {
      navigate("/123/pagenotfound");
    } else {
      dispatch(setNotes(data.msg.notes));
      dispatch(changeHeader(data.msg.section));
      setsectionInfo(data.msg.section);
      setpermission(data.msg.permission);
    }
    load?.current?.complete();
  };

  const debouncedFetchSection = useCallback(
    Debounce(fetchSection, 1000),
    []);

  let navigate = useNavigate();

  let openAddnote = () => {
    navigate("#add-note");
    openModal();
  };

  useEffect(() => {
    if (sectionInfo) debouncedFetchSection(token, section, search);
  }, [search]);

  useEffect(() => {
    fetchSection(token, section, search);
  }, [section]);

  let addnote = async (note) => {
    let tid = toast.loading("adding note");
    let data = await createNote(section, token, note);
    if (data.err) {
      toast.error(data.err, { id: tid });
    } else {
      dispatch(addNote(data.msg));
      toast.success("note added", {
        id: tid,
      });
      toggleIsAdd();
      closeModal();
      navigate("");
    }
  };

  function hideModal() {
    closeModal();
  }

  useEffect(() => {
    window.addEventListener("popstate", hideModal);

    return () => {
      window.removeEventListener("popstate", hideModal);
    };
  }, []);

  // has to be changed
  const handlePaste = () => {
    let newNote = { title: copyNote.title, desc: copyNote.desc };
    addnote(newNote);
    dispatch(removeCopy());
  };

  if (sectionInfo === null && loading) {
    return <Loading />;
  }

  return (
    <>
      <LoadingBar color="#5469d4" ref={load} />
      {sectionInfo && (
        <>
          {permission && <Modal key={isAdd} addnote={addnote} />}

          <SectionIn
            permission={permission}
            section={section}
            sectionInfo={sectionInfo}
          />

          <Divider />

          {permission ? (
            <div className="note-option">
              <div className="addnote">
                <div className="open_note">
                  <h3 style={{ marginRight: 10 }}>Add note</h3>
                  <div className="add_btn" onClick={openAddnote}>
                    <AddCircleIcon
                      style={{
                        fontSize: "3rem",
                        color:
                          theme == themes.LIGHT
                            ? styles.light["btn-primary"]
                            : styles.dark["btn-primary"],
                        cursor: "pointer",
                      }}
                    />
                  </div>
                </div>
              </div>

              {copyNote ? (
                <div className="paste-note" onClick={handlePaste}>
                  <Tooltip title="Paste note in this section">
                    <Button color="primary">paste</Button>
                  </Tooltip>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="search-container">
            <input
              placeholder="Search..."
              className="search"
              type="text"
              value={search}
              onChange={(e) => setsearch(e.target.value)}
            />
          </div>

          {notes.length ? <div className="notes">
            {notes.map((note) => {
              return (
                <Note permission={permission} key={note._id} note={note} />
              );
            })}
          </div> : <div className="no-notes">
            <h2>No Notes Available</h2>
            <NoteIcon style={{ fontSize: "max(10vw,5rem)", color: "grey" }} />
          </div>
          }
        </>
      )}
    </>
  );
}

export default Section;
