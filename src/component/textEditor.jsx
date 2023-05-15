import React, { useState, useMemo, useCallback } from "react";
import { createEditor, Editor, Transforms, Text } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { bold } from 'react-icons-kit/feather/bold'
import Icon from 'react-icons-kit';
import { italic } from 'react-icons-kit/feather/italic'
import { underline } from 'react-icons-kit/feather/underline'
import { list } from 'react-icons-kit/feather/list'
import { code } from 'react-icons-kit/feather/code'

const TextEditor = () => {
    const editor = useMemo(() => withReact(createEditor()), []);
    const [value, setValue] = useState([
        {
            type: "paragraph",
            children: [{ text: "A line of text in a paragraph." }],
        },
    ]);

    const renderLeaf = useCallback((props) => {
        const { attributes, children, leaf } = props;

        let content = <span {...attributes}>{children}</span>
        if (leaf.bold) {
            content = <strong>{content}</strong>;
        }
        if (leaf.italic) {
            content = <em >{content}</em>;
        }
        if (leaf.code) {
            content = <code>{content}</code>;
        }
        if (leaf.list) {
            content = (
                <ul>
                    <li>{content}</li>
                </ul>
            )
        }
        if (leaf.underline) {
            content =  <u>{content}</u>
        }
        return content;
    }, []);


    const onKeyDown = (event) => {
        if(!event.ctrlKey){
            return;
        }
        event.preventDefault();

        switch (event.key) {
            case 'b': {
                event.preventDefault();
                toggleMark(event,'bold');
                break;
            }
            case 'i': {
                event.preventDefault();
                toggleMark(event,'italic');
                break;
            }
            case 'u' : {
                event.preventDefault();
                toggleMark(event,'underline');
                break;
            }
            case 'l' : {
                event.preventDefault();
                toggleMark(event,'list');
                break;
            }
            case 'c' : {
                event.preventDefault();
                toggleMark(event,'code');
                break;
            }
            default:
                break;
        }
    };
    const isMarkActive = (type) => {
        const [match] = Editor.nodes(editor, {
            match: (n) => n[type] === true,
            universal: true,
        });
        return !!match;
    };

    const toggleMark = (event, type) => {
        event.preventDefault();
        const isActive = isMarkActive(type);
        Transforms.setNodes(
            editor,
            { [type]: isActive ? null : true },
            { match: (n) => Text.isText(n), split: true }
        );
    };

    return (
        <>
            <div className="formatToolbar">


                <button
                    onMouseDown={(event) => toggleMark(event, "bold")}
                    style={{
                        fontWeight: isMarkActive("bold") ? "bold" : "normal",
                    }}
                    className="tooltip-icon-button"
                >
                    <Icon icon={bold} />
                </button>
                <button
                    onPointerDown={(event) => toggleMark(event, "italic")}
                    style={{
                        fontStyle: isMarkActive("italic") ? "italic" : "normal",
                    }}
                    className="tooltip-icon-button"
                >
                    <Icon icon={italic} />
                </button>
                <button
                    onMouseDown={(event) => toggleMark(event, "code")}
                    style={{
                        fontFamily: isMarkActive("code") ? "monospace" : "inherit",
                    }}
                    className="tooltip-icon-button"
                >
                    <Icon icon={code} />
                </button>
                <button
                    onMouseDown={(event) => toggleMark(event, "list")}
                    style={{
                        listStyleType: isMarkActive("list") ? "square" : "none",
                    }}
                    className="tooltip-icon-button"
                >
                    <Icon icon={list} />
                </button>
                <button
                    onMouseDown={(event) => toggleMark(event, "underline")}
                    style={{
                        textDecoration: isMarkActive("underline") ? "underline" : "none",
                    }}
                    className="tooltip-icon-button"
                >
                    <Icon icon={underline} />
                </button>
            </div>
            <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
                <Editable onKeyDown={onKeyDown} renderLeaf={renderLeaf} />
            </Slate>

        </>
    );
};

export default TextEditor;
