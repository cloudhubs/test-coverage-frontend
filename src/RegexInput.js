import React from "react";
import {Button} from "react-bootstrap";

export default function RegexInput({objValue, onChange, index, deleteField, regex}) {
    // const { regexVal } = objValue;
    const regexLabel = "RegEx: ";
    const splitter = "\t";
    return (
        <div className="regex-input">
            <div className="input-actual">
                <label>
                    {regexLabel}
                    <input
                        type="text"
                        id={objValue}
                        value={objValue}
                        onChange={(event) => onChange(event, index)}
                    />
                    {splitter}
                    <Button disabled={regex.length <= 1} onClick={(event) => deleteField(event, index)} variant="danger">
                        Delete
                    </Button>
                </label>
            </div>
            <br/>
        </div>
    );
}