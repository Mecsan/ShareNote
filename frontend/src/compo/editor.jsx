import "@blocknote/core/fonts/inter.css";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import React from 'react'
import { useSelector } from "react-redux";

function Editor({ text, deps = [], onChange = () => { } }) {

    let initContent;
    try {
        initContent = JSON.parse(text);
    } catch (error) {
        initContent = [{
            type: "paragraph",
            content: text,
        },]
    }

    const theme = useSelector(state => state.theme.theme)
    const editor = useCreateBlockNote({
        initialContent: initContent,

    },deps);

    return <BlockNoteView
        theme={theme}
        editor={editor}
        onChange={onChange} />;
}

export default Editor
