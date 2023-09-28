import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Divider, Tooltip } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Note from '../compo/note';
import SectionIn from '../compo/section';
import Bignote from '../compo/bignote'
import LoadingBar from 'react-top-loading-bar'
import toast from 'react-hot-toast';
import { createNote } from '../services/note';
import { getSection } from '../services/section';
import { useDispatch, useSelector } from 'react-redux';
import { addNote, removeCopy, setNotes } from '../redux/slices/noteSlice';
import { closeBig, openBig, styles } from '../util/constant';
import Loading from '../compo/loading';
import { themes } from '../redux/slices/themSlice';

function Section() {

  const dispatch = useDispatch();

  let { token } = useSelector(state => state.auth);
  let { notes, copyNote } = useSelector(state => state.notes);
  let { loading } = useSelector(state => state.sections);
  let { theme } = useSelector(state => state.theme)

  let { section } = useParams();

  let [isadd, setisadd] = useState(true);

  let load = useRef(null);

  let [sectionInfo, setsectionInfo] = useState(null);
  const [permission, setpermission] = useState(false);
  let [search, setsearch] = useState("");

  let filteredNotes = notes.filter(note => {
    return note.title.toLowerCase().includes(search.trim()) || note.desc.toLowerCase().includes(search.trim())
  })

  let navigate = useNavigate();

  // i am using same component for adding new note and for updating or see (big note)
  // so to differeciate between adding & updating i am using isadd

  let openAddnote = () => {
    setisadd(true);
    openBig();
  }

  useEffect(() => {

    let fetchsection = async () => {
      load?.current?.staticStart();
      let data = await getSection(token, section, dispatch);
      if (data.err) {
        navigate("/123/pagenotfound");
      } else {
        dispatch(setNotes(data.msg.notes));
        setsectionInfo(data.msg.section)
        setpermission(data.msg.permission)
      }
      load?.current?.complete();
    }

    fetchsection();

  }, [section])

  let addnote = async (note) => {
    let tid = toast.loading("adding note");
    let data = await createNote(section, token, note);
    if (data.err) {
      toast.error("some error occured", { id: tid });
    } else {
      dispatch(addNote(data.msg));
      toast.success('note added', {
        id: tid
      });
    }

    closeBig();
  }

  const handlePaste = () => {
    let newNote = { title: copyNote.title, desc: copyNote.desc }
    addnote(newNote);
    dispatch(removeCopy());
  }

  if (sectionInfo === null && loading) {
    return (<Loading />);
  }

  return (

    <div className="right">
      <LoadingBar color='#5469d4' ref={load} />
      {
        sectionInfo &&
        <>
          <Bignote
            addnote={addnote}
            permission={permission}
            section={section}
            isadd={isadd}
          />

          <SectionIn
            permission={permission}
            section={section}
            sectionInfo={sectionInfo} />

          <Divider />

          {permission ?
            <div className="note-option">

              <div className="addnote">
                <div className="open_note">
                  <h3 style={{ marginRight: 10 }}>Add note</h3>
                  <div className="add_btn" onClick={openAddnote}>
                    <AddCircleIcon style={{
                      fontSize: '3rem',
                      color: theme == themes.LIGHT ? styles.light['btn-primary'] : styles.dark['btn-primary'],
                      cursor: "pointer"
                    }} />
                  </div>
                </div>
              </div>

              {copyNote ? <div className="paste-note" onClick={handlePaste}>
                <Tooltip title='Paste note in this section'>
                  <Button color="primary">
                    paste
                  </Button>
                </Tooltip>
              </div> : null}

            </div>
            : null}

          <div className="search-container">
            <input placeholder='Search...' className='search' type='text' value={search} onChange={(e) => setsearch(e.target.value)} />
          </div>

          <div className="notes">
            {
              filteredNotes.map((note) => {
                return (
                  <Note
                    permission={permission}
                    key={note._id}
                    note={note}
                    setisadd={setisadd}
                  />
                )
              })
            }
          </div>
        </>
      }
    </div>


  )
}

export default Section