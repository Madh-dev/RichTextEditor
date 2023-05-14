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
        if (leaf.bold) {
            return <strong {...attributes}>{children}</strong>;
        }
        if (leaf.italic) {
            return <em {...attributes}>{children}</em>;
        }
        if (leaf.code) {
            return <code {...attributes}>{children}</code>;
        }
        if (leaf.list) {
            return <ul {...attributes} style={{ listStyleType: 'square' }}>
                <li>{children}</li>
            </ul>
        }
        if (leaf.underline) {
            return <u {...attributes}>{children}</u>
        }
        return <span {...attributes}>{children}</span>;
    }, []);

    const onKeyDown = (event) => {
        // we want all our commands to start with the user pressing ctrl,
        // if they don't , we cancel the action

        if (!event.ctrlKey) {
            return;
        }

        event.preventDefault();

        // Decide what to do based on the key code
        switch (event.key) {
            // when b is pressed, add a 'bold' mark to the text
            case "b": {
                const [match] = Editor.nodes(editor, {
                    match: (n) => n.bold === true,
                    universal: true,
                });
                const isActive = !!match;
                Transforms.setNodes(
                    editor,
                    { bold: isActive ? null : true },
                    { match: (n) => Text.isText(n), split: true }
                );
                break;
            }
            case "i": {
                const [match] = Editor.nodes(editor, {
                    match: (n) => n.italic === true,
                    universal: true,
                });
                const isActive = !!match;
                Transforms.setNodes(
                    editor,
                    { italic: isActive ? null : true },
                    { match: (n) => Text.isText(n), split: true }
                );
                break;
            }
            case "c": {
                const [match] = Editor.nodes(editor, {
                    match: (n) => n.code === true,
                    universal: true,
                });
                const isActive = !!match;
                Transforms.setNodes(
                    editor,
                    { code: isActive ? null : true },
                    { match: (n) => Text.isText(n), split: true }
                );
                break;
            }
            case "l": {
                const [match] = Editor.nodes(editor, {
                    match: (n) => n.list === true,
                    universal: true,
                });
                const isActive = !!match;
                Transforms.setNodes(
                    editor,
                    { list: isActive ? null : true },
                    { match: (n) => Text.isText(n), split: true }
                );
                break;
            }
            case "u": {
                const [match] = Editor.nodes(editor, {
                    match: (n) => n.underline === true,
                    universal: true,
                });
                const isActive = !!match;
                Transforms.setNodes(
                    editor,
                    { underline: isActive ? null : true },
                    { match: (n) => Text.isText(n), split: true }
                );
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
