import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import ThemeBtn from "./themeBtn";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { status } from "../redux/slices/authSlice";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { STATIC_TEXT_FOR_ROUTE } from "../config/header";

import {
  deleteSection,
  copySection as copy,
  updateSection,
} from "../services/section";
import {
  updateSection as updateSectionAction,
  deleteSection as deleteSectionAction,
  addSection,
} from "../redux/slices/sectionSlice";
import { deletenote, updatenote } from "../util/common";
import toast from "react-hot-toast";
import { setCopy } from "../redux/slices/noteSlice";
import { debounceDelay } from "../util/constant";

let opennav = () => {
  document.querySelector(".nav").classList.toggle("open-nav-bar");
};

function Header() {
  let { authStatus, user, token } = useSelector((state) => state.auth);
  let { data } = useSelector((state) => state.header);

  let [HeaderProp, setHeaderProp] = useState({
    body: {},
    isOwner: false,
  });

  let location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let timeId;

    if (HeaderProp.body && HeaderProp.body.hasChanged) {
      let data = {
        title: HeaderProp.body.title,
      };

      if (location.pathname == "/") {
      } else if (/note/.test(location.pathname)) {
        timeId = setTimeout(
          () => updatenote(HeaderProp.body._id, data, token, dispatch),
          debounceDelay
        );
      } else {
        timeId = setTimeout(
          () => updateSection(token, HeaderProp.body._id, data),
          debounceDelay
        );

        dispatch(updateSectionAction(HeaderProp.body));
      }
    }

    return () => {
      clearTimeout(timeId);
    };
  }, [HeaderProp.body]);

  useEffect(() => {
    if (location.pathname == "/") {
    } else if (/note/.test(location.pathname)) {
      setHeaderProp({
        body: data,
        isOwner: user?._id == data?.section?.user?._id,
      });
    } else {
      setHeaderProp({
        body: data,
        isOwner: user?._id == data?.user?._id,
      });
    }
  }, [data]);

  let delelesection = async () => {
    if (!HeaderProp.isOwner) return;
    let ok = confirm("are u sure want to delete section?");
    if (ok) {
      let tid = toast.loading("deleting");
      let data = await deleteSection(token, HeaderProp.body._id);
      if (data.err) return;
      dispatch(deleteSectionAction(HeaderProp.body._id));
      navigate("/");
      toast.success("section deleted", {
        id: tid,
      });
    }
  };

  let copySection = async () => {
    const tid = toast.loading("copying", {
      duration: Infinity,
    });
    let data = await copy(token, HeaderProp.body._id);
    if (data.err) {
      toast.error("something went wrong", { id: tid, duration: 2000 });
    } else {
      toast.success("copied successfully", { id: tid, duration: 2000 });
      dispatch(addSection(data.msg));
    }
  };

  let deleteNote = async () => {
    if (!HeaderProp.isOwner) return;
    const data = await deletenote(HeaderProp.body._id, token, dispatch);
    if (!data || data.err) return;
    navigate("/" + HeaderProp.body.section._id);
    document.activeElement.blur();
  };

  const copyNote = async (note) => {
    dispatch(setCopy(note));
    const tid = toast.success("Note has been copied", {
      duration: Infinity,
      position: "top-right",
    });
    setTimeout(() => {
      toast.dismiss(tid);
      toast(
        (t) => (
          <span>
            Press <b> Paste </b>
            button in section page, in which you want to add this note
            <button className="close-toast" onClick={() => toast.dismiss(t.id)}>
              ok
            </button>
          </span>
        ),
        {
          duration: 10000,
          position: "top-right",
        }
      );
    }, 2000);
  };

  const handleDelete = async function () {
    if (location.pathname == "/") {
    } else if (/note/.test(location.pathname)) {
      await deleteNote();
    } else {
      await delelesection();
    }
  };

  const handleCopy = async function () {
    if (location.pathname == "/") {
    } else if (/note/.test(location.pathname)) {
      await copyNote(HeaderProp.body);
    } else {
      await copySection();
    }
    document.activeElement.blur();
  };

  const handleShare = function () { };

  const handleChange = function (e) {
    setHeaderProp((pre) => ({
      ...pre,
      body: { ...pre.body, title: e.target.value, hasChanged: true },
    }));
  };

  const isStatic = function (route) {
    let staticTextRoutes = ['/', '/login', '/signup','/reset-password'];
    return staticTextRoutes.includes(route);
  };

  if (location.pathname == "/" && authStatus == status.NOAUTH) {
    return null;
  }

  return (
    <header>
      <div className="header-left">

        {authStatus == status.AUTH && <div className="opennav" onClick={opennav}>
          <MenuIcon
            style={{ color: "var(--primary-color)", fontSize: "2rem" }}
          />
        </div>}

        <div className="title">
          {
            isStatic(location.pathname) ?
              <h2>{STATIC_TEXT_FOR_ROUTE[location.pathname]}</h2> :
              <input
                disabled={
                  HeaderProp.isOwner && location.pathname != "/" ? false : true
                }
                value={
                  HeaderProp.body.title || ""
                }
                onChange={handleChange}
                className="f_title"
                type="text"
              />
          }
        </div>
      </div>

      <div className="header-right">
        {authStatus == status.NOAUTH || location.pathname == "/" ? null : (
          <div className="header-option">
            <div>
              <button className="option-btn">
                <MoreHorizIcon style={{ color: "grey" }} />
              </button>
              <div className="options">
                {HeaderProp.isOwner ? (
                  <button onClick={handleDelete}>Delete</button>
                ) : null}
                <button onClick={handleCopy}>Make a copy</button>
                {HeaderProp.isOwner ? (
                  <button onClick={handleShare}>share</button>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {authStatus == status.NOAUTH && !isStatic(location.pathname) ? (
          <div className="sign-up-btn">
            <NavLink to="signup">Signup</NavLink>
          </div>
        ) : null}
        <ThemeBtn />
      </div>
    </header>
  );
}

export default Header;
