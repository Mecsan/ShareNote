import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Divider,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import AddBoxIcon from "@mui/icons-material/AddBox";
import LogoutIcon from "@mui/icons-material/Logout";
import User from "./user";
import HouseIcon from "@mui/icons-material/House";
import MenuIcon from "@mui/icons-material/Menu";
import toast from "react-hot-toast";
import { createSection, getSections } from "../services/section";
import { useDispatch, useSelector } from "react-redux";
import { logout, status } from "../redux/slices/authSlice";
import {
  addSection,
  setSections,
  stopSectionLoad,
  startSectionLoad
} from "../redux/slices/sectionSlice";
import { setNotes } from "../redux/slices/noteSlice";
import { themes } from "../redux/slices/themSlice";
import { styles } from "../util/constant";

function Nav() {
  const dispatch = useDispatch();
  const { authStatus,token } = useSelector((state) => state.auth);

  let { theme } = useSelector((state) => state.theme);
  let links = useSelector((state) => state.sections);
  links = links.sections;

  let Navigate = useNavigate();

  let handleLogout = () => {
    let ok = confirm("are u sure want to logout?");

    if (ok) {
      localStorage.removeItem("noteAuth");
      toast.success("Logout successed");
      dispatch(setNotes([]));
      dispatch(setSections([]));
      dispatch(logout());
      Navigate("/login");
    }
  };

  let getsections = async () => {
    dispatch(startSectionLoad());
    let data = await getSections(token);
    if (data.err) return;
    dispatch(setSections(data.msg));
    dispatch(stopSectionLoad());
  };

  useEffect(() => {
    getsections();
  }, []);

  let [isAdd, setIsAdd] = useState(false);
  let [add, setadd] = useState("");

  let opennav = (byPass = false) => {
    if (!byPass && window.innerWidth > 700) return;
    document.querySelector(".nav").classList.toggle("open-nav-bar");
  };

  let addsection = async () => {
    if (add == "") {
      toast.error("can't be empty");
      return;
    }

    let tid = toast.loading("adding section");

    let data = await createSection(token, { title: add });
    if (data.msg) {
      dispatch(addSection(data.msg));
      Navigate("/" + data.msg._id);

      toast.success("section added", {
        id: tid,
      });
    }
    opennav();
    setIsAdd(false);
    setadd("");
  };

  let getStyle = (link) => {
    if (link._id == location.pathname.substring(1)) {
      return { color: styles.light["btn-primary"] };
    }
    if (theme == themes.LIGHT) {
      return { color: styles.light.btn };
    }
    return { color: styles.dark.btn };
  };

  return (
    <div
      className="left"
      onClick={(e) => {
        if (e.target.className == "overlay") {
          opennav();
        }
      }}
    >
      <div className="nav open-nav-bar">
        <div className="overlay"></div>
        <div className="navbar">
          <ul className="flex">
            <User opennav={opennav} />
            <Divider />

            <ListItem disablePadding>
              <ListItemButton onClick={() => Navigate("/")}>
                <ListItemText
                  primary="Home"
                  style={{
                    color:
                      location.pathname == "/"
                        ? styles.light["btn-primary"]
                        : theme == themes.LIGHT
                          ? styles.light.btn
                          : styles.dark.btn,
                  }}
                />
                <ListItemIcon>
                  <HouseIcon
                    style={{
                      color:
                        location.pathname == "/"
                          ? styles.light["btn-primary"]
                          : "grey",
                    }}
                  />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
            <Divider />

            <ListItem disablePadding>
              <ListItemButton onClick={() => setIsAdd(!isAdd)}>
                <ListItemText
                  primary="Add"
                  style={{
                    color:
                      theme == themes.LIGHT
                        ? styles.light.btn
                        : styles.dark.btn,
                  }}
                />
                <ListItemIcon>
                  <AddBoxIcon style={{ color: "grey" }} />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
            {isAdd && (
              <ListItem disablePadding>
                <ListItemButton>
                  <TextField
                    className="add-section"
                    placeholder="Name"
                    size="small"
                    variant="standard"
                    value={add}
                    onChange={(e) => setadd(e.target.value)}
                  />
                  <ListItemIcon onClick={addsection}>
                    <CheckBoxIcon style={{ color: "grey" }} />
                  </ListItemIcon>
                </ListItemButton>
              </ListItem>
            )}
            <Divider />
            {links
              ? links.map((link) => {
                return (
                  <ListItem
                    key={link._id}
                    disablePadding
                    onClick={() => {
                      opennav();
                      Navigate("/" + link._id);
                    }}
                  >
                    <ListItemButton>
                      <ListItemText
                        primary={link.title}
                        style={getStyle(link)}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })
              : null}

            <ListItem disablePadding style={{ paddingTop: "30px" }}>
              <ListItemButton onClick={handleLogout}>
                <ListItemText
                  primary="Logout"
                  style={{
                    color:
                      theme == themes.LIGHT
                        ? styles.light.btn
                        : styles.dark.btn,
                  }}
                />
                <ListItemIcon>
                  <LogoutIcon style={{ color: "grey" }} />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>

            <ListItem
              disablePadding
              onClick={() => {
                opennav(true);
                Navigate("/reset-password");
              }}
            >
              <ListItemButton>
                <ListItemText
                  primary="Reset Password"
                  style={{
                    color:
                      theme == themes.LIGHT
                        ? styles.light.btn
                        : styles.dark.btn,
                  }}
                />
              </ListItemButton>
            </ListItem>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Nav;
